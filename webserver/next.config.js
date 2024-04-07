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
    },
    {/**
      * http://127.0.0.1:3002 - this is the same as localhost. For some reason the dns was resolving localhost to ipv6 which was causing connection issues with cms.
      * So I've defined the ipv4 address here.
      */
      protocol: 'http',
      hostname: '127.0.0.1',
      port: '3002',
      pathname: '/CMS/articles/**',
    },
  ]
  },
  env: {
    NEXT_PUBLIC_CMS_ROUTE: process.env.CMS_ROUTE,
    NEXT_PUBLIC_AI_API: process.env.AI_API,
    NEXT_PUBLIC_REVALIDATE_TIME_SECS: process.env.REVALIDATE_TIME_SECS,
    NEXT_PUBLIC_VERSION: process.env.VERSION
  }
}

module.exports = withMDX(nextConfig);
