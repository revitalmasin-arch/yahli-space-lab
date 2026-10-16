// Static guardrails. Run first in every gate: cheap checks for rules that must never break.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ROOT, PORTS } from './config.mjs';

const phase = Number(process.argv[2] ?? JSON.parse(readFileSync(join(ROOT, '.claude/phases.json'), 'utf8')).current);

function files(dir, exts) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...files(p, exts));
    else if (exts.some((e) => name.endsWith(e))) out.push(p);
  }
  return out;
}
const read = (p) => readFileSync(p, 'utf8');
const rel = (p) => relative(ROOT, p).replace(/\\/g, '/');
const src = files(join(ROOT, 'src'), ['.ts', '.tsx']);
const failures = [];
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok || !detail ? '' : ` — ${detail}`}`);
  if (!ok) failures.push(name);
};
const grep = (list, re) => list.filter((f) => re.test(read(f))).map(rel);

// App behaviour
let hits = grep(src, /serviceWorker/);
check('no service worker (no silent app replacement)', hits.length === 0, hits.join(', '));
hits = grep(src, /location\.reload|location\.href\s*=|location\.replace/);
check('no automatic page reloads', hits.length === 0, hits.join(', '));
hits = grep(src, /localStorage\.clear\s*\(/);
check('progress is never cleared wholesale', hits.length === 0, hits.join(', '));
hits = grep(src.filter((f) => rel(f) !== 'src/progress/storage.ts'), /removeItem\s*\(/);
check('only the storage module removes keys', hits.length === 0, hits.join(', '));
hits = grep(src, /\bautoplay\b/i);
check('no autoplaying media', hits.length === 0, hits.join(', '));
hits = src.filter((f) => [...read(f).matchAll(/fetch\(\s*([^)]*)\)/g)].some((m) => !m[1].includes('__ping'))).map(rel);
check('app makes no network calls except the local release ping', hits.length === 0, hits.join(', '));

// Secrets
const allCode = [...src, ...files(join(ROOT, 'ops'), ['.mjs', '.js']), ...files(join(ROOT, 'tests'), ['.ts', '.mjs'])];
hits = grep(allCode.filter((f) => rel(f) !== 'ops/guardrails.mjs'), /sk-[A-Za-z0-9_-]{20,}|AIza[0-9A-Za-z_-]{30,}|-----BEGIN [A-Z ]*PRIVATE KEY/);
check('no API keys or private keys in code', hits.length === 0, hits.join(', '));

// Environment separation
const pkg = JSON.parse(read(join(ROOT, 'package.json')));
check('dev server pinned to its own port with --strictPort', /--port 5180 --strictPort/.test(pkg.scripts.dev));
check('no other port collides with production', !Object.entries(PORTS).some(([k, v]) => k !== 'prod' && v === PORTS.prod));
const testFiles = [...files(join(ROOT, 'tests'), ['.ts', '.mjs']), join(ROOT, 'ops/gate.mjs')].filter(existsSync);
hits = grep(testFiles, new RegExp(`(PORTS\\.prod\\b|localhost:${PORTS.prod}\\b|[:=]\\s*${PORTS.prod}\\b)`));
check('automated tests never target the production port', hits.length === 0, hits.join(', '));
const storage = join(ROOT, 'src/progress/storage.ts');
check('progress storage exists and its key includes the environment', existsSync(storage) && /__APP_ENV__/.test(read(storage)));
check('progress schema version is declared', existsSync(join(ROOT, 'src/progress/schema-version.json')));

if (phase >= 4) {
  for (const f of ['ops/candidate.mjs', 'ops/prod.mjs', 'ops/releases.mjs', 'ops/server/static-server.mjs']) {
    check(`release tooling present: ${f}`, existsSync(join(ROOT, f)));
  }
  const server = join(ROOT, 'ops/server/static-server.mjs');
  if (existsSync(server)) {
    check('production server does not watch files or auto-reload', !/fs\.watch|chokidar|watchFile/.test(read(server)));
  }
}
if (phase >= 5) {
  const readme = join(ROOT, 'README.md');
  check('Hebrew README present', existsSync(readme) && /[֐-׿]/.test(read(readme)));
}

console.log(failures.length ? `\nGuardrails FAILED (${failures.length})` : '\nGuardrails passed');
process.exit(failures.length ? 1 : 0);
