import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow warnings but not errors for hackathon demo
    ignoreDuringBuilds: false,
  },
  // Convert ESLint errors to warnings
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
