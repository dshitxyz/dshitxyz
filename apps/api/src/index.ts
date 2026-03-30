import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import { authRoutes } from '@/routes/auth';
import { userRoutes } from '@/routes/users';

const app = Fastify({
  logger: true,
});

// Register plugins
app.register(helmet);
app.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
});
app.register(jwt, {
  secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
});

// Health check
app.get('/health', async () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
}));

// Routes
app.register(authRoutes, { prefix: '/api/auth' });
app.register(userRoutes, { prefix: '/api/users' });

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001', 10);
    const host = process.env.HOST || '0.0.0.0';
    await app.listen({ port, host });
    console.log(`Server running at http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
