import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { projects, flagshipProjects, profile } from '../src/data/portfolio';

const sizes = [
  [320, 568],
  [360, 640],
  [375, 667],
  [390, 844],
  [412, 915],
  [430, 932],
  [540, 960],
  [768, 1024],
  [820, 1180],
  [1024, 768],
  [1280, 720],
  [1366, 768],
  [1440, 900],
  [1536, 864],
  [1920, 1080],
  [2560, 1440],
  [844, 390],
  [568, 320],
];
const sceneIds = [
  'night',
  'signal',
  'rocket',
  'launch',
  'space',
  'forest',
  'engine',
  'workshop',
  'universe',
  'failure',
  'cyberspace',
  'lab',
  'door',
  'flight-path',
  'mirror',
  'human',
  'contact',
];
test.use({ reducedMotion: 'reduce', colorScheme: 'dark' });
async function scene(page: Page, id: string) {
  await page.getByRole('button', { name: /Open story chapters/ }).click();
  await page.locator('.story-index-dialog li button').nth(sceneIds.indexOf(id)).click();
  await expect(page.locator('.story-experience')).toHaveAttribute('data-scene', id);
}
async function inspect(page: Page) {
  await page.getByRole('button', { name: /^Inspect scene/ }).click();
  await expect(page.locator('.scene-instrument')).toBeVisible();
}
async function fits(page: Page, label: string) {
  const bad = await page.evaluate(() => {
    const errors: string[] = [];
    if (document.documentElement.scrollWidth > innerWidth + 1)
      errors.push(`page width ${document.documentElement.scrollWidth} > ${innerWidth}`);
    const selectors = [
      '.field-header',
      '.field-footer',
      '.story-navigation',
      '.story-copy',
      '.scene-beacon',
      '.orbital-controls',
      '.scene-instrument',
      '.motion-invite',
    ];
    const elements = selectors
      .map((s) => ({ s, el: document.querySelector<HTMLElement>(s) }))
      .filter(
        (x) =>
          x.el &&
          x.el.getBoundingClientRect().width &&
          x.el.getBoundingClientRect().height &&
          getComputedStyle(x.el).visibility !== 'hidden',
      );
    for (let i = 0; i < elements.length; i++)
      for (let j = i + 1; j < elements.length; j++) {
        const a = elements[i],
          b = elements[j],
          r = a.el!.getBoundingClientRect(),
          q = b.el!.getBoundingClientRect();
        if (
          (a.s === '.motion-invite' && b.s === '.story-copy') ||
          (b.s === '.motion-invite' && a.s === '.story-copy')
        )
          continue;
        const w = Math.min(r.right, q.right) - Math.max(r.left, q.left),
          h = Math.min(r.bottom, q.bottom) - Math.max(r.top, q.top);
        if (w > 2 && h > 2) errors.push(`${a.s} / ${b.s}: ${Math.round(w)}x${Math.round(h)}`);
      }
    return errors;
  });
  expect(bad, label).toEqual([]);
}
for (const [width, height] of sizes) {
  test(`production surfaces reflow at ${width}x${height}`, async ({ page }) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
    for (const sky of ['dark', 'light']) {
      if ((await page.locator('html').getAttribute('data-sky')) !== sky)
        await page.getByRole('button', { name: /Change sky/ }).click();
      for (const id of sceneIds) {
        if ((await page.locator('.story-experience').getAttribute('data-scene')) !== id)
          await scene(page, id);
        await fits(page, `${width}x${height}/${sky}/${id}`);
        if (id !== 'night') {
          await inspect(page);
          await fits(page, `${width}x${height}/${sky}/${id}/instrument`);
          const instrument = page.locator('.scene-instrument');
          await expect(instrument).toBeInViewport();
          expect(await instrument.evaluate((el) => getComputedStyle(el).overflowY)).toMatch(
            /auto|scroll/,
          );
          if (id === 'contact') {
            await page.getByRole('button', { name: /LET’S BUILD WHAT COMES NEXT/ }).click();
            await expect(page.locator('#story-message')).toBeVisible();
            await fits(page, 'contact form');
          }
          await page.getByRole('button', { name: 'Close field instrument', exact: true }).click();
        }
      }
    }
    await page.getByRole('button', { name: 'Open terminal', exact: true }).click();
    const terminal = page.getByRole('dialog', { name: 'System 369 interactive terminal' });
    await expect(terminal).toBeInViewport();
    await page.keyboard.press('Escape');
    await page.keyboard.press('Control+k');
    const palette = page.getByRole('dialog', { name: 'MISSION CONTROL', exact: true });
    await expect(palette).toBeInViewport();
    await page.getByLabel('Search commands').fill('engineering profile');
    await expect(palette.getByRole('option')).toHaveCount(1);
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: /^QUICK/ }).click();
    await expect(page.locator('.quick-portfolio')).toBeVisible();
    await fits(page, 'Quick');
    await expect(page.locator('.q-flagship-entry')).toHaveCount(6);
    for (const path of [
      '/missions/nexus/',
      '/missions/agnipariksha/',
      '/missions/path-guard/',
      '/missions/swift-macrotrust/',
      '/missions/java-algorithm-analyzer/',
      '/engineering-profile/',
      '/not-a-real-mission/',
    ]) {
      await page.goto(path);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        path,
      ).toBeLessThanOrEqual(width + 1);
      const h = page.getByRole('heading', { level: 1 });
      await expect(h).toBeVisible();
      expect(
        await h.evaluate((el) => el.scrollWidth - el.clientWidth),
        path + ' heading wraps',
      ).toBeLessThanOrEqual(2);
    }
  });
}

test('all local links, metadata, structured data and engineering records are coherent', async ({
  page,
  request,
}) => {
  const visited = new Set<string>();
  for (const path of ['/', '/engineering-profile/', ...projects.map((p) => `/missions/${p.id}/`)]) {
    await page.goto(path);
    expect(await page.locator('head link[rel=canonical]').getAttribute('href')).toBe(path);
    const metadata = await page.locator('head').innerHTML();
    expect(metadata).not.toMatch(/https?:\/\/(localhost|127\.0\.0\.1)/);
    expect(await page.locator('head meta[property="og:image"]').getAttribute('content')).toBe(
      '/og.png',
    );
    expect(await page.locator('script[type="application/ld+json"]').count()).toBeGreaterThan(0);
    for (const href of await page
      .locator('a[href]')
      .evaluateAll((links) => links.map((a) => (a as HTMLAnchorElement).getAttribute('href')!))) {
      if (!href.startsWith('/') || href.startsWith('//')) continue;
      const url = new URL(href, 'http://127.0.0.1:3001');
      const local = url.pathname;
      if (!visited.has(local)) {
        visited.add(local);
        expect((await request.get(local)).status(), local).toBe(200);
      }
      if (url.hash && local === path) {
        expect(
          await page.locator(`[id="${decodeURIComponent(url.hash.slice(1))}"]`).count(),
          href,
        ).toBeGreaterThan(0);
      }
    }
  }
  expect((await request.get('/robots.txt')).status()).toBe(200);
  expect((await request.get('/sitemap.xml')).status()).toBe(200);
  expect(flagshipProjects).toHaveLength(6);
  expect(new Set(projects.map((p) => p.id)).size).toBe(17);
  await page.goto('/missions/agnipariksha/');
  await expect(page.locator('main')).toContainText('burn-in');
  await expect(page.locator('main')).not.toContainText('assessment platform');
  await page.goto('/missions/path-guard/');
  await expect(page.locator('main')).toContainText('voice');
  await page.goto('/missions/swift-macrotrust/');
  await expect(page.locator('main')).toContainText('threat taxonomy');
  await page.goto('/engineering-profile/');
  await expect(page.locator('main')).toContainText(profile.positioning);
});

test('a saved Quick Mode does not initialize WebGL', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'system369.experience.v1',
      JSON.stringify({ mode: 'recruiter', motion: true, awards: {}, booted: true, sound: false }),
    );
    const original = HTMLCanvasElement.prototype.getContext;
    let calls = 0;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (type.includes('webgl')) calls++;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
    Object.defineProperty(window, '__webglCalls', { get: () => calls });
  });
  await page.goto('/');
  await expect(page.locator('.quick-portfolio')).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
  expect(
    await page.evaluate(() => (window as unknown as { __webglCalls: number }).__webglCalls),
  ).toBe(0);
});

test('production console and accessible surfaces are clean', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  for (const sky of ['dark', 'light'] as const) {
    await page.emulateMedia({ colorScheme: sky });
    for (const path of [
      '/',
      '/engineering-profile/',
      '/missions/nexus/',
      '/missions/agnipariksha/',
    ]) {
      await page.goto(path);
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(
        result.violations.filter((v) => ['critical', 'serious'].includes(v.impact ?? '')),
      ).toEqual([]);
    }
  }
  expect(errors).toEqual([]);
});
