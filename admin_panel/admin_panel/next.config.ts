import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@mdxeditor/editor'],
  images: {
    domains: ['localhost'],
  }
};

export default nextConfig;
