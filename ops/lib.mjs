// Shared helpers for release tooling. No dependencies beyond Node itself.
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync, readdirSync, statSync, openSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { spawn, execSync } from 'node:child_process';
import { networkInterfaces } from 'node:os';
import { RELEASES_DIR, STATE_DIR, PROD_PORT } from './config.mjs';

export const CANDIDATES = join(RELEASES_DIR, 'candidates');
export const INSTALLED = join(RELEASES_DIR, 'installed');
const STATE_FILE = join(RELEASES_DIR, 'state.json');

export function readJson(p, fallback = null) {
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch {
    return fallback;
  }
}
export function writeJsonAtomic(p, data) {
  const tmp = `${p}.tmp`;
  writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n');
  renameSync(tmp, p);
}

/** { active, previous, history: [{ at, action, from, to }] } */
export function readState() {
  return readJson(STATE_FILE, { active: null, previous: null, history: [] });
}
export function writeState(s) {
  mkdirSync(RELEASES_DIR, { recursive: true });
  writeJsonAtomic(STATE_FILE, s);
}
export const releaseInfo = (dir) => readJson(join(dir, 'release.json'));

/**
 * Progress-data compatibility. `from` is the release whose data is in Yahli's browsers now,
 * `to` is the release we want to serve. `to` must be able to read what `from` wrote.
 */
export function canServe(to, from) {
  if (!from) return { ok: true };
  if (from.schema.current > to.schema.current) {
    return { ok: false, reason: `progress written by ${from.id} uses data version ${from.schema.current}; ${to.id} only understands up to ${to.schema.current}` };
  }
  if (from.schema.current < to.schema.minReadable) {
    return { ok: false, reason: `${to.id} cannot read data version ${from.schema.current} (minimum ${to.schema.minReadable})` };
  }
  return { ok: true };
}

export function hashDir(dir) {
  const h = createHash('sha256');
  (function walk(d) {
    for (const name of readdirSync(d).sort()) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else h.update(name).update(readFileSync(p));
    }
  })(dir);
  return h.digest('hex');
}

export async function fetchOk(url, ms = 2000) {
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(ms) });
    return r.ok ? r : null;
  } catch {
    return null;
  }
}
export async function waitForUrl(url, ms = 15000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (await fetchOk(url, 1000)) return true;
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}

// ---- production process ----
const PID_FILE = join(STATE_DIR, 'prod.pid');
export const ACTIVITY_FILE = join(STATE_DIR, 'activity.json');

export function pidAlive(pid) {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}
export function prodPid() {
  const pid = Number(readJson(PID_FILE)?.pid);
  return pidAlive(pid) ? pid : null;
}
export async function prodPing() {
  const r = await fetchOk(`http://127.0.0.1:${PROD_PORT}/__ping`);
  return r ? r.json() : null;
}

export async function startProd(releaseId) {
  const dir = join(INSTALLED, releaseId);
  if (!existsSync(join(dir, 'server.mjs'))) throw new Error(`release ${releaseId} is not installed`);
  if (await prodPing()) throw new Error(`port ${PROD_PORT} is already serving the app (stop it first)`);
  mkdirSync(STATE_DIR, { recursive: true });
  const log = openSync(join(STATE_DIR, 'prod.log'), 'a');
  const child = spawn(process.execPath, [join(dir, 'server.mjs'), '--dir', dir, '--port', String(PROD_PORT), '--host', '0.0.0.0', '--state', STATE_DIR], {
    detached: true,
    stdio: ['ignore', log, log],
    windowsHide: true,
  });
  child.unref();
  writeJsonAtomic(PID_FILE, { pid: child.pid, release: releaseId, startedAt: new Date().toISOString(), port: PROD_PORT });
  if (!(await waitForUrl(`http://127.0.0.1:${PROD_PORT}/__ping`))) throw new Error(`production did not start; see ${join(STATE_DIR, 'prod.log')}`);
  return child.pid;
}

export async function stopProd() {
  const pid = prodPid();
  if (!pid) return false;
  try {
    if (process.platform === 'win32') execSync(`taskkill /PID ${pid} /T /F`, { stdio: 'ignore' });
    else process.kill(pid);
  } catch {}
  for (let i = 0; i < 40 && (await prodPing()); i++) await new Promise((r) => setTimeout(r, 100));
  return true;
}

/** Minutes since the app last reported real use (taps within the last 2 minutes), or null if never. */
export function minutesSinceActivity() {
  const a = readJson(ACTIVITY_FILE, {});
  const times = Object.values(a).map((x) => Date.parse(x.lastActive)).filter(Number.isFinite);
  if (!times.length) return null;
  return (Date.now() - Math.max(...times)) / 60000;
}
export const activityByClient = () => readJson(ACTIVITY_FILE, {});

export function lanAddresses() {
  return Object.values(networkInterfaces())
    .flat()
    .filter((i) => i && i.family === 'IPv4' && !i.internal && !i.address.startsWith('169.254'))
    .map((i) => i.address);
}

