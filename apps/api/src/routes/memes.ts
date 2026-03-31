import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';

interface Meme {
  id: string;
  userId: string;
  templateId: string;
  title: string;
  description?: string;
  textOverlays: Array<{
    text: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
    fontFamily: string;
  }>;
  imageData?: string;
  tags: string[];
  votes: number;
  shares: number;
  createdAt: string;
  updatedAt: string;
}

// In-memory storage (replace with database in production)
const memes: Map<string, Meme> = new Map();

// Default meme templates
const templates = [
  { id: 'template-1', name: 'Doge Meme', description: 'Classic Doge template' },
  { id: 'template-2', name: 'Drake Reaction', description: 'Drake reaction template' },
  { id: 'template-3', name: 'Loss', description: 'Quadrants template' },
  { id: 'template-4', name: 'Stonks', description: 'Stonks meme template' },
  { id: 'template-5', name: 'Distracted Boyfriend', description: 'Classic distraction meme' },
];

export async function memesRoutes(app: FastifyInstance) {
  // Get all templates
  app.get('/memes/templates', async (request, reply) => {
    try {
      return reply.send(templates);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  // Create meme
  app.post<{ Body: any }>('/memes', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }

      const { templateId, title, description, textOverlays, imageData, tags } = request.body as any;

      if (!templateId || !title) {
        return reply.status(400).send({ message: 'Missing required fields' });
      }

      const meme: Meme = {
        id: uuidv4(),
        userId: 'user-id', // Would come from JWT in production
        templateId,
        title,
        description: description || '',
        textOverlays: textOverlays || [],
        imageData,
        tags: tags || [],
        votes: 0,
        shares: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      memes.set(meme.id, meme);

      return reply.status(201).send({
        success: true,
        meme,
        message: 'Meme created successfully',
      });
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  // Get all memes
  app.get('/memes', async (request, reply) => {
    try {
      const allMemes = Array.from(memes.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return reply.send(allMemes);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  // Get meme by ID
  app.get<{ Params: { memeId: string } }>('/memes/:memeId', async (request, reply) => {
    try {
      const { memeId } = request.params as { memeId: string };
      const meme = memes.get(memeId);

      if (!meme) {
        return reply.status(404).send({ message: 'Meme not found' });
      }

      return reply.send(meme);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  // Vote on meme
  app.post<{ Params: { memeId: string }; Body: any }>('/memes/:memeId/vote', async (request, reply) => {
    try {
      const { memeId } = request.params as { memeId: string };
      const { direction } = request.body as any;

      const meme = memes.get(memeId);
      if (!meme) {
        return reply.status(404).send({ message: 'Meme not found' });
      }

      if (direction === 'up') {
        meme.votes++;
      } else if (direction === 'down') {
        meme.votes--;
      }

      meme.updatedAt = new Date().toISOString();
      memes.set(memeId, meme);

      return reply.send(meme);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  // Update meme
  app.patch<{ Params: { memeId: string }; Body: any }>('/memes/:memeId', async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }

      const { memeId } = request.params as { memeId: string };
      const { title, description, textOverlays, tags } = request.body as any;

      const meme = memes.get(memeId);
      if (!meme) {
        return reply.status(404).send({ message: 'Meme not found' });
      }

      if (title) meme.title = title;
      if (description !== undefined) meme.description = description;
      if (textOverlays) meme.textOverlays = textOverlays;
      if (tags) meme.tags = tags;

      meme.updatedAt = new Date().toISOString();
      memes.set(memeId, meme);

      return reply.send(meme);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  // Delete meme
  app.delete<{ Params: { memeId: string } }>('/memes/:memeId', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }

      const { memeId } = request.params as { memeId: string };

      if (!memes.has(memeId)) {
        return reply.status(404).send({ message: 'Meme not found' });
      }

      memes.delete(memeId);
      return reply.status(204).send();
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });
}
