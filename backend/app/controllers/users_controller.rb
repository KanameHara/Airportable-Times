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

  # mailアドレスからユーザー情報を取得
  def show_by_email
    # 動作確認用のため残す Rails.logger.debug "Requested email: #{params[:email]}"
    user = User.find_by(email: params[:email])
    if user
      # 動作確認用のため残す Rails.logger.debug "User found: #{user.inspect}"
      render json: { id: user.id, email: user.email, userName: user.name }
    else
      # 動作確認用のため残す Rails.logger.debug "User not found for email: #{params[:email]}"
      render json: { error: 'User not found' }, status: :not_found
    end
  end
end
