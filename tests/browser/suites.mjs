// E2E suites by phase. A suite runs in its own phase's gate and in every later gate (regression).
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};
const KEY = 'ysl-dev:progress';

async function setStored(page, url, value) {
  await page.goto(url);
  await page.evaluate(([k, v]) => localStorage.setItem(k, v), [KEY, value]);
  await page.reload();
}

export const suites = [
  {
    phase: 1,
    tests: {
      'app shell loads with Hebrew title and dev badge': async ({ page, url }) => {
        await page.goto(url);
        await page.getByRole('heading', { level: 1 }).waitFor();
        const h1 = await page.getByRole('heading', { level: 1 }).textContent();
        assert(h1?.includes('מַעְבֶּדֶת'), `unexpected title: ${h1}`);
        assert(await page.getByText("DEV — not Yahli's version").isVisible(), 'dev badge missing');
      },
      'malformed stored progress: app still renders and a copy is kept': async ({ page, url }) => {
        await setStored(page, url, '{garbage');
        await page.getByTestId('notice-quarantine').waitFor();
        const copies = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('ysl-dev:quarantine:')).map((k) => localStorage.getItem(k)));
        assert(copies.length === 1 && copies[0] === '{garbage', `quarantine copy missing: ${JSON.stringify(copies)}`);
      },
      'progress from a newer schema is shown read-only and never overwritten': async ({ page, url }) => {
        const raw = JSON.stringify({ schema: 9, attempts: [], productions: [], concepts: {}, units: {}, xp: {}, time: {}, settings: {} });
        await setStored(page, url, raw);
        await page.getByTestId('notice-readonly').waitFor();
        await page.waitForTimeout(800); // longer than the save debounce
        assert((await page.evaluate((k) => localStorage.getItem(k), KEY)) === raw, 'newer-schema data was modified');
      },
    },
  },
];
