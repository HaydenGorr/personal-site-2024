const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/
});

/** @type {import('next').NextConfig} */

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  images: {
    remotePatterns: [{
      protocol: 'http',
      hostname: 'localhost',
      port: '3002',
      pathname: '/CMS/articles/**',
    }]
  },
  env: {
    NEXT_PUBLIC_CMS_ROUTE: process.env.CMS_ROUTE,
    NEXT_PUBLIC_AI_API: process.env.AI_API,
  }
}

module.exports = withMDX(nextConfig);
