# ----------------------------------------------------------------
#  Userコントローラー
#   フロントエンドからのHTTPリクエストを受け取り、それに応じたユーザー情報の操作を行う
# ----------------------------------------------------------------
class UsersController < ApplicationController

	# フロントエンドから送信されたユーザーデータをDBに登録
  def create
    # フロントエンドから送られたデータを取得
    user_params = params.require(:user).permit(:email, :name)

    # ユーザーデータのインスタンス作成
    user = User.new(user_params)

		# ユーザーデータをDBに登録 →登録成功ならtrueをフロントエンドに返却
    if user.save
      render json: { success: true, message: "ユーザーが作成されました。" }
    else
      render json: { success: false, message: user.errors.full_messages.join(", ") }
    end
  end
end
