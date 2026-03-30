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

start();
