Rails.application.routes.draw do

  # User関連のエンドポイントを設定
  resources :users do
    collection do
      get 'find_by_email', to: 'users#show_by_email'  # ユーザー情報をメールアドレスで検索するアクションへのルート
    end
  end

  # Category（投稿種別）関連のエンドポイントを設定
  resources :categories, only: [:show, :index]

  # Post（投稿）関連のエンドポイントを設定
  post 'posts', to: 'posts#create'
  get 'posts', to: 'posts#index' 

end
