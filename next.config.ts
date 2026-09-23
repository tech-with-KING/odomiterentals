import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    eslint: {
    // This tells Next.js to ignore ESLint errors during builds
    ignoreDuringBuilds: true,
  },
  images: {
    // Vercel's image optimization quota is exhausted (402 OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED),
    // so serve images directly from Supabase/Cloudinary instead of via /_next/image.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Allow service workers
  async headers() {
    return [
      {
        source: '/firebase-messaging-sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/'
          }
        ],
      },
    ];
  },
};

export default nextConfig;
