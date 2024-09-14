class RemoveNotNullConstraintsFromMultipleTables < ActiveRecord::Migration[7.0]
  # 誤って追加した NOT NULL 制約を削除
  def change
    change_column_null :posts, :comment, true
    change_column_null :posts, :deleted_at, true

    change_column_null :post_images, :deleted_at, true
  end
end
