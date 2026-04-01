/**
 * API Caching Middleware
 *
 * Implements intelligent cache control headers based on content type and auth status.
 * Phase 5.8 - Performance Hardening
 */

import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Cache control configuration by endpoint pattern
 */
const CACHE_CONFIG: Record<
  string,
  {
    maxAge: number;
    isPrivate: boolean;
    mustRevalidate: boolean;
  }
> = {
  // Public data - cacheable for 24 hours
  '/api/public/memes': { maxAge: 86400, isPrivate: false, mustRevalidate: false },
  '/api/public/token/stats': { maxAge: 3600, isPrivate: false, mustRevalidate: false },
  '/api/public/products': { maxAge: 86400, isPrivate: false, mustRevalidate: false },

  // User-specific data - cacheable for 1 hour, private
  '/api/user': { maxAge: 3600, isPrivate: true, mustRevalidate: false },
  '/api/user/orders': { maxAge: 3600, isPrivate: true, mustRevalidate: false },

  // Real-time data - no cache
  '/api/wallet': { maxAge: 0, isPrivate: true, mustRevalidate: true },
  '/api/balance': { maxAge: 0, isPrivate: true, mustRevalidate: true },
};

/**
 * Build Cache-Control header value
 */
function buildCacheControl(config: (typeof CACHE_CONFIG)[keyof typeof CACHE_CONFIG]): string {
  const parts: string[] = [];

  if (config.isPrivate) {
    parts.push('private');
  } else {
    parts.push('public');
  }

  if (config.maxAge > 0) {
    parts.push(`max-age=${config.maxAge}`);
  } else {
    parts.push('no-cache', 'no-store', 'must-revalidate');
  }

  if (config.mustRevalidate) {
    parts.push('must-revalidate');
  }

  return parts.join(', ');
}

/**
 * Find cache config for given path
 */
function getCacheConfig(
  path: string
): (typeof CACHE_CONFIG)[keyof typeof CACHE_CONFIG] | null {
  // Exact match
  if (path in CACHE_CONFIG) {
    return CACHE_CONFIG[path as keyof typeof CACHE_CONFIG];
  }

  // Pattern match
  for (const [pattern, config] of Object.entries(CACHE_CONFIG)) {
    if (path.startsWith(pattern)) {
      return config;
    }
  }

  // Default: moderate cache for unknown endpoints
  return { maxAge: 300, isPrivate: false, mustRevalidate: false };
}

/**
 * Caching middleware hook
 *
 * Usage in Fastify app:
 * ```typescript
 * app.addHook('onSend', cachingHook);
 * ```
 */
export async function cachingHook(
  request: FastifyRequest,
  reply: FastifyReply,
  _payload: unknown
): Promise<void> {
  // Skip caching for non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  const cacheConfig = getCacheConfig(request.url);
  if (!cacheConfig) {
    return;
  }

  const cacheControl = buildCacheControl(cacheConfig);
  reply.header('Cache-Control', cacheControl);

  // Add ETag for cache validation
  if (reply.statusCode === 200) {
    reply.header('Vary', 'Accept-Encoding');
  }
}

/**
 * Caching strategies for different endpoints
 */
export const CacheStrategies = {
  /**
   * Public content: 24 hour cache
   */
  publicContent: () => ({
    maxAge: 86400,
    isPrivate: false,
    mustRevalidate: false,
  }),

  /**
   * User-specific: 1 hour cache, private
   */
  userSpecific: () => ({
    maxAge: 3600,
    isPrivate: true,
    mustRevalidate: false,
  }),

  /**
   * Real-time: no cache
   */
  realTime: () => ({
    maxAge: 0,
    isPrivate: true,
    mustRevalidate: true,
  }),

  /**
   * Short-lived: 5 minute cache
   */
  shortLived: () => ({
    maxAge: 300,
    isPrivate: false,
    mustRevalidate: false,
  }),
};

/**
 * Manual cache control helper
 *
 * Usage in route handler:
 * ```typescript
 * app.get('/api/data', async (request, reply) => {
 *   setCacheControl(reply, CacheStrategies.publicContent());
 *   return { data: 'value' };
 * });
 * ```
 */
export function setCacheControl(
  reply: FastifyReply,
  strategy: ReturnType<(typeof CacheStrategies)[keyof typeof CacheStrategies]>
): void {
  const cacheControl = buildCacheControl(strategy);
  reply.header('Cache-Control', cacheControl);
  reply.header('Vary', 'Accept-Encoding');
}

/**
 * Compression configuration for responses
 *
 * Enable in Fastify:
 * ```typescript
 * app.register(require('@fastify/compress'), {
 *   threshold: 1024,  // Compress responses > 1KB
 *   encodings: ['gzip', 'br'],
 * });
 * ```
 */
export const COMPRESSION_CONFIG = {
  threshold: 1024, // Minimum size to compress (1KB)
  encodings: ['gzip', 'br'], // Enable gzip and brotli
};

/**
 * Performance monitoring middleware
 *
 * Tracks API response times for performance analysis
 */
export async function performanceHook(request: FastifyRequest): Promise<void> {
  const startTime = Date.now();

  // Add cleanup hook to measure duration
  request.server.addHook('onSend', async (request, reply) => {
    const duration = Date.now() - startTime;

    // Log slow requests (> 1000ms)
    if (duration > 1000) {
      request.log.warn({
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        duration,
        message: 'Slow API response',
      });
    }

    // Add timing header
    reply.header('X-Response-Time', `${duration}ms`);

    return reply;
  });
}

export default {
  cachingHook,
  setCacheControl,
  CacheStrategies,
  COMPRESSION_CONFIG,
  performanceHook,
};
