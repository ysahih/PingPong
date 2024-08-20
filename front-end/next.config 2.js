/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: false ,
  // output: 'export',
  env: {
    NEST_API: process.env.NEST_API,
  },
  images: {
    unoptimized: true,
  },
    swcMinify: true,
    
  };
  
  module.exports = nextConfig;