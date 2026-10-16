import { describe, expect, it } from 'vitest';
import { sameSentence, stripNiqqud } from '../../src/lib/hebrew';
import { UNITS } from '../../src/content/units';
import { QUESTIONS } from '../../src/content/questions';
import { CONCEPTS } from '../../src/content/concepts';
import { PRODUCTION } from '../../src/content/production';

describe('Hebrew helpers', () => {
  it('strips niqqud but keeps letters', () => {
    expect(stripNiqqud('כּוֹכַב לֶכֶת')).toBe('כוכב לכת');
  });
  it('regression: repeated words in a sentence are interchangeable when ordering', () => {
    const words = ['כַּדּוּר הָאָרֶץ', 'עָשׂוּי', 'מִסֶּלַע', 'אֲבָל', 'צֶדֶק', 'עָשׂוּי', 'מִגַּזִּים'];
    // the learner picked the second "עָשׂוּי" chip first — still the same sentence
    expect(sameSentence(words, [words[0], words[5], words[2], words[3], words[4], words[1], words[6]])).toBe(true);
    expect(sameSentence(words, [words[1], words[0], ...words.slice(2)])).toBe(false);
  });
});

// Units whose content is written. Every required topic must be covered once all units are ready.
const READY = UNITS.filter((u) => QUESTIONS.some((q) => q.unit === u.id));

describe('content integrity for ready units', () => {
  for (const u of READY) {
    describe(u.id, () => {
      const qs = QUESTIONS.filter((q) => q.unit === u.id);
      const concepts = CONCEPTS.filter((c) => c.unit === u.id);
      it('has explanation, 2-4 terms, an interaction', () => {
        expect(u.explain.length).toBeGreaterThan(0);
        expect(u.terms.length).toBeGreaterThanOrEqual(2);
        expect(u.terms.length).toBeLessThanOrEqual(4);
        expect(u.interaction).toBeTruthy();
      });
      it('has 3-5 check questions of at least two kinds', () => {
        const checks = qs.filter((q) => q.role === 'check');
        expect(checks.length).toBeGreaterThanOrEqual(3);
        expect(checks.length).toBeLessThanOrEqual(5);
        expect(new Set(checks.map((q) => q.kind)).size).toBeGreaterThanOrEqual(2);
      });
      it('every concept has review questions in different wording (for later days and siblings)', () => {
        for (const c of concepts) {
          expect(qs.filter((q) => q.concept === c.id && q.role === 'review').length, c.id).toBeGreaterThanOrEqual(2);
        }
      });
      it('has Hebrew production: arrange or complete, plus a say-aloud task', () => {
        const ps = PRODUCTION.filter((p) => p.unit === u.id);
        expect(ps.some((p) => p.kind === 'arrange' || p.kind === 'complete')).toBe(true);
        expect(ps.some((p) => (p.kind === 'say' || p.kind === 'paper') && p.role === 'unit')).toBe(true);
        expect(ps.some((p) => p.role === 'review')).toBe(true);
      });
      it('every question references a known concept and has a valid answer', () => {
        for (const q of qs) {
          expect(CONCEPTS.some((c) => c.id === q.concept), q.id).toBe(true);
          if (q.kind === 'mc') expect(q.choices.some((c) => c.id === q.correct), q.id).toBe(true);
          if (q.kind === 'tf' && !q.truth && q.fix) expect(q.fix.choices.some((c) => c.id === q.fix!.correct), q.id).toBe(true);
          if (q.kind === 'match') expect(new Set(q.pairs.map((p) => p.right.heN)).size, q.id).toBe(q.pairs.length);
        }
      });
      it('complete tasks have their answer in the word bank', () => {
        for (const p of PRODUCTION.filter((x) => x.unit === u.id && x.kind === 'complete')) {
          if (p.kind === 'complete') expect(p.bank).toContain(p.answer);
        }
      });
    });
  }
  it('question ids are unique', () => {
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(QUESTIONS.length);
  });
});
