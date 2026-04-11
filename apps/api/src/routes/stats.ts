import { FastifyInstance } from 'fastify';

interface DashboardStats {
  totalValueDumped: string;
  weeklyChange: string;
  activeUsers: string;
  activeToday: string;
  totalMinted: string;
  mintedToday: string;
  auditsPasssed: number;
}

interface Drop {
  id: string;
  title: string;
  description: string;
  tag: {
    text: string;
    type: 'yellow' | 'red' | 'green' | 'purple' | 'orange' | 'brown';
  };
  featured?: boolean;
}

export async function statsRoutes(app: FastifyInstance) {
  // Get dashboard stats
  app.get('/dashboard', async (request, reply) => {
    try {
      // In production, fetch from database
      // For now, return mock data that matches the component structure
      const stats: DashboardStats = {
        totalValueDumped: '$4.2B',
        weeklyChange: '+$145M this week',
        activeUsers: '847K',
        activeToday: '+23K active today',
        totalMinted: '69M',
        mintedToday: '+2.1M since yesterday',
        auditsPasssed: 0,
      };

      return reply.send(stats);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  // Get fresh drops
  app.get('/drops', async (request, reply) => {
    try {
      // In production, fetch from database
      // For now, return mock data that matches the component structure
      const drops: Drop[] = [
        {
          id: '1',
          title: 'TURD SEASON 3: THE GREAT DUMP',
          description: 'The most anticipated drop of the season. Limited supply, unlimited potential.',
          tag: { text: 'FEATURED', type: 'yellow' },
          featured: true,
        },
        {
          id: '2',
          title: 'SKIDMARK PROTOCOL V2',
          description: 'Enhanced version with 2x rewards and new mechanics. Hot drop alert.',
          tag: { text: 'HOT', type: 'red' },
        },
        {
          id: '3',
          title: 'FLOATER YIELD FARM',
          description: 'Stake and earn. Currently yielding 847% APY. Yes, really.',
          tag: { text: 'LIVE', type: 'green' },
        },
        {
          id: '4',
          title: 'CORN REPORT',
          description: 'Deep dive analysis and market research from our team.',
          tag: { text: 'RESEARCH', type: 'purple' },
        },
        {
          id: '5',
          title: 'DOUBLE FLUSH EVENT',
          description: 'Partnership collaboration with another protocol. 2x points this week.',
          tag: { text: 'COLLAB', type: 'orange' },
        },
        {
          id: '6',
          title: 'GHOST WIPE',
          description: 'Historical protocol that went silent. Educational value only.',
          tag: { text: 'RUGGED', type: 'brown' },
        },
      ];

      return reply.send(drops);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  // Get user stats (requires auth)
  app.get<{ Params: { address: string } }>('/user/:address', async (request, reply) => {
    try {
      const { address } = request.params as { address: string };

      // In production, fetch user-specific stats from database
      const userStats = {
        address,
        balance: '69420.42',
        holdings: '0xF4D03F',
        portfolio: {
          tokens: 1,
          value: '$4,242.00',
        },
        history: {
          trades: 0,
          purchases: 0,
          wins: 0,
        },
      };

      return reply.send(userStats);
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });
}
