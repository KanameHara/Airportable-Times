class PostImage < ApplicationRecord
  belongs_to :post
  mount_uploader :path, ImageUploader

  validates :post_id, presence: true
  validates :path, presence: true

  # 画像ファイル保存用
  def full_path_url
    "#{Rails.application.config.asset_host}/#{path.store_dir}/#{path.file.filename}"
  end
end