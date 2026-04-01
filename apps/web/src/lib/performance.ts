/**
 * Performance Optimization Configuration for dshit.xyz
 * 
 * This module handles:
 * - Caching strategies
 * - Image optimization
 * - Database query optimization
 * - API response caching
 */

// Cache configuration for different resource types
export const cacheConfig = {
  // Static assets: cache forever (immutable)
  staticAssets: {
    maxAge: 31536000, // 1 year
    immutable: true,
  },
  // API responses: shorter cache with revalidation
  api: {
    maxAge: 60, // 1 minute
    staleWhileRevalidate: 120, // 2 minutes
  },
  // HTML pages: balance between freshness and performance
  html: {
    maxAge: 300, // 5 minutes
    staleWhileRevalidate: 600, // 10 minutes
  },
  // Images: aggressive caching
  images: {
    maxAge: 31536000, // 1 year
    immutable: true,
  },
} as const;

/**
 * Database Query Optimization Hints
 */
export const dbOptimizations = {
  // Use pagination for large datasets
  pageSize: 20,
  
  // Cache frequently accessed data
  cacheTTL: {
    user: 300, // 5 minutes
    meme: 600, // 10 minutes
    gallery: 900, // 15 minutes
  },

  // Indexes to create
  indexes: [
    'memes.created_at',
    'memes.votes',
    'users.wallet_address',
    'transactions.user_id',
    'transactions.created_at',
  ],
} as const;

/**
 * Image Optimization Settings
 */
export const imageConfig = {
  formats: ['image/avif', 'image/webp'],
  quality: 80,
  sizes: {
    thumbnail: 200,
    medium: 600,
    large: 1200,
  },
} as const;

/**
 * Web Vitals Targets
 */
export const webVitalsTargets = {
  LCP: 2500, // Largest Contentful Paint
  FID: 100,  // First Input Delay
  CLS: 0.1,  // Cumulative Layout Shift
  FCP: 1800, // First Contentful Paint
  TTFB: 600, // Time to First Byte
} as const;

/**
 * Performance monitoring function
 */
export function reportWebVitals(metric: any) {
  if (typeof window !== 'undefined') {
    // Send to analytics service
    if (process.env.NODE_ENV === 'production') {
      console.log(`[Performance] ${metric.name}:`, metric.value);
    }
  }
}
