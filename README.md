<div id="top"></div>

# Airportable-Times

## 使用技術一覧

<!-- シールド一覧 -->
<p style="display: inline">
	<!-- フロントエンドのフレームワーク一覧 -->
	<img src="https://img.shields.io/badge/-Next.js-000000.svg?logo=next.js&style=for-the-badge">
	<img src="https://img.shields.io/badge/-React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
	<!-- バックエンドのフレームワーク一覧 -->
	<img src="https://img.shields.io/badge/-Rails-CC0000.svg?logo=rails&style=for-the-badge">
	<!-- バックエンドの言語一覧 -->
	<img src="https://img.shields.io/badge/-Ruby-CC342D.svg?logo=ruby&style=for-the-badge">
	<!-- インフラ一覧 -->
	<img src="https://img.shields.io/badge/-Docker-20232A.svg?logo=docker&style=for-the-badge">
</p>

## 目次

1. [プロジェクトについて](#プロジェクトについて)
2. [実装にあたって作成したドキュメント](#実装にあたって作成したドキュメント)
3. [環境](#環境)
4. [ディレクトリ構成](#ディレクトリ構成)
5. [開発環境構築](#開発環境構築)

## プロジェクト名

Airportable-Times

## プロジェクトについて

日本全国の空港で自分が撮影した航空機の写真を投稿し他のユーザーとシェアすることができるサービスです。<br>
投稿にはコメントや写真撮影した場所などの情報を追加することができます。

## 実装にあたって作成したドキュメント
- [仕様書](https://docs.google.com/document/d/1KTQHEbzXt_iiyhADy465sPW_qyxC49ZveloylFGle3E/edit#heading=h.jatihhqjawij)
- [画面設計書](https://www.figma.com/design/Q08ny3JZwA0zIxYTwPkm9E/Airport-View-App%E6%A7%8B%E6%83%B3-(chakuraUI-Ver2)?node-id=0-1&node-type=CANVAS)
- [テーブル定義書](https://docs.google.com/spreadsheets/d/1vpu8NMGavKbA1qB3baAdkuc1XZQnt7duvhhlPrdeS_w/edit#gid=0)
- [ER図](https://app.diagrams.net/#HKanameHara%2FAirportViewAPP%2Fmain%2FAirpotyViewAPP.drawio.svg#{"pageId"%3A"R2lEEEUBdFMjLlhIrx00"})
- [デバッグ兼修正管理書](https://docs.google.com/spreadsheets/d/1JQU6jLYJ05ldkJr33ag9Hpnz_UkMVn5oUOs5xG8o9cg/edit?gid=1003822731#gid=1003822731)

## 環境

| 言語・フレームワーク     | バージョン |
| ----------------------| ---------- |
| React                 | 18.2.0     |
| Next.js               | 14.0.4     |
| Ruby                  | 3.1.4      |
| Rails                 | 7.0.8      |
| Docker                | 25.0.2     |

その他のパッケージのバージョンは package.json を参照してください

<p align="right">(<a href="#top">トップへ</a>)</p>

## ディレクトリ構成
<!-- デプロイ完了後に下記コマンドで再度ディレクトリを出力し直すこと -->
<!-- ❯ tree -a -I "node_modules|.next|.git|.pytest_cache|static|tmp|migrate|test|channels|jobs|mailers|views|" -L 2 -->

<pre>
.
├── .DS_Store
├── .env
├── .gitignore
├── backend
│   	├── .DS_Store
│   	├── .env
│   	├── .gitattributes
│   	├── .gitignore
│   	├── .ruby-version
│   	├── Dockerfile
│   	├── Gemfile
│   	├── Gemfile.lock
│   	├── README.md
│   	├── Rakefile
│   	├── app
│   	│   ├── controllers
│   	│   │   ├── application_controller.rb
│   	│   │   ├── categories_controller.rb
│   	│   │   ├── concerns
│   	│   │   │   └── .keep
│   	│   │   ├── places_controller.rb
│   	│   │   ├── posts_controller.rb
│   	│   │   └── users_controller.rb
│   	│   ├── models
│   	│   │   ├── application_record.rb
│   	│   │   ├── category.rb
│   	│   │   ├── concerns
│   	│   │   │   └── .keep
│   	│   │   ├── post.rb
│   	│   │   └── user.rb
│   	│   └── uploaders
│   	│       └── image_uploader.rb
│   	├── bin
│   	│   ├── bundle
│   	│   ├── rails
│   	│   ├── rake
│   	│   └── setup
│   	├── config
│   	│   ├── application.rb
│   	│   ├── boot.rb
│   	│   ├── cable.yml
│   	│   ├── database.yml
│   	│   ├── environment.rb
│   	│   ├── environments
│   	│   │   ├── development.rb
│   	│   │   ├── production.rb
│   	│   │   └── test.rb
│   	│   ├── initializers
│   	│   │   ├── cors.rb
│   	│   │   ├── filter_parameter_logging.rb
│   	│   │   └── inflections.rb
│   	│   ├── locales
│   	│   │   └── en.yml
│   	│   ├── puma.rb
│   	│   ├── routes.rb
│   	│   ├── secrets
│   	│   │   └── gcs.keyfile
│   	│   └── storage.yml
│   	├── config.ru
│   	├── db
│   	│   ├── schema.rb
│   	│   └── seeds.rb
│   	├── entrypoint.sh
│   	├── lib
│   	│   └── tasks
│   	│       └── .keep
│   	├── log
│   	│   ├── .keep
│   	│   └── development.log
│   	├── public
│   	│   └── robots.txt
│   	├── storage
│   	│   └── .keep
│   	└── vendor
│   	    └── .keep
├── docker-compose.yml
└── frontend
	├── .DS_Store
	├── .env
	├── .env.development
	├── .env.production
	├── .eslintrc.json
	├── .gitignore
	├── README.md
	├── components
	│   ├── Features
	│   │   └── GoogleMap
	│   │       ├── Map.tsx
	│   │       └── MapforPost.tsx
	│   ├── UI
	│   │   ├── CategoryDropdown.tsx
	│   │   ├── ConfirmModal.tsx
	│   │   ├── ImageUploadForm.tsx
	│   │   ├── Pagination.tsx
	│   │   └── PostCard.tsx
	│   ├── contexts
	│   │   ├── AuthContext.tsx
	│   │   └── MapContext.tsx
	│   └── layouts
	│       └── Header.tsx
	├── constants
	│   └── InitializedSelectedPlaceInfo.ts
	├── lib
	│   ├── firebase
	│   │   ├── api
	│   │   │   └── auth.ts
	│   │   └── config.ts
	│   └── mysql
	│       └── api
	│           └── database.ts
	├── next-env.d.ts
	├── next.config.mjs
	├── package.json
	├── pages
	│   ├── [placeID]
	│   │   └── posts
	│   │       ├── [id]
	│   │       │   └── show.tsx
	│   │       ├── create.tsx
	│   │       └── index.tsx
	│   ├── [placeID].tsx
	│   ├── _app.tsx
	│   ├── _document.tsx
	│   ├── api
	│   │   └── hello.ts
	│   ├── home.tsx
	│   ├── index.tsx
	│   ├── mypage
	│   │   └── posts
	│   │       ├── [id]
	│   │       │   ├── edit.tsx
	│   │       │   └── show.tsx
	│   │       └── index.tsx
	│   ├── signin.tsx
	│   └── signup.tsx
	├── postcss.config.js
	├── public
	│   ├── favicon.ico
	│   ├── images
	│   │   ├── headerimage.png
	│   │   └── photo_sample.jpg
	│   ├── next.svg
	│   └── vercel.svg
	├── styles
	│   └── globals.css
	├── tailwind.config.ts
	├── tsconfig.json
	├── types
	│   ├── ImageUploadFormPropsType.ts
	│   ├── PostInfoType.ts
	│   ├── SelectePhotoPositionType.ts
	│   ├── SelectedPlaceInfoType.ts
	│   └── UserInfoType.ts
	├── yarn-error.log
	└── yarn.lock
</pre>

<p align="right">(<a href="#top">トップへ</a>)</p>

## 開発環境構築

### 各サーバーを起動
以下のコマンドを実行します

#### フロントエンド
cd frontend/<br>
yarn dev -p 8000

#### バックエンド・データベース
docker-compose build --no-cache backend<br>
docker-compose up -d backend

### 動作確認

" https://airportable-times.vercel.app/ "にアクセスできるか確認<br>
アクセスできたら成功

### サーバーの停止
以下のコマンドで停止することができます

#### フロントエンド
MacBook: control + C<br>
Windows: ctrl + Q

#### バックエンド・データベース
docker-compose down

<p align="right">(<a href="#top">トップへ</a>)</p>
