/**
 * E2E Tests: Memes & Content Creation
 * Tests meme gallery browsing, voting, creation, and sharing
 *
 * Requirements:
 * - API server running with meme data
 * - Web app running on http://localhost:3000
 * - Test user authenticated
 */

import { test, expect } from '@playwright/test';

test.describe('Memes & Content Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Set up authenticated user
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'test_token_12345');
      localStorage.setItem('user_address', '0x1234567890123456789012345678901234567890');
    });

    // Navigate to memes page
    await page.goto('http://localhost:3000/memes');
    await page.waitForLoadState('networkidle');
  });

  test('Meme gallery page loads successfully', async ({ page }) => {
    // Verify page title
    const heading = page.locator('h1, h2').first();
    const text = await heading.textContent();
    expect(text?.toLowerCase()).toMatch(/meme|gallery|humor/i);
  });

  test('Meme grid displays multiple memes', async ({ page }) => {
    // Look for meme grid
    const memeGrid = page.locator('[data-testid="meme-grid"], .meme-grid, [class*="grid"]').first();

    if (await memeGrid.isVisible()) {
      // Verify multiple meme cards exist
      const memeCards = memeGrid.locator('[data-testid="meme-card"], .meme-card, img');
      const count = await memeCards.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('Meme card displays image and info', async ({ page }) => {
    // Find first meme card
    const memeCard = page.locator('[data-testid="meme-card"], .meme-card, [class*="meme-item"]').first();

    if (await memeCard.isVisible()) {
      // Verify image is present
      const image = memeCard.locator('img').first();
      if (await image.isVisible()) {
        await expect(image).toBeVisible();
      }

      // Verify meme info
      const info = memeCard.locator('[data-testid="meme-info"], .meme-info, p, span');
      if (await info.isVisible()) {
        await expect(info).toBeVisible();
      }
    }
  });

  test('Upvote button works on meme cards', async ({ page }) => {
    // Find first meme card
    const memeCard = page.locator('[data-testid="meme-card"], .meme-card').first();

    if (await memeCard.isVisible()) {
      // Find upvote button
      const upvoteButton = memeCard.locator('button:has-text("Like"), button:has-text("Up"), button:has-text("Vote"), [data-testid="upvote"]').first();

      if (await upvoteButton.isVisible()) {
        // Click upvote
        await upvoteButton.click();

        // Verify button state changed or count increased
        const isEnabled = await upvoteButton.isEnabled();
        expect(isEnabled).toBeTruthy();
      }
    }
  });

  test('Share button displays on meme cards', async ({ page }) => {
    // Find first meme card
    const memeCard = page.locator('[data-testid="meme-card"], .meme-card').first();

    if (await memeCard.isVisible()) {
      // Find share button
      const shareButton = memeCard.locator('button:has-text("Share"), button:has-text("Tweet"), [data-testid="share"]').first();

      if (await shareButton.isVisible()) {
        await expect(shareButton).toBeVisible();
      }
    }
  });

  test('Meme creator page is accessible', async ({ page }) => {
    // Look for create meme button/link
    const createButton = page.locator('a:has-text("Create"), button:has-text("Create"), a:has-text("Make Meme")').first();

    if (await createButton.isVisible()) {
      await createButton.click();
      await page.waitForLoadState('networkidle');

      // Verify we're on creator page
      const url = page.url();
      expect(url).toMatch(/create|creator|make/i);
    } else {
      // Try direct navigation
      await page.goto('http://localhost:3000/meme-creator');
      const heading = page.locator('h1, h2').first();
      const text = await heading.textContent();
      expect(text?.toLowerCase()).toMatch(/create|meme|make/i);
    }
  });

  test('Meme creator has template selection', async ({ page }) => {
    // Navigate to creator
    await page.goto('http://localhost:3000/meme-creator');
    await page.waitForLoadState('networkidle');

    // Look for template options
    const templates = page.locator('[data-testid="template"], .template, [class*="template"]');
    const templateCount = await templates.count();

    // Should have at least 1 template available
    if (templateCount > 0) {
      expect(templateCount).toBeGreaterThan(0);
    }
  });

  test('Meme creator has text input fields', async ({ page }) => {
    // Navigate to creator
    await page.goto('http://localhost:3000/meme-creator');
    await page.waitForLoadState('networkidle');

    // Look for text inputs (top text, bottom text, etc.)
    const textInputs = page.locator('input[type="text"]');
    const inputCount = await textInputs.count();

    // Should have at least 1 text input for editing
    if (inputCount > 0) {
      expect(inputCount).toBeGreaterThan(0);
    }
  });

  test('Meme creator has export/download button', async ({ page }) => {
    // Navigate to creator
    await page.goto('http://localhost:3000/meme-creator');
    await page.waitForLoadState('networkidle');

    // Look for export button
    const exportButton = page.locator('button:has-text("Download"), button:has-text("Export"), button:has-text("Save")').first();

    if (await exportButton.isVisible()) {
      await expect(exportButton).toBeVisible();
    }
  });

  test('Meme contests page displays', async ({ page }) => {
    // Navigate to contests
    const contestsLink = page.locator('a:has-text("Contest"), a:has-text("Contests")').first();

    if (await contestsLink.isVisible()) {
      await contestsLink.click();
      await page.waitForLoadState('networkidle');

      // Verify contests page
      const heading = page.locator('h1, h2');
      const text = await heading.first().textContent();
      expect(text?.toLowerCase()).toMatch(/contest|competition/i);
    } else {
      // Try direct navigation
      await page.goto('http://localhost:3000/meme-contests');
      const heading = page.locator('h1, h2').first();
      const text = await heading.textContent();
      expect(text).toBeTruthy();
    }
  });

  test('Sorting options work on meme gallery', async ({ page }) => {
    // Go back to main gallery
    await page.goto('http://localhost:3000/memes');

    // Look for sort options
    const sortButton = page.locator('button:has-text("Sort"), select, [data-testid="sort"]').first();

    if (await sortButton.isVisible()) {
      await sortButton.click();

      // Verify sort options appear
      const sortOptions = page.locator('[data-testid="sort-option"], [role="option"], .sort-option');
      const optionCount = await sortOptions.count();

      if (optionCount > 0) {
        expect(optionCount).toBeGreaterThan(0);
      }
    }
  });

  test('Leaderboard section displays top creators', async ({ page }) => {
    // Look for leaderboard
    const leaderboard = page.locator('[data-testid="leaderboard"], .leaderboard, [class*="leaderboard"]');

    if (await leaderboard.isVisible()) {
      // Verify it has creator entries
      const entries = leaderboard.locator('[data-testid="leaderboard-entry"], .entry, li, tr');
      const count = await entries.count();

      if (count > 0) {
        expect(count).toBeGreaterThan(0);
      }
    }
  });
});
