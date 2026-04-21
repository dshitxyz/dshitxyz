import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../lib/auth';
import type { MemeQuery } from '@/types/routes';

interface Meme {
  id: string;
  creatorAddress: string;
  title: string;
  topText: string;
  bottomText: string;
  template: string;
  imageUrl?: string;
  likes: number;
  createdAt: string;
}

// In-memory storage for MVP
const memes: Map<string, Meme> = new Map();

export async function memesRoutes(app: FastifyInstance) {
  // GET /api/memes - List all memes with pagination
  app.get<{ Querystring: MemeQuery }>('/memes', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = request.query as MemeQuery;
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 20;
      const skip = (page - 1) * limit;

      const allMemes = Array.from(memes.values()).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const total = allMemes.length;
      const data = allMemes.slice(skip, skip + limit);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error fetching memes:', error);
      reply.status(500);
      return { error: 'Failed to fetch memes' };
    }
  });

  // GET /api/memes/:id - Get specific meme
  app.get(
    '/memes/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as { id: string };
        const meme = memes.get(id);

        if (!meme) {
          reply.status(404);
          return { error: 'Meme not found' };
        }

        return meme;
      } catch (error) {
        console.error('Error fetching meme:', error);
        reply.status(500);
        return { error: 'Failed to fetch meme' };
      }
    }
  );

  // POST /api/memes - Create new meme
  app.post('/memes', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Verify auth
      const token = request.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        reply.status(401);
        return { error: 'Unauthorized' };
      }

      const user = await verifyToken(token);
      if (!user) {
        reply.status(401);
        return { error: 'Invalid token' };
      }

      const {
        title,
        topText,
        bottomText,
        template,
        imageUrl,
      } = request.body as {
        title?: string;
        topText: string;
        bottomText: string;
        template: string;
        imageUrl?: string;
      };

      if (!topText || !bottomText || !template) {
        reply.status(400);
        return { error: 'Missing required fields' };
      }

      const id = `meme-${Date.now()}`;
      const meme: Meme = {
        id,
        creatorAddress: user.address,
        title: title || `Meme ${id}`,
        topText,
        bottomText,
        template,
        imageUrl,
        likes: 0,
        createdAt: new Date().toISOString(),
      };

      memes.set(id, meme);

      reply.status(201);
      return meme;
    } catch (error) {
      console.error('Error creating meme:', error);
      reply.status(500);
      return { error: 'Failed to create meme' };
    }
  });

  // POST /api/memes/:id/like - Like a meme
  app.post(
    '/memes/:id/like',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as { id: string };
        const meme = memes.get(id);

        if (!meme) {
          reply.status(404);
          return { error: 'Meme not found' };
        }

        meme.likes += 1;
        memes.set(id, meme);

        return meme;
      } catch (error) {
        console.error('Error liking meme:', error);
        reply.status(500);
        return { error: 'Failed to like meme' };
      }
    }
  );

  // GET /api/memes/trending - Get trending memes
  app.get(
    '/memes/trending',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const allMemes = Array.from(memes.values()).sort(
          (a, b) => b.likes - a.likes
        );

        const trendingMemes = allMemes.slice(0, 10);

        return {
          data: trendingMemes,
        };
      } catch (error) {
        console.error('Error fetching trending memes:', error);
        reply.status(500);
        return { error: 'Failed to fetch trending memes' };
      }
    }
  );

  // DELETE /api/memes/:id - Delete meme (creator only)
  app.delete(
    '/memes/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // Verify auth
        const token = request.headers.authorization?.replace('Bearer ', '');
        if (!token) {
          reply.status(401);
          return { error: 'Unauthorized' };
        }

        const user = await verifyToken(token);
        if (!user) {
          reply.status(401);
          return { error: 'Invalid token' };
        }

        const { id } = request.params as { id: string };
        const meme = memes.get(id);

        if (!meme) {
          reply.status(404);
          return { error: 'Meme not found' };
        }

        // Check if user is creator
        if (meme.creatorAddress !== user.address) {
          reply.status(403);
          return { error: 'You can only delete your own memes' };
        }

        memes.delete(id);

        return { message: 'Meme deleted successfully' };
      } catch (error) {
        console.error('Error deleting meme:', error);
        reply.status(500);
        return { error: 'Failed to delete meme' };
      }
    }
  );
}
