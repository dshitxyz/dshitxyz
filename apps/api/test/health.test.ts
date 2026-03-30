import Fastify from 'fastify';
import { healthRoute } from '../src/routes/health';

describe('Health Route', () => {
  it('Should return health status', async () => {
    const fastify = Fastify();
    fastify.register(healthRoute, { prefix: '/api' });
    await fastify.ready();

    const response = await fastify.inject({
      method: 'GET',
      url: '/api/health',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.status).toBe('ok');

    await fastify.close();
  });
});
