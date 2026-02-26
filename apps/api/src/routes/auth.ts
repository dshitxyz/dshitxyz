import { FastifyInstance } from 'fastify';
import { verifyMessage } from 'ethers';
import { z } from 'zod';
import { generateAnonymousProfile } from '@/lib/profiles';
import { createOrUpdateUser, getUserByAddress } from '@/lib/db';

const verifySignatureSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  signature: z.string(),
  message: z.string(),
  timestamp: z.number(),
});

export async function authRoutes(app: FastifyInstance) {
  // Verify signature and create/update user
  app.post<{ Body: any }>('/verify', async (request, reply) => {
    try {
      const { address, signature, message, timestamp } = verifySignatureSchema.parse(request.body);

      // Validate timestamp (must be within 5 minutes)
      const now = Date.now();
      if (Math.abs(now - timestamp) > 5 * 60 * 1000) {
        return reply.status(401).send({ message: 'Signature expired' });
      }

      // Verify signature
      let recoveredAddress: string;
      try {
        recoveredAddress = verifyMessage(message, signature);
      } catch (error) {
        return reply.status(401).send({ message: 'Invalid signature' });
      }

      // Check if signature matches address
      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        return reply.status(401).send({ message: 'Address mismatch' });
      }

      // Get or create user
      let user = await getUserByAddress(address);
      if (!user) {
        const profile = generateAnonymousProfile();
        user = await createOrUpdateUser(address, profile);
      }

      // Create JWT token
      const token = app.jwt.sign(
        {
          address: user.address,
          userId: user.id,
        },
        { expiresIn: '30d' }
      );

      return reply.send({
        token,
        user: {
          id: user.id,
          address: user.address,
          pseudonym: user.pseudonym,
          avatar: user.avatar,
          createdAt: user.created_at,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: 'Invalid request', errors: error.errors });
      }

      app.log.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  // Verify token
  app.get('/me', async (request, reply) => {
    try {
      await request.jwtVerify();

      const user = await getUserByAddress(request.user.address);
      if (!user) {
        return reply.status(404).send({ message: 'User not found' });
      }

      return reply.send({
        user: {
          id: user.id,
          address: user.address,
          pseudonym: user.pseudonym,
          avatar: user.avatar,
          createdAt: user.created_at,
        },
      });
    } catch (error) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }
  });
}
