/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https', // The protocol for the image URL
        hostname: 'tarunraheja84.s3.ap-south-1.amazonaws.com', // The hostname of the remote image source
        pathname: '/**', // The path pattern to match images
      },
    ],
  },
};

export default nextConfig;