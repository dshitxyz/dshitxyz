/**
 * k6 Load Testing Script for dshit.xyz
 *
 * Run with: k6 run load-test.js
 *
 * This script simulates realistic user traffic patterns and validates
 * that the platform can handle concurrent load without performance degradation.
 *
 * Test Configuration:
 * - Stage 1 (0-30s): Ramp up to 100 users
 * - Stage 2 (30-150s): Maintain 500 users (steady state)
 * - Stage 3 (150-180s): Spike to 1000 users (peak load)
 * - Stage 4 (180-240s): Cool down to 0 users
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Counter, Trend, Rate, Gauge } from 'k6/metrics';

// ==========================================
// Custom Metrics
// ==========================================

const requestCount = new Counter('requests_total');
const requestDuration = new Trend('request_duration_ms');
const requestFailureRate = new Rate('request_failure_rate');
const activeVUsers = new Gauge('active_vusers');

// ==========================================
// Test Configuration
// ==========================================

export const options = {
  stages: [
    // Stage 1: Ramp up to 100 users over 30 seconds
    { duration: '30s', target: 100, name: 'ramp-up' },

    // Stage 2: Steady state - 500 users for 2 minutes
    { duration: '2m', target: 500, name: 'steady-state' },

    // Stage 3: Peak load - 1000 users for 30 seconds
    { duration: '30s', target: 1000, name: 'peak-load' },

    // Stage 4: Cool down to 0 users
    { duration: '1m', target: 0, name: 'cool-down' },
  ],

  // Thresholds define pass/fail criteria
  thresholds: {
    // 95% of requests must complete within 500ms
    'http_req_duration': ['p(95)<500'],

    // 99% of requests must complete within 1 second
    'http_req_duration{staticAsset:true}': ['p(99)<1000'],

    // Error rate must be < 1%
    'http_req_failed': ['rate<0.01'],

    // Custom metrics thresholds
    'request_failure_rate': ['rate<0.01'],
  },

  // Define groups for metrics aggregation
  // metrics: {
  //   external: {
  //     thresholds: {
  //       'http_req_duration': ['p(95)<5000'],
  //     },
  //   },
  // },

  // Graceful stop - wait 10s before killing
  gracefulStop: '10s',

  // Ramp down
  rampDown: '10s',
};

// ==========================================
// Helper Functions
// ==========================================

function makeRequest(url, method = 'GET', body = null, headers = {}) {
  const params = {
    headers: {
      'User-Agent': 'k6-load-test',
      'Accept-Encoding': 'gzip, deflate',
      ...headers,
    },
    timeout: '30s',
  };

  let response;
  const startTime = Date.now();

  try {
    if (method === 'GET') {
      response = http.get(url, params);
    } else if (method === 'POST') {
      response = http.post(url, body, params);
    } else {
      response = http.request(method, url, body, params);
    }
  } catch (error) {
    console.error(`Request failed: ${error.message}`);
    return null;
  }

  const duration = Date.now() - startTime;

  // Record metrics
  requestCount.add(1);
  requestDuration.add(duration);
  activeVUsers.add(__VU);

  if (response.status >= 400) {
    requestFailureRate.add(true);
  } else {
    requestFailureRate.add(false);
  }

  return response;
}

function checkResponse(response, name) {
  return check(response, {
    [`${name} - status is 200/201`]: (r) => r.status === 200 || r.status === 201,
    [`${name} - response time < 500ms`]: (r) => r.timings.duration < 500,
    [`${name} - not error`]: (r) => r.status < 400,
  });
}

// ==========================================
// Test Scenarios
// ==========================================

export default function () {
  const baseUrl = __ENV.BASE_URL || 'https://dshitxyz.vercel.app';

  // Scenario distribution: 70% browsing, 20% API, 10% checkout
  const randomScenario = Math.random();

  if (randomScenario < 0.7) {
    browsingScenario(baseUrl);
  } else if (randomScenario < 0.9) {
    apiScenario(baseUrl);
  } else {
    checkoutScenario(baseUrl);
  }

  // Random think time between requests (1-3 seconds)
  sleep(1 + Math.random() * 2);
}

/**
 * Browsing Scenario (70% of traffic)
 * Simulates users browsing the platform
 */
function browsingScenario(baseUrl) {
  group('Homepage', () => {
    const res = makeRequest(`${baseUrl}/`);
    checkResponse(res, 'Homepage');
  });

  sleep(2);

  group('Dashboard', () => {
    const res = makeRequest(`${baseUrl}/dashboard`);
    checkResponse(res, 'Dashboard');
  });

  sleep(2);

  group('Gallery', () => {
    const res = makeRequest(`${baseUrl}/gallery`);
    checkResponse(res, 'Gallery');
  });

  sleep(2);

  group('Products', () => {
    const res = makeRequest(`${baseUrl}/products`);
    checkResponse(res, 'Products');
  });
}

/**
 * API Scenario (20% of traffic)
 * Simulates direct API calls for data
 */
function apiScenario(baseUrl) {
  group('API - Stats', () => {
    const res = makeRequest(`${baseUrl}/api/public/stats`);
    checkResponse(res, 'GET /api/public/stats');
  });

  sleep(1);

  group('API - Memes', () => {
    const page = Math.floor(Math.random() * 5) + 1;
    const res = makeRequest(`${baseUrl}/api/public/memes?page=${page}&sort=trending`);
    checkResponse(res, 'GET /api/public/memes');
  });

  sleep(1);

  group('API - Leaderboard', () => {
    const res = makeRequest(`${baseUrl}/api/public/leaderboard`);
    checkResponse(res, 'GET /api/public/leaderboard');
  });
}

/**
 * Checkout Scenario (10% of traffic)
 * Simulates users going through checkout process
 */
function checkoutScenario(baseUrl) {
  group('Checkout Flow', () => {
    // View checkout page
    const checkoutRes = makeRequest(`${baseUrl}/checkout`);
    checkResponse(checkoutRes, 'GET /checkout');

    sleep(2);

    // Simulate form submission
    const orderRes = makeRequest(`${baseUrl}/api/checkout`, 'POST', JSON.stringify({
      items: [
        { productId: 'product-1', quantity: 1 },
      ],
      shippingAddress: {
        address: '123 Main St',
        city: 'Anonymous',
        state: 'XX',
        zip: '00000',
      },
    }), {
      'Content-Type': 'application/json',
    });

    checkResponse(orderRes, 'POST /api/checkout');
  });
}

// ==========================================
// Teardown (Optional)
// ==========================================

export function teardown(data) {
  console.log('Load test completed!');
  console.log(`Total requests: ${requestCount.value}`);
  console.log(`Average request duration: ${requestDuration.value}ms`);
  console.log(`Failure rate: ${requestFailureRate.value * 100}%`);
}

// ==========================================
// Usage
// ==========================================
/*

# Run the load test:
k6 run scripts/load-test.js

# Run against different environment:
k6 run -e BASE_URL=http://localhost:3000 scripts/load-test.js

# Run with output to file:
k6 run scripts/load-test.js --out json=results.json

# View real-time metrics:
k6 run scripts/load-test.js --duration 5m --vus 100

*/
