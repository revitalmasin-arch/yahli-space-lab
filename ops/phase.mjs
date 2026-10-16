// Phase status / advance. Advancing requires a passing gate record for the current phase.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './config.mjs';

const file = join(ROOT, '.claude/phases.json');
const state = JSON.parse(readFileSync(file, 'utf8'));
const cur = Number(state.current);
const gateFile = join(ROOT, `.claude/gates/phase-${cur}.json`);
const gate = existsSync(gateFile) ? JSON.parse(readFileSync(gateFile, 'utf8')) : null;

if (process.argv[2] === 'replan') {
  // Replace the plan for phases after the current one. Current and finished phases cannot change.
  const next = JSON.parse(readFileSync(process.argv[3], 'utf8'));
  for (let n = 1; n <= cur; n++) {
    if (next[n] !== state.phases[n]) {
      console.error(`Refusing: phase ${n} is current or finished and cannot be changed.`);
      process.exit(1);
    }
  }
  state.phases = next;
  writeFileSync(file, JSON.stringify(state, null, 2) + '\n');
  console.log('Phases replanned:\n' + Object.entries(next).map(([n, d]) => `  ${n}. ${d}`).join('\n'));
} else if (process.argv[2] === 'next') {
  if (!gate || gate.passed !== true || gate.phase !== cur) {
    console.error(`Cannot advance: the gate for phase ${cur} has not passed. Run \`npm run gate\`.`);
    process.exit(1);
  }
  if (!state.phases[cur + 1]) {
    console.log(`Phase ${cur} was the last phase.`);
    process.exit(0);
  }
  state.current = cur + 1;
  writeFileSync(file, JSON.stringify(state, null, 2) + '\n');
  console.log(`Advanced to phase ${cur + 1}: ${state.phases[cur + 1]}`);
} else {
  console.log(`Current phase ${cur}: ${state.phases[cur]}`);
  console.log(gate ? `Last gate run ${gate.at}: ${gate.passed ? 'PASSED' : 'FAILED'} ${JSON.stringify(gate.results)}` : 'Gate not run yet.');
}
