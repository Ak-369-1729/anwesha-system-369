import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.use({ reducedMotion: 'reduce', colorScheme: 'dark' });
const EXPERIENCE_KEY = 'system369.experience.v1';
const SKY_KEY = 'system369.sky.v2';
const scenes = [
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
async function inspectScene(page: Page) {
  const trigger = page.getByRole('button', { name: /^Inspect scene/ });
  if (!(await page.locator('.scene-instrument').isVisible())) {
    await expect(trigger).toBeVisible();
    await trigger.click();
  }
  await expect(page.locator('.scene-instrument')).toBeVisible();
}

async function openStory(page: Page, path = '/', inspect = true) {
  await page.goto(path);
  await expect(page.locator('html')).toHaveAttribute('data-motion', /full|reduced/);
  await expect(page.locator('html')).toHaveAttribute('data-experience', 'story');
  await expect(page.locator('canvas.story-world')).toHaveCount(1);
  const expectedScene = path.includes('#') ? path.split('#')[1] : 'night';
  await expect(page.locator('.story-experience')).toHaveAttribute('data-scene', expectedScene);
  if (expectedScene !== 'night' && inspect) await inspectScene(page);
}
async function openQuick(page: Page) {
  await openStory(page);
  await page.getByRole('button', { name: 'QUICK', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-experience', 'quick');
  await expect(page.locator('.quick-portfolio')).toBeVisible();
}
async function jumpTo(page: Page, id: string, inspect = true) {
  const index = scenes.indexOf(id);
  if (index < 0) throw new Error('Unknown test scene: ' + id);
  await page.getByRole('button', { name: /Open story chapters/i }).click();
  const dialog = page.getByRole('dialog', { name: 'Story chapters', exact: true });
  await expect(dialog).toBeVisible();
  await dialog.locator('ol > li > button').nth(index).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('.story-experience')).toHaveAttribute('data-scene', id);
  await expect(page).toHaveURL(new RegExp('#' + id + '$'));
  if (id !== 'night' && inspect) await inspectScene(page);
}
async function awards(page: Page): Promise<Record<string, number>> {
  return page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key) || '{}').awards || {},
    EXPERIENCE_KEY,
  );
}
async function command(page: Page, query: string) {
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog', { name: 'MISSION CONTROL', exact: true });
  await expect(dialog).toBeVisible();
  const input = page.getByLabel('Search commands');
  await expect(input).toBeFocused();
  await input.fill(query);
  await expect(dialog.getByRole('option')).toHaveCount(1);
  await input.press('Enter');
  await expect(dialog).toHaveCount(0);
}
async function seriousAccessibilityViolations(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  return results.violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
    }));
}

test('the opening follows a girl before revealing the engineer', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await openStory(page);
  await expect(page.locator('.story-copy h1')).toContainText('She saw questions.');
  await expect(page.locator('.story-copy h1')).not.toContainText('ANWESHA');
  await expect(page.locator('.scene-alt')).toContainText('little girl');
  await expect(page.getByRole('button', { name: /résumé|resume/i })).toHaveCount(0);
  await expect(page.locator('.quick-portfolio')).toHaveCount(0);
  await expect(page.locator('canvas.story-world')).toHaveAttribute('aria-hidden', 'true');
  await page.getByRole('button', { name: /FOLLOW THE SIGNAL/i }).click();
  await expect(page.locator('.story-experience')).toHaveAttribute('data-scene', 'signal');
  expect(errors).toEqual([]);
});

test('seventeen scenes retain one world canvas and remain directly navigable', async ({ page }) => {
  await openStory(page);
  await page
    .locator('canvas.story-world')
    .evaluate((node) => node.setAttribute('data-qa-world', 'persistent'));
  for (const id of scenes) {
    await jumpTo(page, id);
    await expect(page.locator('canvas.story-world')).toHaveAttribute('data-qa-world', 'persistent');
    await expect(page.locator('.scene-alt')).toContainText(
      'Scene ' + (scenes.indexOf(id) + 1) + ' of 17.',
    );
  }
  await jumpTo(page, 'mirror');
  await expect(page.locator('.mirror-stages')).toContainText('CHILD');
  await expect(page.locator('.mirror-stages')).toContainText('ENGINEER');
  await page.getByRole('button', { name: /CONTINUE/i }).click();
  await expect(page.locator('.identity-reveal')).toContainText('ANWESHA');
});

test('signal and code discoveries persist while challenges remain optional', async ({ page }) => {
  await openStory(page, '/#signal');
  await page.getByRole('button', { name: /Catch the strange signal/i }).click();
  await expect(page.locator('.signal-artifact')).toContainText('QUESTION COLLECTED');
  await expect.poll(async () => (await awards(page))['artifact-question']).toBe(10);
  await jumpTo(page, 'forest');
  await page.getByRole('button', { name: /Connect logic node/i }).click();
  await expect(page.locator('.status-toast')).toContainText('Start with input');
  for (const name of ['input', 'logic', 'possibility'])
    await page.getByRole('button', { name: new RegExp('Connect ' + name + ' node', 'i') }).click();
  await expect(page.locator('.syntax-puzzle button.connected')).toHaveCount(3);
  await expect.poll(async () => (await awards(page))['artifact-code']).toBe(20);
  await page.reload();
  await inspectScene(page);
  await expect(page.locator('.syntax-puzzle button.connected')).toHaveCount(3);
  await page.getByRole('button', { name: /CONTINUE/i }).click();
  await expect(page.locator('.story-experience')).toHaveAttribute('data-scene', 'engine');
  await jumpTo(page, 'door');
  await page.getByRole('button', { name: /CONTINUE/i }).click();
  await expect(page.locator('.story-experience')).toHaveAttribute('data-scene', 'flight-path');
});

test('threat containment awards one persistent shield, not repeat points', async ({ page }) => {
  await openStory(page, '/#cyberspace');
  const lab = page.locator('.security-lab');
  await lab.locator('.network-node:not(.anomaly)').first().click();
  await lab.getByRole('button', { name: /ISOLATE SELECTED NODE/i }).click();
  await expect(lab.locator('.security-message')).toContainText('healthy');
  expect((await awards(page))['cyber-threat']).toBeUndefined();
  await lab.locator('.network-node.anomaly').click();
  await expect(lab.locator('.node-metrics')).toContainText('UNKNOWN HOST');
  await lab.getByRole('button', { name: /ISOLATE SELECTED NODE/i }).click();
  await expect(lab.locator('.security-message')).toContainText('THREAT CONTAINED');
  await expect.poll(async () => (await awards(page))['cyber-threat']).toBe(100);
  await expect(page.locator('.collected-artifacts [title="shield"]')).toBeVisible();
  await lab.getByRole('button', { name: /RESET SIMULATION/i }).click();
  await lab.locator('.network-node.anomaly').click();
  await lab.getByRole('button', { name: /ISOLATE SELECTED NODE/i }).click();
  expect((await awards(page))['cyber-threat']).toBe(100);
  await jumpTo(page, 'engine');
  await expect(page.locator('.collected-artifacts [title="shield"]')).toBeVisible();
  await page.reload();
  await expect(page.locator('.collected-artifacts [title="shield"]')).toBeVisible();
  expect((await awards(page))['cyber-threat']).toBe(100);
});

test('launch, orbital alignment, research and the why door lead onward', async ({ page }) => {
  await openStory(page, '/#rocket');
  await page.getByRole('button', { name: /INITIATE LAUNCH/i }).click();
  await expect(page.locator('.story-experience')).toHaveAttribute('data-scene', 'launch');
  await inspectScene(page);
  await expect(page.locator('.launch-telemetry')).toContainText('SIMULATED FLIGHT');
  await expect.poll(async () => (await awards(page))['artifact-system']).toBe(20);
  await jumpTo(page, 'space');
  const alignment = page.getByRole('slider', { name: 'Satellite alignment' });
  await alignment.focus();
  await alignment.press('End');
  for (let step = 0; step < 31; step++) await alignment.press('ArrowLeft');
  await expect(page.locator('.orbit-readout')).toContainText('ALIGNED');
  await expect.poll(async () => (await awards(page))['artifact-orbit']).toBe(20);
  await jumpTo(page, 'lab');
  await page.getByRole('button', { name: /KEEP THE QUESTION/i }).click();
  await expect.poll(async () => (await awards(page))['artifact-knowledge']).toBe(30);
  await jumpTo(page, 'door');
  await page.getByRole('button', { name: /^WHY/i }).click();
  await expect.poll(async () => (await awards(page))['artifact-why']).toBe(20);
});

test('Quick Mode preserves searchable mission records, categories and routes', async ({ page }) => {
  await openQuick(page);
  const atlas = page.locator('.project-atlas');
  await expect(atlas.locator('.project-index-row')).toHaveCount(17);
  await page.getByLabel('Search projects, categories or technologies').fill('no-such-signal-369');
  await expect(atlas.locator('.atlas-empty')).toBeVisible();
  await atlas.getByRole('button', { name: /CLEAR FILTERS/i }).click();
  await expect(atlas.locator('.project-index-row')).toHaveCount(17);
  await atlas.getByRole('button', { name: 'Cybersecurity', exact: true }).click();
  expect(await atlas.locator('.project-index-row').count()).toBeGreaterThan(0);
  expect(await atlas.locator('.project-index-row').count()).toBeLessThan(17);
  await atlas.getByRole('button', { name: 'ALL SIGNALS', exact: true }).click();
  await atlas.locator('.project-index-row').filter({ hasText: 'NEXUS' }).click();
  await expect(page).toHaveURL(/\/missions\/nexus\/?$/);
  await expect(page.locator('h1')).toContainText('NEXUS');
  await expect(page.locator('.file-meta')).toContainText('SOURCE AVAILABLE');
  await expect(page.locator('.file-evidence')).toBeVisible();
});

test('constellation zoom and orbit are bounded and resettable', async ({ page }) => {
  await openStory(page, '/#universe');
  const atlas = page.locator('.project-atlas');
  await expect(atlas.locator('.project-node')).toHaveCount(17);
  for (let i = 0; i < 5; i++)
    await atlas.getByRole('button', { name: 'Zoom map in', exact: true }).click();
  await expect(atlas.locator('.atlas-spatial-position')).toContainText('150%');
  await expect(atlas.getByRole('button', { name: 'Zoom map in', exact: true })).toBeDisabled();
  for (let i = 0; i < 2; i++)
    await atlas.getByRole('button', { name: 'Orbit map clockwise', exact: true }).click();
  await expect(atlas.locator('.atlas-spatial-position')).toContainText('30°');
  await expect(
    atlas.getByRole('button', { name: 'Orbit map clockwise', exact: true }),
  ).toBeDisabled();
  await expect(atlas.locator('.project-node').first()).toHaveCSS('transform', /matrix/);
  await atlas.getByRole('button', { name: 'RESET MAP', exact: true }).click();
  await expect(atlas.locator('.atlas-spatial-position')).toContainText('100%');
  await expect(atlas.locator('.atlas-spatial-position')).toContainText('0°');
  await expect(atlas.getByRole('button', { name: 'Zoom map in', exact: true })).toBeEnabled();
});

test('workshop mission files return to the continuous constellation', async ({ page }) => {
  await openStory(page, '/#workshop');
  await page.locator('.machine-link').filter({ hasText: 'BoundaryLens' }).click();
  await expect(page).toHaveURL(/\/missions\/boundarylens\/?$/);
  await expect(page.locator('h1')).toContainText('BoundaryLens');
  await page.locator('.file-back').click();
  await expect(page).toHaveURL(/\/#universe$/);
  await expect(page.locator('.story-experience')).toHaveAttribute('data-scene', 'universe');
  await inspectScene(page);
  await expect(page.locator('.project-atlas')).toBeVisible();
});

test('Quick mission files return to the project anchor without reopening Story Mode', async ({
  page,
}) => {
  await openQuick(page);
  await page.locator('.project-index-row').filter({ hasText: 'BoundaryLens' }).click();
  await expect(page).toHaveURL(/\/missions\/boundarylens\/?$/);
  await page.locator('.file-back').click();
  await expect(page).toHaveURL(/\/#universe$/);
  await expect(page.locator('html')).toHaveAttribute('data-experience', 'quick');
  await expect(page.locator('.quick-portfolio')).toBeVisible();
  await expect(page.locator('canvas.story-world')).toHaveCount(0);
  await expect(page.locator('#universe')).toBeInViewport();
  await expect(page.locator('.project-index-row')).toHaveCount(17);
});

test('Quick Mode gives immediate profile, contacts, résumé and persistent preference', async ({
  page,
}) => {
  await openQuick(page);
  await expect(page.locator('canvas.story-world')).toHaveCount(0);
  await expect(page.locator('.q-profile h1')).toHaveText('Anwesha Kar');
  await expect(page.locator('.q-profile')).toContainText('Chandigarh University');
  await expect(page.locator('.q-profile').getByRole('link', { name: /GitHub/i })).toHaveAttribute(
    'href',
    'https://github.com/Ak-369-1729',
  );
  await expect(page.locator('.q-profile').getByRole('link', { name: /LinkedIn/i })).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/anwesha-kar-53a065230/',
  );
  await expect(page.locator('.q-profile a[href^="mailto:"]')).toHaveAttribute(
    'href',
    'mailto:anwesha.hogwarts@gmail.com',
  );
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: /Download résumé/i }).click();
  expect((await download).suggestedFilename()).toMatch(/Anwesha.*\.html$/i);
  await expect(page.locator('#flight-path')).toContainText('Adxania');
  await expect(page.locator('#vault')).toContainText('INSPIRE');
  await page.reload();
  await expect(page.locator('.quick-portfolio')).toBeVisible();
  await expect(page.locator('canvas.story-world')).toHaveCount(0);
  await page.getByRole('button', { name: 'STORY', exact: true }).click();
  await expect(page.locator('canvas.story-world')).toHaveCount(1);
});

test('Change Sky changes the rendered world, respects system preference and persists', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await openStory(page);
  await expect(page.locator('html')).toHaveAttribute('data-sky', 'light');
  const canvas = page.locator('canvas.story-world');
  await canvas.evaluate((node) => node.setAttribute('data-qa-sky', 'same-canvas'));
  const pixel = () =>
    canvas.evaluate((node) =>
      Array.from((node as HTMLCanvasElement).getContext('2d')!.getImageData(50, 50, 1, 1).data)
        .slice(0, 3)
        .reduce((sum, value) => sum + value, 0),
    );
  const daylight = await pixel();
  await page.getByRole('button', { name: /Change sky/i }).click();
  await expect(page.locator('html')).toHaveAttribute('data-sky', 'dark');
  await expect.poll(pixel).toBeLessThan(daylight - 100);
  await expect(canvas).toHaveAttribute('data-qa-sky', 'same-canvas');
  expect(await page.evaluate((key) => localStorage.getItem(key), SKY_KEY)).toBe('dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-sky', 'dark');
  await expect(page.locator('.story-copy h1')).toContainText('stars');
});

test('command palette supports focus, Story and Quick modes, sky and achievements', async ({
  page,
}) => {
  await openStory(page);
  const trigger = page.getByRole('button', { name: /Open command palette/i });
  await trigger.focus();
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('dialog', { name: 'MISSION CONTROL', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await command(page, 'Quick Mode');
  await expect(page.locator('.quick-portfolio')).toBeVisible();
  await command(page, 'Change sky');
  await expect(page.locator('html')).toHaveAttribute('data-sky', 'light');
  await command(page, 'Story Mode');
  await expect(page.locator('canvas.story-world')).toHaveCount(1);
  await command(page, 'achievements');
  await expect(page.locator('.story-experience')).toHaveAttribute('data-scene', 'flight-path');
  await expect(page.locator('.story-copy h1')).toBeFocused();
});

test('terminal commands, history and story navigation remain functional', async ({ page }) => {
  await openStory(page);
  await page.getByRole('button', { name: 'Open terminal', exact: true }).click();
  const input = page.getByLabel('Enter a system command');
  await expect(input).toBeFocused();
  for (const [entry, answer] of [
    ['whoami', 'ANWESHA KAR'],
    ['cat future.txt', 'still compiling...'],
    ['why', 'The oldest key'],
  ]) {
    await input.fill(entry);
    await input.press('Enter');
    await expect(page.getByRole('log')).toContainText(answer);
  }
  await input.press('ArrowUp');
  await expect(input).toHaveValue('why');
  await input.fill('an-unknown-command');
  await input.press('Enter');
  await expect(page.getByRole('log')).toContainText('Command not found');
  await input.fill('clear');
  await input.press('Enter');
  await expect(page.getByRole('log')).toBeEmpty();
  await input.fill('timeline');
  await input.press('Enter');
  await expect(page.locator('.terminal-dialog')).toHaveCount(0);
  await expect(page.locator('.story-experience')).toHaveAttribute('data-scene', 'flight-path');
  await page.getByRole('button', { name: 'Open terminal', exact: true }).click();
  await page.getByLabel('Enter a system command').fill('orbit');
  await page.getByLabel('Enter a system command').press('Enter');
  await expect(page.locator('.story-experience')).toHaveAttribute('data-scene', 'space');
});

test('story, Quick Mode and sky controls survive unavailable storage', async ({ page }) => {
  await page.addInitScript(() => {
    for (const method of ['getItem', 'setItem', 'removeItem'])
      Object.defineProperty(Storage.prototype, method, {
        configurable: true,
        value() {
          throw new DOMException('Storage blocked', 'SecurityError');
        },
      });
  });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await openStory(page, '/#signal');
  await page.getByRole('button', { name: /Catch the strange signal/i }).click();
  await expect(page.locator('.signal-artifact')).toContainText('QUESTION COLLECTED');
  await page.getByRole('button', { name: /Change sky/i }).click();
  await expect(page.locator('html')).toHaveAttribute('data-sky', 'light');
  await page.getByRole('button', { name: 'QUICK', exact: true }).click();
  await expect(page.locator('.quick-portfolio')).toBeVisible();
  expect(errors).toEqual([]);
});

test('reduced motion is respected and can be explicitly overridden', async ({ page }) => {
  await openStory(page);
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await expect(page.locator('.orbital-cursor')).toHaveCount(0);
  await page.getByRole('button', { name: 'REDUCED MOTION', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'full');
  await expect(page.locator('.orbital-cursor')).toHaveCount(1);
});

for (const [width, height] of [
  [1440, 1000],
  [1280, 800],
  [768, 1024],
  [390, 844],
]) {
  test(
    'Story and Quick layouts fit ' + width + 'x' + height + ' in both skies',
    async ({ page }) => {
      await page.setViewportSize({ width, height });
      await openStory(page);
      for (const mode of ['STORY', 'QUICK']) {
        await page.getByRole('button', { name: mode, exact: true }).click();
        if (mode === 'QUICK') await expect(page.locator('.quick-portfolio')).toBeVisible();
        for (const sky of ['dark', 'light']) {
          if ((await page.locator('html').getAttribute('data-sky')) !== sky)
            await page.getByRole('button', { name: /Change sky/i }).click();
          await expect(page.locator('html')).toHaveAttribute('data-sky', sky);
          const metrics = await page.evaluate(() => ({
            viewport: innerWidth,
            pageWidth: document.documentElement.scrollWidth,
          }));
          expect(metrics.pageWidth).toBeLessThanOrEqual(metrics.viewport + 1);
          const hud = await page.locator('.field-header').boundingBox();
          expect(hud).not.toBeNull();
          expect(hud!.x + hud!.width).toBeLessThanOrEqual(width + 1);
        }
      }
    },
  );
}

for (const sky of ['dark', 'light'] as const) {
  for (const scene of ['forest', 'cyberspace', 'lab', 'flight-path']) {
    test('interactive story scene ' + scene + ' is accessible / ' + sky, async ({ page }) => {
      await page.emulateMedia({ colorScheme: sky });
      await openStory(page, '/#' + scene);
      if (scene === 'cyberspace') await expect(page.locator('.security-lab')).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('data-sky', sky);
      expect(await seriousAccessibilityViolations(page)).toEqual([]);
    });
  }
  for (const surface of ['story', 'quick', 'mission'] as const) {
    test(
      'no serious or critical accessibility violations in ' + surface + ' / ' + sky,
      async ({ page }) => {
        await page.emulateMedia({ colorScheme: sky });
        if (surface === 'mission') await page.goto('/missions/nexus/');
        else if (surface === 'quick') await openQuick(page);
        else await openStory(page);
        await expect(page.locator('html')).toHaveAttribute('data-sky', sky);
        expect(await seriousAccessibilityViolations(page)).toEqual([]);
      },
    );
  }
}

test('the semantic portfolio and all mission links work without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('.story-nojs')).toBeVisible();
    await expect(page.locator('.story-nojs h1')).toHaveText('Anwesha Kar');
    await expect(page.locator('.story-nojs a[href^="/missions/"]')).toHaveCount(17);
    await expect(page.locator('.story-nojs a[href^="mailto:"]')).toHaveAttribute(
      'href',
      'mailto:anwesha.hogwarts@gmail.com',
    );
    await page.locator('.story-nojs a[href="/missions/nexus/"]').click();
    await expect(page.locator('h1')).toContainText('NEXUS');
  } finally {
    await context.close();
  }
});

test('static server preserves 404 responses, asset MIME and path boundaries', async ({
  request,
}) => {
  const missing = await request.get('/this-signal-does-not-exist-369/');
  expect(missing.status()).toBe(404);
  expect(await missing.text()).toContain('Uncharted');
  const icon = await request.get('/icon.svg');
  expect(icon.status()).toBe(200);
  expect(icon.headers()['content-type']).toContain('image/svg+xml');
  const source = await request.get('/%2e%2e%5cpackage.json');
  expect([400, 403]).toContain(source.status());
});

for (const [width, height] of [
  [1366, 768],
  [768, 1024],
  [390, 844],
  [320, 568],
  [844, 390],
]) {
  test(`world and on-demand instruments fit ${width}x${height}`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height });
    await openStory(page);
    for (const scene of scenes) {
      if (scene !== 'night') await jumpTo(page, scene, false);
      const heading = await page.locator('.story-copy').boundingBox();
      const header = await page.locator('.field-header').boundingBox();
      const nav = await page.locator('.story-navigation').boundingBox();
      expect(heading!.y, scene + ' clears header').toBeGreaterThanOrEqual(
        header!.y + header!.height,
      );
      expect(heading!.y + heading!.height, scene + ' clears navigation').toBeLessThanOrEqual(
        nav!.y - 8,
      );
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        scene + ' fits width',
      ).toBeLessThanOrEqual(width + 1);
      if (scene === 'night') continue;
      await expect(page.locator('.scene-instrument')).toBeHidden();
      await inspectScene(page);
      const instrument = await page.locator('.scene-instrument').boundingBox();
      expect(instrument!.height).toBeGreaterThan(70);
      expect(
        instrument!.y + instrument!.height,
        scene + ' instrument clears navigation',
      ).toBeLessThanOrEqual(nav!.y - 8);
      if (width > 700) {
        const a = heading!,
          b = instrument!;
        const overlap =
          Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)) *
          Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
        expect(overlap, scene + ' text and instrument separate').toBeLessThanOrEqual(1);
      } else await expect(page.locator('.story-copy')).toBeHidden();
      await page.getByRole('button', { name: 'Close field instrument', exact: true }).click();
      await expect(page.getByRole('button', { name: /^Inspect scene/ })).toBeFocused();
      await expect(page.locator('.story-copy')).toBeVisible();
    }
  });
}

test('the orbital world can be rotated, reset and explored without opening a card', async ({
  page,
}) => {
  await openStory(page);
  await expect(page.locator('.orbital-stage')).toHaveClass(/is-ready/);
  const stage = page.locator('.orbital-stage');
  await expect(stage).toHaveAttribute('data-rotation', '0.300');
  await page.getByRole('button', { name: 'Rotate observatory right', exact: true }).click();
  await expect(stage).toHaveAttribute('data-rotation', '0.700');
  const bounds = await page.locator('canvas.orbital-webgl').boundingBox();
  await page.mouse.move(bounds!.x + bounds!.width * 0.7, bounds!.y + bounds!.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(bounds!.x + bounds!.width * 0.8, bounds!.y + bounds!.height * 0.5, {
    steps: 6,
  });
  await page.mouse.up();
  await expect(stage).not.toHaveAttribute('data-rotation', '0.700');
  await page.getByRole('button', { name: 'Reset observatory rotation', exact: true }).click();
  await expect(stage).toHaveAttribute('data-rotation', '0.300');
  await jumpTo(page, 'workshop', false);
  await expect(page.locator('.scene-instrument')).toBeHidden();
  const satellites = page.getByRole('navigation', { name: 'Project satellites' });
  await expect(satellites.getByRole('link')).toHaveCount(17);
  await satellites
    .getByRole('link', { name: 'Open project satellite — NEXUS', exact: true })
    .focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/missions\/nexus\/?$/);
});

test('the complete journey works when WebGL is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (type.includes('webgl')) return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await openStory(page);
  await jumpTo(page, 'cyberspace');
  await expect(page.locator('.security-lab')).toBeVisible();
  await page.getByRole('button', { name: 'QUICK', exact: true }).click();
  await expect(page.locator('.quick-portfolio')).toBeVisible();
});

test('skill constellation opens the selected technical system', async ({ page }) => {
  await openStory(page, '/#engine', false);
  await expect(page.locator('.orbital-stage')).toHaveClass(/is-ready/);
  await page
    .getByRole('button', { name: 'Inspect skill constellation — Python', exact: true })
    .focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.infrastructure-readout h3')).toHaveText('Python');
});

test('full motion visibly animates the world without user input', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openStory(page);
  const stage = page.locator('.orbital-stage');
  await expect(stage).toHaveClass(/is-ready/);
  await expect
    .poll(async () => Number(await stage.getAttribute('data-orbit-time')))
    .toBeGreaterThan(0.25);
  const start = Number(await stage.getAttribute('data-orbit-time'));
  const before = await page.locator('canvas.orbital-webgl').screenshot();
  await expect
    .poll(async () => Number(await stage.getAttribute('data-orbit-time')) - start)
    .toBeGreaterThan(0.8);
  const after = await page.locator('canvas.orbital-webgl').screenshot();
  expect(before.equals(after)).toBe(false);
});

test('cursor and continuous scroll move the actual 3D camera', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openStory(page);
  const stage = page.locator('.orbital-stage');
  await expect(stage).toHaveClass(/is-ready/);
  const camera = async () => (await stage.getAttribute('data-camera'))!.split(',').map(Number);
  await expect(stage).toHaveAttribute('data-camera', /.+,/);
  const initial = await camera();
  await page.mouse.move(1380, 160);
  await expect.poll(async () => Math.abs((await camera())[0] - initial[0])).toBeGreaterThan(0.2);
  await page.mouse.wheel(0, 800);
  await expect.poll(async () => Math.abs((await camera())[2] - initial[2])).toBeGreaterThan(0.5);
});

test('reduced motion stays still and has an explicit play control', async ({ page }) => {
  await openStory(page);
  const stage = page.locator('.orbital-stage');
  await expect(stage).toHaveClass(/is-ready/);
  await expect(stage).toHaveAttribute('data-orbit-time', '0.000');
  await page.waitForTimeout(350);
  await expect(stage).toHaveAttribute('data-orbit-time', '0.000');
  await page.getByRole('button', { name: /Play the animated world/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'full');
  await expect
    .poll(async () => Number(await stage.getAttribute('data-orbit-time')))
    .toBeGreaterThan(0.2);
  await page.getByRole('button', { name: 'FULL MOTION', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  const paused = await stage.getAttribute('data-orbit-time');
  await page.waitForTimeout(350);
  await expect(stage).toHaveAttribute('data-orbit-time', paused!);
});

test('project orbits pause for keyboard selection and resume afterwards', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openStory(page, '/#workshop', false);
  const stage = page.locator('.orbital-stage');
  await expect(stage).toHaveClass(/is-ready/);
  await expect
    .poll(async () => Number(await stage.getAttribute('data-orbit-time')))
    .toBeGreaterThan(0.2);
  await page.getByRole('link', { name: 'Open project satellite — NEXUS', exact: true }).focus();
  const paused = Number(await stage.getAttribute('data-orbit-time'));
  await page.waitForTimeout(350);
  expect(Number(await stage.getAttribute('data-orbit-time')) - paused).toBeLessThan(0.1);
  await page.getByRole('button', { name: 'STORY', exact: true }).focus();
  await expect
    .poll(async () => Number(await stage.getAttribute('data-orbit-time')) - paused)
    .toBeGreaterThan(0.2);
});
