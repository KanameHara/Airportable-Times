/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Googleマップ空取得した画像をImagesコンポーネントで表示するための設定
  images: {
    domains: ['maps.googleapis.com'],
  },
};

export default nextConfig;
