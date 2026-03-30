import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';

const fastify = Fastify({
  logger: true,
});

await fastify.register(helmet);
await fastify.register(cors, {
  origin: true,
});

fastify.get('/', async (_request, _reply) => {
  return { message: 'Welcome to 💩 PROTOCOL API' };
});

fastify.get('/health', async (_request, _reply) => {
  return { status: 'ok' };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('API server running on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
