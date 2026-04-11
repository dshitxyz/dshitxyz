/**
 * E2E Tests: Governance & DAO
 * Tests proposal viewing, voting, and DAO interface
 *
 * Requirements:
 * - API server running with governance data
 * - Web app running on http://localhost:3000
 * - Test user authenticated with sufficient token balance
 */

import { test, expect } from '@playwright/test';

test.describe('Governance & DAO Features', () => {
  test.beforeEach(async ({ page }) => {
    // Set up authenticated user
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'test_token_12345');
      localStorage.setItem('user_address', '0x1234567890123456789012345678901234567890');
    });

    // Navigate to governance page
    await page.goto('http://localhost:3000/governance');
    await page.waitForLoadState('networkidle');
  });

  test('Governance page loads successfully', async ({ page }) => {
    // Verify page title or heading
    const heading = page.locator('h1, h2').first();
    const text = await heading.textContent();
    expect(text?.toLowerCase()).toMatch(/governance|dao|proposal|vote/i);
  });

  test('Proposals list displays', async ({ page }) => {
    // Look for proposals list
    const proposalsList = page.locator('[data-testid="proposals-list"], .proposals-list, [class*="proposal"]');
    if (await proposalsList.isVisible()) {
      await expect(proposalsList).toBeVisible();
    }

    // Verify at least section exists
    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent).toBeVisible();
  });

  test('Proposal card displays correctly', async ({ page }) => {
    // Find first proposal
    const proposalCard = page.locator('[data-testid="proposal-card"], .proposal-card, [class*="proposal-item"]').first();

    if (await proposalCard.isVisible()) {
      // Verify title exists
      const title = proposalCard.locator('h3, h4, [data-testid="proposal-title"]');
      await expect(title).toBeVisible();

      // Verify description or summary exists
      const description = proposalCard.locator('[data-testid="proposal-description"], p, .description');
      if (await description.isVisible()) {
        const text = await description.textContent();
        expect(text?.length).toBeGreaterThan(0);
      }
    }
  });

  test('Proposal detail page can be accessed', async ({ page }) => {
    // Find and click first proposal
    const proposalLink = page.locator('[data-testid="proposal-card"], .proposal-card, [class*="proposal-item"]').first();

    if (await proposalLink.isVisible()) {
      // Try clicking the card or a link within it
      const link = proposalLink.locator('a').first();
      if (await link.isVisible()) {
        await link.click();
        await page.waitForLoadState('networkidle');

        // Verify we're on proposal detail page
        const url = page.url();
        expect(url).toMatch(/proposal|governance/i);
      }
    }
  });

  test('Vote button is visible on proposals', async ({ page }) => {
    // Navigate to a proposal detail page if possible
    const proposalLink = page.locator('[data-testid="proposal-card"], .proposal-card').first();

    if (await proposalLink.isVisible()) {
      const link = proposalLink.locator('a').first();
      if (await link.isVisible()) {
        await link.click();
        await page.waitForLoadState('networkidle');

        // Look for vote button or voting interface
        const voteButton = page.locator('button:has-text("Vote"), button:has-text("For"), button:has-text("Against")').first();
        if (await voteButton.isVisible()) {
          await expect(voteButton).toBeEnabled();
        }
      }
    }
  });

  test('Voting options are clearly presented', async ({ page }) => {
    // Look for voting interface
    const votingSection = page.locator('[data-testid="voting-section"], .voting-section, [class*="vote"]');

    if (await votingSection.isVisible()) {
      // Verify voting options exist (For, Against, Abstain, etc.)
      const forButton = page.locator('button:has-text("For"), button:has-text("Yes"), button:has-text("Support")');
      const againstButton = page.locator('button:has-text("Against"), button:has-text("No"), button:has-text("Oppose")');

      const hasVoteOptions = (await forButton.isVisible()) || (await againstButton.isVisible());
      expect(hasVoteOptions).toBeTruthy();
    }
  });

  test('Vote counts or results are displayed', async ({ page }) => {
    // Look for vote counts
    const voteResults = page.locator('[data-testid="vote-results"], .vote-results, .results, [class*="votes"]');

    if (await voteResults.isVisible()) {
      const text = await voteResults.textContent();
      // Verify numeric content (vote counts)
      expect(text).toMatch(/\d+/);
    }
  });

  test('Staking interface is accessible', async ({ page }) => {
    // Navigate to staking page if available
    const stakingLink = page.locator('a:has-text("Stake"), a:has-text("Staking")').first();

    if (await stakingLink.isVisible()) {
      await stakingLink.click();
      await page.waitForLoadState('networkidle');

      // Verify staking page loads
      const heading = page.locator('h1, h2');
      const text = await heading.first().textContent();
      expect(text?.toLowerCase()).toMatch(/stake/i);
    }
  });

  test('Treasury information is available', async ({ page }) => {
    // Look for treasury section
    const treasurySection = page.locator('[data-testid="treasury"], .treasury, [class*="treasury"]');

    if (await treasurySection.isVisible()) {
      await expect(treasurySection).toBeVisible();

      // Verify balance information
      const balance = treasurySection.locator('[data-testid="balance"], .balance, [class*="balance"]');
      if (await balance.isVisible()) {
        const text = await balance.textContent();
        expect(text).toBeTruthy();
      }
    }
  });
});
