import Fastify from 'fastify';
import fastifyHelmet from 'fastify-helmet';
import fastifyCors from 'fastify-cors';

const fastify = Fastify({
  logger: true,
});

// Register plugins
fastify.register(fastifyHelmet);
fastify.register(fastifyCors, {
  origin: true,
});

// Health check route
fastify.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.API_PORT || '3001', 10);
    const host = process.env.API_HOST || '0.0.0.0';

    await fastify.listen({ port, host });
    console.log(`API server listening on ${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

export default fastify;
