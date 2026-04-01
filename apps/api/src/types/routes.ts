/**
 * Fastify route type definitions
 * Provides TypeScript types for request/response bodies and query parameters
 */

// Public API Query Parameters
export interface PublicMemesQuery {
  page?: string;
  limit?: string;
  sort?: string;
}

export interface LeaderboardQuery {
  limit?: string;
}

export interface CombinedLeaderboardQuery {
  type?: string;
  limit?: string;
}

export interface UserQuery {
  address?: string;
}

export interface MemeQuery {
  page?: string;
  limit?: string;
}

// Request Bodies
export interface LoginBody {
  address: string;
}

export interface VerifyBody {
  address: string;
  message: string;
  signature: string;
}

export interface CheckoutBody {
  address: string;
  amount: number;
  items: Array<{ id: string; quantity: number }>;
}

export interface MemeSubmissionBody {
  title: string;
  imageUrl: string;
  templateId?: string;
}

export interface AnalyticsEventBody {
  event: string;
  properties?: Record<string, unknown>;
}
