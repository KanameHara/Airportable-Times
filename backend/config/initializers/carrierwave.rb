CarrierWave.configure do |config|
  config.root = Rails.root.join('public')
  config.cache_dir = 'uploads/tmp'
  config.asset_host = ENV.fetch('ASSET_HOST', 'http://localhost:3000') # 本番環境では変更する
end
