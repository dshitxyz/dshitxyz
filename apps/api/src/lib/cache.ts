/**
 * In-Memory Caching Layer for API Responses
 *
 * This module provides a simple but effective caching strategy for
 * expensive API operations. Uses a time-based TTL (Time To Live) approach.
 *
 * Cache TTL Strategy:
 * - Real-time data (stats): 60 seconds
 * - Browseable content (memes): 120 seconds
 * - Static lists (leaderboard): 300 seconds
 * - User-specific data: 60 seconds
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // TTL in milliseconds
}

interface CacheConfig {
  maxSize?: number; // Maximum cache size in MB
  cleanupInterval?: number; // Auto-cleanup interval in ms
}

/**
 * Simple in-memory cache with TTL support
 */
export class Cache {
  private store: Map<string, CacheEntry<any>> = new Map();
  private maxSize: number;
  private cleanupInterval: number;

  constructor(config: CacheConfig = {}) {
    this.maxSize = config.maxSize || 50; // 50MB default
    this.cleanupInterval = config.cleanupInterval || 300000; // 5 minutes

    // Start cleanup interval
    setInterval(() => this.cleanup(), this.cleanupInterval);
  }

  /**
   * Get a value from cache (if not expired)
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);

    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.store.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set a value in cache with TTL
   */
  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    });
  }

  /**
   * Delete a specific key
   */
  delete(key: string): void {
    this.store.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Remove expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.store.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.store.delete(key);
        removed++;
      }
    }

    if (removed > 0 && process.env.DEBUG_CACHE === 'true') {
      console.log(`[CACHE] Cleaned up ${removed} expired entries`);
    }
  }

  /**
   * Get cache statistics
   */
  stats() {
    return {
      size: this.store.size,
      keys: Array.from(this.store.keys()),
    };
  }
}

/**
 * Global cache instance
 */
export const cache = new Cache({
  maxSize: 50,
  cleanupInterval: 300000, // 5 minutes
});

/**
 * Cache key generator helper
 */
export const cacheKeys = {
  stats: (period: string = 'hourly') => `stats:${period}`,
  memes: (page: number = 1, sort: string = 'trending') => `memes:${sort}:${page}`,
  leaderboard: (limit: number = 100) => `leaderboard:${limit}`,
  user: (wallet: string) => `user:${wallet}`,
  product: (id: string) => `product:${id}`,
  orders: (wallet: string) => `orders:${wallet}`,
};

/**
 * Cache TTL constants (in seconds)
 */
export const CACHE_TTL = {
  INSTANT: 30, // 30 seconds - very fresh data
  SHORT: 60, // 1 minute - real-time data
  MEDIUM: 120, // 2 minutes - frequently changing data
  LONG: 300, // 5 minutes - slower changing data
  VERY_LONG: 900, // 15 minutes - static lists
  HOUR: 3600, // 1 hour - rare updates
};

/**
 * Example usage in API routes:
 *
 * =======================================
 * GET /api/public/stats (60s cache)
 * =======================================
 * app.get('/api/public/stats', async (request, reply) => {
 *   const cached = cache.get(cacheKeys.stats());
 *   if (cached) return reply.send(cached);
 *
 *   const stats = await computeStats();
 *   cache.set(cacheKeys.stats(), stats, CACHE_TTL.SHORT);
 *   return reply.send(stats);
 * });
 *
 * =======================================
 * GET /api/public/memes (120s cache)
 * =======================================
 * app.get('/api/public/memes', async (request, reply) => {
 *   const { page = 1, sort = 'trending' } = request.query;
 *   const key = cacheKeys.memes(page, sort);
 *
 *   const cached = cache.get(key);
 *   if (cached) return reply.send(cached);
 *
 *   const memes = await fetchMemes(page, sort);
 *   cache.set(key, memes, CACHE_TTL.MEDIUM);
 *   return reply.send(memes);
 * });
 *
 * =======================================
 * GET /api/public/leaderboard (300s cache)
 * =======================================
 * app.get('/api/public/leaderboard', async (request, reply) => {
 *   const key = cacheKeys.leaderboard(100);
 *
 *   const cached = cache.get(key);
 *   if (cached) return reply.send(cached);
 *
 *   const leaderboard = await computeLeaderboard();
 *   cache.set(key, leaderboard, CACHE_TTL.LONG);
 *   return reply.send(leaderboard);
 * });
 *
 * =======================================
 * Cache Invalidation Pattern
 * =======================================
 * When creating/updating data, invalidate related caches:
 *
 * app.post('/api/memes', async (request, reply) => {
 *   const meme = await createMeme(request.body);
 *
 *   // Invalidate all meme lists
 *   cache.delete(cacheKeys.memes(1, 'trending'));
 *   cache.delete(cacheKeys.memes(1, 'newest'));
 *
 *   // Invalidate leaderboard
 *   cache.delete(cacheKeys.leaderboard());
 *
 *   return reply.send(meme);
 * });
 */
