/** @type {import('next').NextConfig} */
//env property is required for access to the env variables.
module.exports = {
  reactStrictMode: true,
  env: {
    REACT_APP_SECRET: process.env.REACT_APP_SECRET,
    REACT_APP_ID: process.env.REACT_APP_ID,
  }
}