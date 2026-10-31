import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function openExperience(page: Page) {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', /full|reduced/);
}

test('project search, empty recovery, category filter and mission index work', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await openExperience(page);
  const atlas = page.locator('.project-atlas');
  await expect(atlas.locator('.project-node')).toHaveCount(17);
  await page.getByLabel('Search projects, categories or technologies').fill('no-such-signal-369');
  await expect(atlas.locator('.atlas-empty')).toBeVisible();
  await atlas.getByRole('button', { name: /CLEAR FILTERS/ }).click();
  await expect(atlas.locator('.project-node')).toHaveCount(17);
  await atlas.getByRole('button', { name: 'Cybersecurity', exact: true }).click();
  await expect(atlas.locator('.project-node')).not.toHaveCount(17);
  expect(await atlas.locator('.project-node').count()).toBeGreaterThan(0);
  await atlas.getByRole('button', { name: 'ALL SIGNALS', exact: true }).click();
  await atlas.getByRole('button', { name: /INDEX/ }).click();
  await expect(atlas.locator('.project-index-row')).toHaveCount(17);
  await atlas.locator('.project-index-row').filter({ hasText: 'NEXUS' }).click();
  await expect(page).toHaveURL(/\/missions\/nexus\/?$/);
  await expect(page.locator('h1')).toContainText('NEXUS');
  await expect(page.locator('.file-evidence')).toBeVisible();
  await expect(page.locator('.file-meta')).toContainText('SOURCE AVAILABLE');
  expect(errors).toEqual([]);
});

test('command palette supports keyboard search, dismissal and destination focus', async ({
  page,
}) => {
  await openExperience(page);
  const trigger = page.getByRole('button', { name: 'Open command palette' });
  await trigger.focus();
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog', { name: 'MISSION CONTROL' });
  await expect(dialog).toBeVisible();
  await expect(page.getByLabel('Search commands')).toBeFocused();
  await page.getByLabel('Search commands').fill('research');
  await expect(dialog.getByRole('option')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Control+k');
  await page.getByLabel('Search commands').fill('projects');
  await page.keyboard.press('Enter');
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('#universe')).toBeFocused();
});

test('terminal commands, history and clear are functional', async ({ page }) => {
  await openExperience(page);
  await page.getByRole('button', { name: 'Open terminal', exact: true }).click();
  const input = page.getByLabel('Enter a system command');
  await expect(input).toBeFocused();
  await input.fill('whoami');
  await input.press('Enter');
  await expect(page.getByRole('log')).toContainText('ANWESHA KAR');
  await input.fill('cat future.txt');
  await input.press('Enter');
  await expect(page.getByRole('log')).toContainText('still compiling...');
  await input.press('ArrowUp');
  await expect(input).toHaveValue('cat future.txt');
  await input.fill('an-unknown-command');
  await input.press('Enter');
  await expect(page.getByRole('log')).toContainText('Command not found');
  await input.fill('clear');
  await input.press('Enter');
  await expect(page.getByRole('log')).toBeEmpty();
  await page.keyboard.press('Escape');
  await expect(page.locator('.terminal-dialog')).toHaveCount(0);
});

test('threat isolation awards once and progress survives reload', async ({ page }) => {
  await openExperience(page);
  const score = page.locator('.score-hud strong');
  await expect(score).toHaveText('000');
  const lab = page.locator('.security-lab');
  await lab.locator('.network-node:not(.anomaly)').first().click();
  await lab.getByRole('button', { name: /ISOLATE SELECTED NODE/ }).click();
  await expect(lab.locator('.security-message')).toContainText('healthy');
  await expect(score).toHaveText('000');
  await lab.locator('.network-node.anomaly').click();
  await expect(lab.locator('.node-metrics')).toContainText('UNKNOWN HOST');
  await lab.getByRole('button', { name: /ISOLATE SELECTED NODE/ }).click();
  await expect(lab.locator('.security-message')).toContainText('THREAT CONTAINED');
  await expect(score).toHaveText('100');
  await lab.getByRole('button', { name: /RESET SIMULATION/ }).click();
  await lab.locator('.network-node.anomaly').click();
  await lab.getByRole('button', { name: /ISOLATE SELECTED NODE/ }).click();
  await expect(score).toHaveText('100');
  await page.reload();
  await expect(score).toHaveText('100');
});

test('experience remains usable when persistent storage is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    for (const method of ['getItem', 'setItem', 'removeItem']) {
      Object.defineProperty(Storage.prototype, method, {
        configurable: true,
        value() {
          throw new DOMException('Storage blocked', 'SecurityError');
        },
      });
    }
  });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await openExperience(page);
  await page.getByRole('button', { name: /INITIALIZE EXPLORATION/ }).click();
  await expect(page.locator('.score-hud strong')).toHaveText('010');
  await page.getByRole('button', { name: 'Switch to recruiter mode' }).click();
  await expect(page.locator('.experience')).toHaveClass(/recruiter/);
  expect(errors).toEqual([]);
});

test('recruiter mode surfaces the briefing and persists', async ({ page }) => {
  await openExperience(page);
  await page.getByRole('button', { name: 'Switch to recruiter mode' }).click();
  await expect(page.getByRole('complementary', { name: 'Recruiter briefing' })).toBeVisible();
  await expect(page.locator('.signal-section')).toBeHidden();
  await expect(page.locator('#universe')).toBeVisible();
  await page.reload();
  await expect(page.locator('.experience')).toHaveClass(/recruiter/);
  await page.getByRole('button', { name: 'Switch to explorer mode' }).click();
  await expect(page.locator('.signal-section')).toBeVisible();
});

test('system reduced motion is respected and can be toggled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openExperience(page);
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await expect(page.locator('.terminal-caret')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.orbital-cursor')).toHaveCount(0);
  await page.getByRole('button', { name: 'MOTION REDUCED', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'full');
});

for (const width of [390, 768, 1440]) {
  test(`layout stays within a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 960 });
    await openExperience(page);
    await expect(page.locator('.project-node')).toHaveCount(17);
    const metrics = await page.evaluate(() => ({
      viewport: innerWidth,
      pageWidth: document.documentElement.scrollWidth,
    }));
    expect(metrics.pageWidth).toBeLessThanOrEqual(metrics.viewport + 1);
    const hud = await page.locator('.mission-hud').boundingBox();
    expect(hud).not.toBeNull();
    expect(hud!.x + hud!.width).toBeLessThanOrEqual(width + 1);
    if (width === 390) {
      await expect(page.getByRole('button', { name: 'Mission navigation' })).toBeVisible();
      await page.getByRole('button', { name: 'Mission navigation' }).click();
      await expect(page.locator('#chapter-nav')).toBeVisible();
      await page
        .locator('#chapter-nav')
        .getByRole('link', { name: /UNIVERSE/ })
        .click();
      await expect(page.locator('#universe')).toBeFocused();
      await expect(page.locator('#chapter-nav')).toBeHidden();
    }
  });
}

for (const path of ['/', '/missions/nexus/']) {
  test(`no serious or critical accessibility violations at ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const violations = results.violations.filter(
      (violation) => violation.impact === 'serious' || violation.impact === 'critical',
    );
    expect(
      violations.map((violation) => ({
        id: violation.id,
        description: violation.description,
        nodes: violation.nodes.map((node) => ({
          target: node.target,
          summary: node.failureSummary,
        })),
      })),
    ).toEqual([]);
  });
}

test('static server returns real 404s, correct MIME and rejects traversal', async ({ request }) => {
  const missing = await request.get('/this-signal-does-not-exist-369/');
  expect(missing.status()).toBe(404);
  expect(await missing.text()).toContain('Uncharted');
  const icon = await request.get('/icon.svg');
  expect(icon.status()).toBe(200);
  expect(icon.headers()['content-type']).toContain('image/svg+xml');
  const source = await request.get('/%2e%2e%5cpackage.json');
  expect([400, 403]).toContain(source.status());
});
