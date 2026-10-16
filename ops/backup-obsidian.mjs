// Backs up the project into the Obsidian vault as notes: overview, phases (with live gate status),
// working rules, and a full text snapshot of the source. Re-run any time: `npm run backup:obsidian`.
// Vault path: OBSIDIAN_VAULT env var, or the first CLI argument.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { ROOT } from './config.mjs';

const vault = process.env.OBSIDIAN_VAULT ?? process.argv[2];
if (!vault || !existsSync(join(vault, '.obsidian'))) {
  console.error('Usage: OBSIDIAN_VAULT="<vault folder>" npm run backup:obsidian   (folder must contain .obsidian)');
  process.exit(1);
}
const outDir = join(vault, 'yahli-space-lab');
mkdirSync(outDir, { recursive: true });

const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const rel = (p) => relative(ROOT, p).replace(/\\/g, '/');
const now = new Date().toISOString();
const phases = JSON.parse(read('.claude/phases.json'));
const gate = (n) => {
  const f = join(ROOT, `.claude/gates/phase-${n}.json`);
  return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null;
};
const statusOf = (n) => {
  const g = gate(n);
  const cur = Number(phases.current);
  if (g?.passed) return `✅ gate passed (${g.at})`;
  if (n === cur) return g ? `🔧 in progress — last gate FAILED at ${g.results.find((r) => !r.ok)?.step} (${g.at})` : '🔧 in progress — gate not run yet';
  return n < cur ? '⚠️ no passing gate record' : '⏳ not started (locked)';
};

// Phase detail comes from docs/PHASES.md, split on "## Phase N".
const plan = read('docs/PHASES.md');
const sections = Object.fromEntries(
  [...plan.matchAll(/## Phase (\d+)[^\n]*\n([\s\S]*?)(?=\n## Phase |\s*$)/g)].map((m) => [m[1], m[2].trim()]),
);

const files = [];
const notes = {};
const header = (title) => `---\nproject: yahli-space-lab\nbacked_up: ${now}\n---\n# ${title}\n\n`;

notes['00 - Overview.md'] =
  header("Yahli's Space Lab — Overview") +
  `Source folder: \`${ROOT}\`\n\n` +
  `Local browser learning app for Yahli's Grade 5 Hebrew science exam (space chapter, book pp. 168–190), plus a\n` +
  `dev/production setup so development never interrupts the stable version Yahli uses.\n\n` +
  `## Phases\n\n| # | Phase | Status |\n|---|---|---|\n` +
  Object.entries(phases.phases).map(([n, d]) => `| ${n} | [[${n.padStart(2, '0')} - Phase ${n}\\|${d.split(':')[0]}]] | ${statusOf(Number(n))} |`).join('\n') +
  `\n\nCurrent phase: **${phases.current}**.\n\n## Notes\n- [[06 - Working Rules (CLAUDE.md)]]\n- [[07 - Phase Gate & Hook]]\n- [[90 - Source Snapshot]]\n`;

for (const [n, d] of Object.entries(phases.phases)) {
  const g = gate(Number(n));
  notes[`${n.padStart(2, '0')} - Phase ${n}.md`] =
    header(`Phase ${n} — ${d}`) +
    `**Status:** ${statusOf(Number(n))}\n\n` +
    (g ? `**Last gate run:** ${g.at}\n\n| Step | Result |\n|---|---|\n${g.results.map((r) => `| ${r.step} | ${r.ok ? 'pass' : 'FAIL'} |`).join('\n')}\n\n` : '') +
    (sections[n] ?? '') +
    `\n\nBack to [[00 - Overview]]\n`;
}

notes['06 - Working Rules (CLAUDE.md).md'] = header('Working rules (CLAUDE.md)') + read('CLAUDE.md').replace(/^# .*\n/, '');
notes['07 - Phase Gate & Hook.md'] =
  header('Phase gate & hook') +
  'Gate order: guardrails → regression → e2e (`ops/gate.mjs`). Hook: `ops/hooks/phase-guard.mjs`, registered in `.claude/settings.json`.\n\n' +
  '## .claude/settings.json\n```json\n' + read('.claude/settings.json') + '```\n\n## .claude/phases.json\n```json\n' + read('.claude/phases.json') + '```\n';

// Full text snapshot of the project source (no node_modules, builds, releases, PDF).
const SKIP = new Set(['node_modules', 'dist', 'releases', '.git', 'state']);
const EXT = new Set(['.ts', '.tsx', '.mjs', '.js', '.json', '.css', '.html', '.md']);
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (EXT.has(extname(name)) && name !== 'package-lock.json') files.push(p);
  }
})(ROOT);
files.sort();
const lang = { '.ts': 'ts', '.tsx': 'tsx', '.mjs': 'js', '.js': 'js', '.json': 'json', '.css': 'css', '.html': 'html', '.md': 'markdown' };
notes['90 - Source Snapshot.md'] =
  header('Source snapshot') +
  `${files.length} files. Restore a file by copying its block back to the path shown.\n\n` +
  files.map((f) => `## \`${rel(f)}\`\n\`\`\`\`${lang[extname(f)]}\n${readFileSync(f, 'utf8')}\n\`\`\`\`\n`).join('\n');

for (const [name, body] of Object.entries(notes)) writeFileSync(join(outDir, name), body);
console.log(`Backed up ${Object.keys(notes).length} notes (${files.length} source files) to ${outDir}`);
