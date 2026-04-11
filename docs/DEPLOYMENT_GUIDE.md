# Deployment Guide - dshit.xyz

Complete step-by-step guide for deploying dshit.xyz to production.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pre-Deployment](#pre-deployment)
3. [Staging Deployment](#staging-deployment)
4. [Production Deployment](#production-deployment)
5. [Verification](#verification)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools
```bash
# Node.js and pnpm
node --version  # v18+ required
pnpm --version  # v8+ required

# Git
git --version

# Docker (for local testing)
docker --version
docker-compose --version
```

### Required Accounts & Access
- [ ] GitHub account with push access
- [ ] Production server SSH access
- [ ] Database admin credentials
- [ ] Secrets manager access
- [ ] Sentry account configured
- [ ] CDN API credentials
- [ ] Domain DNS access

### Environment Setup
```bash
# Clone repository
git clone https://github.com/dshitxyz/dshitxyz.git
cd dshitxyz

# Install dependencies
pnpm install

# Verify setup
pnpm type-check
pnpm lint
pnpm test
```

---

## Pre-Deployment

### 1. Code Verification

**Step 1.1: Update from main**
```bash
git fetch origin
git checkout main
git pull origin main
```

**Step 1.2: Run all tests**
```bash
# Unit tests
pnpm test

# Integration tests
pnpm test:integration

# E2E tests (requires running services)
pnpm dev &  # Start dev server in background
pnpm test:e2e
```

**Step 1.3: Type checking**
```bash
pnpm type-check
```

**Step 1.4: Linting**
```bash
pnpm lint
```

### 2. Review Checklist

```bash
# View recent commits
git log --oneline -10

# Check for uncommitted changes
git status

# View staged changes
git diff --cached

# Review PR notes
# (Open GitHub and check latest PR)
```

### 3. Create Release Tag (Optional)
```bash
# Create version tag
git tag -a v1.0.0 -m "Release 1.0.0 - Production Ready"

# Push tag
git push origin v1.0.0
```

---

## Staging Deployment

### Step 1: Prepare Staging Environment

```bash
# SSH to staging server
ssh staging@dshit-staging.example.com

# Create deployment directory
mkdir -p /var/www/dshit-staging
cd /var/www/dshit-staging

# Clone/update repository
git clone https://github.com/dshitxyz/dshitxyz.git .
# Or: git pull origin main

# Copy environment file
cp .env.example .env.staging
# Edit .env.staging with staging values
nano .env.staging
```

### Step 2: Install Dependencies

```bash
# Install Node modules
pnpm install --frozen-lockfile

# Build applications
pnpm build
```

### Step 3: Database Setup

```bash
# Connect to staging database
psql postgresql://user:password@staging-db:5432/dshit_staging

# Run migrations
npm run migrate:staging

# Seed test data (optional)
npm run seed:staging

# Verify schema
\dt  # List tables
\d users  # Describe users table
```

### Step 4: Start Services

```bash
# Start API server
cd apps/api
npm start &

# Start web server
cd ../web
npm start &

# Start Redis (if used)
redis-server &

# Verify services running
ps aux | grep node
curl http://localhost:3000  # Web
curl http://localhost:3001/api/health  # API
```

### Step 5: Run Smoke Tests

```bash
# E2E tests
pnpm test:e2e

# Manual checks
curl https://dshit-staging.example.com
curl https://dshit-staging.example.com/api/health

# Check logs for errors
tail -f /var/log/dshit/api.log
tail -f /var/log/dshit/web.log
```

---

## Production Deployment

### ⚠️ Critical: Pre-Production Backup

```bash
# SSH to production database server
ssh db@prod-db-01.example.com

# Create database backup
pg_dump -U postgres dshit > /backups/dshit_$(date +%Y%m%d_%H%M%S).sql

# Verify backup
ls -lh /backups/dshit*.sql

# Test backup restoration (in sandbox)
pg_restore -d dshit_test /backups/dshit_latest.sql
```

### Step 1: Notification

```bash
# Post to operations channel
# Slack: #ops or #deployments
# Discord: #deployments

message = """
🚀 DEPLOYMENT NOTICE
---
Service: dshit.xyz
Type: Production Deployment
Version: v1.0.0
Start Time: 2026-04-01 14:00 UTC
Expected Duration: 15 minutes
Impact: Possible brief service interruption
Status: Starting
"""
```

### Step 2: Prepare Production Environment

```bash
# SSH to production server
ssh deploy@prod-web-01.example.com

# Stop current services (graceful)
sudo systemctl stop dshit-api
sudo systemctl stop dshit-web

# Wait for connections to drain
sleep 10

# Verify stopped
ps aux | grep dshit

# Create backup of current version
cp -r /var/www/dshit /var/www/dshit.backup.$(date +%Y%m%d_%H%M%S)
```

### Step 3: Deploy Code

```bash
cd /var/www/dshit

# Fetch latest code
git fetch origin
git checkout origin/main

# Install dependencies
pnpm install --frozen-lockfile --prod

# Build
pnpm build
```

### Step 4: Database Migrations

```bash
# Run any pending migrations
npm run migrate:prod

# Verify migrations completed
npm run migrate:status
```

### Step 5: Start Services

```bash
# Start API server
sudo systemctl start dshit-api

# Wait for startup
sleep 5

# Verify API running
curl http://localhost:3001/api/health

# Start web server
sudo systemctl start dshit-web

# Wait for startup
sleep 5

# Verify web running
curl http://localhost:3000
```

### Step 6: Verify Services

```bash
# Check service status
sudo systemctl status dshit-api
sudo systemctl status dshit-web

# Check for errors in logs
sudo tail -n 50 /var/log/dshit/api.log
sudo tail -n 50 /var/log/dshit/web.log

# Test critical endpoints
curl -I https://dshit.xyz
curl -I https://dshit.xyz/api/health
curl -I https://dshit.xyz/api/memes

# Send test errors to monitoring
curl -X POST https://dshit.xyz/api/test-error 2>/dev/null || echo "Test error recorded"
```

### Step 7: Post-Deployment Notification

```bash
# Update operations channel
message = """
✅ DEPLOYMENT COMPLETE
---
Service: dshit.xyz
Version: v1.0.0
Status: Healthy
Start Time: 2026-04-01 14:00 UTC
End Time: 2026-04-01 14:15 UTC
Duration: 15 minutes
Issues: None
"""
```

---

## Verification

### Immediate Checks (5 min)

```bash
# Website accessible
curl -I https://dshit.xyz
# Expected: HTTP 200

# API responding
curl -I https://dshit.xyz/api/health
# Expected: HTTP 200

# Frontend loads
curl https://dshit.xyz | grep -i "dshit"
# Expected: HTML containing dshit content

# Error monitoring active
curl -s https://dshit.xyz/api/health | grep -i "status"
# Expected: JSON with status
```

### Functional Tests (15 min)

```bash
# Test login flow
# 1. Visit https://dshit.xyz
# 2. Click "Connect Wallet"
# 3. Select MetaMask or WalletConnect
# 4. Sign message
# 5. Verify logged in

# Test product browsing
# 1. Navigate to /products
# 2. Verify products load
# 3. Add item to cart
# 4. Verify cart updates

# Test governance
# 1. Navigate to /governance
# 2. Verify proposals load
# 3. Try to vote (if eligible)

# Test memes
# 1. Navigate to /memes
# 2. Verify gallery loads
# 3. Try to upvote
# 4. Try to create meme
```

### Performance Tests (30 min)

```bash
# Page load time
# Use: https://pagespeed.web.dev
# Target: >90 score

# API response time
# Run: pnpm run test:load
# Target: <500ms average

# Database query performance
# Check: Monitoring dashboard
# Target: <100ms 95th percentile

# Memory/CPU usage
# Check: Server monitoring
# Target: Normal baseline
```

---

## Monitoring

### Set Up Dashboards

```bash
# Sentry Error Monitoring
# 1. Log in to https://sentry.io
# 2. Select dshit.xyz project
# 3. Review error trends
# 4. Set up alerts

# Server Monitoring
# 1. Log in to host monitoring tool
# 2. Create dashboard for dshit.xyz
# 3. Add metrics: CPU, memory, disk
# 4. Set up alerts for anomalies

# API Monitoring
# 1. Log in to API monitoring tool
# 2. Add dshit.xyz endpoints
# 3. Set up health checks
# 4. Configure SLA alerts
```

### Alert Configuration

```bash
# Critical alerts (immediate notification)
# - API response time > 1000ms
# - Error rate > 5%
# - Database connection pool exhausted
# - Disk space < 10%
# - CPU > 80%

# Warning alerts (notify team)
# - API response time > 500ms
# - Error rate > 1%
# - Disk space < 20%
# - CPU > 60%

# Info alerts (log only)
# - Deployment completed
# - Health check passed
# - Metrics snapshot
```

### Daily Checks

```bash
# First 24 hours, check every 4 hours:
1. Error rate (should be low)
2. API response times (should be normal)
3. User-reported issues (should be none)
4. Database performance (should be stable)
5. Log files for warnings (should be clean)

# After 24 hours, check daily:
1. Weekly error trends
2. Performance metrics
3. User feedback
4. System capacity
5. Backup status
```

---

## Troubleshooting

### API Not Starting

```bash
# Check logs
sudo tail -f /var/log/dshit/api.log

# Common issues:
# 1. Port already in use
lsof -i :3001

# 2. Missing dependencies
cd apps/api && npm install

# 3. Environment variables missing
echo $DATABASE_URL
echo $JWT_SECRET

# Solution: Fix issue and restart
sudo systemctl restart dshit-api
```

### Web App Not Loading

```bash
# Check logs
sudo tail -f /var/log/dshit/web.log

# Test with curl
curl -I https://dshit.xyz

# Check Next.js build
cd apps/web && npm run build

# Restart if needed
sudo systemctl restart dshit-web
```

### Database Connection Error

```bash
# Test database connectivity
psql postgresql://user:password@prod-db:5432/dshit

# Check connection pool
# In database:
SELECT count(*) FROM pg_stat_activity;

# Check max connections
SHOW max_connections;

# Solution: Increase pool size in API config
# Edit apps/api/.env
DATABASE_POOL_SIZE=20
```

### Performance Degradation

```bash
# Identify slow queries
# Check monitoring dashboard for slow queries

# Common causes:
# 1. Missing database indexes
SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;

# 2. Cache not working
redis-cli INFO stats

# 3. N+1 queries
# Check API logs for repeated queries

# 4. High load
# Check system metrics
top
free -h
df -h
```

### Data Issues

```bash
# Check data integrity
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM memes;
SELECT COUNT(*) FROM products;

# Restore from backup if needed
# 1. Stop services
sudo systemctl stop dshit-api dshit-web

# 2. Restore database
pg_restore -d dshit /backups/dshit_backup.sql

# 3. Run migrations
npm run migrate:prod

# 4. Start services
sudo systemctl start dshit-api dshit-web
```

---

## Rollback Procedure

If critical issues found, rollback to previous version:

```bash
# 1. Stop services
sudo systemctl stop dshit-api
sudo systemctl stop dshit-web

# 2. Restore from backup
cd /var/www
rm -rf dshit
cp -r dshit.backup.20260401_140000 dshit
cd dshit

# 3. Install dependencies
pnpm install --frozen-lockfile --prod

# 4. Restore database if needed
# (only if data schema changed)
# pg_restore -d dshit /backups/dshit_backup.sql

# 5. Start services
sudo systemctl start dshit-api
sudo systemctl start dshit-web

# 6. Verify health
curl https://dshit.xyz/api/health

# 7. Notify team
# Post to #ops: Rollback completed to previous version
```

---

## Post-Deployment

### 1. Documentation
- [ ] Update deployment notes with any issues
- [ ] Document any manual steps performed
- [ ] Update runbook if needed

### 2. Communication
- [ ] Post completion to team
- [ ] Share monitoring dashboard
- [ ] Schedule post-deployment review

### 3. Monitoring
- [ ] Set up alerts for critical metrics
- [ ] Create dashboard for executive visibility
- [ ] Schedule weekly reviews

### 4. Planning
- [ ] Schedule next deployment
- [ ] Plan maintenance window
- [ ] Update documentation

---

## Support

### Getting Help
1. Check [RUNBOOK.md](RUNBOOK.md) for common issues
2. Review [docs/PERFORMANCE_OPTIMIZATION.md](PERFORMANCE_OPTIMIZATION.md)
3. Check server logs: `/var/log/dshit/`
4. Contact on-call engineer

### Escalation
- Non-critical: Email team
- Important: Slack/Discord channel
- Critical: Page on-call engineer

---

*Last Updated: Session 18 (April 2026)*  
**Status: ✅ Production Ready**
