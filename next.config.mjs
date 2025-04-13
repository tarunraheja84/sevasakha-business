/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['tarunraheja84.s3.ap-south-1.amazonaws.com'],
      },
      experimental: {
        serverActions: {
          bodySizeLimit: '10mb',
        },
      },
};

export default nextConfig;
