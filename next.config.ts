// next.config.js
module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};
/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
    // This tells Next.js to ignore ESLint errors during builds
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.foldingchairs4less.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'thronekingdom.com',
        port: '',
        pathname: '/**',
    },
    ],
    
  },
}

module.exports = nextConfig

export default nextConfig;
