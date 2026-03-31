import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';

interface Order {
  id: string;
  userId: string;
  address: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// In-memory storage (replace with database in production)
const orders: Map<string, Order> = new Map();

export async function checkoutRoutes(app: FastifyInstance) {
  // Create order
  app.post<{ Body: any }>('/checkout/create', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }

      const { items, shippingAddress, address, userId } = request.body as any;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return reply.status(400).send({ message: 'Invalid items' });
      }

      if (!shippingAddress || !address) {
        return reply.status(400).send({ message: 'Missing required fields' });
      }

      const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

      const order: Order = {
        id: uuidv4(),
        userId: userId || 'anonymous',
        address,
        items,
        total,
        shippingAddress,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      orders.set(order.id, order);

      return reply.status(201).send({
        success: true,
        order,
        message: 'Order created successfully',
      });
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  // Get order by ID
  app.get<{ Params: { orderId: string } }>('/checkout/:orderId', async (request, reply) => {
    try {
      const { orderId } = request.params as { orderId: string };
      const order = orders.get(orderId);

      if (!order) {
        return reply.status(404).send({ message: 'Order not found' });
      }

      return reply.send(order);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  // Update order status (admin only in production)
  app.patch<{ Params: { orderId: string }; Body: any }>('/checkout/:orderId', async (request, reply) => {
    try {
      const { orderId } = request.params as { orderId: string };
      const { status } = request.body;

      const order = orders.get(orderId);
      if (!order) {
        return reply.status(404).send({ message: 'Order not found' });
      }

      order.status = status;
      order.updatedAt = new Date().toISOString();
      orders.set(orderId, order);

      return reply.send(order);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  // Get user orders (requires auth)
  app.get('/checkout/user/orders', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }

      const userOrders = Array.from(orders.values());
      return reply.send(userOrders);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });
}
