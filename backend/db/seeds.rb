# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

# categoriesテーブルのマスタデータを登録
categories = [
  '航空機・風景',
  'グルメ・お土産',
  'イベント・アクティビティ',
  'その他'
]

categories.each do |category_name|
  Category.find_or_create_by(name: category_name)
end