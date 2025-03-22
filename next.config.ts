/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // This ensures Next.js outputs a standalone build that Render can deploy
  output: 'standalone',
}

module.exports = nextConfig 