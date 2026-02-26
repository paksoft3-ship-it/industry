import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      { pathname: "/images/**" },
      { pathname: "/uploads/**" },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
    minimumCacheTTL: 86400,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
