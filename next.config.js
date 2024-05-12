/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    env: {
        API_SERVICE: process.env.NEXT_PUBLIC_API_SERVICE
    }
  };
