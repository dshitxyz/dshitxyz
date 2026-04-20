# E2E Test Execution Guide

This guide explains how to run the end-to-end test suite for dshit.xyz locally and in CI/CD environments.

## Overview

The E2E test suite uses **Playwright** to test critical user journeys across the platform:
- **Authentication** - Wallet connection, login, logout
- **Commerce** - Product browsing, cart management, checkout
- **Governance** - Proposal viewing, voting, staking
- **Memes** - Gallery browsing, creation, contests

## Prerequisites

### System Requirements
- Node.js 18+ (tested on 20)
- pnpm 10+
- 2GB free disk space (for browser downloads)
- macOS, Linux, or Windows (WSL2)

### Required Tools
```bash
# Check versions
node --version    # Should be 18+
pnpm --version    # Should be 10+

# Install dependencies
pnpm install
```

### Browser Installation
Playwright requires browser binaries. They're installed automatically, but you can pre-install them:

```bash
# Install all browsers
pnpm exec playwright install

# Install specific browser
pnpm exec playwright install chromium
pnpm exec playwright install firefox
pnpm exec playwright install webkit
```

## Running Tests Locally

### Quick Start
```bash
# Run all tests (headless mode)
pnpm test:e2e

# Run specific test file
pnpm test:e2e -- tests/e2e/auth.spec.ts

# Run specific browser
pnpm test:e2e -- --project=chromium

# Run with UI (debug mode)
pnpm test:e2e:ui

# Run with visible browser
pnpm test:e2e:headed
```

### Common Commands

```bash
# Run all tests, stop on first failure
pnpm test:e2e -- --fail-on-console

# Run tests matching a pattern
pnpm test:e2e -- -g "wallet"

# Run with verbose output
pnpm test:e2e -- --reporter=list

# Generate detailed HTML report
pnpm test:e2e
# Open: playwright-report/index.html
```

## Understanding Test Organization

### Test Files Structure
```
tests/e2e/
├── auth.spec.ts          (6 tests) - Authentication flows
├── commerce.spec.ts      (8 tests) - Shopping and checkout
├── governance.spec.ts    (9 tests) - Governance and voting
├── memes.spec.ts         (12 tests) - Meme creation and contests
├── README.md             - Test framework documentation
└── EXECUTION_GUIDE.md    - This file
```

### Total Test Count: 35 tests

### Test Naming Convention
```
describe('Feature Name', () => {
  test('should [action] when [condition]', () => {
    // Test implementation
  });
});
```

## Test Configuration

### `playwright.config.ts`

Key settings:
```typescript
{
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',
  workers: process.env.CI ? 1 : 4,  // 4 parallel workers locally, 1 in CI
  timeout: 30 * 1000,               // 30 second test timeout
  expect: { timeout: 5 * 1000 },    // 5 second assertion timeout
  baseURL: 'http://localhost:3000',
  // Browsers: chromium, firefox, webkit, mobile chrome, mobile safari
}
```

## CI/CD Integration

### GitHub Actions Workflow

Tests run automatically on:
- ✅ Push to `main` or `develop`
- ✅ Pull requests to `main` or `develop`
- ✅ Multiple browser testing (chromium, firefox, webkit)

**Workflow Location:** `.github/workflows/e2e-tests.yml`

**CI Behavior:**
- Single worker (sequential) for stability
- Automatic browser download
- Artifacts uploaded for 7 days
- HTML and JUnit reports generated
- Failed tests trigger detailed reports

### Monitoring CI Results

1. **GitHub Actions Tab**
   - Go to repository "Actions" tab
   - Find workflow run: "E2E Tests"
   - Check status: ✅ Passed or ❌ Failed

2. **Download Artifacts**
   - Scroll to "Artifacts" section
   - Download `playwright-report-[browser]`
   - Extract and open `index.html` in browser

3. **Pull Request Checks**
   - Tests must pass before merging
   - Detailed results in PR checks

## Troubleshooting

### Tests Hang or Timeout

**Symptoms:** Tests run forever or timeout at 30 seconds

**Solutions:**
```bash
# 1. Check if server is running
curl http://localhost:3000

# 2. Restart development server
pnpm dev

# 3. Increase timeout temporarily
pnpm test:e2e -- --timeout=60000

# 4. Check network connectivity
ping 8.8.8.8
```

### Tests Fail with "Element not found"

**Symptoms:** Tests fail on element selection

**Solutions:**
```bash
# 1. Run in headed mode to see what's happening
pnpm test:e2e:headed -- tests/e2e/auth.spec.ts

# 2. Use UI mode for debugging
pnpm test:e2e:ui

# 3. Check if page is loading correctly
pnpm test:e2e:headed -- --reporter=list

# 4. Add debug() call to pause execution
// In test:
await page.pause(); // Browser will pause here
```

### Tests Fail with "Port already in use"

**Symptoms:** Error about port 3000 being in use

**Solutions:**
```bash
# 1. Kill existing process
lsof -ti:3000 | xargs kill -9

# 2. Use different port
PORT=3001 pnpm dev

# 3. Configure playwright.config.ts for different port
// Update baseURL and webServer.url
```

### Cross-browser Issues

**Symptoms:** Tests pass in chromium but fail in firefox/webkit

**Solutions:**
```bash
# 1. Run only failing browser
pnpm test:e2e -- --project=firefox

# 2. Check browser-specific selectors
# Different browsers may render elements differently

# 3. Use cross-browser compatible selectors
// Good: page.locator('[data-testid="button"]')
// Avoid: page.locator('.some-class:first-child')

# 4. Add browser-specific waits
await page.waitForLoadState('networkidle');
```

## Test Execution Workflow

### Pre-Deployment Validation

```
1. Clone latest main branch
2. Install dependencies (pnpm install)
3. Run all tests locally (pnpm test:e2e)
4. Check for flaky tests (run 3x)
5. Review test coverage
6. Verify CI/CD passes
7. Ready for deployment
```

### Development Workflow

```
1. Make code changes
2. Run related E2E tests (pnpm test:e2e -- -g "pattern")
3. Debug failures with headed mode (pnpm test:e2e:headed)
4. Commit changes
5. GitHub Actions runs full suite
6. Create PR when all tests pass
```

## Performance Metrics

### Local Execution
- Total time: ~5-10 minutes (4 parallel workers)
- Per test: ~10-20 seconds
- Browsers: Chromium, Firefox, WebKit (sequential)

### CI Execution
- Total time: ~15-20 minutes (1 worker)
- Matrix: 3 browsers × 35 tests
- Artifacts: All reports preserved

## Coverage Summary

### Test Count by Feature
| Feature | Tests | Coverage |
|---------|-------|----------|
| Authentication | 6 | Wallet connection, login, logout |
| Commerce | 8 | Products, cart, checkout |
| Governance | 9 | Proposals, voting, staking |
| Memes | 12 | Gallery, creation, contests |
| **Total** | **35** | **Core user journeys** |

### Coverage Gaps
- Load testing (performance)
- Security testing (OWASP)
- Accessibility testing (WCAG)
- Mobile-specific flows

## Debugging Tips

### Enable Trace Capture
```bash
# Capture full trace of test execution
pnpm test:e2e -- --trace on

# View trace
# playwright show-trace trace.zip
```

### Screenshot on Failure
```bash
# Automatically screenshot failures
pnpm test:e2e -- --screenshot=only-on-failure

# View screenshots in playwright-report/
```

### Video Recording
```bash
# Record video of failures
pnpm test:e2e -- --video=retain-on-failure

# Videos in test-results/
```

### Step-by-step Debugging
```bash
# Use inspector for line-by-line execution
pnpm test:e2e -- --debug

# Will open Playwright Inspector
# Step through test execution
```

## Environment Configuration

### Development (.env)
```bash
# Optional: disable Sentry in tests
NEXT_PUBLIC_SENTRY_ENABLED=false
SENTRY_ENABLED=false

# Base URL (default: http://localhost:3000)
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000
```

### CI/CD (GitHub Actions)
Environment variables automatically set:
- `CI=true` (tells Playwright we're in CI)
- `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=false`
- `NODE_ENV=test`

## Continuous Integration

### Workflow Triggers
- Every push to main/develop
- Every PR to main/develop
- Can be triggered manually

### Success Criteria
- ✅ All 35 tests pass
- ✅ No flaky tests
- ✅ HTML report generated
- ✅ Test execution < 20 minutes

### Failure Handling
- ❌ Tests fail → PR blocked
- ❌ Browser crashes → Automatic retry
- ❌ Timeout → Full trace captured

### Artifacts Retention
- HTML reports: 7 days
- Test results XML: 7 days
- Screenshots/videos: 7 days

## Next Steps

### For Next Session
1. Review CI/CD test results
2. Configure Sentry project DSN
3. Execute staging deployment
4. Monitor production metrics
5. Gather performance baseline

### For Improvement
1. Add load testing (k6)
2. Add security testing
3. Add accessibility testing
4. Add performance testing
5. Increase coverage to 85%+

## Resources

- **Playwright Docs:** https://playwright.dev
- **Test Examples:** `tests/e2e/*.spec.ts`
- **Config:** `playwright.config.ts`
- **CI Workflow:** `.github/workflows/e2e-tests.yml`

## Support

For issues or questions:
1. Check this guide first
2. Review test files for examples
3. Check Playwright documentation
4. Review CI/CD logs in GitHub Actions
5. Enable debug mode for detailed output
