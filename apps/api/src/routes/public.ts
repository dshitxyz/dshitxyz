import { FastifyInstance } from 'fastify';

interface PublicMeme {
  id: string;
  title: string;
  imageUrl: string;
  creator: string;
  votes: number;
  createdAt: string;
}

interface LeaderboardEntry {
  rank: number;
  creator: string;
  totalVotes: number;
  memesCount: number;
  earnings: string;
}

interface TokenStats {
  price: string;
  marketCap: string;
  volume24h: string;
  holders: number;
  supply: string;
  circulating: string;
  change24h: string;
  change7d: string;
}

interface PlatformStats {
  totalMemes: number;
  totalCreators: number;
  totalVotes: number;
  avgVotesPerMeme: number;
  memesCreatedToday: number;
  contractAddress: string;
  deployedNetwork: string;
}

export async function publicRoutes(app: FastifyInstance) {
  // GET /api/public/memes - Public meme gallery (paginated)
  app.get<{ Querystring: { page?: string; limit?: string; sort?: string } }>(
    '/memes',
    async (request, reply) => {
      try {
        const page = Math.max(1, parseInt(request.query.page || '1', 10));
        const limit = Math.min(50, Math.max(1, parseInt(request.query.limit || '20', 10)));
        const sort = request.query.sort || 'trending'; // trending, newest, highest-voted

        // Mock data - in production, fetch from database
        const mockMemes: PublicMeme[] = [
          {
            id: 'meme-001',
            title: 'When your portfolio is down but you HODL',
            imageUrl: '/api/mock/meme1.png',
            creator: 'CryptoApe420',
            votes: 1248,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'meme-002',
            title: 'DSHIT goes brrrrr',
            imageUrl: '/api/mock/meme2.png',
            creator: 'MemeKing',
            votes: 892,
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'meme-003',
            title: 'POV: You bought at ATH',
            imageUrl: '/api/mock/meme3.png',
            creator: 'BagHolder',
            votes: 654,
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'meme-004',
            title: 'Governance proposals be like',
            imageUrl: '/api/mock/meme4.png',
            creator: 'DAODegen',
            votes: 523,
            createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          },
        ];

        // Sort
        let sorted = [...mockMemes];
        if (sort === 'newest') {
          sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sort === 'highest-voted') {
          sorted.sort((a, b) => b.votes - a.votes);
        }

        // Paginate
        const start = (page - 1) * limit;
        const paginatedMemes = sorted.slice(start, start + limit);

        return reply.send({
          data: paginatedMemes,
          pagination: {
            page,
            limit,
            total: sorted.length,
            pages: Math.ceil(sorted.length / limit),
          },
          meta: {
            sort,
            timestamp: new Date().toISOString(),
          },
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );

  // GET /api/public/stats - Token & platform statistics
  app.get('/stats', async (request, reply) => {
    try {
      const tokenStats: TokenStats = {
        price: '$0.0000042',
        marketCap: '$4.2M',
        volume24h: '$127K',
        holders: 2847,
        supply: '1,000,000,000',
        circulating: '891,234,567',
        change24h: '+12.5%',
        change7d: '+47.3%',
      };

      const platformStats: PlatformStats = {
        totalMemes: 8294,
        totalCreators: 1847,
        totalVotes: 284739,
        avgVotesPerMeme: 34,
        memesCreatedToday: 128,
        contractAddress: '0x0000000000000000000000000000000000000000',
        deployedNetwork: 'base-sepolia',
      };

      return reply.send({
        token: tokenStats,
        platform: platformStats,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  // GET /api/public/leaderboard - Top creators and highest voted memes
  app.get<{ Querystring: { type?: string; limit?: string } }>(
    '/leaderboard',
    async (request, reply) => {
      try {
        const type = request.query.type || 'creators'; // creators or memes
        const limit = Math.min(100, Math.max(1, parseInt(request.query.limit || '20', 10)));

        const mockLeaderboard: LeaderboardEntry[] = [
          {
            rank: 1,
            creator: 'MemeKingSupreme',
            totalVotes: 18492,
            memesCount: 187,
            earnings: '12,485 DSHIT',
          },
          {
            rank: 2,
            creator: 'CryptoArtisan',
            totalVotes: 14723,
            memesCount: 142,
            earnings: '9,847 DSHIT',
          },
          {
            rank: 3,
            creator: 'VaultDweller',
            totalVotes: 12456,
            memesCount: 98,
            earnings: '8,304 DSHIT',
          },
          {
            rank: 4,
            creator: 'ShitpostingLord',
            totalVotes: 10234,
            memesCount: 156,
            earnings: '6,823 DSHIT',
          },
          {
            rank: 5,
            creator: 'BullRunBoi',
            totalVotes: 9187,
            memesCount: 67,
            earnings: '6,125 DSHIT',
          },
        ];

        const sliced = mockLeaderboard.slice(0, limit);

        return reply.send({
          type,
          data: sliced,
          total: mockLeaderboard.length,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );

  // GET /api/public/health - Public health check (no auth required)
  app.get('/health', async (request, reply) => {
    return reply.send({
      status: 'healthy',
      api: 'dshit.xyz',
      version: '0.1.0',
      network: 'base-sepolia',
      timestamp: new Date().toISOString(),
    });
  });
}
