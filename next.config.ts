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
  // Empty turbopack config to acknowledge webpack config
  turbopack: {},
  webpack: (config: any, { isServer }: any) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");

    // Ignore test files and non-source files from bundling
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    config.module.rules.push({
      test: /node_modules\/thread-stream\/(test|bench\.js|\.md|LICENSE)/,
      use: "null-loader",
    });

    // Ignore specific problematic files
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      // Ignore thread-stream test files
      "thread-stream/test": false,
      "thread-stream/bench.js": false,
    };

    return config;
  },
  // Optimize for production
  productionBrowserSourceMaps: false,
  // Exclude test files from being processed
  pageExtensions: ["tsx", "ts", "jsx", "js"],
};

export default nextConfig;
