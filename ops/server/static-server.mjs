// Production static server. A copy of this file is placed inside every release, so later edits in the
// development tree can never change a release that is already built or running.
// No file watching, no reloads, no service worker. Only GET/HEAD of the release's own files, plus
// /__ping (release identity + an "in use" signal for safe updates).
//   node server.mjs --dir <releaseDir> --port 8090 --host 0.0.0.0 --state <stateDir>
import { createServer } from 'node:http';
import { createReadStream, existsSync, readFileSync, statSync, writeFileSync, renameSync, mkdirSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';

const arg = (n, d) => {
  const i = process.argv.indexOf(n);
  return i > -1 ? process.argv[i + 1] : d;
};
const dir = resolve(arg('--dir', '.'));
const site = join(dir, 'site');
const port = Number(arg('--port', '8090'));
const host = arg('--host', '0.0.0.0');
const stateDir = arg('--state');
const release = JSON.parse(readFileSync(join(dir, 'release.json'), 'utf8'));

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.txt': 'text/plain; charset=utf-8',
};

const activity = {};
function noteActivity(ip) {
  if (!stateDir) return;
  activity[ip] = { lastActive: new Date().toISOString() };
  try {
    mkdirSync(stateDir, { recursive: true });
    const f = join(stateDir, 'activity.json');
    const prev = existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {};
    writeFileSync(`${f}.tmp`, JSON.stringify({ ...prev, ...activity }, null, 2));
    renameSync(`${f}.tmp`, f);
  } catch {}
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://x');
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405).end();
    return;
  }
  if (url.pathname === '/__ping') {
    if (url.searchParams.get('active') === '1') noteActivity(req.socket.remoteAddress ?? 'unknown');
    res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' });
    res.end(JSON.stringify({ releaseId: release.id, version: release.version, schema: release.schema }));
    return;
  }
  let rel = decodeURIComponent(url.pathname);
  if (rel.endsWith('/')) rel += 'index.html';
  const file = normalize(join(site, rel));
  if (!file.startsWith(site + sep) && file !== site) {
    res.writeHead(403).end();
    return;
  }
  const target = existsSync(file) && statSync(file).isFile() ? file : join(site, 'index.html');
  const isAsset = target.includes(`${sep}assets${sep}`);
  res.writeHead(200, {
    'content-type': TYPES[extname(target).toLowerCase()] ?? 'application/octet-stream',
    // index.html is re-checked on each visit; hashed assets never change for a given name.
    'cache-control': isAsset ? 'public, max-age=31536000, immutable' : 'no-cache',
    'x-content-type-options': 'nosniff',
  });
  if (req.method === 'HEAD') return res.end();
  createReadStream(target).pipe(res);
});

server.on('error', (e) => {
  console.error(`[${new Date().toISOString()}] cannot listen on ${host}:${port}: ${e.code ?? e.message}`);
  process.exit(1);
});
server.listen(port, host, () => {
  console.log(`[${new Date().toISOString()}] serving release ${release.id} on ${host}:${port}`);
});
