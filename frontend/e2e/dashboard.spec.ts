import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('access_token', 'fake-token-for-e2e');
      localStorage.setItem('refresh_token', 'fake-refresh-token');
    });
    await page.goto('/main/dashboard');
    await page.waitForLoadState('domcontentloaded');
  });

  test.afterEach(async ({ page }) => {
    try {
      await page.evaluate(() => localStorage.clear());
    } catch {
      // Ignore cleanup errors
    }
  });

  test('redirects to /main/dashboard when already logged in and visiting /', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/main\/dashboard/);
  });

  test('profile page renders correctly', async ({ page }) => {
    await page.goto('/main/profile');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();
    await expect(page.getByText('John Doe')).toBeVisible();
  });

  test('settings page renders correctly', async ({ page }) => {
    await page.goto('/main/settings');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Appearance' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();
  });

  test('main page redirects to dashboard', async ({ page }) => {
    await page.goto('/main');
    await expect(page).toHaveURL(/\/main\/dashboard/);
  });
});