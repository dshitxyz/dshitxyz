/**
 * Sentry Client-Side Error Monitoring
 *
 * Captures browser errors, performance issues, and user sessions.
 * Configuration is environment-based and disabled in development by default.
 *
 * Usage:
 * - Import in app root (layout.tsx)
 * - Wrap App component with error boundary
 * - Errors automatically captured and reported
 */

import * as Sentry from '@sentry/nextjs';

/**
 * Initialize Sentry for browser error tracking
 * Called once at app startup
 */
export function initSentryClient() {
  // Only initialize in production or when explicitly enabled
  const shouldInit =
    process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true' &&
    process.env.NEXT_PUBLIC_SENTRY_DSN;

  if (!shouldInit || typeof window === 'undefined') {
    return;
  }

  Sentry.init({
    // Sentry DSN for error reporting
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Environment (development, staging, production)
    environment: process.env.NEXT_PUBLIC_ENV || 'development',

    // Release version for tracking errors across versions
    release: process.env.NEXT_PUBLIC_APP_VERSION,

    // Sample rate for performance monitoring (0.0 - 1.0)
    tracesSampleRate: process.env.NEXT_PUBLIC_SENTRY_TRACES_RATE
      ? parseFloat(process.env.NEXT_PUBLIC_SENTRY_TRACES_RATE)
      : 0.1, // 10% by default

    // Replay configuration for session recording
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of error sessions

    // Integrations
    integrations: [
      // Breadcrumbs for user actions
      new Sentry.Breadcrumbs(),
      // Replay recording
      new Sentry.Replay({
        maskAllText: true, // Mask sensitive text
        blockAllMedia: true, // Block media playback
      }),
      // HTTP client instrumentation
      new Sentry.HttpClientIntegration(),
      // Vue/React integration
      new Sentry.Replay(),
    ],

    // Before sending event - filter sensitive data
    beforeSend(event, hint) {
      // Filter out non-error exceptions if needed
      if (event.exception) {
        const error = hint.originalException;
        // Could add custom filtering here
      }

      // Remove sensitive headers
      if (event.request?.headers) {
        delete event.request.headers['Authorization'];
        delete event.request.headers['Cookie'];
      }

      return event;
    },

    // Allowed URLs for tracking
    allowUrls: [
      // Track errors from our domain
      /https?:\/\/(www\.)?dshit\.xyz/,
      /https?:\/\/localhost/,
    ],

    // Ignore errors from specific patterns
    denyUrls: [
      // Ignore browser extensions
      /extensions?\//i,
      // Ignore third-party scripts
      /^chrome:\/\//i,
    ],

    // Max breadcrumbs to keep
    maxBreadcrumbs: 50,

    // Debug mode (disable in production)
    debug: process.env.NODE_ENV === 'development',
  });
}

/**
 * Capture a message event
 * @param message - Message text
 * @param level - Severity level
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info'
) {
  Sentry.captureMessage(message, level);
}

/**
 * Capture an exception/error
 * @param error - Error object
 * @param context - Additional context
 */
export function captureException(
  error: Error | unknown,
  context?: Record<string, unknown>
) {
  if (context) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value as any);
      });
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
}

/**
 * Add custom context data to all subsequent events
 * @param data - Context object
 */
export function setUserContext(data: {
  id?: string;
  email?: string;
  address?: string;
  [key: string]: unknown;
}) {
  Sentry.setUser(data);
}

/**
 * Add custom tags to all subsequent events
 * @param tags - Tag key-value pairs
 */
export function setTags(tags: Record<string, string>) {
  Object.entries(tags).forEach(([key, value]) => {
    Sentry.setTag(key, value);
  });
}

/**
 * Set a transaction name for performance tracking
 * @param name - Transaction name
 * @param op - Operation type (optional)
 */
export function setTransaction(name: string, op?: string) {
  Sentry.getCurrentScope().setTransaction(
    Sentry.startTransaction({
      name,
      op,
    })
  );
}

/**
 * Add a breadcrumb for user action tracking
 * @param message - Breadcrumb message
 * @param category - Category (user-action, navigation, etc.)
 * @param level - Severity level
 */
export function addBreadcrumb(
  message: string,
  category: string = 'user-action',
  level: Sentry.SeverityLevel = 'info'
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Check if Sentry is configured and enabled
 */
export function isSentryEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true' &&
    !!process.env.NEXT_PUBLIC_SENTRY_DSN
  );
}

/**
 * Sentry proxy object for direct access
 * Allows calling Sentry methods directly: sentryProxy.captureException(error)
 */
export const sentryProxy = {
  captureException,
  captureMessage,
  setUserContext,
  setTags,
  setTransaction,
  addBreadcrumb,
};
