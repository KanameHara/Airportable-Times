class AddForeignKeyToPostImages < ActiveRecord::Migration[7.0]
  def change
    add_foreign_key :post_images, :posts, column: :post_id
  end
end
