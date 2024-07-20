# ----------------------------------------------------------------
# Postコントローラー
# ----------------------------------------------------------------
class PostsController < ApplicationController
  include Rails.application.routes.url_helpers

  # POST /posts
  def create
    Rails.logger.debug "ポストされた内容: #{params.inspect}"

    ActiveRecord::Base.transaction do
      Rails.logger.debug "ポストのクリエイトアクションが呼ばれました。"

      @post = Post.new(post_params)
      @post.save!

      if params[:images].present?
        @post.images.attach(params[:images].values)
      end
      
      render json: { 
        message: 'Post and image successfully created', 
        image_urls: @post.images.map { |img| url_for(img) }
      }, status: :created
    end

  rescue ActiveRecord::RecordInvalid, ActiveRecord::Rollback => e
    Rails.logger.error "投稿作成エラーメッセージ: #{e.message}"
    render json: { errors: e.message }, status: :unprocessable_entity
  end

  # PUT /posts/:id
  def update
    @post = Post.find(params[:id])

    ActiveRecord::Base.transaction do
      @post.update!(post_params)

      if params[:images].present?
        @post.post_images.destroy_all  # 既存の画像を削除
        params[:images].each do |image|
          @post.post_images.create!(image: image)
        end
      end

      render json: {
        message: 'Post and image successfully updated',
        image_urls: @post.post_images.map { |img| url_for(img.image) } # ここでActiveStorageのurl_forを使用する
      }, status: :ok
    end

  rescue ActiveRecord::RecordNotFound => e
    render json: { errors: e.message }, status: :not_found
  rescue ActiveRecord::RecordInvalid, ActiveRecord::Rollback => e
    render json: { errors: e.message }, status: :unprocessable_entity
  end
  
  # GET /posts
  # GET /posts?category=:category_id&user_id=:user_id&airport_id=:airport_id&id=:id
  def index
    @posts = Post.all

    # ユーザーIDでフィルタリング
    @posts = @posts.where(user_id: params[:user_id]) if params[:user_id]

    # カテゴリIDでフィルタリング
    @posts = @posts.where(category_id: params[:category]) if params[:category]

    # 空港IDでフィルタリング
    @posts = @posts.where(airport_id: params[:airport_id]) if params[:airport_id]

    # 投稿IDでフィルタリング
    @posts = @posts.where(id: params[:id]) if params[:id]

    # 各投稿に紐づく画像のURLを含めてJSONレスポンスを構築
    posts_with_images = @posts.map do |post|
      post.as_json.merge({
        image_urls: post.images.map { |img| url_for(img) }
      })
    end

    render json: posts_with_images
  end

  # DELETE /posts/:id
  def destroy
    @post = Post.find(params[:id])

    @post.destroy!

    render json: { message: 'Post deleted successfully' }, status: :ok
  rescue ActiveRecord::RecordNotFound => e
    render json: { errors: e.message }, status: :not_found
  rescue StandardError => e
    render json: { errors: e.message }, status: :unprocessable_entity
  end

  private

  def post_params
    params.require(:post).permit(
      :user_id, 
      :airport_id, 
      :category_id, 
      :title, 
      :taking_at, 
      :location, 
      :taking_position_latitude, 
      :taking_position_longitude, 
      :comment
    )
  end
end