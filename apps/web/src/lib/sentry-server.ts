/**
 * Sentry Server-Side Error Monitoring (Stub)
 *
 * NOTE: Sentry integration is stubbed for now to ensure TypeScript compatibility.
 * Full integration can be added when Sentry 8 API migration is complete.
 */

/**
 * Initialize Sentry for server-side error tracking
 */
export function initSentryServer() {
  const shouldInit =
    process.env.SENTRY_ENABLED === 'true' && process.env.SENTRY_DSN;

  if (!shouldInit) {
    return;
  }

  console.log('[Sentry] Server initialized (stub)');
}

/**
 * Wrap API route handler with error capturing
 */
export function withSentryErrorCapture<T>(
  handler: (req: any, context?: any) => Promise<T> | T
) {
  return async (req: any, context?: any) => {
    try {
      return await handler(req, context);
    } catch (error) {
      captureServerError(error);
      throw error;
    }
  };
}

/**
 * Wrap async function with error capturing
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
  console.error('[Server Error]', { message: errorObj.message, context });
}

/**
 * Capture server message
 */
export function captureServerMessage(
  message: string,
  level: string = 'info',
  context?: Record<string, unknown>
) {
  console.log(`[Server Message - ${level}]`, message, context);
}

/**
 * Get current Sentry transaction
 */
export function getCurrentTransaction() {
  return null;
}

/**
 * Set server-side context
 */
export function setServerContext(data: {
  userId?: string;
  userEmail?: string;
  requestId?: string;
  [key: string]: unknown;
}) {
  console.log('[Server Context]', data);
}

/**
 * Middleware wrapper for error handling
 */
export function sentryErrorMiddleware(
  error: Error,
  req: any,
  res: any,
  next: () => void
) {
  console.error('[Middleware Error]', error.message);
  next();
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
