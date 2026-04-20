import { FastifyInstance } from 'fastify';

interface FunnelMetrics {
  visitors: number;
  lurkers: number;
  natives: number;
  conversionRates: {
    visitorToLurker: string;
    lurkerToNative: string;
    visitorToNative: string;
  };
}

interface CommerceMetrics {
  totalOrders: number;
  totalRevenue: string;
  avgOrderValue: string;
  ordersToday: number;
  revenueToday: string;
  topProducts: Array<{ name: string; sales: number }>;
}

interface CommunityMetrics {
  totalMemesCreated: number;
  totalVotes: number;
  avgVotesPerMeme: number;
  activeCreators: number;
  contestEntries: number;
  contestVoteTotal: number;
}

interface EngagementMetrics {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  avgSessionDuration: string;
  bounceRate: string;
  returnVisitors: string;
}

export async function analyticsRoutes(app: FastifyInstance) {
  // POST /api/analytics/event - Track analytics event
  app.post<{ Body: { event: string; userId?: string; metadata?: Record<string, unknown> } }>(
    '/event',
    async (request, reply) => {
      try {
        const { event, userId, metadata } = request.body;

        if (!event) {
          return reply.status(400).send({ message: 'Event name required' });
        }

        // In production, store in analytics database
        app.log.info({
          event,
          userId,
          metadata,
          timestamp: new Date().toISOString(),
        });

        return reply.send({
          status: 'tracked',
          event,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );

  // GET /api/analytics/funnel - VLN funnel metrics
  app.get('/funnel', async (request, reply) => {
    try {
      const funnelMetrics: FunnelMetrics = {
        visitors: 42850,
        lurkers: 8234,
        natives: 1847,
        conversionRates: {
          visitorToLurker: '19.2%',
          lurkerToNative: '22.4%',
          visitorToNative: '4.3%',
        },
      };

      return reply.send({
        metrics: funnelMetrics,
        timestamp: new Date().toISOString(),
        period: 'all-time',
      });
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  // GET /api/analytics/commerce - Commerce metrics
  app.get('/commerce', async (request, reply) => {
    try {
      const commerceMetrics: CommerceMetrics = {
        totalOrders: 2847,
        totalRevenue: '892,450 DSHIT',
        avgOrderValue: '314 DSHIT',
        ordersToday: 34,
        revenueToday: '10,676 DSHIT',
        topProducts: [
          { name: 'Biohazard Revenge Kit', sales: 284 },
          { name: 'Political Hit Package', sales: 187 },
          { name: 'Reputation Destroyer', sales: 156 },
          { name: 'Meme Warfare Bundle', sales: 134 },
        ],
      };

      return reply.send({
        metrics: commerceMetrics,
        timestamp: new Date().toISOString(),
        period: 'all-time',
      });
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  // GET /api/analytics/community - Community metrics
  app.get('/community', async (request, reply) => {
    try {
      const communityMetrics: CommunityMetrics = {
        totalMemesCreated: 8294,
        totalVotes: 284739,
        avgVotesPerMeme: 34,
        activeCreators: 1847,
        contestEntries: 427,
        contestVoteTotal: 18492,
      };

      return reply.send({
        metrics: communityMetrics,
        timestamp: new Date().toISOString(),
        period: 'all-time',
      });
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  // GET /api/analytics/engagement - User engagement metrics
  app.get('/engagement', async (request, reply) => {
    try {
      const engagementMetrics: EngagementMetrics = {
        dailyActiveUsers: 1247,
        weeklyActiveUsers: 6843,
        monthlyActiveUsers: 18920,
        avgSessionDuration: '12m 34s',
        bounceRate: '28.5%',
        returnVisitors: '42.3%',
      };

      return reply.send({
        metrics: engagementMetrics,
        timestamp: new Date().toISOString(),
        period: '30-days',
      });
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  // GET /api/analytics/summary - All metrics summary
  app.get('/summary', async (request, reply) => {
    try {
      const summary = {
        funnel: {
          visitors: 42850,
          lurkers: 8234,
          natives: 1847,
        },
        commerce: {
          totalOrders: 2847,
          totalRevenue: '892,450 DSHIT',
        },
        community: {
          totalMemesCreated: 8294,
          activeCreators: 1847,
        },
        engagement: {
          dailyActiveUsers: 1247,
          monthlyActiveUsers: 18920,
        },
      };

      return reply.send({
        summary,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });
}
