// System test for dev/prod separation. Runs entirely in a throwaway sandbox: its own releases dir,
// state dir and port (PORTS.sandboxProd). Never touches the real production release or port.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright-core';
import { PORTS, ROOT } from '../../ops/config.mjs';

const box = mkdtempSync(join(tmpdir(), 'ysl-sandbox-'));
const env = { ...process.env, YSL_RELEASES_DIR: join(box, 'releases'), YSL_STATE_DIR: join(box, 'state'), YSL_PROD_PORT: String(PORTS.sandboxProd) };
const base = `http://127.0.0.1:${PORTS.sandboxProd}`;
const KEY = 'ysl-prod:progress';
const run = (args) => spawnSync(process.execPath, args, { cwd: ROOT, env, encoding: 'utf8' });
const candidates = () => (existsSync(join(box, 'releases/candidates')) ? readdirSync(join(box, 'releases/candidates')).sort() : []);
let failed = 0;
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  [release] ${name}${ok ? '' : ` — ${detail}`}`);
  if (!ok) failed++;
};
const sha = (s) => createHash('sha256').update(s).digest('hex');
async function servedSnapshot() {
  const html = await (await fetch(`${base}/`)).text();
  const js = html.match(/src="\.?\/?(assets\/[^"]+\.js)"/)[1];
  const bundle = await (await fetch(`${base}/${js}`)).text();
  const ping = await (await fetch(`${base}/__ping`)).json();
  return { html: sha(html), bundle: sha(bundle), release: ping.releaseId };
}
const hashInstalled = (id) => run(['-e', `import('./ops/lib.mjs').then(m=>console.log(m.hashDir(${JSON.stringify(join(box, 'releases/installed', id))})))`]).stdout.trim();

const mainFile = join(ROOT, 'src/main.tsx');
const mainOriginal = readFileSync(mainFile, 'utf8');
const brokenProbe = join(ROOT, 'src/__isolation_probe_broken.ts');
let browser;
try {
  // Release A becomes production.
  let r = run(['ops/candidate.mjs', '--skip-tests']);
  const A = candidates()[0];
  check('candidate A builds into the candidates directory', r.status === 0 && !!A, r.stderr);
  r = run(['ops/releases.mjs', 'promote', A]);
  check('promote A', r.status === 0, r.stderr);
  r = run(['ops/prod.mjs', 'start']);
  check('production starts on its fixed port', r.status === 0, r.stderr + r.stdout);

  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.clock.setFixedTime(new Date('2026-10-16T12:00:00+03:00')); // date-independent: Day 1 is "today's mission"
  await page.goto(base);
  await page.getByTestId('mission').getByTestId('open-u2').click();
  // Answer one warm-up question to completion (production has no answer hints: tap until done).
  for (let i = 0; i < 6; i++) {
    if (await page.getByTestId('solved').isVisible()) { await page.getByTestId('solved').getByRole('button', { name: /Next/ }).click(); break; }
    if (await page.getByTestId('help-3').isVisible()) { await page.getByRole('button', { name: /Try a new question/ }).click(); break; }
    await page.locator('section[data-testid^="question-"] button.choice:not([disabled])').first().click();
    await page.waitForTimeout(100);
  }
  await page.waitForTimeout(600);
  const before = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), KEY);
  check('learning activity is saved in production storage', before?.attempts?.length === 1, JSON.stringify(before?.attempts));
  check('production build has no dev-only answer hints', (await page.locator('[data-ok]').count()) === 0);
  check('production shows no DEV badge', (await page.getByText("DEV — not Yahli's version").count()) === 0);

  const prodBefore = { served: await servedSnapshot(), files: hashInstalled(A) };

  // Edit development code, build candidate B, then attempt a failing build.
  writeFileSync(mainFile, mainOriginal + `\n// isolation probe ${Date.now()}\n`);
  r = run(['ops/candidate.mjs', '--skip-tests']);
  const B = candidates().find((c) => c !== A);
  check('candidate B builds after a dev edit', r.status === 0 && !!B, r.stderr);
  writeFileSync(brokenProbe, "const broken: number = 'not a number';\nexport default broken;\n");
  const countBefore = candidates().length;
  r = run(['ops/candidate.mjs']);
  check('a failing build is rejected', r.status !== 0);
  check('a failing build leaves nothing in releases', candidates().length === countBefore && !existsSync(join(box, 'releases/.tmp', 'x')));
  rmSync(brokenProbe, { force: true });
  writeFileSync(mainFile, mainOriginal);

  const prodAfter = { served: await servedSnapshot(), files: hashInstalled(A) };
  check('production files unchanged by dev edit + builds', prodAfter.files === prodBefore.files);
  check('production serves identical bytes and the same release', JSON.stringify(prodAfter.served) === JSON.stringify(prodBefore.served), JSON.stringify(prodAfter.served));

  // Update guard: the app reports use; promote must refuse without --force.
  await page.evaluate(() => fetch('./__ping?active=1'));
  r = run(['ops/releases.mjs', 'promote', B]);
  check('promote refuses while the app is in use', r.status !== 0 && /in use/.test(r.stderr), r.stderr + r.stdout);
  check('refused promote changed nothing', (await servedSnapshot()).release === A);

  // Promote B during a "break" and check progress survives the update.
  r = run(['ops/releases.mjs', 'promote', B, '--force']);
  check('promote B (explicit)', r.status === 0, r.stderr);
  await page.reload();
  const afterUpdate = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), KEY);
  check('progress persists after the update', afterUpdate?.attempts?.length === before.attempts.length);
  await page.getByTestId('open-parent').click();
  check('parent view shows the new release', (await page.getByTestId('release-id').textContent()) === B);

  // Compatible rollback to A.
  r = run(['ops/releases.mjs', 'rollback', '--force']);
  check('rollback to A (compatible schema)', r.status === 0, r.stderr);
  await page.reload();
  const afterRollback = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)), KEY);
  check('progress persists after the rollback', afterRollback?.attempts?.length === before.attempts.length);
  check('rollback serves release A again', (await servedSnapshot()).release === A);
} catch (e) {
  check('release system test ran', false, String(e?.stack ?? e));
} finally {
  writeFileSync(mainFile, mainOriginal);
  rmSync(brokenProbe, { force: true });
  await browser?.close();
  run(['ops/prod.mjs', 'stop']);
  rmSync(box, { recursive: true, force: true });
}
console.log(failed ? `\nRelease tests FAILED (${failed})` : '\nRelease tests passed');
process.exit(failed ? 1 : 0);
