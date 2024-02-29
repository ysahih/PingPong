/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
    images: {
        unoptimized: true,
      },
      env: {
        NEST_API: process.env.NEST_API,
      },
      future: {
        webpack5: true,
      }
}

export default nextConfig
