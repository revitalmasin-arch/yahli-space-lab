import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

// The Hebrew README is the parent's manual: every command it names must really exist.
const read = (p: string) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');

describe('README', () => {
  it('is in Hebrew and every "npm run" command in it exists', () => {
    const readme = read('README.md');
    expect(readme).toMatch(/[\u05D0-\u05EA]/);
    const scripts = Object.keys(JSON.parse(read('package.json')).scripts);
    const used = [...readme.matchAll(/npm run ([\w:-]+)/g)].map((m) => m[1]);
    expect(used.length).toBeGreaterThan(5);
    for (const s of used) expect(scripts, `npm run ${s}`).toContain(s);
  });
  it('names the fixed ports', () => {
    const readme = read('README.md');
    for (const port of ['8090', '8091', '5180']) expect(readme).toContain(port);
  });
});
