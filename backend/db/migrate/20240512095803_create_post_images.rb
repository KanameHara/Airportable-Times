class CreatePostImages < ActiveRecord::Migration[7.0]
  def change
    create_table :post_images do |t|
      t.bigint :post_id
      t.string :path
      t.datetime :deleted_at

      t.timestamps
    end
  end
end
