import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import fastify, { FastifyInstance } from 'fastify';
import jwt from '@fastify/jwt';
import { authRoutes } from '../auth';

/**
 * Auth Routes Test Suite
 *
 * Tests for wallet authentication endpoints:
 * - POST /verify - Verify signed message and create/update user
 * - Error handling for invalid signatures
 * - Timestamp validation
 * - User creation and retrieval
 */

describe('Auth Routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = fastify();
    await app.register(jwt, { secret: 'test-secret-key' });
    await app.register(authRoutes, { prefix: '/api/auth' });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/auth/verify', () => {
    it('should reject requests without required fields', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/verify',
        payload: {
          address: '0x1234567890123456789012345678901234567890',
          // missing signature and message
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should reject invalid ethereum addresses', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/verify',
        payload: {
          address: 'not-an-address',
          signature: '0xabcd1234',
          message: 'Sign this message',
          timestamp: Date.now(),
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should reject expired signatures (older than 5 minutes)', async () => {
      const expiredTimestamp = Date.now() - 6 * 60 * 1000; // 6 minutes ago

      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/verify',
        payload: {
          address: '0x1234567890123456789012345678901234567890',
          signature: '0xabcd1234',
          message: 'Sign this message',
          timestamp: expiredTimestamp,
        },
      });

      expect(response.statusCode).toBe(401);
      expect(JSON.parse(response.body).message).toBe('Signature expired');
    });

    it('should reject invalid signatures', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/verify',
        payload: {
          address: '0x1234567890123456789012345678901234567890',
          signature: 'invalid-signature',
          message: 'Sign this message',
          timestamp: Date.now(),
        },
      });

      expect(response.statusCode).toBe(401);
      expect(JSON.parse(response.body).message).toBe('Invalid signature');
    });

    it('should reject mismatched address and signature', async () => {
      // This tests the case where signature doesn't match the claimed address
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/verify',
        payload: {
          address: '0x1234567890123456789012345678901234567890',
          signature: '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', // dummy valid format
          message: 'Sign this message',
          timestamp: Date.now(),
        },
      });

      // Should fail signature verification or address mismatch check
      expect([400, 401]).toContain(response.statusCode);
    });
  });

  describe('Auth Error Handling', () => {
    it('should handle malformed JSON gracefully', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/verify',
        payload: '{invalid json',
      });

      expect([400, 422]).toContain(response.statusCode);
    });

    it('should require all required fields', async () => {
      const requiredFields = ['address', 'signature', 'message', 'timestamp'];

      for (const field of requiredFields) {
        const payload: any = {
          address: '0x1234567890123456789012345678901234567890',
          signature: '0xabcd1234',
          message: 'Sign this',
          timestamp: Date.now(),
        };
        delete payload[field];

        const response = await app.inject({
          method: 'POST',
          url: '/api/auth/verify',
          payload,
        });

        expect(response.statusCode).toBe(400);
      }
    });
  });
});
