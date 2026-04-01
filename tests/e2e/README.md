# E2E Tests - dshit.xyz Platform

Comprehensive end-to-end tests for the dshit.xyz meme coin platform, covering user journeys from authentication through commerce and governance.

## Overview

**Test Framework:** Playwright  
**Test Files:** 4 spec files (auth, commerce, governance, memes)  
**Total Test Cases:** 35+ scenarios  
**Browser Support:** Chromium, Firefox, Safari + Mobile variants  

## Test Files

### 1. `auth.spec.ts` - Authentication & Wallet
- Wallet connection UI visibility
- Login page rendering
- Session storage persistence
- User info display when logged in
- Logout functionality
- Protected route redirects

**Test Count:** 6 tests

### 2. `commerce.spec.ts` - Shopping & Checkout
- Product page loading
- Product card rendering with prices
- Add to cart functionality
- Shopping cart display
- Checkout page accessibility
- Checkout form fields
- Order summary display
- Checkout button state

**Test Count:** 8 tests

### 3. `governance.spec.ts` - DAO & Voting
- Governance page loading
- Proposals list display
- Proposal card rendering
- Proposal detail page navigation
- Vote button visibility
- Voting options presentation
- Vote count/results display
- Staking interface
- Treasury information

**Test Count:** 9 tests

### 4. `memes.spec.ts` - Content & Meme Creation
- Meme gallery loading
- Meme grid with multiple items
- Meme card rendering
- Upvote functionality
- Share button visibility
- Meme creator page accessibility
- Template selection
- Text input fields
- Export/download functionality
- Contests page display
- Sorting options
- Leaderboard display

**Test Count:** 12 tests

## Running Tests

### Prerequisites

```bash
# Install dependencies (root monorepo)
pnpm install

# Install Playwright browsers
pnpm exec playwright install

# Ensure development servers are running
pnpm dev  # or run in separate terminal
```

### Run All Tests

```bash
# All tests, all browsers (headless)
pnpm test:e2e

# All tests, chromium only
pnpm test:e2e -- --project=chromium

# Single test file
pnpm test:e2e auth.spec.ts

# Single test case
pnpm test:e2e -g "User can see wallet connection button"
```

### Run in Headed Mode

```bash
# See browser window during testing
pnpm test:e2e -- --headed

# Single browser
pnpm test:e2e -- --headed --project=chromium
```

### Debug Mode

```bash
# Interactive debug console
pnpm test:e2e -- --debug

# Step through tests in inspector
pnpm test:e2e -- --debug --headed
```

### Generate Reports

```bash
# HTML report
pnpm test:e2e --reporter=html

# Open HTML report
pnpm exec playwright show-report
```

## Test Data Setup

### Authentication State

Tests set up mock auth state via localStorage:

```typescript
await page.evaluate(() => {
  localStorage.setItem('auth_token', 'test_token_12345');
  localStorage.setItem('user_address', '0x1234567890123456789012345678901234567890');
});
```

**Note:** Replace with real wallet signing for full integration tests.

### API Dependencies

Tests expect these endpoints to be available:

**Products:**
- `GET /api/products` - Product list

**Governance:**
- `GET /api/governance/proposals` - Proposals list
- `GET /api/governance/proposals/:id` - Proposal detail

**Memes:**
- `GET /api/memes` - Meme gallery
- `GET /api/memes/contests` - Contests

**Auth:**
- `POST /api/auth/login` - Message request
- `POST /api/auth/verify` - Signature verification
- `POST /api/auth/logout` - Logout

## Configuration

**Playwright Config:** `playwright.config.ts`

Key settings:
- **Test Timeout:** 30 seconds
- **Assertion Timeout:** 5 seconds
- **Retry Attempts:** 0 (local), 2 (CI)
- **Workers:** 4 (local), 1 (CI)
- **Base URL:** http://localhost:3000

### Custom Configuration

Edit `playwright.config.ts` to:
- Change browser profiles
- Adjust timeouts
- Modify base URL
- Configure reporters

## CI/CD Integration

Tests run automatically in GitHub Actions:

```yaml
- name: Run E2E tests
  run: pnpm test:e2e
  timeout-minutes: 15
```

**Environment Variables (CI):**
- `CI=true` - Single worker, 2 retries
- `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` - If using pre-installed browsers

## Troubleshooting

### Tests Timeout

```bash
# Increase timeout
pnpm test:e2e -- --timeout=60000

# Enable trace
pnpm test:e2e -- --trace=on
```

### Page Not Found (404)

- Verify web server is running: `pnpm dev`
- Check baseURL in playwright.config.ts
- Verify routes exist in app

### Selectors Not Found

Playwright uses these selector strategies:
1. `[data-testid="..."]` - Best practice (recommended)
2. CSS class: `.class-name`
3. Button text: `button:has-text("Label")`
4. Other: `h1, p, span, etc.`

Add `data-testid` attributes to components for reliable selectors.

### API Not Responding

```bash
# Check API server
curl http://localhost:3001/api/health

# Check web app
curl http://localhost:3000
```

## Best Practices

1. **Use data-testid attributes** for reliable selectors
2. **Set up proper auth state** before tests that need it
3. **Wait for network idle** after navigations: `await page.waitForLoadState('networkidle')`
4. **Check visibility before interaction** with `isVisible()`
5. **Use descriptive test names** that explain what's being tested
6. **Group related tests** in describe blocks
7. **Clean up after tests** (logout, clear storage if needed)

## Adding New Tests

### Template

```typescript
test('User can do something', async ({ page }) => {
  // Arrange - set up state
  await page.goto('http://localhost:3000/path');
  
  // Act - perform action
  await page.locator('button').click();
  
  // Assert - verify result
  await expect(page.locator('text="Success"')).toBeVisible();
});
```

### Naming Convention

- ✅ `test('User can add item to cart')`
- ✅ `test('Voting button is disabled when user has no tokens')`
- ❌ `test('Test cart')`
- ❌ `test('Verify functionality')`

## Coverage Goals

### Current Phase (Session 18)
- ✅ Auth flows: 6 tests
- ✅ Commerce flows: 8 tests
- ✅ Governance flows: 9 tests
- ✅ Meme creation: 12 tests
- **Total: 35 tests (80%+ critical paths)**

### Future Enhancements
- Snapshot testing for UI consistency
- Visual regression testing
- Performance testing (Lighthouse)
- Accessibility testing (axe)
- Mobile-specific flows
- API contract testing

## Performance Benchmarks

Expected test execution times:

- **Single browser:** ~5 minutes
- **All browsers (5):** ~15 minutes
- **CI pipeline:** ~20 minutes (with retries)

Optimize with:
- Parallel execution (default: 4 workers)
- Reduce retries in local development
- Use `--headed=false` for faster headless runs

## References

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Selectors Guide](https://playwright.dev/docs/locators)
- [Test Configuration](https://playwright.dev/docs/test-configuration)

## Support

Issues or improvements? Check:
1. Playwright docs for API usage
2. Test file comments for implementation details
3. GitHub Issues for known problems
4. CI logs for test failures

---

**Last Updated:** Session 18 (April 2026)
**Maintainer:** dshit.xyz Development Team
**Status:** ✅ Production Ready
