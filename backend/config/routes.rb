Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  # User関連のエンドポイントを設定
  resources :users  # ユーザーリソースに対してCRUD操作を許可
end

# User関連のエンドポイントを設定
# resources :users, only: [:create, :show, :update, :destroy]  # ユーザーリソースに対してCRUD操作を許可
