import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('page has main content', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/dshit/i);
  });
});
