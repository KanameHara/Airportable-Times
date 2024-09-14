class CreatePosts < ActiveRecord::Migration[7.0]
  def change
    create_table :posts do |t|
      t.bigint :user_id
      t.string :airport_id
      t.bigint :category_id
      t.string :title
      t.date :taking_at
      t.decimal :taking_position_latitude, precision: 10, scale: 6
      t.decimal :taking_position_longitude, precision: 10, scale: 6
      t.text :comment
      t.datetime :deleted_at

      t.timestamps
    end
  end
end
