// E2E browser checks, run by the gate. Starts its own dev server on the e2e test port (never production),
// runs every suite up to the current phase in headless Chrome, then shuts everything down.
//   node tests/browser/flow.mjs --phase N [--url http://host:port]  (--url skips starting a server)
import { spawn, execSync } from 'node:child_process';
import { chromium } from 'playwright-core';
import { PORTS, ROOT } from '../../ops/config.mjs';
import { suites } from './suites.mjs';

const arg = (name, def) => {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : def;
};
const phase = Number(arg('--phase', '1'));
const TEST_NOW = '2026-10-16T12:00:00+03:00';
let url = arg('--url');
let server;

async function waitFor(u, ms = 30000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try {
      if ((await fetch(u)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`server at ${u} did not start`);
}

function stopServer() {
  if (!server?.pid) return;
  try {
    if (process.platform === 'win32') execSync(`taskkill /PID ${server.pid} /T /F`, { stdio: 'ignore' });
    else process.kill(-server.pid);
  } catch {}
}

let failed = 0;
let browser;
try {
  if (!url) {
    url = `http://127.0.0.1:${PORTS.e2e}/`;
    server = spawn(`npx vite --port ${PORTS.e2e} --strictPort --host 127.0.0.1`, { cwd: ROOT, shell: true, stdio: 'ignore', detached: process.platform !== 'win32' });
    await waitFor(url);
  }
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  for (const suite of suites.filter((s) => s.phase <= phase)) {
    for (const [name, fn] of Object.entries(suite.tests)) {
      // Each test gets a fresh browser context: empty localStorage, like a new device.
      const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, locale: 'he-IL' });
      const page = await context.newPage();
      // Fixed date so plan-dependent screens are the same on any day the tests run (Day 1 shown as "today's mission").
      await page.clock.setFixedTime(new Date(TEST_NOW));
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      try {
        await fn({ page, context, url, errors });
        if (errors.length) throw new Error(`page errors: ${errors.join(' | ')}`);
        console.log(`PASS  [phase ${suite.phase}] ${name}`);
      } catch (e) {
        failed++;
        console.log(`FAIL  [phase ${suite.phase}] ${name}\n      ${String(e?.message ?? e).split('\n')[0]}`);
      } finally {
        await context.close();
      }
    }
  }
} catch (e) {
  failed++;
  console.log(`FAIL  e2e setup: ${e?.message ?? e}`);
} finally {
  await browser?.close();
  stopServer();
}
console.log(failed ? `\nE2E FAILED (${failed})` : '\nE2E passed');
process.exit(failed ? 1 : 0);
