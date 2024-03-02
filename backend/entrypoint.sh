#!/bin/bash
# set -eコマンドは、スクリプト実行中にエラー（非ゼロの終了ステータスを返すコマンド）が発生した場合に
# スクリプトを直ちに終了させるために使用
set -e

# Remove a potentially pre-existing server.pid for Rails.
# uby on Railsアプリケーションの起動前に古いサーバープロセスID（PID）ファイルを安全に削除するために使用
rm -f /airapp/tmp/pids/server.pid

# Then exec the container's main process (what's set as CMD in the Dockerfile).
# コンテナ内のメインプロセスを実行するために、CMDに設定されたコマンドを実行します。
# CMDは、Dockerイメージ内で定義されたコマンドのリストです。
# CMDは、引数として与えられるコマンドのリストです。
exec "$@"