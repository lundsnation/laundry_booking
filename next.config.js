/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    AUTH_ISSUER_BASE: process.env.AUTH_ISSUER_BASE,
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL
  }
}

module.exports = nextConfig
