class AddNotNullConstraintsToMultipleTables < ActiveRecord::Migration[7.0]
  def change
    # postsテーブルの変更 NULL制約の付加
    change_column_null :posts, :user_id, false
    change_column_null :posts, :airport_id, false
    change_column_null :posts, :category_id, false
    change_column_null :posts, :title, false
    change_column_null :posts, :taking_at, false
    change_column_null :posts, :location, false
    change_column_null :posts, :taking_position_latitude, false
    change_column_null :posts, :taking_position_longitude, false
    change_column_null :posts, :comment, false
    change_column_null :posts, :deleted_at, false
    
    # post_imagesテーブルの変更 NULL制約の付加
    change_column_null :post_images, :post_id, false
    change_column_null :post_images, :path, false
    change_column_null :post_images, :deleted_at, false
  end
end
