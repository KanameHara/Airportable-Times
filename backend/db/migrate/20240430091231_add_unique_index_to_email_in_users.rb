class AddUniqueIndexToEmailInUsers < ActiveRecord::Migration[7.0]
  def change
    # emailカラムにユニークインデックスを追加
    add_index :users, :email, unique: true
  end
end
