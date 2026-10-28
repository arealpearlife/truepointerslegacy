import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@truepointers/commerce", "@truepointers/tokens"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
};

export default nextConfig;
