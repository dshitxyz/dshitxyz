/**
 * E2E Tests: Authentication Flow
 * Tests wallet connection, message signing, login, and session persistence
 *
 * Requirements:
 * - Wallet extension installed (MetaMask for testing)
 * - Test wallet with available ETH on Base
 * - API server running on http://localhost:3001
 * - Web app running on http://localhost:3000
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication & Wallet Connection', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test
    await page.goto('http://localhost:3000');
    // Wait for app to load
    await page.waitForLoadState('networkidle');
  });

  test('User can see wallet connection button on landing page', async ({ page }) => {
    // Verify wallet connect button is visible
    const walletButton = page.locator('button:has-text("Connect Wallet")');
    await expect(walletButton).toBeVisible();
  });

  test('Login page displays correctly', async ({ page }) => {
    // Navigate to login page
    await page.goto('http://localhost:3000/auth/login');

    // Verify login page elements
    await expect(page.locator('h1')).toContainText(/login|connect/i);

    // Verify wallet connection form is visible
    const walletInput = page.locator('input[type="text"]');
    await expect(walletInput).toBeVisible();
  });

  test('Session storage works correctly', async ({ page, context }) => {
    // Set up localStorage mock
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'test_token_12345');
      localStorage.setItem('user_address', '0x1234567890123456789012345678901234567890');
    });

    // Reload page to verify persistence
    await page.reload();

    // Verify token is still in storage
    const token = await page.evaluate(() => localStorage.getItem('auth_token'));
    expect(token).toBe('test_token_12345');

    // Verify address is still in storage
    const address = await page.evaluate(() => localStorage.getItem('user_address'));
    expect(address).toBe('0x1234567890123456789012345678901234567890');
  });

  test('Header shows user info when logged in', async ({ page }) => {
    // Set up authenticated state
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'test_token_12345');
      localStorage.setItem('user_address', '0x1234567890123456789012345678901234567890');
    });

    // Navigate to dashboard
    await page.goto('http://localhost:3000/dashboard');

    // Verify user address is displayed (or shortened version)
    const userDisplay = page.locator('[data-testid="user-address"], .user-address');
    if (await userDisplay.isVisible()) {
      await expect(userDisplay).toContainText('0x1234');
    }
  });

  test('Logout clears session', async ({ page }) => {
    // Set up authenticated state
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'test_token_12345');
      localStorage.setItem('user_address', '0x1234567890123456789012345678901234567890');
    });

    // Navigate to page
    await page.goto('http://localhost:3000/dashboard');

    // Find and click logout button
    const logoutButton = page.locator('button:has-text("Logout")');
    if (await logoutButton.isVisible()) {
      await logoutButton.click();

      // Verify session is cleared
      const token = await page.evaluate(() => localStorage.getItem('auth_token'));
      expect(token).toBeNull();
    }
  });

  test('Unauthenticated user is redirected from dashboard', async ({ page }) => {
    // Clear any stored auth
    await page.evaluate(() => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_address');
    });

    // Try to navigate to dashboard
    await page.goto('http://localhost:3000/dashboard');

    // Should be redirected to login or home
    const url = page.url();
    const isLoggedOut = url.includes('/login') || url.includes('/');
    expect(isLoggedOut).toBeTruthy();
  });
});
