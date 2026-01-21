/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'instagram-api.softclub.tj',
        pathname: '/images/**'
      }
    ]
  }
}

module.exports = nextConfig
