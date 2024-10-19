/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 画像をImagesコンポーネントで表示するための設定
  images: {
    domains: [
      'maps.googleapis.com',
      process.env.NEXT_PUBLIC_RAILS_SERVER_URL,
    ],
  },

  env: {
    BACKEND_API_URL: process.env.NODE_ENV === 'production'
      ? 'https://airportable-times-724d7bfa5bb8.herokuapp.com/'
      : 'http://localhost:3000',
  },

  // 開発環境でのパフォーマンス向上のためのwebpackDevMiddleware設定
  webpackDevMiddleware: config => {
    config.watchOptions = {

      // ポーリングの頻度を調整してシステム負荷を軽減
      poll: 5000,

      // 再ビルドまでの待ち時間を設定
      aggregateTimeout: 300,

      // 監視から除外するパスのパターンを指定
      ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
    };
    
    return config;
  },
};

export default nextConfig;
