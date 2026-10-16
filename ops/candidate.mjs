// Build a candidate release in a separate directory. Production is never touched.
// Steps: typecheck + unit tests -> build into a temp dir -> smoke test on a temporary port ->
// move to releases/candidates/<id>. Any failure deletes the temp dir and leaves nothing behind.
//   npm run candidate            (full)
//   npm run candidate -- --skip-tests   (used by the gate, which has just run the tests)
import { spawnSync, spawn, execSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { PORTS, RELEASES_DIR, ROOT } from './config.mjs';
import { CANDIDATES, fetchOk, waitForUrl } from './lib.mjs';

const skipTests = process.argv.includes('--skip-tests');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const schema = JSON.parse(readFileSync(join(ROOT, 'src/progress/schema-version.json'), 'utf8'));
const stamp = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Jerusalem', dateStyle: 'short', timeStyle: 'medium' })
  .format(new Date()).replace(/[-: ]/g, '').replace(/^(\d{8})(\d{6})$/, '$1-$2');
const id = `${pkg.version}-${stamp}`;
const tmp = join(RELEASES_DIR, '.tmp', id);
const run = (cmd, env = {}) => spawnSync(cmd, { cwd: ROOT, stdio: 'inherit', shell: true, env: { ...process.env, ...env } }).status === 0;
const fail = (msg) => {
  rmSync(tmp, { recursive: true, force: true });
  console.error(`\nCandidate FAILED: ${msg}\nNothing was added to releases/; production is unchanged.`);
  process.exit(1);
};

console.log(`Building candidate ${id}`);
if (!skipTests) {
  if (!run('npx tsc --noEmit -p tsconfig.json')) fail('typecheck');
  if (!run('npx vitest run')) fail('unit tests');
}
mkdirSync(tmp, { recursive: true });
if (!run('npx vite build --logLevel warn', { RELEASE_ID: id, BUILD_OUT_DIR: join(tmp, 'site') })) fail('build');
cpSync(join(ROOT, 'ops/server/static-server.mjs'), join(tmp, 'server.mjs'));
const git = (args) => spawnSync(`git ${args}`, { cwd: ROOT, shell: true, encoding: 'utf8' }).stdout?.trim() || null;
const source = { commit: git('rev-parse --short HEAD'), branch: git('branch --show-current'), uncommittedChanges: !!git('status --porcelain') };
const info = { id, version: pkg.version, schema, source, builtAt: new Date().toISOString(), checks: { typecheck: !skipTests, unit: !skipTests, smoke: false } };
writeFileSync(join(tmp, 'release.json'), JSON.stringify(info, null, 2) + '\n');

// Smoke test the built files with the release's own server on a temporary port.
const smokeUrl = `http://127.0.0.1:${PORTS.smoke}`;
const srv = spawn(process.execPath, [join(tmp, 'server.mjs'), '--dir', tmp, '--port', String(PORTS.smoke), '--host', '127.0.0.1'], { stdio: 'ignore' });
const stop = () => {
  try {
    if (process.platform === 'win32') execSync(`taskkill /PID ${srv.pid} /T /F`, { stdio: 'ignore' });
    else srv.kill();
  } catch {}
};
try {
  if (!(await waitForUrl(`${smokeUrl}/__ping`))) fail('smoke: server did not start');
  const ping = await (await fetchOk(`${smokeUrl}/__ping`)).json();
  if (ping.releaseId !== id) fail(`smoke: ping returned ${ping.releaseId}`);
  const html = await (await fetchOk(`${smokeUrl}/`)).text();
  const js = html.match(/src="\.?\/?(assets\/[^"]+\.js)"/)?.[1];
  if (!js) fail('smoke: no script in index.html');
  const bundle = await (await fetchOk(`${smokeUrl}/${js}`)).text();
  if (!bundle.includes(id)) fail('smoke: release id not embedded in bundle');
  if (/serviceWorker\.register/.test(bundle)) fail('smoke: bundle registers a service worker');
  if (bundle.includes('ysl-dev')) fail('smoke: bundle uses the development storage namespace');
  if (readdirSync(join(tmp, 'site', 'assets')).filter((f) => f.endsWith('.js')).length !== 1) fail('smoke: expected a single JS bundle');
} finally {
  stop();
}
info.checks.smoke = true;
writeFileSync(join(tmp, 'release.json'), JSON.stringify(info, null, 2) + '\n');
mkdirSync(CANDIDATES, { recursive: true });
renameSync(tmp, join(CANDIDATES, id));
console.log(`\nCandidate ready: ${id}\n  preview (separate port, separate progress): npm run candidate:preview -- ${id}\n  promote when Yahli is on a break:          npm run release:promote -- ${id}`);
