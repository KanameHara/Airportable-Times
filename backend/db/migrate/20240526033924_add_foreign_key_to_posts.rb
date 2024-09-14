class AddForeignKeyToPosts < ActiveRecord::Migration[7.0]
  def change
    add_foreign_key :posts, :categories, column: :category_id
  end
end
