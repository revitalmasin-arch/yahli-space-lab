// Claude Code PreToolUse hook: enforces the phase gate described in CLAUDE.md.
// - Work in phase N is allowed only if the gate for phase N-1 passed.
// - Phase state and gate records may only change through ops/phase.mjs and ops/gate.mjs.
// Exit 2 = block the tool call (stderr is shown to Claude).
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const block = (msg) => {
  process.stderr.write(`[phase-guard] ${msg}\n`);
  process.exit(2);
};

let input = {};
try {
  input = JSON.parse(readFileSync(0, 'utf8') || '{}');
} catch {
  process.exit(0); // unparseable payload: do not wedge the session
}
const tool = input.tool_name ?? '';
const ti = input.tool_input ?? {};

const PROTECTED = /(^|[^\w.])\.claude[\\/](phases\.json|gates([\\/]|\b|$))/;

if (tool === 'Bash' || tool === 'PowerShell') {
  const cmd = String(ti.command ?? '');
  const viaScripts = /\b(ops[\/](phase|gate)\.mjs|npm run (gate|phase:next|phase:status))\b/.test(cmd);
  if (PROTECTED.test(cmd.replace(/["']/g, '')) && !viaScripts) {
    block('Phase state and gate records change only via `npm run gate` / `npm run phase:next`.');
  }
  process.exit(0);
}

const file = ti.file_path ?? ti.notebook_path;
if (!file) process.exit(0);
const rel = relative(root, resolve(file));
if (rel.startsWith('..')) process.exit(0); // outside the project (e.g. scratchpad)
if (PROTECTED.test(rel)) block('Do not edit phase state or gate records directly; run `npm run gate` then `npm run phase:next`.');

let state;
try {
  state = JSON.parse(readFileSync(join(root, '.claude/phases.json'), 'utf8'));
} catch {
  block('.claude/phases.json is missing or invalid; restore it before continuing.');
}
const current = Number(state.current);
if (current > 1) {
  const gateFile = join(root, `.claude/gates/phase-${current - 1}.json`);
  let ok = false;
  if (existsSync(gateFile)) {
    try {
      const g = JSON.parse(readFileSync(gateFile, 'utf8'));
      ok = g.passed === true && g.phase === current - 1;
    } catch {}
  }
  if (!ok) block(`Phase ${current} is locked: the gate for phase ${current - 1} has not passed. Run \`npm run gate\`.`);
}
process.exit(0);
