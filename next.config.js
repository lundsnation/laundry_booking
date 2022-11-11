/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    REACT_APP_SECRET: process.env.REACT_APP_SECRET,
    REACT_APP_ID: process.env.REACT_APP_ID,
  }
}