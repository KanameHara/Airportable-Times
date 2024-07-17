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
        params[:images].each do |index, image|
          Rails.logger.debug "Image: #{image.inspect}"
          @post.images.attach(image)
        end
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
  # GET /posts?category=:category_id&user_id=:user_id
  def index
    @posts = Post.all

    # ユーザーIDでフィルタリング
    if params[:user_id]
      @posts = @posts.where(user_id: params[:user_id])
    end

    # カテゴリIDでフィルタリング
    if params[:category]
      @posts = @posts.where(category_id: params[:category])
    end

    render json: @posts
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