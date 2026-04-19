import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('playwright is working', () => {
    expect(true).toBe(true);
  });

  test('test configuration is valid', async ({ browser }) => {
    expect(browser).toBeTruthy();
  });
});
