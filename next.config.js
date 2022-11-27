/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    REACT_APP_ID: process.env.REACT_APP_ID,
    AUTH_ISSUER_BASE: process.env.AUTH_ISSUER_BASE
  }
}

module.exports = nextConfig
