import { describe, expect, it } from 'vitest';
import { askKip, queryTokens } from '../../src/lib/kipSearch';

const top = (q: string) => askKip(q)[0]?.concept.id;

describe("Kip's offline question search", () => {
  it('finds the right concept from English questions', () => {
    expect(top('What is a star?')).toBe('c-star');
    expect(top('what is the difference between rotation and orbit')).toBe('c-rot-orbit');
    expect(top('where is the asteroid belt')).toBe('c-belt');
  });
  it('finds concepts from Hebrew, with or without niqqud and with prefixes', () => {
    expect(top('מה זה ירח?')?.startsWith('c-moon')).toBe(true);
    expect(top('מה זה יְקוּם')).toBe('c-universe');
    expect(top('למה כוכב לכת מואר')).toBe('c-lit');
  });
  it('ignores question words and returns nothing for unrelated text', () => {
    expect(queryTokens('מה זה?')).toEqual([]);
    expect(askKip('pizza basketball')).toEqual([]);
  });
});

import { formatPages, unitPages } from '../../src/lib/bookPages';
import { UNITS } from '../../src/content/units';

describe('book page bookmarks', () => {
  it('every unit points to at least one textbook page', () => {
    for (const u of UNITS) expect(unitPages(u.id).pages.length, u.id).toBeGreaterThan(0);
  });
  it('star vs planet points to pages 174 and 183, glossary listed separately', () => {
    const p = unitPages('u2');
    expect(p.pages).toEqual([174, 183]);
    expect(p.glossary).toEqual([214]);
    expect(formatPages(p)).toBe('pages 174, 183 · glossary p. 214');
  });
  it('the Moon unit includes pages outside the assigned range (193-194)', () => {
    expect(unitPages('u6').pages).toEqual(expect.arrayContaining([193, 194]));
  });
});

import { lookupWord } from '../../src/lib/kipSearch';

describe('regression: Kip explains chapter words (reported: "TAZPIT" did not work)', () => {
  it('finds תצפית from Latin letters, Hebrew with/without niqqud, and English', () => {
    for (const q of ['TAZPIT', 'tazpit', 'explain tazpit', 'מה זה תצפית?', 'תַּצְפִּית', 'observation']) {
      expect(lookupWord(q)[0]?.id, q).toBe('tazpit');
    }
  });
  it('handles Hebrew prefixes and translates both ways', () => {
    expect(lookupWord('בטלסקופ')[0]?.id).toBe('telescope');
    expect(lookupWord('what is a comet')[0]?.heN).toContain('שָׁבִיט');
  });
  it('every dictionary entry has Hebrew, English and a simple explanation', async () => {
    const { GLOSSARY } = await import('../../src/content/glossary');
    expect(GLOSSARY.length).toBeGreaterThanOrEqual(70);
    for (const g of GLOSSARY) {
      expect(g.heN && g.en && g.simple.heN && g.simple.en, g.id).toBeTruthy();
    }
  });
});

describe('dictionary lookup does not over-match', () => {
  it('unrelated words find nothing', () => {
    expect(lookupWord('pizza')).toEqual([]);
    expect(lookupWord('בננה')).toEqual([]);
  });
  it('typed-in-English Hebrew finds the right planet and more', () => {
    expect(lookupWord('maadim')[0]?.id).toBe('mars');
    expect(lookupWord('yemama')[0]?.id).toBe('yemama');
    expect(lookupWord('kochav lechet')[0]?.id).toBe('planet');
    expect(lookupWord('כוכב לכת')[0]?.id).toBe('planet');
    expect(lookupWord('הגלקסיות')[0]?.id).toBe('galaxy');
  });
});

describe('every dictionary word finds itself', () => {
  it('by its Hebrew word and by its English word', async () => {
    const { GLOSSARY } = await import('../../src/content/glossary');
    for (const g of GLOSSARY) {
      expect(lookupWord(g.heN)[0]?.id, g.heN).toBe(g.id);
      expect(lookupWord(g.en)[0]?.id, g.en).toBe(g.id);
    }
  });
});
