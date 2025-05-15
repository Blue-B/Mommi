/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com'], // 구글 프로필 이미지와 파이어베이스 이미지 모두 허용
  },
};

module.exports = nextConfig;
