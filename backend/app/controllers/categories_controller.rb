# ----------------------------------------------------------------
#  Categoryコントローラー
# ----------------------------------------------------------------
class CategoriesController < ApplicationController
  
	# カテゴリIDからカテゴリ名を返す
	def show
    category = Category.find(params[:id])
    render json: { name: category.name }
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Category not found" }, status: :not_found
  end

  # カテゴリテーブルの全データを返す
  def index
    categories = Category.all
    render json: categories
  end
end
