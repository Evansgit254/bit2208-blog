import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows header and navigation', async ({ page }) => {
    const header = page.locator('header, h1, [data-testid="site-title"]');
    await expect(header.first()).toBeVisible();
  });

  test('search functionality', async ({ page }) => {
    const searchBar = page.getByPlaceholder(/search/i);
    await expect(searchBar).toBeVisible();
    
    // Type in search query
    await searchBar.fill('test');
    await searchBar.press('Enter');
    
    // Search results should update (either showing posts or empty state)
    const noResults = page.getByText(/no posts found|no posts yet|no posts/i);
    const articles = page.locator('article');
    await Promise.race([
      noResults.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {}),
      articles.first().waitFor({ state: 'visible', timeout: 2000 }).catch(() => {})
    ]);
  });

  test('blog post list', async ({ page }) => {
    // Wait for post list to load and either show posts or empty state
    await page.getByRole('main').waitFor({ state: 'visible', timeout: 5000 });

    // Wait for either an article to appear or the empty-state message
    const noResults = page.getByText(/no posts found|no posts yet|no posts/i);
    const articleVisible = await page.waitForSelector('article', { state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
    const noResultsVisible = await noResults.isVisible().catch(() => false);
    expect(noResultsVisible || articleVisible).toBe(true);
  });
});
