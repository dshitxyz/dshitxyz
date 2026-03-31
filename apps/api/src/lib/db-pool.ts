import { Pool, PoolConfig } from 'pg';

/**
 * Database Connection Pool Configuration
 *
 * This module configures PostgreSQL connection pooling for optimal
 * performance and resource utilization.
 *
 * Pool benefits:
 * - Reuses connections instead of creating new ones
 * - Reduces connection overhead by 50-70%
 * - Improves query response times
 * - Better resource management
 */

const poolConfig: PoolConfig = {
  // Connection parameters
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'dshitxyz',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',

  // Pool size configuration
  min: parseInt(process.env.DB_POOL_MIN || '5'), // Minimum idle connections
  max: parseInt(process.env.DB_POOL_MAX || '20'), // Maximum total connections

  // Timeout configuration (in milliseconds)
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'), // 30 seconds
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000'), // 2 seconds
  statement_timeout: parseInt(process.env.DB_STATEMENT_TIMEOUT || '30000'), // 30 seconds

  // Connection validation
  connectionValidationQuery: 'SELECT NOW();',

  // SSL configuration (for production)
  ...(process.env.NODE_ENV === 'production' && {
    ssl: {
      rejectUnauthorized: false, // Set to true in production with proper certificates
    },
  }),
};

/**
 * Create and export the connection pool
 * The pool is created once and reused for all queries
 */
export const pool = new Pool(poolConfig);

/**
 * Pool event listeners for monitoring and logging
 */

pool.on('connect', () => {
  // Optionally log successful connections
  if (process.env.DEBUG_DB === 'true') {
    console.log('[DB] Pool connection created');
  }
});

pool.on('error', (err, client) => {
  console.error('[DB ERROR] Unexpected error on idle client:', err);
  process.exit(-1);
});

pool.on('release', () => {
  if (process.env.DEBUG_DB === 'true') {
    console.log('[DB] Connection released back to pool');
  }
});

/**
 * Helper function to execute queries with built-in error handling
 */
export async function query<T = any>(
  text: string,
  params?: any[],
  timeout?: number
): Promise<T[]> {
  const client = await pool.connect();
  try {
    // Set statement timeout if provided
    if (timeout) {
      await client.query(`SET statement_timeout = ${timeout};`);
    }

    const result = await client.query(text, params);
    return result.rows;
  } catch (error) {
    console.error('[DB ERROR] Query execution failed:', {
      query: text.substring(0, 100),
      params: params?.length || 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Execute a transaction with multiple queries
 */
export async function transaction<T = any>(
  queries: Array<{ text: string; params?: any[] }>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const q of queries) {
      await client.query(q.text, q.params);
    }

    await client.query('COMMIT');
    return {} as T;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[DB ERROR] Transaction failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get pool statistics
 */
export function getPoolStats() {
  return {
    totalConnections: pool.totalCount,
    idleConnections: pool.idleCount,
    waitingRequests: pool.waitingCount,
  };
}

/**
 * Gracefully shutdown the pool
 */
export async function drainPool() {
  await pool.end();
  console.log('[DB] Connection pool drained');
}

/**
 * Environment variables for connection pooling:
 *
 * DB_HOST              - Database host (default: localhost)
 * DB_PORT              - Database port (default: 5432)
 * DB_NAME              - Database name (default: dshitxyz)
 * DB_USER              - Database user (default: postgres)
 * DB_PASSWORD          - Database password (required in production)
 * DB_POOL_MIN          - Minimum idle connections (default: 5)
 * DB_POOL_MAX          - Maximum connections (default: 20)
 * DB_IDLE_TIMEOUT      - Idle timeout in ms (default: 30000)
 * DB_CONNECTION_TIMEOUT- Connection timeout in ms (default: 2000)
 * DB_STATEMENT_TIMEOUT - Statement timeout in ms (default: 30000)
 * DEBUG_DB             - Enable debug logging (default: false)
 */
