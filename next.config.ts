import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "1mb",
      allowedOrigins: ["*"],
    },
  },
}

export default nextConfig;
