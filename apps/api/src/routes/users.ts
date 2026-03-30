import { FastifyInstance } from 'fastify';
import { getUserByAddress, updateUserProfile } from '@/lib/db';
import { z } from 'zod';

const updateProfileSchema = z.object({
  pseudonym: z.string().min(3).max(32).optional(),
  bio: z.string().max(500).optional(),
});

export async function userRoutes(app: FastifyInstance) {
  // Get current user profile
  app.get('/me', async (request, reply) => {
    try {
      await request.jwtVerify();

      const user = await getUserByAddress(request.user.address);
      if (!user) {
        return reply.status(404).send({ message: 'User not found' });
      }

      return reply.send({
        id: user.id,
        address: user.address,
        pseudonym: user.pseudonym,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      });
    } catch (error) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }
  });

  // Update profile
  app.patch<{ Body: any }>('/me', async (request, reply) => {
    try {
      await request.jwtVerify();

      const { pseudonym, bio } = updateProfileSchema.parse(request.body);

      const user = await updateUserProfile(request.user.address, {
        pseudonym,
        bio,
      });

      if (!user) {
        return reply.status(404).send({ message: 'User not found' });
      }

      return reply.send({
        id: user.id,
        address: user.address,
        pseudonym: user.pseudonym,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: 'Invalid request', errors: error.errors });
      }

      app.log.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  // Get user by address
  app.get<{ Params: { address: string } }>('/:address', async (request, reply) => {
    try {
      const { address } = request.params as { address: string };

      const user = await getUserByAddress(address);
      if (!user) {
        return reply.status(404).send({ message: 'User not found' });
      }

      return reply.send({
        id: user.id,
        address: user.address,
        pseudonym: user.pseudonym,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.created_at,
      });
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });
}
