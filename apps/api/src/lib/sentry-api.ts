/**
 * Sentry API Error Monitoring (Fastify)
 *
 * Captures server-side errors, API request/response cycles, and performance issues.
 * Integrates with Fastify error handling and logging.
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

import * as Sentry from '@sentry/node';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

/**
 * Initialize Sentry for Fastify API
 */
export function initSentryAPI() {
  const shouldInit = process.env.SENTRY_ENABLED === 'true' && process.env.SENTRY_DSN;

  if (!shouldInit) {
    console.log('[Sentry] Disabled (set SENTRY_ENABLED=true to enable)');
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    release: process.env.APP_VERSION,

    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_RATE || '0.1'),

    integrations: [
      // Node.js integration
      new Sentry.Integrations.OnUncaughtException(),
      new Sentry.Integrations.OnUnhandledRejection(),
      // HTTP integration for outbound requests
      new Sentry.Integrations.Http({
        tracing: true,
      }),
    ],

    // Filter sensitive data
    beforeSend(event) {
      if (event.request?.headers) {
        const sensitiveHeaders = [
          'authorization',
          'cookie',
          'x-api-key',
          'x-auth-token',
        ];
        sensitiveHeaders.forEach((header) => {
          delete event.request!.headers![header];
        });
      }

      return event;
    },

    debug: process.env.NODE_ENV === 'development',
  });

  console.log('[Sentry] Initialized for API monitoring');
}

/**
 * Fastify error handler with Sentry integration
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
  // Capture error with request context
  Sentry.withScope((scope) => {
    scope.setContext('fastify_request', {
      method: request.method,
      url: request.url,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
    });

    // Add user context if authenticated
    if ((request as any).user) {
      scope.setUser({
        id: (request as any).user.id,
        address: (request as any).user.address,
      });
    }

    // Capture the error
    Sentry.captureException(error);
  });

  // Send error response
  const statusCode = (error as any).statusCode || 500;
  const message = error.message || 'Internal Server Error';

  reply.status(statusCode).send({
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      // Include sentry event ID in response for user tracking
      reportId: Sentry.lastEventId(),
    },
  });
}

/**
 * Capture API error with request context
 */
export function captureAPIError(
  error: Error | unknown,
  request?: FastifyRequest,
  context?: Record<string, unknown>
) {
  Sentry.withScope((scope) => {
    if (request) {
      scope.setContext('api_request', {
        method: request.method,
        url: request.url,
        ip: request.ip,
      });

      if ((request as any).user) {
        scope.setUser({
          id: (request as any).user.id,
          address: (request as any).user.address,
        });
      }
    }

    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        if (typeof value === 'object') {
          scope.setContext(key, value as any);
        } else {
          scope.setTag(key, String(value));
        }
      });
    }

    Sentry.captureException(error);
  });
}

/**
 * Capture API message (info, warning, error)
 */
export function captureAPIMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  request?: FastifyRequest,
  context?: Record<string, unknown>
) {
  Sentry.withScope((scope) => {
    if (request) {
      scope.setContext('api_request', {
        method: request.method,
        url: request.url,
        ip: request.ip,
      });
    }

    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        if (typeof value === 'object') {
          scope.setContext(key, value as any);
        } else {
          scope.setTag(key, String(value));
        }
      });
    }

    Sentry.captureMessage(message, level);
  });
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
 * Middleware to track request performance
 * Usage:
 * ```
 * fastify.addHook('onRequest', sentryPerformanceHook);
 * ```
 */
export async function sentryPerformanceHook(
  request: FastifyRequest
) {
  // Create transaction for this request
  const transaction = Sentry.startTransaction({
    name: `${request.method} ${request.url}`,
    op: 'http.request',
  });

  // Store in request context
  (request as any).sentryTransaction = transaction;
}

/**
 * Middleware to finish performance tracking
 * Usage:
 * ```
 * fastify.addHook('onSend', sentryFinishHook);
 * ```
 */
export async function sentryFinishHook(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const transaction = (request as any).sentryTransaction;
  if (transaction) {
    transaction.setStatus(reply.statusCode < 400 ? 'ok' : 'error');
    transaction.finish();
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
 * Set user context for authenticated requests
 */
export function setAPIUserContext(
  request: FastifyRequest,
  userId?: string,
  userAddress?: string
) {
  Sentry.getCurrentScope().setUser({
    id: userId,
    ip_address: request.ip,
  });

  Sentry.setTag('user_address', userAddress || 'unknown');
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
      reportId: Sentry.lastEventId(),
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
