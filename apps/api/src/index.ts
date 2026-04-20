import Fastify from 'fastify';
import { healthRoute } from './routes/health';

const PORT = parseInt(process.env.API_PORT || '3001', 10);
const HOST = process.env.API_HOST || 'localhost';

async function start() {
  const fastify = Fastify({
    logger: true,
  });

  // Register routes
  fastify.register(healthRoute, { prefix: '/api' });

  // Start server
  try {
    await fastify.listen({ port: PORT, host: HOST });
    console.log(`✅ API server running on http://${HOST}:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import { authRoutes } from '@/routes/auth';
import { userRoutes } from '@/routes/users';
import { statsRoutes } from '@/routes/stats';
import { memesRoutes } from '@/routes/memes';
import { checkoutRoutes } from '@/routes/checkout';
import { publicRoutes } from '@/routes/public';
import { analyticsRoutes } from '@/routes/analytics';
import { publicApiLimiter, getClientIp } from '@/lib/rateLimiter';
import { partnershipsRoutes } from '@/routes/partnerships';

const app = Fastify({
  logger: true,
});

// Register plugins
app.register(helmet);
app.register(cors, {
  origin: true, // Allow all origins for public endpoints
});
app.register(jwt, {
  secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
});

// Rate limiting middleware for public API endpoints
app.addHook('onRequest', async (request, reply) => {
  if (request.url.startsWith('/api/public/')) {
    const clientIp = getClientIp(request);
    const isLimited = publicApiLimiter.isLimited(clientIp);
    const remaining = publicApiLimiter.getRemaining(clientIp);
    const resetTime = publicApiLimiter.getResetTime(clientIp);

    // Set rate limit headers
    reply.header('X-RateLimit-Limit', '1000');
    reply.header('X-RateLimit-Remaining', remaining.toString());
    reply.header('X-RateLimit-Reset', Math.ceil(resetTime / 1000).toString());

    if (isLimited) {
      return reply.status(429).send({
        error: 'Too Many Requests',
        message: `Rate limit exceeded: 1000 requests per hour`,
        retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
      });
    }
  }
});

// Health check
app.get('/health', async () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
}));

// Routes
app.register(authRoutes, { prefix: '/api/auth' });
app.register(userRoutes, { prefix: '/api/users' });
app.register(statsRoutes, { prefix: '/api/stats' });
app.register(memesRoutes, { prefix: '/api' });
app.register(checkoutRoutes, { prefix: '/api' });
app.register(publicRoutes, { prefix: '/api/public' });
app.register(analyticsRoutes, { prefix: '/api/analytics' });
app.register(partnershipsRoutes, { prefix: '/api/partnerships' });

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
