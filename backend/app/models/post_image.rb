class PostImage < ApplicationRecord
  belongs_to :post
  has_one_attached :image # Active Storageの設定

  validates :post_id, presence: true
  validates :image, presence: true

  # 画像のURLを取得するメソッド
  def image_url
    Rails.application.routes.url_helpers.rails_blob_url(image, only_path: true)
  end
end