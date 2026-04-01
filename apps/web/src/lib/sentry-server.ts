/**
 * Sentry Server-Side Error Monitoring
 *
 * Captures server-side errors in Next.js API routes and server components.
 * Works alongside client-side Sentry for full application visibility.
 *
 * Usage:
 * - Import in API routes
 * - Wrap handlers with error capturing
 * - Automatic error reporting to Sentry
 */

import * as Sentry from '@sentry/nextjs';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Initialize Sentry for server-side error tracking
 * Called in API route middleware or server startup
 */
export function initSentryServer() {
  const shouldInit =
    process.env.SENTRY_ENABLED === 'true' && process.env.SENTRY_DSN;

  if (!shouldInit) {
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.ENV || 'development',
    release: process.env.APP_VERSION,
    tracesSampleRate: process.env.SENTRY_TRACES_RATE
      ? parseFloat(process.env.SENTRY_TRACES_RATE)
      : 0.1,

    integrations: [
      // Node.js integration
      new Sentry.Integrations.OnUncaughtException(),
      new Sentry.Integrations.OnUnhandledRejection(),
      // Request/response tracking
      new Sentry.Integrations.RequestHandler(),
    ],

    beforeSend(event) {
      // Remove sensitive headers from requests
      if (event.request?.headers) {
        delete event.request.headers['Authorization'];
        delete event.request.headers['Cookie'];
        delete event.request.headers['X-API-Key'];
      }

      return event;
    },

    debug: process.env.NODE_ENV === 'development',
  });
}

/**
 * Wrap API route handler with error capturing
 * Usage:
 * ```
 * export default withSentryErrorCapture(async (req, res) => {
 *   // route logic
 * });
 * ```
 */
export function withSentryErrorCapture(
  handler: (
    req: NextRequest,
    context?: any
  ) => Promise<NextResponse> | NextResponse
) {
  return Sentry.wrapApiHandlerWithSentry(handler);
}

/**
 * Wrap async function with error capturing
 * Usage:
 * ```
 * const safeFetch = withErrorCapture(async () => {
 *   return await fetch('...');
 * });
 * ```
 */
export function withErrorCapture<T>(
  fn: () => Promise<T>
): () => Promise<T | null> {
  return async () => {
    try {
      return await fn();
    } catch (error) {
      captureServerError(error, {
        context: 'async_function',
      });
      return null;
    }
  };
}

/**
 * Capture server-side error with context
 */
export function captureServerError(
  error: Error | unknown,
  context?: Record<string, unknown>
) {
  const errorObj = error instanceof Error ? error : new Error(String(error));

  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        if (typeof value === 'object') {
          scope.setContext(key, value as any);
        } else {
          scope.setTag(key, String(value));
        }
      });
    }

    Sentry.captureException(errorObj);
  });
}

/**
 * Capture server message
 */
export function captureServerMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, unknown>
) {
  Sentry.withScope((scope) => {
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
 * Get current Sentry transaction (for performance monitoring)
 */
export function getCurrentTransaction() {
  return Sentry.getCurrentScope().getTransaction();
}

/**
 * Set server-side context (request info, user, etc.)
 */
export function setServerContext(data: {
  userId?: string;
  userEmail?: string;
  requestId?: string;
  [key: string]: unknown;
}) {
  const scope = Sentry.getCurrentScope();

  if (data.userId || data.userEmail) {
    scope.setUser({
      id: data.userId,
      email: data.userEmail,
    });
  }

  const context: Record<string, any> = {};
  Object.entries(data).forEach(([key, value]) => {
    if (!['userId', 'userEmail'].includes(key)) {
      context[key] = value;
    }
  });

  if (Object.keys(context).length > 0) {
    scope.setContext('request', context);
  }
}

/**
 * Middleware wrapper for Express-like servers
 * Usage:
 * ```
 * app.use(sentryErrorMiddleware);
 * ```
 */
export function sentryErrorMiddleware(
  error: Error,
  req: NextRequest,
  res: NextResponse,
  next: () => void
) {
  Sentry.captureException(error, {
    contexts: {
      request: {
        method: req.method,
        url: req.url,
        headers: sanitizeHeaders(req.headers),
      },
    },
  });

  // Continue error handling
  next();
}

/**
 * Remove sensitive headers before sending to Sentry
 */
function sanitizeHeaders(headers: Record<string, any>): Record<string, any> {
  const sensitiveKeys = [
    'authorization',
    'cookie',
    'x-api-key',
    'x-auth-token',
    'x-access-token',
  ];

  const sanitized = { ...headers };
  sensitiveKeys.forEach((key) => {
    Object.keys(sanitized).forEach((headerKey) => {
      if (headerKey.toLowerCase() === key) {
        delete sanitized[headerKey];
      }
    });
  });

  return sanitized;
}

/**
 * Check if server-side Sentry is enabled
 */
export function isSentryServerEnabled(): boolean {
  return (
    process.env.SENTRY_ENABLED === 'true' && !!process.env.SENTRY_DSN
  );
}

/**
 * Sentry server proxy for direct access
 */
export const sentryServerProxy = {
  captureError: captureServerError,
  captureMessage: captureServerMessage,
  setContext: setServerContext,
  getCurrentTransaction,
  withErrorCapture,
};
