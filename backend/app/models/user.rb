# ----------------------------------------------------------------
#  Userモデル
#   ユーザーデータを管理するuserモデルを定義する
# ----------------------------------------------------------------
class User < ApplicationRecord
  # バリデーション(DBに正しい値が保存されるための検証)の設定
  validates :email, presence: true, uniqueness: true	# presence: trueで空欄を許さない
  validates :name, presence: true
	# その他のモデルとの関連があればここに定義
end
