import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import fastify, { FastifyInstance } from 'fastify';
import jwt from '@fastify/jwt';
import { checkoutRoutes } from '../checkout';

/**
 * Checkout Routes Test Suite
 *
 * Tests for payment and order management endpoints:
 * - POST /create - Create new order
 * - GET /:orderId - Retrieve order status
 * - Error handling for invalid orders
 * - Payment processing validation
 */

describe('Checkout Routes', () => {
  let app: FastifyInstance;
  let validToken: string;
  const testAddress = '0x1234567890123456789012345678901234567890';

  beforeAll(async () => {
    app = fastify();
    await app.register(jwt, { secret: 'test-secret-key' });
    await app.register(checkoutRoutes, { prefix: '/api/checkout' });

    // Create a valid test token
    validToken = app.jwt.sign({
      address: testAddress,
      userId: 'test-user-1',
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/checkout/create', () => {
    it('should require authentication', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/checkout/create',
        payload: {
          items: [{ id: 'product-1', quantity: 1 }],
          total: 100,
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it('should reject requests without items', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/checkout/create',
        headers: { authorization: `Bearer ${validToken}` },
        payload: {
          // missing items
          total: 100,
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should reject empty items array', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/checkout/create',
        headers: { authorization: `Bearer ${validToken}` },
        payload: {
          items: [],
          total: 0,
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should reject invalid item format', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/checkout/create',
        headers: { authorization: `Bearer ${validToken}` },
        payload: {
          items: [{ id: 'product-1' }], // missing quantity
          total: 100,
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should reject zero or negative totals', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/checkout/create',
        headers: { authorization: `Bearer ${validToken}` },
        payload: {
          items: [{ id: 'product-1', quantity: 1 }],
          total: 0,
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should require shipping address for orders', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/checkout/create',
        headers: { authorization: `Bearer ${validToken}` },
        payload: {
          items: [{ id: 'product-1', quantity: 1 }],
          total: 100,
          // missing shippingAddress
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should validate shipping address format', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/checkout/create',
        headers: { authorization: `Bearer ${validToken}` },
        payload: {
          items: [{ id: 'product-1', quantity: 1 }],
          total: 100,
          shippingAddress: {
            // incomplete address
            street: 'Main St',
          },
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should create order with valid payload', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/checkout/create',
        headers: { authorization: `Bearer ${validToken}` },
        payload: {
          items: [{ id: 'product-1', quantity: 1, price: 50 }],
          total: 50,
          shippingAddress: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zip: '62701',
            country: 'US',
          },
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('orderId');
      expect(body).toHaveProperty('status');
      expect(body.status).toBe('pending');
    });

    it('should return order details on successful creation', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/checkout/create',
        headers: { authorization: `Bearer ${validToken}` },
        payload: {
          items: [{ id: 'product-1', quantity: 1, price: 50 }],
          total: 50,
          shippingAddress: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zip: '62701',
            country: 'US',
          },
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('createdAt');
      expect(body).toHaveProperty('items');
      expect(Array.isArray(body.items)).toBe(true);
    });
  });

  describe('GET /api/checkout/:orderId', () => {
    it('should require authentication', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/checkout/order-123',
      });

      expect(response.statusCode).toBe(401);
    });

    it('should return 404 for non-existent orders', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/checkout/non-existent-order',
        headers: { authorization: `Bearer ${validToken}` },
      });

      expect(response.statusCode).toBe(404);
    });

    it('should return order details with valid orderId', async () => {
      // First create an order
      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/checkout/create',
        headers: { authorization: `Bearer ${validToken}` },
        payload: {
          items: [{ id: 'product-1', quantity: 1, price: 50 }],
          total: 50,
          shippingAddress: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zip: '62701',
            country: 'US',
          },
        },
      });

      const createdOrder = JSON.parse(createResponse.body);
      const orderId = createdOrder.orderId;

      // Then retrieve it
      const response = await app.inject({
        method: 'GET',
        url: `/api/checkout/${orderId}`,
        headers: { authorization: `Bearer ${validToken}` },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.orderId).toBe(orderId);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('items');
      expect(body).toHaveProperty('total');
    });

    it('should prevent users from viewing other users\' orders', async () => {
      // Create an order with one user
      const anotherToken = app.jwt.sign({
        address: '0x9999999999999999999999999999999999999999',
        userId: 'other-user',
      });

      const createResponse = await app.inject({
        method: 'POST',
        url: '/api/checkout/create',
        headers: { authorization: `Bearer ${anotherToken}` },
        payload: {
          items: [{ id: 'product-1', quantity: 1, price: 50 }],
          total: 50,
          shippingAddress: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zip: '62701',
            country: 'US',
          },
        },
      });

      const orderId = JSON.parse(createResponse.body).orderId;

      // Try to view with different user
      const response = await app.inject({
        method: 'GET',
        url: `/api/checkout/${orderId}`,
        headers: { authorization: `Bearer ${validToken}` },
      });

      expect(response.statusCode).toBe(403);
    });
  });

  describe('Checkout Error Handling', () => {
    it('should handle malformed JSON gracefully', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/checkout/create',
        headers: { authorization: `Bearer ${validToken}` },
        payload: '{invalid json',
      });

      expect([400, 422]).toContain(response.statusCode);
    });

    it('should handle missing authorization header', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/checkout/create',
        payload: {
          items: [],
          total: 0,
        },
      });

      expect(response.statusCode).toBe(401);
    });

    it('should handle invalid JWT tokens', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/checkout/create',
        headers: { authorization: 'Bearer invalid-token' },
        payload: {
          items: [],
          total: 0,
        },
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('Checkout Data Validation', () => {
    it('should reject negative quantities', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/checkout/create',
        headers: { authorization: `Bearer ${validToken}` },
        payload: {
          items: [{ id: 'product-1', quantity: -1, price: 50 }],
          total: -50,
          shippingAddress: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zip: '62701',
            country: 'US',
          },
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should validate total matches items sum', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/checkout/create',
        headers: { authorization: `Bearer ${validToken}` },
        payload: {
          items: [{ id: 'product-1', quantity: 1, price: 50 }],
          total: 100, // mismatch!
          shippingAddress: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zip: '62701',
            country: 'US',
          },
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
