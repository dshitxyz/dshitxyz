/**
 * Sentry API Error Monitoring (Fastify)
 *
 * NOTE: Sentry integration is stubbed for now to ensure TypeScript compatibility.
 * Full integration can be added when Sentry 8 API migration is complete.
 *
 * Usage in main API file:
 * ```
 * import { initSentryAPI, withSentryErrorHandler } from './lib/sentry-api';
 *
 * initSentryAPI();
 *
 * fastify.setErrorHandler(withSentryErrorHandler);
 * ```
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

/**
 * Initialize Sentry for Fastify API (stub)
 */
export function initSentryAPI() {
  const shouldInit = process.env.SENTRY_ENABLED === 'true' && process.env.SENTRY_DSN;

  if (!shouldInit) {
    console.log('[Sentry] Disabled (set SENTRY_ENABLED=true to enable)');
    return;
  }

  // Sentry 8 initialization would go here
  console.log('[Sentry] Initialized for API monitoring (stub)');
}

/**
 * Fastify error handler with Sentry integration (stub)
 * Usage:
 * ```
 * fastify.setErrorHandler(withSentryErrorHandler);
 * ```
 */
export async function withSentryErrorHandler(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Log error context
  console.error('[API Error]', {
    method: request.method,
    url: request.url,
    message: error.message,
  });

  // Send error response
  const statusCode = (error as any).statusCode || 500;
  const message = error.message || 'Internal Server Error';

  reply.status(statusCode).send({
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Capture API error with request context (stub)
 */
export function captureAPIError(
  error: Error | unknown,
  request?: FastifyRequest,
  context?: Record<string, unknown>
) {
  console.error('[API Error Captured]', {
    error: error instanceof Error ? error.message : String(error),
    context,
  });
}

/**
 * Capture API message (stub)
 */
export function captureAPIMessage(
  message: string,
  level: string = 'info',
  request?: FastifyRequest,
  context?: Record<string, unknown>
) {
  console.log(`[API Message - ${level}]`, message, context);
}

/**
 * Wrap async route handler with error catching
 * Usage:
 * ```
 * fastify.get('/endpoint', wrapHandler(async (request, reply) => {
 *   // Route logic
 * }));
 * ```
 */
export function wrapHandler(
  handler: (request: FastifyRequest, reply: FastifyReply) => Promise<any>
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      return await handler(request, reply);
    } catch (error) {
      captureAPIError(error, request);
      throw error;
    }
  };
}

/**
 * Middleware to track request performance (stub)
 * Usage:
 * ```
 * fastify.addHook('onRequest', sentryPerformanceHook);
 * ```
 */
export async function sentryPerformanceHook(
  request: FastifyRequest
) {
  // Store start time for duration tracking
  (request as any).sentryStartTime = Date.now();
}

/**
 * Middleware to finish performance tracking (stub)
 * Usage:
 * ```
 * fastify.addHook('onSend', sentryFinishHook);
 * ```
 */
export async function sentryFinishHook(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const startTime = (request as any).sentryStartTime;
  if (startTime) {
    const duration = Date.now() - startTime;
    console.log(`[Performance] ${request.method} ${request.url} - ${duration}ms - Status: ${reply.statusCode}`);
  }
}

/**
 * Register Sentry hooks with Fastify instance
 * Usage in main API file:
 * ```
 * registerSentryHooks(fastify);
 * ```
 */
export async function registerSentryHooks(fastify: FastifyInstance) {
  if (!isSentryAPIEnabled()) {
    return;
  }

  // Performance tracking
  fastify.addHook('onRequest', sentryPerformanceHook);
  fastify.addHook('onSend', sentryFinishHook);

  // Error handling
  fastify.setErrorHandler(withSentryErrorHandler);

  console.log('[Sentry] Hooks registered with Fastify');
}

/**
 * Set user context for authenticated requests (stub)
 */
export function setAPIUserContext(
  request: FastifyRequest,
  userId?: string,
  userAddress?: string
) {
  console.log('[User Context]', { userId, userAddress, ip: request.ip });
}

/**
 * Check if Sentry API monitoring is enabled
 */
export function isSentryAPIEnabled(): boolean {
  return process.env.SENTRY_ENABLED === 'true' && !!process.env.SENTRY_DSN;
}

/**
 * Get formatted error response
 */
export function getErrorResponse(error: Error, statusCode: number = 500) {
  return {
    error: {
      message: error.message,
      statusCode,
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Sentry API proxy
 */
export const sentryAPIProxy = {
  captureError: captureAPIError,
  captureMessage: captureAPIMessage,
  wrapHandler,
  setUserContext: setAPIUserContext,
  getErrorResponse,
};
