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
          post_image = @post.post_images.new
          post_image.path = image # ここで CarrierWave にアップロードファイルを渡す
          post_image.save!
        end
      end
      
      render json: { 
        message: 'Post and image successfully created', 
        image_urls: @post.post_images.map { |img| img.full_path_url } # ここで full_path_url メソッドを使用する
      }, status: :created
    end

  rescue ActiveRecord::RecordInvalid, ActiveRecord::Rollback => e
    Rails.logger.error "投稿作成エラーメッセージ: #{e.message}"
    render json: { errors: e.message }, status: :unprocessable_entity
  end

  # GET /posts
  # GET /posts?category=:category_id
  def index

    # 投稿カテゴリの指定がある場合はその投稿のみを取得
    if params[:category]
      @posts = Post.where(category_id: params[:category])
    else
      @posts = Post.all
    end

    render json: @posts
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