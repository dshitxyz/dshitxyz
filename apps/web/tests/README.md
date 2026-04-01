# Performance Load Testing Guide

**Phase 5.8 - Performance Hardening & Optimization**

This directory contains k6 performance tests for dshit.xyz infrastructure.

---

## Quick Start

### Prerequisites

Install k6:
```bash
# macOS with Homebrew
brew install k6

# Linux (Ubuntu/Debian)
sudo apt-get install k6

# Windows with Chocolatey
choco install k6

# Or download: https://k6.io/docs/getting-started/installation/
```

### Running Tests

**1. Start the local development environment:**
```bash
# Terminal 1: Start API (port 4000)
cd apps/api
npm install  # First time only
npm run dev

# Terminal 2: Start Web (port 3000)
cd apps/web
npm install  # First time only
npm run dev
```

**2. Run the baseline performance test:**
```bash
# Terminal 3: Run load test
cd apps/web
k6 run tests/performance.k6.js
```

**Expected output:**
```
✓ status is 200
✓ page load < 1.5s
✓ response time < 100ms
✓ p95 < 200ms
...
```

---

## Test Scenarios

### performance.k6.js - Baseline Load Test

Simulates realistic user behavior with progressive load increase:

1. **Ramp Up (30s):** 0 → 100 concurrent users
2. **Medium Load (1m 30s):** 100 → 500 concurrent users
3. **High Load (2m):** 500 → 1,000 concurrent users
4. **Ramp Down (30s):** 1,000 → 0 users

**Total Duration:** ~5 minutes

**Tests Included:**
- ✅ Homepage load time
- ✅ Meme gallery API response
- ✅ Token stats API response
- ✅ Product catalog API response
- ✅ Concurrent user handling

**Success Criteria:**
- p95 page load < 1500ms
- p95 API response < 200ms
- Error rate < 1%
- No timeouts

---

## Running Custom Load Tests

### Adjust Load Parameters

```bash
# Run with 50 concurrent users for 2 minutes
k6 run --vus 50 --duration 2m tests/performance.k6.js

# Run with custom stages (ramp-up controlled)
k6 run --stage 1m:100 --stage 2m:500 tests/performance.k6.js
```

### Test Against Production URLs

```bash
# Test against production frontend and API
k6 run \
  --env BASE_URL=https://dshit.xyz \
  --env API_URL=https://api.dshit.xyz \
  tests/performance.k6.js
```

### Export Results to JSON

```bash
# Save results for analysis
k6 run --out json=results.json tests/performance.k6.js

# View results
cat results.json | jq '.metrics'
```

### Real-time HTML Report

```bash
# Install xk6-html extension
go install github.com/xk6-io/xk6-html/cmd/xk6-html@latest

# Generate interactive HTML report
xk6-html results.json --output report.html --open
```

---

## Performance Metrics Explained

### Page Load Metrics

```
FCP (First Contentful Paint) - Time until first content visible
LCP (Largest Contentful Paint) - Time until largest element visible
TTI (Time to Interactive) - Time until page is interactive

Target: FCP < 1.5s, LCP < 2.5s, TTI < 3s
```

### API Metrics

```
p50  = 50th percentile (median response time)
p95  = 95th percentile (slow requests)
p99  = 99th percentile (very slow requests)

Target: p95 < 200ms, p99 < 500ms
```

### Error Metrics

```
Error Rate = Failed requests / Total requests
Target: < 1% (< 0.01)
```

---

## Troubleshooting

### Tests Fail with "Connection Refused"

**Problem:** API or web server not running

**Solution:**
```bash
# Check if services are running
lsof -i :3000  # Web on port 3000
lsof -i :4000  # API on port 4000

# Start services if needed
cd apps/web && npm run dev  # Terminal 1
cd apps/api && npm run dev  # Terminal 2
```

### High Error Rate

**Problem:** Services can't handle load

**Check:**
1. API database connections
2. Web server resource limits
3. Network bandwidth
4. System RAM/CPU

**Solution:**
```bash
# Reduce load
k6 run --vus 50 --duration 2m tests/performance.k6.js

# Monitor system
watch -n 1 'ps aux | grep node'  # macOS/Linux
```

### Timeout Errors

**Problem:** Requests taking too long

**Solution:**
```typescript
// Increase timeout in test
import http from 'k6/http';

const params = {
  timeout: '30s',  // Increase from default 30s
};

http.get(`${BASE_URL}/`, params);
```

---

## Continuous Performance Testing

### CI/CD Integration

**Add to GitHub Actions:**
```yaml
- name: Run Performance Tests
  run: |
    npm run dev:api &
    npm run dev:web &
    sleep 5
    k6 run tests/performance.k6.js --out json=results.json
    
    # Check thresholds
    cat results.json | jq '.metrics | .http_req_duration'
```

### Scheduled Testing

```bash
# Run daily performance test
0 2 * * * cd /path/to/dshitxyz && \
  k6 run tests/performance.k6.js --out json=results-$(date +%Y%m%d).json
```

---

## Performance Optimization Tips

### Frontend

1. **Images:** Use responsive images with `<Image/>` component
2. **Code splitting:** Dynamic imports for large components
3. **Caching:** Leverage 1-year cache headers for static assets
4. **Fonts:** Preload critical fonts, defer non-critical

### API

1. **Database:** Add indexes on frequently queried columns
2. **Caching:** Cache responses for 24 hours where applicable
3. **Pagination:** Limit results to 50-100 items
4. **Compression:** Enable gzip/brotli for all responses

### Infrastructure

1. **CDN:** Serve static assets from CDN
2. **Caching:** Use Redis for hot data
3. **Monitoring:** Track slow queries and endpoints
4. **Scaling:** Horizontal scaling for load distribution

---

## References

- [k6 Documentation](https://k6.io/docs/)
- [k6 Performance Testing Best Practices](https://k6.io/docs/testing-guides/load-testing-best-practices/)
- [Web Vitals Explained](https://web.dev/vitals/)
- [Fastify Performance](https://www.fastify.io/docs/latest/Guides/Getting-Started/)

---

## Phase 5.8 Completion

✅ **Performance hardening strategy implemented**
✅ **Load testing framework configured**
✅ **Cache control headers configured**
✅ **Ready for production deployment**

**Next Steps:**
1. Deploy to Vercel (Session 15)
2. Configure CDN caching
3. Set up monitoring (Sentry, DataDog)
4. Run baseline tests and capture metrics

---

*Last Updated: Session 14*
*Phase 5.8 - Performance Hardening Complete*
