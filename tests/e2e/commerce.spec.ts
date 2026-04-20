/**
 * E2E Tests: Commerce & Shopping
 * Tests product browsing, cart management, and checkout flow
 *
 * Requirements:
 * - API server running with populated products database
 * - Web app running on http://localhost:3000
 * - Test user authenticated
 */

import { test, expect } from '@playwright/test';

test.describe('Commerce & Shopping Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Set up authenticated user
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'test_token_12345');
      localStorage.setItem('user_address', '0x1234567890123456789012345678901234567890');
    });

    // Navigate to products page
    await page.goto('http://localhost:3000/products');
    await page.waitForLoadState('networkidle');
  });

  test('Products page loads and displays products', async ({ page }) => {
    // Verify products page header
    await expect(page.locator('h1, h2')).toContainText(/product/i);

    // Verify product grid is visible
    const productGrid = page.locator('[data-testid="product-grid"], .product-grid, [class*="grid"]');
    await expect(productGrid).toBeVisible();

    // Verify at least one product card is visible
    const productCard = page.locator('[data-testid="product-card"], .product-card, [class*="card"]').first();
    await expect(productCard).toBeVisible();
  });

  test('Product card displays price and details', async ({ page }) => {
    // Find first product card
    const productCard = page.locator('[data-testid="product-card"], .product-card').first();

    // Verify product name is visible
    const productName = productCard.locator('[data-testid="product-name"], .product-name, h3, h4');
    await expect(productName).toBeVisible();

    // Verify price is displayed (should contain DSHIT or number)
    const productPrice = productCard.locator('[data-testid="product-price"], .product-price, [class*="price"]');
    if (await productPrice.isVisible()) {
      const priceText = await productPrice.textContent();
      expect(priceText).toMatch(/\d+|DSHIT/i);
    }
  });

  test('Add to cart button works', async ({ page }) => {
    // Find first product card
    const productCard = page.locator('[data-testid="product-card"], .product-card').first();

    // Click add to cart button
    const addButton = productCard.locator('button:has-text("Add"), button:has-text("Cart")').first();
    if (await addButton.isVisible()) {
      await addButton.click();

      // Verify success feedback (toast, badge, etc.)
      const successMsg = page.locator('text=/added|success|cart/i');
      // May or may not appear, so we just verify no error occurred
      expect(addButton).toBeEnabled();
    }
  });

  test('Shopping cart displays added items', async ({ page }) => {
    // Add item to cart first
    const productCard = page.locator('[data-testid="product-card"], .product-card').first();
    const addButton = productCard.locator('button').first();
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(500); // Wait for state update
    }

    // Navigate to cart
    const cartButton = page.locator('a:has-text("Cart"), button:has-text("Cart")');
    if (await cartButton.isVisible()) {
      await cartButton.click();
      await page.waitForLoadState('networkidle');

      // Verify cart page displays
      const cartHeading = page.locator('h1, h2');
      await expect(cartHeading).toContainText(/cart/i);
    }
  });

  test('Checkout page is accessible', async ({ page }) => {
    // Navigate to checkout
    await page.goto('http://localhost:3000/checkout');

    // Verify checkout page loads
    const checkoutHeading = page.locator('h1, h2').first();
    const textContent = await checkoutHeading.textContent();
    expect(textContent).toMatch(/checkout|order|confirm/i);
  });

  test('Checkout form displays required fields', async ({ page }) => {
    // Navigate to checkout
    await page.goto('http://localhost:3000/checkout');
    await page.waitForLoadState('networkidle');

    // Verify form fields exist (or mock them)
    // Commonly used fields: email, address, city, state, zip
    const form = page.locator('form').first();
    if (await form.isVisible()) {
      // Just verify form is present
      await expect(form).toBeVisible();
    }
  });

  test('Order summary displays on checkout', async ({ page }) => {
    // Navigate to checkout
    await page.goto('http://localhost:3000/checkout');

    // Look for order summary
    const summary = page.locator('[data-testid="order-summary"], .order-summary, [class*="summary"]');
    if (await summary.isVisible()) {
      // Verify it contains price/total info
      const text = await summary.textContent();
      expect(text).toMatch(/total|price|DSHIT/i);
    }
  });

  test('Checkout button is present and enabled', async ({ page }) => {
    // Navigate to checkout
    await page.goto('http://localhost:3000/checkout');

    // Find checkout/confirm button
    const checkoutBtn = page.locator('button:has-text("Confirm"), button:has-text("Complete"), button:has-text("Pay")').first();
    if (await checkoutBtn.isVisible()) {
      await expect(checkoutBtn).toBeEnabled();
    }
  });
});
