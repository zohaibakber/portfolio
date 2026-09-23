import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first: noticeably smaller than WebP for the project screenshots.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
