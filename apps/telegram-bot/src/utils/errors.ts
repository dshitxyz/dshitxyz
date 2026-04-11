export class BotError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'BotError';
  }
}

export class APIError extends BotError {
  constructor(message: string, public statusCode?: number) {
    super(message, 'API_ERROR');
    this.name = 'APIError';
  }
}

export class ValidationError extends BotError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends BotError {
  constructor(message: string) {
    super(message, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends BotError {
  constructor(message: string) {
    super(message, 'RATE_LIMIT');
    this.name = 'RateLimitError';
  }
}
