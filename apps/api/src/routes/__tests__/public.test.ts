import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import fastify, { FastifyInstance } from 'fastify';
import { publicRoutes } from '../public';

/**
 * Public API Routes Test Suite
 *
 * Tests for public-facing endpoints:
 * - GET /memes - Paginated meme gallery
 * - GET /stats - Token and platform statistics
 * - GET /leaderboard - Creator leaderboard
 * - GET /health - Service health check
 */

describe('Public API Routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = fastify();
    await app.register(publicRoutes, { prefix: '/api/public' });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/public/health', () => {
    it('should return service health status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/public/health',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('version');
      expect(body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/public/stats', () => {
    it('should return token and platform statistics', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/public/stats',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('tokenStats');
      expect(body).toHaveProperty('platformStats');

      // Token stats structure
      expect(body.tokenStats).toHaveProperty('price');
      expect(body.tokenStats).toHaveProperty('marketCap');
      expect(body.tokenStats).toHaveProperty('volume24h');
      expect(body.tokenStats).toHaveProperty('holders');

      // Platform stats structure
      expect(body.platformStats).toHaveProperty('totalMemes');
      expect(body.platformStats).toHaveProperty('totalCreators');
      expect(body.platformStats).toHaveProperty('totalVotes');
    });

    it('should return numeric values for statistics', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/public/stats',
      });

      const body = JSON.parse(response.body);
      expect(typeof body.tokenStats.price).toBe('number');
      expect(typeof body.tokenStats.marketCap).toBe('number');
      expect(typeof body.platformStats.totalMemes).toBe('number');
    });
  });

  describe('GET /api/public/memes', () => {
    it('should return paginated meme list', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/public/memes?page=1&limit=10',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(Array.isArray(body.memes)).toBe(true);
      expect(body).toHaveProperty('total');
      expect(body).toHaveProperty('page');
      expect(body).toHaveProperty('limit');
    });

    it('should enforce maximum limit of 50', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/public/memes?page=1&limit=100',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.limit).toBeLessThanOrEqual(50);
    });

    it('should support sorting by trending', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/public/memes?sort=trending',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(Array.isArray(body.memes)).toBe(true);
    });

    it('should support sorting by newest', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/public/memes?sort=newest',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(Array.isArray(body.memes)).toBe(true);
    });

    it('should default to page 1 and limit 20', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/public/memes',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.page).toBe(1);
      expect(body.limit).toBeLessThanOrEqual(20);
    });

    it('should return meme objects with required fields', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/public/memes?limit=1',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      if (body.memes.length > 0) {
        const meme = body.memes[0];
        expect(meme).toHaveProperty('id');
        expect(meme).toHaveProperty('creator');
        expect(meme).toHaveProperty('votes');
      }
    });
  });

  describe('GET /api/public/leaderboard', () => {
    it('should return creator leaderboard', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/public/leaderboard?type=creators',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(Array.isArray(body.leaderboard)).toBe(true);
      expect(body).toHaveProperty('type');
    });

    it('should enforce maximum limit of 100', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/public/leaderboard?limit=200',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.leaderboard.length).toBeLessThanOrEqual(100);
    });

    it('should return creator objects with earnings', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/public/leaderboard?type=creators&limit=1',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      if (body.leaderboard.length > 0) {
        const creator = body.leaderboard[0];
        expect(creator).toHaveProperty('address');
        expect(creator).toHaveProperty('earnings');
        expect(typeof creator.earnings).toBe('number');
      }
    });
  });

  describe('Public API Error Handling', () => {
    it('should handle invalid page numbers gracefully', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/public/memes?page=abc',
      });

      // Should either coerce to default or return error
      expect([200, 400]).toContain(response.statusCode);
    });

    it('should handle invalid sort parameters gracefully', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/public/memes?sort=invalid',
      });

      // Should either use default or return error
      expect([200, 400]).toContain(response.statusCode);
    });

    it('should handle missing optional parameters', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/public/memes',
      });

      expect(response.statusCode).toBe(200);
    });
  });

  describe('Public API Response Format', () => {
    it('should return proper Content-Type headers', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/public/health',
      });

      expect(response.headers['content-type']).toContain('application/json');
    });

    it('should return valid JSON in all responses', async () => {
      const endpoints = [
        '/api/public/health',
        '/api/public/stats',
        '/api/public/memes',
        '/api/public/leaderboard',
      ];

      for (const endpoint of endpoints) {
        const response = await app.inject({
          method: 'GET',
          url: endpoint,
        });

        expect(() => JSON.parse(response.body)).not.toThrow();
      }
    });
  });
});
