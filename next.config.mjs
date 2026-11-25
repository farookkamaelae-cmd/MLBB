/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "akmweb.youngjoygame.com",
      },
      {
        protocol: "https",
        hostname: "akmwebstatic.yuanzhanapp.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
