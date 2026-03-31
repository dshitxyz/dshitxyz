import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

interface PublicMeme {
  id: string;
  title: string;
  imageUrl: string;
  creator: string;
  creatorName: string;
  votes: number;
  createdAt: string;
  url: string;
}

interface LeaderboardCreator {
  rank: number;
  address: string;
  name: string;
  memeCount: number;
  totalVotes: number;
  earningsUsd: number;
}

interface LeaderboardHolder {
  rank: number;
  address: string;
  name: string;
  balance: number;
  percentage: number;
}

interface TokenStats {
  token: {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
  };
  price: {
    usd: number;
    change24h: number;
    change7d: number;
  };
  supply: {
    total: number;
    circulating: number;
    burned: number;
  };
  market: {
    capUsd: number;
    volume24h: number;
    holders: number;
  };
  network: {
    chain: string;
    explorer: string;
  };
}

interface PlatformStats {
  totalMemes: number;
  totalCreators: number;
  totalVotes: number;
  avgVotesPerMeme: number;
  memesCreatedToday: number;
  totalOrders: number;
  contractAddress: string;
  deployedNetwork: string;
}

export async function publicRoutes(app: FastifyInstance) {
  // GET /api/public/memes - Public meme gallery (paginated, sortable)
  app.get<{ Querystring: { page?: string; limit?: string; sort?: string } }>(
    '/memes',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const page = Math.max(1, parseInt(request.query.page || '1', 10));
        const limit = Math.min(100, Math.max(1, parseInt(request.query.limit || '20', 10)));
        const sort = (request.query.sort || 'trending') as string;

        // Set cache headers for 1 minute
        reply.header('Cache-Control', 'public, max-age=60');

        // Mock data - in production, fetch from database
        const mockMemes: PublicMeme[] = [
          {
            id: 'meme-001',
            title: 'When your portfolio is down but you HODL',
            imageUrl: 'https://dshitxyz.vercel.app/meme1.png',
            creator: '0xabc123def456',
            creatorName: 'CryptoApe420',
            votes: 1248,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            url: 'https://dshitxyz.vercel.app/gallery/meme-001',
          },
          {
            id: 'meme-002',
            title: 'DSHIT goes brrrrr',
            imageUrl: 'https://dshitxyz.vercel.app/meme2.png',
            creator: '0xdef456ghi789',
            creatorName: 'MemeKing',
            votes: 892,
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            url: 'https://dshitxyz.vercel.app/gallery/meme-002',
          },
          {
            id: 'meme-003',
            title: 'POV: You bought at ATH',
            imageUrl: 'https://dshitxyz.vercel.app/meme3.png',
            creator: '0xghi789jkl012',
            creatorName: 'BagHolder',
            votes: 654,
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            url: 'https://dshitxyz.vercel.app/gallery/meme-003',
          },
          {
            id: 'meme-004',
            title: 'Governance proposals be like',
            imageUrl: 'https://dshitxyz.vercel.app/meme4.png',
            creator: '0xjkl012mno345',
            creatorName: 'DAODegen',
            votes: 523,
            createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            url: 'https://dshitxyz.vercel.app/gallery/meme-004',
          },
        ];

        // Sort
        let sorted = [...mockMemes];
        if (sort === 'newest') {
          sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sort === 'votes') {
          sorted.sort((a, b) => b.votes - a.votes);
        } else {
          // trending (default): sort by votes
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
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  // GET /api/public/stats - Token & platform statistics
  app.get('/stats', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Set cache headers for 5 minutes
      reply.header('Cache-Control', 'public, max-age=300');

      const tokenStats: TokenStats = {
        token: {
          name: 'DSHIT',
          symbol: 'DSHIT',
          address: '0x0000000000000000000000000000000000000000',
          decimals: 18,
        },
        price: {
          usd: 0.0000042,
          change24h: 12.5,
          change7d: 47.3,
        },
        supply: {
          total: 1000000000,
          circulating: 891234567,
          burned: 50000000,
        },
        market: {
          capUsd: 4200000,
          volume24h: 127000,
          holders: 2847,
        },
        network: {
          chain: 'base',
          explorer: 'https://basescan.org/token/0x0000000000000000000000000000000000000000',
        },
      };

      const platformStats: PlatformStats = {
        totalMemes: 8294,
        totalCreators: 1847,
        totalVotes: 284739,
        avgVotesPerMeme: 34,
        memesCreatedToday: 128,
        totalOrders: 2847,
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
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // GET /api/public/leaderboard/creators - Top meme creators
  app.get<{ Querystring: { limit?: string } }>(
    '/leaderboard/creators',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const limit = Math.min(100, Math.max(1, parseInt(request.query.limit || '10', 10)));

        // Set cache headers for 5 minutes
        reply.header('Cache-Control', 'public, max-age=300');

        const mockLeaderboard: LeaderboardCreator[] = [
          {
            rank: 1,
            address: '0xabc123def456abc123def456abc123def456abc1',
            name: 'MemeKingSupreme',
            memeCount: 187,
            totalVotes: 18492,
            earningsUsd: 12485,
          },
          {
            rank: 2,
            address: '0xdef456ghi789def456ghi789def456ghi789def4',
            name: 'CryptoArtisan',
            memeCount: 142,
            totalVotes: 14723,
            earningsUsd: 9847,
          },
          {
            rank: 3,
            address: '0xghi789jkl012ghi789jkl012ghi789jkl012ghi7',
            name: 'VaultDweller',
            memeCount: 98,
            totalVotes: 12456,
            earningsUsd: 8304,
          },
          {
            rank: 4,
            address: '0xjkl012mno345jkl012mno345jkl012mno345jkl0',
            name: 'ShitpostingLord',
            memeCount: 156,
            totalVotes: 10234,
            earningsUsd: 6823,
          },
          {
            rank: 5,
            address: '0xmno345pqr678mno345pqr678mno345pqr678mno3',
            name: 'BullRunBoi',
            memeCount: 67,
            totalVotes: 9187,
            earningsUsd: 6125,
          },
        ];

        const sliced = mockLeaderboard.slice(0, limit);

        return reply.send({
          data: sliced,
          total: mockLeaderboard.length,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  // GET /api/public/leaderboard/holders - Top token holders
  app.get<{ Querystring: { limit?: string } }>(
    '/leaderboard/holders',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const limit = Math.min(100, Math.max(1, parseInt(request.query.limit || '10', 10)));

        // Set cache headers for 5 minutes
        reply.header('Cache-Control', 'public, max-age=300');

        const mockHolders: LeaderboardHolder[] = [
          {
            rank: 1,
            address: '0xpqr678stu901pqr678stu901pqr678stu901pqr6',
            name: 'WhaleWallet1',
            balance: 500000000,
            percentage: 50.0,
          },
          {
            rank: 2,
            address: '0xstu901uvw234stu901uvw234stu901uvw234stu9',
            name: 'WhaleWallet2',
            balance: 200000000,
            percentage: 20.0,
          },
          {
            rank: 3,
            address: '0xuvw234xyz567uvw234xyz567uvw234xyz567uvw2',
            name: 'DegenStack1',
            balance: 100000000,
            percentage: 10.0,
          },
          {
            rank: 4,
            address: '0xxyz567abc890xyz567abc890xyz567abc890xyz5',
            name: 'DegenStack2',
            balance: 80000000,
            percentage: 8.0,
          },
          {
            rank: 5,
            address: '0xabc890def123abc890def123abc890def123abc8',
            name: 'DegenStack3',
            balance: 70000000,
            percentage: 7.0,
          },
        ];

        const sliced = mockHolders.slice(0, limit);

        return reply.send({
          data: sliced,
          total: mockHolders.length,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  // GET /api/public/leaderboard - Combined leaderboard (creators by default)
  app.get<{ Querystring: { type?: string; limit?: string } }>(
    '/leaderboard',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const type = request.query.type || 'creators';
      const limit = request.query.limit;

      if (type === 'holders') {
        return app.inject({
          method: 'GET',
          url: `/api/public/leaderboard/holders?limit=${limit}`,
        });
      }

      return app.inject({
        method: 'GET',
        url: `/api/public/leaderboard/creators?limit=${limit}`,
      });
    }
  );

  // GET /api/public/health - Public health check (no auth required)
  app.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.header('Cache-Control', 'public, max-age=30');
    return reply.send({
      status: 'healthy',
      api: 'dshit.xyz',
      version: '0.1.0',
      network: 'base-sepolia',
      endpoints: {
        memes: '/api/public/memes',
        stats: '/api/public/stats',
        leaderboard: '/api/public/leaderboard',
        creators: '/api/public/leaderboard/creators',
        holders: '/api/public/leaderboard/holders',
      },
      timestamp: new Date().toISOString(),
    });
  });
}
