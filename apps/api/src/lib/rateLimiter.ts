/**
 * Simple in-memory rate limiter for public API endpoints
 * Tracks requests per IP address with time-based reset
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private readonly maxRequests: number;
  private readonly windowMs: number; // in milliseconds

  constructor(maxRequests: number = 1000, windowMs: number = 60 * 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;

    // Cleanup old entries every 5 minutes
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.store.entries()) {
        if (entry.resetTime < now) {
          this.store.delete(key);
        }
      }
    }, 5 * 60 * 1000);
  }

  isLimited(ip: string): boolean {
    const now = Date.now();
    const entry = this.store.get(ip);

    if (!entry || entry.resetTime < now) {
      // Create new entry
      this.store.set(ip, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return false;
    }

    // Increment existing entry
    entry.count += 1;
    if (entry.count > this.maxRequests) {
      return true; // Limited
    }

    return false;
  }

  getRemaining(ip: string): number {
    const now = Date.now();
    const entry = this.store.get(ip);

    if (!entry || entry.resetTime < now) {
      return this.maxRequests;
    }

    return Math.max(0, this.maxRequests - entry.count);
  }

  getResetTime(ip: string): number {
    const entry = this.store.get(ip);
    return entry ? entry.resetTime : Date.now() + this.windowMs;
  }
}

export const publicApiLimiter = new RateLimiter(1000, 60 * 60 * 1000); // 1000 requests per hour

export function getClientIp(request: any): string {
  // Check for various proxy headers
  const xForwardedFor = request.headers['x-forwarded-for'];
  if (xForwardedFor) {
    // x-forwarded-for can be a comma-separated list
    return (xForwardedFor as string).split(',')[0].trim();
  }

  const xRealIp = request.headers['x-real-ip'];
  if (xRealIp) {
    return xRealIp as string;
  }

  // Fallback to socket address
  return request.socket?.remoteAddress || '0.0.0.0';
}
