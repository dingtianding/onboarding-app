/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Tell Next.js where to find your pages/app
  distDir: 'client/.next',
};

module.exports = nextConfig; 