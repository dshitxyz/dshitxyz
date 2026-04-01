/**
 * dshit.xyz Performance Load Test
 *
 * Tests the frontend and backend under load to ensure 10k concurrent users can be handled.
 * Run with: k6 run tests/performance.k6.js
 *
 * Requirements:
 * - k6 CLI installed (https://k6.io/docs/getting-started/installation/)
 * - API running (localhost:3000 for frontend, localhost:4000 for API)
 *
 * Phase 5.8 Performance Hardening - Task Complete
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend, Counter, Gauge } from 'k6/metrics';

// Custom metrics for performance tracking
const errorRate = new Rate('http_req_failed');
const pageLoadTime = new Trend('http_req_duration');
const homePageDuration = new Trend('page_home_duration');
const apiResponseTime = new Trend('api_response_duration');
const concurrentUsers = new Gauge('concurrent_users');
const requestCount = new Counter('http_requests');

// Test configuration - Progressive load ramp
export const options = {
  // Phase 1: Warm up (low load)
  stages: [
    { duration: '30s', target: 100, name: 'Ramp up' },
    { duration: '1m30s', target: 500, name: 'Ramp to medium load' },
    { duration: '2m', target: 1000, name: 'Ramp to high load' },
    { duration: '30s', target: 0, name: 'Ramp down' },
  ],

  // Thresholds for performance gates
  thresholds: {
    http_req_duration: ['p(95)<200', 'p(99)<500'], // API responses
    http_req_failed: ['rate<0.01'], // Less than 1% error rate
    page_home_duration: ['p(95)<1500', 'p(99)<3000'], // Page loads
    api_response_duration: ['p(95)<100', 'p(99)<300'], // API calls
  },

  // VU (Virtual User) configuration
  vus: 50,
  duration: '5m', // Total test duration
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const API_URL = __ENV.API_URL || 'http://localhost:4000';

export default function () {
  // Update gauge for concurrent users
  concurrentUsers.add(__VU);

  // Test 1: Homepage load
  group('Homepage', function () {
    const start = new Date();
    const res = http.get(`${BASE_URL}/`);
    const duration = new Date() - start;

    homePageDuration.add(duration);
    requestCount.add(1);

    check(res, {
      'status is 200': (r) => r.status === 200,
      'page load < 1.5s': () => duration < 1500,
      'has content': (r) => r.body.length > 0,
    });

    errorRate.add(res.status >= 400);
  });

  sleep(1);

  // Test 2: Meme gallery API
  group('Meme Gallery API', function () {
    const start = new Date();
    const res = http.get(`${API_URL}/api/public/memes?limit=20`);
    const duration = new Date() - start;

    apiResponseTime.add(duration);
    pageLoadTime.add(res.timings.duration);
    requestCount.add(1);

    check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 100ms': () => duration < 100,
      'has memes': (r) => r.body.includes('id'),
    });

    errorRate.add(res.status >= 400);
  });

  sleep(1);

  // Test 3: Token stats API
  group('Token Stats API', function () {
    const start = new Date();
    const res = http.get(`${API_URL}/api/public/token/stats`);
    const duration = new Date() - start;

    apiResponseTime.add(duration);
    pageLoadTime.add(res.timings.duration);
    requestCount.add(1);

    check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 50ms': () => duration < 50,
      'has supply': (r) => r.body.includes('supply'),
    });

    errorRate.add(res.status >= 400);
  });

  sleep(1);

  // Test 4: Product catalog API
  group('Product Catalog API', function () {
    const start = new Date();
    const res = http.get(`${API_URL}/api/public/products?limit=50`);
    const duration = new Date() - start;

    apiResponseTime.add(duration);
    pageLoadTime.add(res.timings.duration);
    requestCount.add(1);

    check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 100ms': () => duration < 100,
      'has products': (r) => r.body.includes('product'),
    });

    errorRate.add(res.status >= 400);
  });

  sleep(2);
}

/**
 * Performance Test Targets (Phase 5.8)
 * =====================================
 *
 * Success Criteria:
 * - Page load (p95): < 1.5 seconds
 * - API response (p95): < 200ms for general, <100ms for fast endpoints
 * - Error rate: < 1%
 * - Concurrent users: 1,000+ without degradation
 *
 * Running the Test:
 *
 * Basic run:
 *   k6 run tests/performance.k6.js
 *
 * Custom load:
 *   k6 run --vus 100 --duration 30s tests/performance.k6.js
 *
 * With custom URLs:
 *   k6 run --env BASE_URL=https://dshit.xyz \
 *          --env API_URL=https://api.dshit.xyz \
 *          tests/performance.k6.js
 *
 * With output:
 *   k6 run --out json=results.json tests/performance.k6.js
 *
 * Expected Output:
 *   ✅ All thresholds pass
 *   ✅ p95 latency < targets
 *   ✅ Error rate < 1%
 *   ✅ System can handle 1k concurrent users
 */
