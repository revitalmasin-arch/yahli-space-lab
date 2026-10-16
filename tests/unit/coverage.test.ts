import { describe, expect, it } from 'vitest';
import { ASSIGNED_PAGES, PAGE_COVERAGE } from '../../src/content/coverage';
import { CONCEPTS } from '../../src/content/concepts';
import { QUESTIONS } from '../../src/content/questions';
import { UNITS } from '../../src/content/units';

// Parent requirement: everything on pages 168–190 is taught AND asked, with no invented facts.
describe('textbook pages 168–190 are covered in depth', () => {
  for (let page = ASSIGNED_PAGES.from; page <= ASSIGNED_PAGES.to; page++) {
    it(`page ${page} is taught and asked`, () => {
      const concepts = PAGE_COVERAGE[page];
      expect(concepts, `page ${page} has no concepts`).toBeTruthy();
      for (const id of concepts) {
        const c = CONCEPTS.find((x) => x.id === id);
        expect(c, `concept ${id} (page ${page}) does not exist`).toBeTruthy();
        if (!c) continue;
        expect(c.sources.map((s) => s.page), `${id} does not cite page ${page}`).toContain(page);
        const qs = QUESTIONS.filter((q) => q.concept === id);
        expect(qs.some((q) => q.role === 'check' || q.role === 'warmup'), `${id} is never asked in a unit`).toBe(true);
        expect(qs.some((q) => q.role === 'review'), `${id} has no review question`).toBe(true);
        expect(UNITS.some((u) => u.id === c.unit), `${id} belongs to no unit`).toBe(true);
      }
    });
  }
});

describe('no invented facts: everything has a source', () => {
  it('every concept cites at least one book page or external source', () => {
    for (const c of CONCEPTS) expect(c.sources.length, c.id).toBeGreaterThan(0);
  });
  it('every unit cites its book pages', () => {
    for (const u of UNITS) expect(u.sources.length, u.id).toBeGreaterThan(0);
  });
});
