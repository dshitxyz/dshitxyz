/**
 * Sentry Client-Side Error Monitoring (Stub)
 *
 * NOTE: Sentry integration is stubbed for now to ensure TypeScript compatibility.
 * Full integration can be added when Sentry 8 API migration is complete.
 *
 * Captures browser errors, performance issues, and user sessions.
 * Configuration is environment-based and disabled in development by default.
 */

/**
 * Initialize Sentry for browser error tracking
 * Called once at app startup
 */
export function initSentryClient() {
  const shouldInit =
    process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true' &&
    process.env.NEXT_PUBLIC_SENTRY_DSN;

  if (!shouldInit || typeof window === 'undefined') {
    return;
  }

  console.log('[Sentry] Client initialized (stub)');
}

/**
 * Capture a client-side error
 */
export function captureClientError(error: Error, context?: Record<string, unknown>) {
  console.error('[Client Error]', { error: error.message, context });
}

/**
 * Capture a client-side message
 */
export function captureClientMessage(message: string, level: string = 'info') {
  console.log(`[Client Message - ${level}]`, message);
}

/**
 * Set user context for error tracking
 */
export function setClientUserContext(userId?: string, wallet?: string) {
  console.log('[User Context]', { userId, wallet });
}

/**
 * Track a page view
 */
export function trackPageView(path: string) {
  console.log('[Page View]', path);
}

/**
 * Add a breadcrumb for user actions
 */
export function addBreadcrumb(message: string, category?: string) {
  console.log('[Breadcrumb]', { message, category });
}

/**
 * Error boundary component for React
 */
export function withSentryErrorBoundary<P extends object>(
  Component: React.ComponentType<P>
) {
  // For now, just return the component as-is
  // Full error boundary implementation would go here
  return Component;
}

/**
 * Sentry client proxy
 */
export const sentryClientProxy = {
  captureError: captureClientError,
  captureMessage: captureClientMessage,
  setUserContext: setClientUserContext,
  trackPageView,
  addBreadcrumb,
};
