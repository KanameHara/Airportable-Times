class DropPostImages < ActiveRecord::Migration[7.0]
  def change
    drop_table :post_images
  end
end
