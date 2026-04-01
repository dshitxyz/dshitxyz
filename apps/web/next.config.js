/** @type {import('next').NextConfig} */
const nextConfig = {
  // ============================================================================
  // PERFORMANCE & OPTIMIZATION SETTINGS (Phase 5.8)
  // ============================================================================

  reactStrictMode: true,
  swcMinify: true,

  // Image optimization for CDN
  images: {
    // Enable image optimization with responsive sizing
    unoptimized: false,
    // Supported image formats for better compression
    formats: ['image/avif', 'image/webp'],
    // Image sizes for responsive loading
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimization images
    minimumCacheTTL: 31536000, // 1 year for versioned images
    // Domain whitelist for external images (add as needed)
    domains: [],
  },

  typescript: {
    tsconfigPath: './tsconfig.json',
  },

  // Compression & bundle optimization
  compress: true,

  // Enable production source maps for error tracking
  productionBrowserSourceMaps: true,

  // Trailing slashes for CDN compatibility
  trailingSlash: false,

  // Headers for caching static assets
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Content-Type',
            value: 'application/octet-stream',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects (performance: avoid unnecessary redirects)
  async redirects() {
    return [];
  },

  // Rewrites for API proxying (reduces DNS lookups)
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },

  // Web vitals monitoring configuration
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },

  // Optimize for Lighthouse
  experimental: {
    // Optimized Font loading
    optimizePackageImports: ['@rainbow-me/rainbowkit'],
  },
};

module.exports = nextConfig;
