// Phase gate: guardrails -> regression -> e2e, in that order. Stops at the first failure.
// A passing run writes .claude/gates/phase-N.json, which unlocks `npm run phase:next`.
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './config.mjs';

const state = JSON.parse(readFileSync(join(ROOT, '.claude/phases.json'), 'utf8'));
const phase = Number(state.current);

const steps = [
  { name: 'guardrails', cmds: [`node ops/guardrails.mjs ${phase}`] },
  { name: 'regression', cmds: ['npx tsc --noEmit -p tsconfig.json', 'npx vitest run'] },
  { name: 'e2e', cmds: [`node tests/browser/flow.mjs --phase ${phase}`, ...(phase >= 3 ? ['node tests/system/release.mjs'] : [])] },
];

const results = [];
let passed = true;
console.log(`=== Gate for phase ${phase}: ${state.phases[phase]} ===`);
for (const step of steps) {
  console.log(`\n--- ${step.name} ---`);
  const ok = step.cmds.every((cmd) => spawnSync(cmd, { cwd: ROOT, stdio: 'inherit', shell: true }).status === 0);
  results.push({ step: step.name, ok });
  if (!ok) {
    passed = false;
    console.log(`\nGate STOPPED at "${step.name}". Later steps were not run. Fix and re-run \`npm run gate\`.`);
    break;
  }
}

mkdirSync(join(ROOT, '.claude/gates'), { recursive: true });
writeFileSync(
  join(ROOT, `.claude/gates/phase-${phase}.json`),
  JSON.stringify({ phase, passed, at: new Date().toISOString(), results }, null, 2) + '\n',
);
if (passed) console.log(`\nGate for phase ${phase} PASSED. Run \`npm run phase:next\` to unlock phase ${phase + 1}.`);
process.exit(passed ? 0 : 1);
