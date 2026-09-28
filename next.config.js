/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'th.bing.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tse1.mm.bing.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tse2.mm.bing.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tse3.mm.bing.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tse4.mm.bing.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.tusktravel.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'livingnomads.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imgs.search.brave.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.yachtgetawaysmumbai.in',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'yachtgetawaysmumbai.in',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'date-fns',
      'recharts',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable persistent pack-file disk cache in dev mode on Windows.
      // Webpack's PackFileCacheStrategy causes RangeError: Array buffer allocation failed
      // and ENOENT/EPERM rename errors when serializing large gz chunks.
      config.cache = false;
    }
    return config;
  },
}

module.exports = nextConfig

