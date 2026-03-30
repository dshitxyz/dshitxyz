import { FastifyPluginAsync } from 'fastify';

export const healthRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/health', async (_request, _reply) => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  });

  fastify.get('/version', async (_request, _reply) => {
    return {
      version: '0.1.0',
      phase: 'Phase 0: Foundation',
    };
  });
};
