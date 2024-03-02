# ---- Base Node ----
# FROM: イメージのベースとなる親イメージを指定。通常は公式イメージや以前作成したイメージを指定する
#  Alpine Linuxベースのイメージを指定
FROM node:18-alpine AS base
# WORKDIR: コマンドを実行する作業ディレクトリを指定。ディレクトリが無いときは新規で作成される
#  また、コレ以降の操作はすべてこのディレクトリ内で行われる
WORKDIR /usr/src/app

# Copy package.json and yarn.lock for utilising Docker cache 
# ホストマシンからイメージ内のファイルシステムへファイルやディレクトリをコピーする（例：ソースファイルをイメージにコピーなど）
#  ホストマシンからDockerコンテナ内の現在の作業ディレクトリ（WORKDIRで設定されたディレクトリ）へ指定したファイルをコピーする
COPY package.json yarn.lock ./

# ---- Dependencies ----
# マルチステージビルド。４行目で開始したbaseイメージから新たにdependenciesイメージを作成
# マルチステージビルドの目的は、ビルドに必要なツールをインストールしたり、ビルド結果を最小限のイメージにコピーすることで、最終的なイメージサイズの軽量化
FROM base AS dependencies
# yarn install:ackage.jsonとyarn.lockファイルに基づいてプロジェクトの依存関係をインストール
# yarn cache clean:キャッシュされたデータの削除。イメージのサイズを最小にする
RUN yarn install && yarn cache clean

# ---- Copy Files/Build ----
# マルチステージビルド。dependenciesイメージから新たにbuildイメージを作成
FROM dependencies AS build 
WORKDIR /usr/src/app
# ここでコピーする目的→ソースファイル、envファイル等の設定ファイル、依存関係ファイル（packagejsonなど）をコピーするため
COPY . /usr/src/app
# イメージビルド時にシェルコマンドを実行
# yarn build:ソースコードを本番環境用にコンパイルし、最適化するプロセスを実行
RUN yarn build

# --- Release ----
# マルチステージビルド。dependenciesイメージから新たにreleaseイメージを作成
FROM base AS release
# ビルドステージ「dependencies」で生成されたnode_modulesディレクトリを現在のステージにコピー  目的がようわからん？？
# コピー系のコマンドは「ホストのディレクトリ」→「コンテナ上のディレクトリ」になっているのか？？
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
# ビルドステージ「build」で生成されたNext.jsのビルド成果物（.nextディレクトリ）を現在のステージにコピー
COPY --from=build /usr/src/app/.next ./.next
# フロントエンドプロジェクトで静的ファイルやアセットをコンテナに含めるために使用
COPY ./public ./public

# Next.js collects completely anonymous telemetry data about general usage.
# Read more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# RUN npx next telemetry disable

# コンテナがリッスンするポートを指示
#  ただし、実際にポートを公開するには、コンテナを起動する際に-pオプションを使用する必要あり
EXPOSE 3000
# コンテナが起動された際にデフォルトで実行するコマンドを指定
CMD ["yarn", "start", "-H", "0.0.0.0"]