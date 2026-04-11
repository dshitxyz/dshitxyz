import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../lib/auth';

interface Order {
  id: string;
  userAddress: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
  shipping: {
    recipientName: string;
    recipientEmail?: string;
    recipientAddress: string;
    recipientCity: string;
    recipientZip: string;
    recipientCountry: string;
    anonymous: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// In-memory storage for MVP
const orders: Map<string, Order> = new Map();

export async function checkoutRoutes(app: FastifyInstance) {
  // POST /api/checkout - Create new order
  app.post('/checkout', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Verify auth
      const token = request.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        reply.status(401);
        return { error: 'Unauthorized' };
      }

      const user = await verifyToken(token);
      if (!user) {
        reply.status(401);
        return { error: 'Invalid token' };
      }

      const { items, total, shipping } = request.body as {
        items: {
          id: string;
          name: string;
          quantity: number;
          price: number;
        }[];
        total: number;
        shipping: {
          recipientName: string;
          recipientEmail?: string;
          recipientAddress: string;
          recipientCity: string;
          recipientZip: string;
          recipientCountry: string;
          anonymous: boolean;
        };
      };

      // Validation
      if (!items || items.length === 0) {
        reply.status(400);
        return { error: 'Cart is empty' };
      }

      if (!shipping || !shipping.recipientName || !shipping.recipientAddress) {
        reply.status(400);
        return { error: 'Invalid shipping information' };
      }

      if (typeof total !== 'number' || total <= 0) {
        reply.status(400);
        return { error: 'Invalid order total' };
      }

      // Create order
      const orderId = `ORDER-${Date.now()}`;
      const now = new Date().toISOString();
      const order: Order = {
        id: orderId,
        userAddress: user.address,
        items,
        total,
        status: 'confirmed',
        shipping,
        createdAt: now,
        updatedAt: now,
      };

      orders.set(orderId, order);

      reply.status(201);
      return {
        order,
        message: 'Order created successfully',
      };
    } catch (error) {
      console.error('Error creating order:', error);
      reply.status(500);
      return { error: 'Failed to create order' };
    }
  });

  // GET /api/checkout/:orderId - Get order details
  app.get(
    '/checkout/:orderId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { orderId } = request.params as { orderId: string };
        const order = orders.get(orderId);

        if (!order) {
          reply.status(404);
          return { error: 'Order not found' };
        }

        return order;
      } catch (error) {
        console.error('Error fetching order:', error);
        reply.status(500);
        return { error: 'Failed to fetch order' };
      }
    }
  );

  // GET /api/checkout/user/orders - Get user's orders
  app.get(
    '/checkout/user/orders',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // Verify auth
        const token = request.headers.authorization?.replace('Bearer ', '');
        if (!token) {
          reply.status(401);
          return { error: 'Unauthorized' };
        }

        const user = await verifyToken(token);
        if (!user) {
          reply.status(401);
          return { error: 'Invalid token' };
        }

        const userOrders = Array.from(orders.values()).filter(
          (order) => order.userAddress === user.address
        );

        return {
          orders: userOrders.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ),
        };
      } catch (error) {
        console.error('Error fetching user orders:', error);
        reply.status(500);
        return { error: 'Failed to fetch orders' };
      }
    }
  );

  // PATCH /api/checkout/:orderId - Update order status
  app.patch(
    '/checkout/:orderId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { orderId } = request.params as { orderId: string };
        const { status } = request.body as {
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
        };

        const order = orders.get(orderId);
        if (!order) {
          reply.status(404);
          return { error: 'Order not found' };
        }

        // Validate status transition
        const validStatuses = [
          'pending',
          'confirmed',
          'processing',
          'shipped',
          'delivered',
        ];
        if (!validStatuses.includes(status)) {
          reply.status(400);
          return { error: 'Invalid status' };
        }

        order.status = status;
        order.updatedAt = new Date().toISOString();
        orders.set(orderId, order);

        return order;
      } catch (error) {
        console.error('Error updating order:', error);
        reply.status(500);
        return { error: 'Failed to update order' };
      }
    }
  );

  // GET /api/checkout/stats - Order statistics
  app.get(
    '/checkout/stats',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const allOrders = Array.from(orders.values());

        const stats = {
          totalOrders: allOrders.length,
          totalVolume: allOrders.reduce((sum, order) => sum + order.total, 0),
          averageOrderValue:
            allOrders.length > 0
              ? allOrders.reduce((sum, order) => sum + order.total, 0) /
                allOrders.length
              : 0,
          ordersByStatus: {
            pending: allOrders.filter((o) => o.status === 'pending').length,
            confirmed: allOrders.filter((o) => o.status === 'confirmed')
              .length,
            processing: allOrders.filter((o) => o.status === 'processing')
              .length,
            shipped: allOrders.filter((o) => o.status === 'shipped').length,
            delivered: allOrders.filter((o) => o.status === 'delivered')
              .length,
          },
          recentOrders: allOrders
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .slice(0, 10),
        };

        return stats;
      } catch (error) {
        console.error('Error fetching stats:', error);
        reply.status(500);
        return { error: 'Failed to fetch stats' };
      }
    }
  );
}
