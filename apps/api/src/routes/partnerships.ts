import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  Partnership,
  PartnershipApplication,
  PartnershipType,
  SAMPLE_PARTNERSHIPS,
  getPartnershipTypeLabel,
  getPartnershipTypeColor,
} from '@/lib/partnerships';

// In-memory storage for demo (would use database in production)
let partnerships: Partnership[] = JSON.parse(JSON.stringify(SAMPLE_PARTNERSHIPS));
let applications: PartnershipApplication[] = [];

export async function partnershipsRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/partnerships
   * List all active partnerships with optional filtering
   */
  fastify.get<{
    Querystring: {
      type?: PartnershipType;
      active?: string;
      limit?: string;
      offset?: string;
    };
  }>('/', async (request: FastifyRequest<{
    Querystring: {
      type?: PartnershipType;
      active?: string;
      limit?: string;
      offset?: string;
    };
  }>, reply: FastifyReply) => {
    const query = request.query as any;
    const { type, active, limit = '50', offset = '0' } = query;

    let filtered = partnerships;

    // Filter by type
    if (type) {
      filtered = filtered.filter((p) => p.type === type);
    }

    // Filter by active status
    if (active !== undefined) {
      const activeFilter = active === 'true';
      filtered = filtered.filter((p) => p.active === activeFilter);
    }

    // Pagination
    const skip = parseInt(offset);
    const take = Math.min(parseInt(limit), 100);
    const paginated = filtered.slice(skip, skip + take);

    return reply.send({
      data: paginated,
      pagination: {
        total: filtered.length,
        offset: skip,
        limit: take,
        hasMore: skip + take < filtered.length,
      },
      metadata: {
        totalPartners: partnerships.length,
        types: ['memecoin', 'ecosystem', 'aggregator', 'community'],
      },
    });
  });

  /**
   * GET /api/partnerships/:id
   * Get a specific partnership by ID
   */
  fastify.get<{ Params: { id: string } }>('/:id', async (request: FastifyRequest<{
    Params: { id: string };
  }>, reply: FastifyReply) => {
    const { id } = request.params as any;
    const partnership = partnerships.find((p) => p.id === id);

    if (!partnership) {
      return reply.status(404).send({
        error: 'Partnership not found',
        message: `Partnership with ID '${id}' does not exist`,
      });
    }

    return reply.send({
      data: partnership,
      typeLabel: getPartnershipTypeLabel(partnership.type),
      typeColor: getPartnershipTypeColor(partnership.type),
    });
  });

  /**
   * GET /api/partnerships/type/:type
   * Get partnerships filtered by type
   */
  fastify.get<{
    Params: { type: PartnershipType };
    Querystring: { limit?: string; offset?: string };
  }>('/type/:type', async (request: FastifyRequest<{
    Params: { type: PartnershipType };
    Querystring: { limit?: string; offset?: string };
  }>, reply: FastifyReply) => {
    const { type } = request.params as any;
    const query = request.query as any;
    const { limit = '50', offset = '0' } = query;

    if (!['memecoin', 'ecosystem', 'aggregator', 'community'].includes(type)) {
      return reply.status(400).send({
        error: 'Invalid partnership type',
        message: `Type must be one of: memecoin, ecosystem, aggregator, community`,
      });
    }

    const filtered = partnerships.filter((p) => p.type === type && p.active);
    const skip = parseInt(offset);
    const take = Math.min(parseInt(limit), 100);
    const paginated = filtered.slice(skip, skip + take);

    return reply.send({
      data: paginated,
      type,
      typeLabel: getPartnershipTypeLabel(type),
      pagination: {
        total: filtered.length,
        offset: skip,
        limit: take,
        hasMore: skip + take < filtered.length,
      },
    });
  });

  /**
   * GET /api/partnerships/stats
   * Get partnership statistics and metrics
   */
  fastify.get('/stats/overview', async (request: FastifyRequest, reply: FastifyReply) => {
    const activePartners = partnerships.filter((p) => p.active).length;
    const totalReach = partnerships.reduce((sum, p) => sum + p.metrics.reach, 0);
    const totalConversions = partnerships.reduce((sum, p) => sum + p.metrics.conversions, 0);
    const totalRevenue = partnerships.reduce((sum, p) => sum + p.metrics.totalRevenue, 0);
    const avgConversionRate = (
      partnerships.reduce((sum, p) => sum + p.metrics.conversionRate, 0) / partnerships.length
    ).toFixed(2);

    const typeBreakdown = partnerships.reduce(
      (acc, p) => {
        const existing = acc[p.type] || { count: 0, reach: 0, conversions: 0 };
        return {
          ...acc,
          [p.type]: {
            count: existing.count + 1,
            reach: existing.reach + p.metrics.reach,
            conversions: existing.conversions + p.metrics.conversions,
          },
        };
      },
      {} as Record<PartnershipType, { count: number; reach: number; conversions: number }>
    );

    return reply.send({
      stats: {
        activePartners,
        totalPartners: partnerships.length,
        totalReach,
        totalConversions,
        totalRevenue,
        avgConversionRate: parseFloat(avgConversionRate),
      },
      typeBreakdown,
      topPartners: partnerships
        .sort((a, b) => b.metrics.totalRevenue - a.metrics.totalRevenue)
        .slice(0, 5)
        .map((p) => ({
          id: p.id,
          name: p.name,
          revenue: p.metrics.totalRevenue,
          conversions: p.metrics.conversions,
        })),
    });
  });

  /**
   * POST /api/partnerships/apply
   * Submit a partnership application
   */
  fastify.post<{
    Body: {
      projectName: string;
      email: string;
      website: string;
      type: PartnershipType;
      description: string;
    };
  }>('/apply', async (request: FastifyRequest<{
    Body: {
      projectName: string;
      email: string;
      website: string;
      type: PartnershipType;
      description: string;
    };
  }>, reply: FastifyReply) => {
    const { projectName, email, website, type, description } = request.body as any;

    // Validation
    if (!projectName || !email || !website || !type || !description) {
      return reply.status(400).send({
        error: 'Missing required fields',
        message: 'projectName, email, website, type, and description are required',
      });
    }

    if (!['memecoin', 'ecosystem', 'aggregator', 'community'].includes(type)) {
      return reply.status(400).send({
        error: 'Invalid partnership type',
        message: `Type must be one of: memecoin, ecosystem, aggregator, community`,
      });
    }

    if (!email.includes('@')) {
      return reply.status(400).send({
        error: 'Invalid email',
        message: 'Please provide a valid email address',
      });
    }

    // Create application
    const application: PartnershipApplication = {
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      projectName,
      email,
      website,
      type,
      description,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    applications.push(application);

    return reply.status(201).send({
      message: 'Partnership application submitted successfully',
      data: application,
      nextSteps: 'We will review your application and contact you within 48 hours',
    });
  });

  /**
   * GET /api/partnerships/applications (admin only)
   * List all partnership applications (would be admin-protected in production)
   */
  fastify.get('/applications', async (request: FastifyRequest, reply: FastifyReply) => {
    const { status, limit = '50', offset = '0' } = request.query as {
      status?: string;
      limit?: string;
      offset?: string;
    };

    let filtered = applications;

    if (status) {
      filtered = filtered.filter((a) => a.status === status);
    }

    const skip = parseInt(offset);
    const take = Math.min(parseInt(limit), 100);
    const paginated = filtered.slice(skip, skip + take);

    return reply.send({
      data: paginated,
      pagination: {
        total: filtered.length,
        offset: skip,
        limit: take,
        hasMore: skip + take < filtered.length,
      },
      summary: {
        pending: applications.filter((a) => a.status === 'pending').length,
        approved: applications.filter((a) => a.status === 'approved').length,
        rejected: applications.filter((a) => a.status === 'rejected').length,
      },
    });
  });
}
