/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "polymarket.com",
      },
      {
        protocol: "https",
        hostname: "clob.polymarket.com",
      },
    ],
  },
  // Empty turbopack config to silence Next.js 16 warning
  turbopack: {},
  webpack: (config: any) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default nextConfig;
