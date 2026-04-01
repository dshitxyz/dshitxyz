-- Performance Optimization: Database Index Creation
-- Execute this script to create indexes for improved query performance
-- Created: 2026-03-31 (Session 12)

-- ============================================
-- 1. MEMES TABLE INDEXES
-- ============================================

-- Fast lookups by creation time (trending/newest)
CREATE INDEX IF NOT EXISTS idx_memes_created_at
ON memes(created_at DESC)
WHERE deleted_at IS NULL;

-- User memes lookup
CREATE INDEX IF NOT EXISTS idx_memes_user_id
ON memes(user_id)
WHERE deleted_at IS NULL;

-- Trending score (for ranking)
CREATE INDEX IF NOT EXISTS idx_memes_trending
ON memes(viral_score DESC, created_at DESC)
WHERE deleted_at IS NULL;

-- Vote lookups
CREATE INDEX IF NOT EXISTS idx_memes_vote_count
ON memes(vote_count DESC)
WHERE deleted_at IS NULL;

-- ============================================
-- 2. ORDERS TABLE INDEXES
-- ============================================

-- User order history
CREATE INDEX IF NOT EXISTS idx_orders_user_wallet
ON orders(user_wallet)
WHERE status != 'cancelled';

-- Order timeline
CREATE INDEX IF NOT EXISTS idx_orders_created_at
ON orders(created_at DESC)
WHERE status != 'cancelled';

-- Order status lookup
CREATE INDEX IF NOT EXISTS idx_orders_status
ON orders(status, created_at DESC);

-- Fast order lookup by ID
CREATE INDEX IF NOT EXISTS idx_orders_order_id
ON orders(order_id)
WHERE status != 'cancelled';

-- ============================================
-- 3. USERS TABLE INDEXES
-- ============================================

-- Leaderboard queries
CREATE INDEX IF NOT EXISTS idx_users_total_score
ON users(total_score DESC, reputation_score DESC);

-- Wallet lookup (authentication)
CREATE INDEX IF NOT EXISTS idx_users_wallet_address
ON users(wallet_address)
WHERE active = true;

-- User by username
CREATE INDEX IF NOT EXISTS idx_users_username
ON users(username)
WHERE active = true;

-- ============================================
-- 4. VOTES TABLE INDEXES
-- ============================================

-- Vote count aggregation
CREATE INDEX IF NOT EXISTS idx_votes_meme_id
ON votes(meme_id, vote_type);

-- User voting history
CREATE INDEX IF NOT EXISTS idx_votes_user_meme
ON votes(user_id, meme_id);

-- Timeline of votes
CREATE INDEX IF NOT EXISTS idx_votes_created_at
ON votes(created_at DESC);

-- ============================================
-- 5. ANALYTICS TABLE INDEXES
-- ============================================

-- Event timeline queries
CREATE INDEX IF NOT EXISTS idx_analytics_event_timestamp
ON analytics_events(event_type, timestamp DESC);

-- User analytics
CREATE INDEX IF NOT EXISTS idx_analytics_user_session
ON analytics_events(user_id, session_id, timestamp DESC);

-- ============================================
-- 6. COMPOSITE INDEXES (Multi-column)
-- ============================================

-- Dashboard stats (user memes + votes)
CREATE INDEX IF NOT EXISTS idx_memes_user_trending
ON memes(user_id, viral_score DESC, created_at DESC)
WHERE deleted_at IS NULL;

-- Order fulfillment pipeline
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment
ON orders(status, created_at DESC, user_wallet)
WHERE status IN ('pending', 'processing');

-- ============================================
-- 7. QUERY PLAN ANALYSIS
-- ============================================

-- After creating indexes, run ANALYZE to update statistics
-- This helps the query planner make better decisions

ANALYZE memes;
ANALYZE orders;
ANALYZE users;
ANALYZE votes;
ANALYZE analytics_events;

-- ============================================
-- 8. INDEX MAINTENANCE
-- ============================================

-- Check for unused indexes:
-- SELECT * FROM pg_stat_user_indexes
-- WHERE idx_scan = 0
-- AND indexname NOT LIKE 'pk_%';

-- Rebuild indexes to optimize storage:
-- REINDEX INDEX idx_memes_created_at;

-- Monitor index size:
-- SELECT schemaname, tablename, indexname,
--        pg_size_pretty(pg_relation_size(indexrelid)) as size
-- FROM pg_stat_user_indexes
-- ORDER BY pg_relation_size(indexrelid) DESC;

-- ============================================
-- 9. PERFORMANCE MONITORING QUERIES
-- ============================================

-- Monitor slow queries (if slow query log is enabled):
-- SELECT query, calls, total_time, mean_time, stddev_time
-- FROM pg_stat_statements
-- WHERE mean_time > 50  -- More than 50ms average
-- ORDER BY mean_time DESC
-- LIMIT 20;

-- Connection pool status:
-- SELECT count(*) as total_connections,
--        max_conn
-- FROM pg_stat_activity
-- CROSS JOIN (SELECT setting::int as max_conn FROM pg_settings WHERE name = 'max_connections') s
-- WHERE datname = current_database();

-- ============================================
-- 10. EXECUTION TIME ESTIMATES
-- ============================================

-- Expected query times AFTER optimization:
-- - Simple lookups (e.g., GET user by wallet): 5-10ms
-- - Paginated lists (e.g., trending memes): 20-30ms
-- - Aggregations (e.g., leaderboard): 30-50ms
-- - Complex joins (e.g., orders with user data): 40-60ms

-- Expected improvement:
-- - Before indexes: 200-500ms average query time
-- - After indexes: 20-50ms average query time
-- - Improvement factor: 5-10x faster

-- ============================================
-- CREATED: 2026-03-31 (Session 12)
-- NEXT REVIEW: 2026-04-14 (Monitor performance)
-- ============================================
