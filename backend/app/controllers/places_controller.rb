# ----------------------------------------------------------------
#  Google Places APIコントローラー
# ----------------------------------------------------------------
class PlacesController < ApplicationController
  require 'net/http'
  require 'uri'
  require 'json'

  # place_idで指定した場所の詳細情報を日本語で取得する
  def show
    place_id = params[:place_id]
    api_key = ENV['GOOGLE_MAPS_API_KEY']
    language = 'ja' # 日本語を指定
    url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=#{place_id}&key=#{api_key}&language=#{language}"

    uri = URI.parse(url)
    response = Net::HTTP.get_response(uri)

    render json: JSON.parse(response.body)
  end
end