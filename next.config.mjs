/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
    ],
  },
};

export default nextConfig;