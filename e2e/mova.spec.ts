import { test, expect } from '@playwright/test';

test.describe('MOVA Complete Platform E2E & QA Verification', () => {

  // 1. PUBLIC PAGES VERIFICATION
  test('1. Public Pages: Home, Explore, Categories, Detail, and Claim', async ({ page }) => {
    // Homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/MOVA/);
    await expect(page.locator('h1')).toBeVisible();

    // Navigation to Explore
    await page.goto('/explore');
    await expect(page).toHaveTitle(/Explore/i);
    await expect(page.locator('input[placeholder*="Search"]').first()).toBeVisible();

    // Navigation to Categories
    await page.goto('/categories');
    await expect(page).toHaveTitle(/Categories/i);
    await expect(page.locator('text=Artists & Musicians').first()).toBeVisible();

    // Person Detail Page (Aiko Nakamura)
    await page.goto('/people/aiko-nakamura');
    await expect(page.locator('h1')).toContainText('Aiko Nakamura');
    await expect(page.locator('text=Jazz Pianist & Composer').first()).toBeVisible();
    await expect(page.locator('text=Verified').first()).toBeVisible();

    // Test timeline tab on person page
    await page.click('button:has-text("Career Timeline")');
    await expect(page.locator('text=Tokyo University of the Arts')).toBeVisible();

    // Test save bookmark toast
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=saved to your collection')).toBeVisible();

    // Claim Page
    await page.goto('/claim');
    await expect(page.locator('h1')).toContainText(/Claim Your MOVA Profile/i);
    await expect(page.locator('text=Step 1: Choose the Profile to Claim')).toBeVisible();
  });

  // 2. DEMO AUTHENTICATION & LOGIN GATEWAY
  test('2. Login Gateway & 1-Click Role Login', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Sign In|MOVA/i);

    // Verify all 5 demo role titles exist
    await expect(page.locator('text=Super Admin').first()).toBeVisible();
    await expect(page.locator('text=Platform Administrator').first()).toBeVisible();
    await expect(page.locator('text=Content Moderator').first()).toBeVisible();
    await expect(page.locator('text=Jazz Pianist & Composer').first()).toBeVisible();
    await expect(page.locator('text=MOVA Explorer').first()).toBeVisible();

    // Test Super Admin 1-click login button
    await page.click('button:has-text("Enter Super Admin Demo")');
    await page.waitForURL('**/dashboard/super-admin');
    await expect(page.locator('text=Super Administrator Master Console')).toBeVisible();
  });

  // 3. ROLE GUARDING & UNAUTHORIZED ACCESS PROTECTION
  test('3. Role Guard: Unauthenticated & Cross-Role Redirection', async ({ page, context }) => {
    // Clear storage
    await context.clearCookies();
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());

    // Try visiting super-admin directly without login
    await page.goto('/dashboard/super-admin');
    // Guard redirects unauthenticated user back to /login
    await page.waitForURL('**/login');
    await expect(page.locator('h1')).toContainText('Welcome to MOVA');

    // Now log in as USER (Sam Rivera)
    await page.click('button:has-text("Enter User Demo")');
    await page.waitForURL('**/dashboard/user');
    await expect(page.locator('text=Sam Rivera • Discovery & Saved')).toBeVisible();

    // Now try navigating manually to /dashboard/super-admin while logged in as USER
    await page.goto('/dashboard/super-admin');
    // Guard redirects back to /dashboard/user
    await page.waitForURL('**/dashboard/user');
    await expect(page.locator('text=Explorer Personal Portal')).toBeVisible();
  });

  // 4. SUPER ADMIN DASHBOARD INTERACTIONS
  test('4. Super Admin: Claims Review & User Status Toggle', async ({ page }) => {
    await page.goto('/login');
    await page.click('button:has-text("Enter Super Admin Demo")');
    await page.waitForURL('**/dashboard/super-admin');

    // Switch to Claims tab
    await page.click('button:has-text("Claims Queue")');
    await expect(page.locator('text=Profile Verification Claim Station')).toBeVisible();

    // Check action: Grant Verified Badge
    const grantBtn = page.locator('button:has-text("Grant Verified Badge")').first();
    if (await grantBtn.isVisible()) {
      await grantBtn.click();
      await expect(page.locator('text=approved successfully')).toBeVisible();
    }

    // Switch to Users tab
    await page.click('button:has-text("Users & Accounts")');
    await expect(page.locator('text=Alex Karimov').first()).toBeVisible();

    // Toggle Suspend / Activate
    const toggleBtn = page.locator('button:has-text("Suspend"), button:has-text("Activate")').first();
    if (await toggleBtn.isVisible()) {
      await toggleBtn.click();
      await expect(page.locator('text=status changed')).toBeVisible();
    }
  });

  // 5. CREATOR DASHBOARD: BIO EDITING & ACHIEVEMENTS PERSISTENCE
  test('5. Creator: Live Biography Editing & Achievements Manager', async ({ page }) => {
    await page.goto('/login');
    await page.click('button:has-text("Enter Creator Demo")');
    await page.waitForURL('**/dashboard/creator');

    await expect(page.locator('text=Aiko Nakamura • Studio & Profile')).toBeVisible();
    await expect(page.getByText('VERIFIED', { exact: true })).toBeVisible();

    // Switch to Biography tab
    await page.click('button:has-text("Edit Biography & Title")');
    await expect(page.locator('text=Professional Title / Discipline')).toBeVisible();

    // Save biography
    await page.click('button:has-text("Save Biography Changes")');
    await expect(page.locator('text=Profile biography and professional title updated')).toBeVisible();

    // Switch to Achievements tab
    await page.click('button:has-text("Achievements")');
    await expect(page.locator('text=Montreux Jazz Soloist Award')).toBeVisible();

    // Add new achievement
    await page.fill('input[placeholder*="Grammy Nomination"]', 'Tokyo Classical Piano Laureate');
    await page.click('button:has-text("Add")');
    await expect(page.locator('text=Tokyo Classical Piano Laureate').first()).toBeVisible();
    await expect(page.locator('text=added to your profile')).toBeVisible();
  });

  // 6. USER DASHBOARD: SAVED BOOKMARKS & DISCOVERY PREFERENCES
  test('6. User: Bookmarks Collection & Feed Preferences', async ({ page }) => {
    await page.goto('/login');
    await page.click('button:has-text("Enter User Demo")');
    await page.waitForURL('**/dashboard/user');

    await expect(page.locator('text=Sam Rivera • Discovery & Saved')).toBeVisible();

    // Check remove bookmark
    const trashBtn = page.locator('button[title="Remove Bookmark"]').first();
    if (await trashBtn.isVisible()) {
      await trashBtn.click();
      await expect(page.locator('text=removed from saved collection')).toBeVisible();
    }

    // Switch to Preferences tab
    await page.click('button:has-text("Discovery Preferences")');
    await expect(page.locator('text=Feed Ranking Algorithm')).toBeVisible();
    await page.click('button:has-text("Save Preferences")');
    await expect(page.locator('text=Preferences updated')).toBeVisible();
  });

  // 7. ACCOUNT SWITCHING MODAL & LOGOUT
  test('7. Switch Account Modal & Sign Out', async ({ page }) => {
    await page.goto('/login');
    await page.click('button:has-text("Enter Super Admin Demo")');
    await page.waitForURL('**/dashboard/super-admin');

    // Click Switch Account button in sidebar
    await page.click('button:has-text("Switch Account")');
    await expect(page.locator('h2:has-text("Switch Demo Account")')).toBeVisible();

    // Switch to Moderator
    await page.click('button:has-text("James Okafor")');
    await page.waitForURL('**/dashboard/moderator');
    await expect(page.locator('text=Content Moderation Queue')).toBeVisible();

    // Click Sign Out
    await page.click('button:has-text("Sign Out")');
    await page.waitForURL('**/login');
    await expect(page.locator('h1').first()).toContainText('Welcome to MOVA');
  });

  // 8. MULTI-VIEWPORT RESPONSIVENESS (320px to 3840px)
  test('8. Multi-Viewport Responsiveness & Zero Horizontal Overflow', async ({ page }) => {
    const viewports = [
      { name: 'Small Mobile', width: 320, height: 568 },
      { name: 'Standard Mobile', width: 390, height: 844 },
      { name: 'Tablet Portrait', width: 768, height: 1024 },
      { name: 'Tablet Landscape', width: 1024, height: 768 },
      { name: 'Desktop HD', width: 1440, height: 900 },
      { name: 'Full HD', width: 1920, height: 1080 },
      { name: '2K QHD', width: 2560, height: 1440 },
      { name: '4K Ultrawide', width: 3840, height: 2160 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      // Check overflow (allow 1px for browser subpixel calculation)
      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
      });

      expect(isOverflowing, `Horizontal overflow detected at ${vp.name} (${vp.width}x${vp.height})`).toBe(false);
    }
  });

});
