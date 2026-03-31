import Fastify from 'fastify';

const fastify = Fastify({
  logger: true,
});

fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

const start = async (): Promise<void> => {
  try {
    const PORT = parseInt(process.env.PORT || '3001', 10);
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`✓ API running at http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
