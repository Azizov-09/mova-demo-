import { expect, test, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const visualRoot = path.resolve('test-results/visual-recovery/current');

const visualBaselines = new Set([
  'login-desktop',
  'login-mobile',
  'public-home-desktop',
  'public-home-mobile',
  'public-explore-desktop',
  'public-explore-mobile',
  'public-profile-desktop',
  'public-profile-mobile',
  'super-admin-desktop',
  'super-admin-mobile',
  'admin-desktop',
  'admin-mobile',
  'moderator-desktop',
  'moderator-mobile',
  'creator-desktop',
  'creator-mobile',
  'user-desktop',
  'user-mobile',
  'super-admin-users-desktop',
  'super-admin-users-mobile',
  'admin-profiles-desktop',
  'admin-profiles-mobile',
  'moderator-pending-desktop',
  'moderator-pending-mobile',
  'creator-profile-desktop',
  'creator-profile-mobile',
  'user-saved-desktop',
  'user-saved-mobile',
]);

const dashboardRoles = [
  { slug: 'super-admin', button: 'Enter Super Admin Demo' },
  { slug: 'admin', button: 'Enter Admin Demo' },
  { slug: 'moderator', button: 'Enter Moderator Demo' },
  { slug: 'creator', button: 'Enter Creator Demo' },
  { slug: 'user', button: 'Enter User Demo' },
] as const;

const publicPages = [
  { name: 'home', route: '/' },
  { name: 'explore', route: '/explore' },
  { name: 'categories', route: '/categories' },
  { name: 'profile', route: '/people/aiko-nakamura' },
  { name: 'claim', route: '/claim' },
  { name: 'about', route: '/about' },
  { name: 'register', route: '/register' },
  { name: 'privacy', route: '/privacy' },
  { name: 'terms', route: '/terms' },
  { name: 'not-found', route: '/visual-recovery-missing-page' },
] as const;

const nestedDashboardRoutes = {
  'super-admin': ['users', 'roles', 'profiles', 'categories', 'claims', 'moderation', 'reports', 'settings', 'audit'],
  admin: ['profiles', 'categories', 'content', 'claims', 'media', 'reports', 'settings'],
  moderator: ['pending', 'reported', 'content', 'history', 'settings'],
  creator: ['profile', 'biography', 'achievements', 'projects', 'gallery', 'social', 'claim', 'settings'],
  user: ['saved', 'recent', 'categories', 'preferences', 'account'],
} as const;

type LayoutAudit = {
  documentOverflow: number;
  clippedText: string[];
  overlappingControls: string[];
  offscreenControls: string[];
};

async function settlePage(page: Page, autoScroll = false) {
  await page.evaluate(() => document.fonts.ready);

  // Framer Motion intentionally keeps opacity transitions under reduced-motion.
  // Wait for the longest entrance sequence so evidence never captures half-rendered UI.
  await page.waitForTimeout(850);

  if (autoScroll) {
    await page.evaluate(async () => {
      const delay = (milliseconds: number) =>
        new Promise((resolve) => window.setTimeout(resolve, milliseconds));

      for (let y = 0; y < document.documentElement.scrollHeight; y += Math.max(320, window.innerHeight * 0.75)) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await delay(45);
      }

      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }

  await page.waitForTimeout(180);
}

async function auditLayout(page: Page): Promise<LayoutAudit> {
  return page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const visible = (element: Element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.right > 0 &&
        rect.left < viewportWidth &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        Number(style.opacity) > 0.01
      );
    };
    const describe = (element: Element) => {
      const text = element.textContent?.replace(/\s+/g, ' ').trim().slice(0, 80);
      return `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${text ? `: ${text}` : ''}`;
    };
    const hasHorizontalScroller = (element: Element) => {
      let current = element.parentElement;
      while (current && current !== document.body) {
        const overflowX = getComputedStyle(current).overflowX;
        if ((overflowX === 'auto' || overflowX === 'scroll') && current.scrollWidth > current.clientWidth) {
          return true;
        }
        current = current.parentElement;
      }
      return false;
    };

    const elements = [...document.body.querySelectorAll<HTMLElement>('*')].filter(visible);
    const clippedText = elements
      .filter((element) => {
        const hasDirectText = [...element.childNodes].some(
          (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
        );
        if (!hasDirectText) return false;
        const style = getComputedStyle(element);
        const intentionallyClamped =
          style.textOverflow === 'ellipsis' || Number.parseInt(style.webkitLineClamp || '0', 10) > 0;
        if (intentionallyClamped) return false;
        const clippedX =
          (style.overflowX === 'hidden' || style.overflowX === 'clip') &&
          element.scrollWidth > element.clientWidth + 2;
        const clippedY =
          (style.overflowY === 'hidden' || style.overflowY === 'clip') &&
          element.scrollHeight > element.clientHeight + 2;
        return clippedX || clippedY;
      })
      .slice(0, 20)
      .map(describe);

    const controls = [...document.querySelectorAll<HTMLElement>(
      'a, button, input, select, textarea, [role="button"], [role="tab"]'
    )].filter(visible);
    const overlappingControls: string[] = [];

    for (let firstIndex = 0; firstIndex < controls.length; firstIndex += 1) {
      const first = controls[firstIndex];
      const firstRect = first.getBoundingClientRect();
      for (let secondIndex = firstIndex + 1; secondIndex < controls.length; secondIndex += 1) {
        const second = controls[secondIndex];
        if (first.contains(second) || second.contains(first)) continue;
        const sharedParent = first.parentElement === second.parentElement;
        const inputAffordance =
          sharedParent &&
          ((first instanceof HTMLInputElement && getComputedStyle(second).position === 'absolute') ||
            (second instanceof HTMLInputElement && getComputedStyle(first).position === 'absolute'));
        if (inputAffordance) continue;
        const secondRect = second.getBoundingClientRect();
        const overlapWidth = Math.min(firstRect.right, secondRect.right) - Math.max(firstRect.left, secondRect.left);
        const overlapHeight = Math.min(firstRect.bottom, secondRect.bottom) - Math.max(firstRect.top, secondRect.top);
        if (overlapWidth > 4 && overlapHeight > 4) {
          overlappingControls.push(`${describe(first)} <> ${describe(second)}`);
        }
      }
    }

    const offscreenControls = controls
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return (rect.left < -1 || rect.right > viewportWidth + 1) && !hasHorizontalScroller(element);
      })
      .slice(0, 20)
      .map(describe);

    return {
      documentOverflow: Math.max(0, document.documentElement.scrollWidth - viewportWidth),
      clippedText,
      overlappingControls: overlappingControls.slice(0, 20),
      offscreenControls,
    };
  });
}

async function captureAndAudit(
  page: Page,
  name: string,
  viewport: { width: number; height: number },
  autoScroll = false
) {
  await page.setViewportSize(viewport);
  await settlePage(page, autoScroll);
  const audit = await auditLayout(page);
  await page.screenshot({ path: path.join(visualRoot, `${name}.png`), fullPage: true });

  if (visualBaselines.has(name)) {
    await expect(page).toHaveScreenshot(`${name}.png`, {
      animations: 'disabled',
      caret: 'hide',
      fullPage: true,
      maxDiffPixelRatio: 0.01,
      timeout: 20_000,
    });
  }

  expect(audit.documentOverflow, `${name}: document overflow`).toBe(0);
  expect(audit.overlappingControls, `${name}: overlapping controls`).toEqual([]);
  expect(audit.offscreenControls, `${name}: controls outside viewport`).toEqual([]);

  return audit;
}

test.beforeAll(async () => {
  await mkdir(visualRoot, { recursive: true });
});

test.describe('visual recovery evidence', () => {
  test('login at desktop and mobile', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/login');
    const desktop = await captureAndAudit(page, 'login-desktop', { width: 1440, height: 900 });

    await page.goto('/login');
    const mobile = await captureAndAudit(page, 'login-mobile', { width: 390, height: 844 });

    expect(desktop.clippedText, 'login desktop clipped text').toEqual([]);
    expect(mobile.clippedText, 'login mobile clipped text').toEqual([]);
  });

  for (const role of dashboardRoles) {
    test(`${role.slug} dashboard at desktop and mobile`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/login');
      await page.getByRole('button', { name: role.button, exact: true }).click();
      await page.waitForURL(`**/dashboard/${role.slug}`);
      const desktop = await captureAndAudit(
        page,
        `${role.slug}-desktop`,
        { width: 1440, height: 900 }
      );

      await page.setViewportSize({ width: 390, height: 844 });
      await page.reload();
      const mobile = await captureAndAudit(
        page,
        `${role.slug}-mobile`,
        { width: 390, height: 844 }
      );

      expect(desktop.clippedText, `${role.slug} desktop clipped text`).toEqual([]);
      expect(mobile.clippedText, `${role.slug} mobile clipped text`).toEqual([]);
    });
  }
});

test.describe('public page visual audit', () => {
  for (const publicPage of publicPages) {
    test(`${publicPage.name} at desktop and mobile`, async ({ page }) => {
      test.setTimeout(60_000);
      await page.emulateMedia({ reducedMotion: 'reduce' });

      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(publicPage.route);
      const desktop = await captureAndAudit(
        page,
        `public-${publicPage.name}-desktop`,
        { width: 1440, height: 900 },
        true
      );

      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(publicPage.route);
      const mobile = await captureAndAudit(
        page,
        `public-${publicPage.name}-mobile`,
        { width: 390, height: 844 },
        true
      );

      expect(desktop.clippedText, `${publicPage.name} desktop clipped text`).toEqual([]);
      expect(mobile.clippedText, `${publicPage.name} mobile clipped text`).toEqual([]);
    });
  }
});

test.describe('nested dashboard route audit', () => {
  for (const role of dashboardRoles) {
    test(`${role.slug} nested routes`, async ({ page }) => {
      test.setTimeout(180_000);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/login');
      await page.getByRole('button', { name: role.button, exact: true }).click();
      await page.waitForURL(`**/dashboard/${role.slug}`);

      for (const tab of nestedDashboardRoutes[role.slug]) {
        for (const viewport of [
          { name: 'desktop', width: 1440, height: 900 },
          { name: 'mobile', width: 390, height: 844 },
        ] as const) {
          await page.setViewportSize(viewport);
          await page.goto(`/dashboard/${role.slug}/${tab}`);
          await settlePage(page);
          const audit = await auditLayout(page);
          const label = `${role.slug}-${tab}-${viewport.name}`;
          const hasPanelAfterTabs = await page.locator('.dashboard-tabs').evaluate((tabs) => {
            let sibling = tabs.nextElementSibling;
            while (sibling) {
              const rect = sibling.getBoundingClientRect();
              const style = getComputedStyle(sibling);
              if (rect.height > 40 && style.display !== 'none' && style.visibility !== 'hidden') {
                return true;
              }
              sibling = sibling.nextElementSibling;
            }
            return false;
          });

          expect(audit.documentOverflow, `${label}: document overflow`).toBe(0);
          expect(audit.overlappingControls, `${label}: overlapping controls`).toEqual([]);
          expect(audit.offscreenControls, `${label}: controls outside viewport`).toEqual([]);
          expect(audit.clippedText, `${label}: clipped text`).toEqual([]);
          expect(hasPanelAfterTabs, `${label}: missing content panel`).toBe(true);
        }
      }

      const evidenceTab = nestedDashboardRoutes[role.slug][0];
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`/dashboard/${role.slug}/${evidenceTab}`);
      await settlePage(page);
      const desktopName = `${role.slug}-${evidenceTab}-desktop`;
      await page.screenshot({
        path: path.join(visualRoot, `${desktopName}.png`),
        fullPage: true,
      });
      await expect(page).toHaveScreenshot(`${desktopName}.png`, {
        animations: 'disabled',
        caret: 'hide',
        fullPage: true,
        maxDiffPixelRatio: 0.01,
        timeout: 20_000,
      });

      await page.setViewportSize({ width: 390, height: 844 });
      await page.reload();
      await settlePage(page);
      const mobileName = `${role.slug}-${evidenceTab}-mobile`;
      await page.screenshot({
        path: path.join(visualRoot, `${mobileName}.png`),
        fullPage: true,
      });
      await expect(page).toHaveScreenshot(`${mobileName}.png`, {
        animations: 'disabled',
        caret: 'hide',
        fullPage: true,
        maxDiffPixelRatio: 0.01,
        timeout: 20_000,
      });
    });
  }
});
