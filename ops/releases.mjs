// Release management. Nothing here runs automatically; every switch is an explicit command.
//   npm run release:list
//   npm run release:promote -- <candidateId> [--force]
//   npm run release:rollback [--force] [--accept-readonly]
// --force skips the "used in the last 20 minutes" check (only when you know Yahli is on a break).
import { cpSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { QUIET_MINUTES } from './config.mjs';
import { CANDIDATES, INSTALLED, canServe, minutesSinceActivity, prodPing, readState, releaseInfo, startProd, stopProd, writeState } from './lib.mjs';

const [cmd, ...rest] = process.argv.slice(2);
const flags = new Set(rest.filter((a) => a.startsWith('--')));
const positional = rest.filter((a) => !a.startsWith('--'));
const die = (msg) => {
  console.error(msg);
  process.exit(1);
};

async function guardQuiet() {
  if (flags.has('--force')) return;
  if (!(await prodPing())) return; // not running: nobody can be using it
  const m = minutesSinceActivity();
  if (m !== null && m < QUIET_MINUTES) {
    die(`Refusing: the app was in use ${m.toFixed(1)} min ago (Yahli may be studying). Nothing changed.\n` +
      `Try again during a break, or add --force if you are sure nobody is using it.`);
  }
}

async function switchTo(id, action) {
  const s = readState();
  const wasRunning = await prodPing();
  writeState({ active: id, previous: s.active, history: [...(s.history ?? []), { at: new Date().toISOString(), action, from: s.active, to: id }] });
  if (wasRunning) {
    await stopProd();
    await startProd(id);
    console.log(`Production restarted on ${id}. Open tabs keep the old version until reloaded; progress stays in the browser.`);
  } else {
    console.log(`Active release is now ${id}. Start it with \`npm run prod:start\`.`);
  }
}

if (cmd === 'list') {
  const s = readState();
  const show = (dir, label) => {
    if (!existsSync(dir)) return;
    for (const id of readdirSync(dir).sort()) {
      const r = releaseInfo(join(dir, id));
      const mark = id === s.active ? ' [ACTIVE]' : id === s.previous ? ' [previous]' : '';
      console.log(`${label} ${id}  data v${r?.schema.current}${mark}`);
    }
  };
  show(INSTALLED, 'installed');
  show(CANDIDATES, 'candidate');
} else if (cmd === 'promote') {
  const id = positional[0] ?? die('Usage: npm run release:promote -- <candidateId>   (see npm run release:list)');
  const cand = join(CANDIDATES, id);
  const info = releaseInfo(cand) ?? die(`No candidate ${id}.`);
  if (!info.checks?.smoke) die(`Candidate ${id} did not pass its smoke test.`);
  const s = readState();
  if (s.active === id) die(`${id} is already active.`);
  const current = s.active ? releaseInfo(join(INSTALLED, s.active)) : null;
  const compat = canServe(info, current);
  if (!compat.ok) die(`Refusing: ${compat.reason}. Add a migration in the candidate first.`);
  await guardQuiet();
  if (!existsSync(join(INSTALLED, id))) cpSync(cand, join(INSTALLED, id), { recursive: true });
  await switchTo(id, 'promote');
} else if (cmd === 'rollback') {
  const s = readState();
  if (!s.previous) die('No previous release to roll back to.');
  const target = releaseInfo(join(INSTALLED, s.previous));
  const current = releaseInfo(join(INSTALLED, s.active));
  const compat = canServe(target, current);
  if (!compat.ok && !flags.has('--accept-readonly')) {
    die(`Refusing rollback: ${compat.reason}.\nRolling back would show Yahli's progress read-only (it is never erased, but he could not save new work).\n` +
      `Prefer fixing forward with a new candidate. If you must, add --accept-readonly.`);
  }
  await guardQuiet();
  await switchTo(s.previous, 'rollback');
} else {
  die('Commands: list | promote <id> | rollback');
}
