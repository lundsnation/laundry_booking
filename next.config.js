/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    REACT_APP_ID: process.env.REACT_APP_ID,
    AUTH_ISSUER_BASE: process.env.AUTH_ISSUER_BASE,
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
    REACT_APP_PUSHER_KEY: process.env.REACT_APP_PUSHER_KEY,
    REACT_APP_PUSHER_CLUSTER: process.env.REACT_APP_PUSHER_CLUSTER
  }
}

module.exports = nextConfig