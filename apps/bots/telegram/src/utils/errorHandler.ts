/**
 * Telegram Bot Error Handler
 * Centralized error handling and logging
 */

export type ErrorLevel = 'info' | 'warn' | 'error';

export interface ErrorContext {
  level: ErrorLevel;
  context: string;
  error?: Error;
  userId?: number;
  commandName?: string;
}

/**
 * Timestamp formatter for logs
 */
function getTimestamp(): string {
  const now = new Date();
  return now.toISOString();
}

/**
 * Format log message
 */
function formatLog(level: ErrorLevel, context: string, error?: Error): string {
  const timestamp = getTimestamp();
  const levelUpper = level.toUpperCase();
  const errorMsg = error ? ` - ${error.message}` : '';
  return `[${timestamp}] [${levelUpper}] ${context}${errorMsg}`;
}

/**
 * Log error to console
 */
export function logError(level: ErrorLevel, context: string, error?: Error): void {
  const message = formatLog(level, context, error);

  switch (level) {
    case 'info':
      console.log(message);
      break;
    case 'warn':
      console.warn(message);
      break;
    case 'error':
      console.error(message);
      if (error?.stack) {
        console.error('Stack trace:', error.stack);
      }
      break;
  }
}

/**
 * Handle API request errors
 */
export function handleApiError(
  endpoint: string,
  error: any,
  userId?: number
): string {
  logError('error', `API request failed to ${endpoint}`, error as Error);

  if (error?.response?.status === 404) {
    return '❌ Data not found. Please try again later.';
  }

  if (error?.response?.status === 429) {
    return '⏳ Too many requests. Please wait a moment before trying again.';
  }

  if (error?.response?.status === 500) {
    return '❌ Server error. Please try again in a few moments.';
  }

  if (error?.code === 'ECONNREFUSED') {
    return '❌ Unable to connect to service. Please check your connection.';
  }

  if (error?.message?.includes('timeout')) {
    return '⏳ Request timed out. Please try again.';
  }

  return '❌ Error fetching data. Please try again later.';
}

/**
 * Handle command execution errors
 */
export function handleCommandError(
  commandName: string,
  error: any,
  userId?: number
): string {
  logError('error', `Command /${commandName} failed for user ${userId}`, error as Error);

  if (error?.message?.includes('validation')) {
    return `❌ Invalid input: ${error.message}`;
  }

  if (error?.message?.includes('already exists')) {
    return '❌ This alert already exists.';
  }

  if (error?.message?.includes('not found')) {
    return '❌ Not found. Please check your input.';
  }

  return `❌ Error running /${commandName}. Please try again or use /help.`;
}

/**
 * Validate input and return error message if invalid
 */
export function validateInput(input: string, rule: 'price'): string | null {
  if (!input) {
    return 'Input is required.';
  }

  if (rule === 'price') {
    const price = parseFloat(input);
    if (isNaN(price)) {
      return 'Please enter a valid number.';
    }
    if (price <= 0) {
      return 'Price must be greater than 0.';
    }
    if (price > 1000000) {
      return 'Price is too high. Please enter a reasonable value.';
    }
  }

  return null;
}

/**
 * Safe API call wrapper
 */
export async function safeApiCall<T>(
  fn: () => Promise<T>,
  context: string
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    logError('error', context, error as Error);
    return null;
  }
}

/**
 * Log command execution
 */
export function logCommandExecution(
  commandName: string,
  userId?: number,
  args?: string
): void {
  logError(
    'info',
    `Command /${commandName} executed${userId ? ` by user ${userId}` : ''}${args ? ` with args: ${args}` : ''}`
  );
}

/**
 * Log bot start/stop
 */
export function logBotStatus(status: 'started' | 'stopped', message?: string): void {
  const msg =
    status === 'started'
      ? '🚀 Telegram bot started successfully'
      : '🛑 Telegram bot stopped';

  logError('info', msg + (message ? ` - ${message}` : ''));
}

/**
 * Format error for user display
 */
export function formatUserError(error: any, context: string = 'operation'): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  return `An error occurred during ${context}. Please try again later.`;
}
