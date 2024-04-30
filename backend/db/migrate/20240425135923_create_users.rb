# ----------------------------------------------------------------
#  Usersマイグレーションファイル
#   DBにusersテーブルを作成しその中に持たせるカラムを定義
#   本ファイル定義後、rails db:migrate実行し定義内容がDBに反映されusersテーブルが作成される
# ----------------------------------------------------------------
class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :email
      t.string :name
      t.string :password
      t.timestamps # 自動的に created_at と updated_at のタイムスタンプカラムを追加
    end
  end
end
