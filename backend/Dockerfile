# Build stage
# マルチステージビルド。Builderステージでは、アプリケーションの依存関係のインストールやプリコンパイルを実行
FROM ruby:3.2.2 as Builder
# Debianベースのイメージ（例ruby:3.2.2のようなイメージ）内で実行される場合に、
# パッケージリストの更新とNode.jsおよびMySQLクライアントのインストールを実行
# 特にRuby on RailsアプリケーションでJavaScriptのアセットコンパイルやデータベース操作を行う際に必要な環境を設定するために使用
#   この時点ではアプリケーションのビルドプロセスに必要な依存関係をインストール（ランタイムステージで再度行うが目的は別）
# RUN apt-get update -qq && apt-get install -y nodejs default-mysql-client git
RUN apt-get update -qq && apt-get install -y nodejs npm yarn default-mysql-client git
# タイムゾーンの環境変数を設定
ENV TZ=Asia/Tokyo
# RUN mkdir /airapp
WORKDIR /airapp   
COPY Gemfile /airapp/Gemfile
COPY Gemfile.lock /airapp/Gemfile.lock
# インストール済みのgemを最新バージョンに更新かつ
# アプリケーションのGemfileに記載されている依存関係をインストールする。Gemfile.lockファイルがある場合はそれに従ってインストール
RUN gem update && \
    bundle install
COPY . /airapp

# Runtime stage
# slim」バリアントは、基本的なRuby環境に必要な最小限のパッケージのみを含むイメージ
FROM ruby:3.2.2-slim
# アプリケーション実行環境の準備のために実行されるコマンド（ビルドステージの時とは目的が異なる）
RUN apt-get update -qq && apt-get install -y nodejs npm yarn default-mysql-client git
ENV TZ=Asia/Tokyo
RUN mkdir /airapp
WORKDIR /airapp
COPY --from=Builder /usr/local/bundle/ /usr/local/bundle/
# このスクリプトは、コンテナの起動時に実行されるエントリーポイントとして機能
#  アプリケーションの初期設定や起動前の準備作業などを自動化するために使用
COPY entrypoint.sh /usr/bin/
# entrypoint.shスクリプトファイルに実行権限を付与
#  実行権限を付与することで、コンテナが起動するときにこのスクリプトが自動的に実行されるようになる
RUN chmod +x /usr/bin/entrypoint.sh
# このスクリプトをエントリーポイントとして指定
ENTRYPOINT ["entrypoint.sh"]
# コンテナがリッスンするポートを指示
EXPOSE 3000
# コンテナが起動された際にデフォルトで実行するコマンドを指定
CMD ["rails", "server", "-b", "0.0.0.0"]