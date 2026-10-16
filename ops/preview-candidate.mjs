// Serve a candidate on the staging port for manual testing (its own origin, so its own progress).
//   npm run candidate:preview -- <candidateId> [--lan]
import { spawn } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { PORTS } from './config.mjs';
import { CANDIDATES, lanAddresses } from './lib.mjs';

const id = process.argv[2] ?? (existsSync(CANDIDATES) ? readdirSync(CANDIDATES).sort().pop() : undefined);
if (!id || !existsSync(join(CANDIDATES, id))) {
  console.error('No such candidate. Build one with `npm run candidate`.');
  process.exit(1);
}
const lan = process.argv.includes('--lan');
const dir = join(CANDIDATES, id);
console.log(`Previewing ${id} (not production) at http://localhost:${PORTS.staging}${lan ? lanAddresses().map((ip) => `  and http://${ip}:${PORTS.staging}`).join('') : ''}\nCtrl+C to stop.`);
spawn(process.execPath, [join(dir, 'server.mjs'), '--dir', dir, '--port', String(PORTS.staging), '--host', lan ? '0.0.0.0' : '127.0.0.1'], { stdio: 'inherit' });
