/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables configuration
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_STRIPE_PAYMENT_LINK: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_MOCK_PAYMENTS: process.env.NEXT_PUBLIC_MOCK_PAYMENTS,
  },
  
  // Image optimization
  images: {
    domains: ['localhost', 'images.unsplash.com', 'res.cloudinary.com', '45.32.74.216'],
    unoptimized: false,
  },
  
  // Build configuration
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '45.32.74.216'],
    },
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
