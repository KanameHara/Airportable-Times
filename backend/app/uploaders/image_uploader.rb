class ImageUploader < CarrierWave::Uploader::Base
  # 保存先を指定（ここではファイルシステムを使用）
  storage :file

  # 保存先のディレクトリを指定
  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  # 許可する拡張子を指定
  def extension_allowlist
    %w(jpg jpeg gif png)
  end

  # ファイル名を指定（オプション）
  def filename
    original_filename if original_filename.present?
  end
end
