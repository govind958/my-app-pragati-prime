/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    qualities: [75, 85, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wgbecseaahisrmhddykz.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/article_image/**', 
      },
      {
        protocol: 'https',
        hostname: 'wgbecseaahisrmhddykz.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/logo/**', 
      },
      {
        protocol: 'https',
        hostname: 'wgbecseaahisrmhddykz.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/profile_image/**', 
      },
      {
        protocol: 'https',
        hostname: 'wgbecseaahisrmhddykz.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/images/**', 
      },
    ],
  },
  
  // Optimize production builds
  swcMinify: true,
  
  // Enable React strict mode for better performance
  reactStrictMode: true,
  
  // Optimize fonts
  optimizeFonts: true,
  
  // Power optimizations
  poweredByHeader: false,
  
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;