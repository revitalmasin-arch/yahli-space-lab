import { describe, expect, it } from 'vitest';
import { emptyProgress } from '../../src/progress/model';
import { addWord, buildVocabQuiz, meaningOf, recordVocab, removeWord } from '../../src/lib/words';

// deterministic "random" for repeatable quizzes
const seeded = (seed = 7) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

describe('My words', () => {
  it('adds a pasted word once, cleaned, and links it to the chapter dictionary', () => {
    const p = emptyProgress();
    expect(addWord(p, '  "תַּצְפִּית," ').status).toBe('added');
    expect(p.words[0]).toMatchObject({ text: 'תַּצְפִּית', id: 'תצפית', glossId: 'tazpit' });
    expect(addWord(p, 'תצפית').status).toBe('exists');
    expect(p.words).toHaveLength(1);
  });
  it('keeps words that are not in the dictionary, waiting for Mum to explain them', () => {
    const p = emptyProgress();
    addWord(p, 'מרתק');
    expect(p.words[0].glossId).toBeUndefined();
    expect(meaningOf(p.words[0])).toBeUndefined();
    p.words[0].meaning = 'מעניין מאוד';
    expect(meaningOf(p.words[0])).toEqual({ text: 'מעניין מאוד' });
  });
  it('refuses empty text and whole paragraphs', () => {
    const p = emptyProgress();
    expect(addWord(p, '  ...  ').status).toBe('empty');
    expect(addWord(p, 'א'.repeat(41)).status).toBe('too-long');
    expect(p.words).toHaveLength(0);
  });
  it('removes a word', () => {
    const p = emptyProgress();
    addWord(p, 'comet');
    removeWord(p, 'comet');
    expect(p.words).toEqual([]);
  });
});

describe('vocabulary quiz', () => {
  const setup = () => {
    const p = emptyProgress();
    for (const w of ['תצפית', 'יממה', 'שביט', 'מרתק']) addWord(p, w);
    return p;
  };
  it('asks only about explained words, with 4 different choices and the right answer among them', () => {
    const qs = buildVocabQuiz(setup().words, true, seeded());
    expect(qs.map((q) => q.wordId).sort()).toEqual(['יממה', 'שביט', 'תצפית'].sort());
    for (const q of qs) {
      expect(new Set(q.choices).size).toBe(4);
      expect(q.answer).toBeGreaterThanOrEqual(0);
    }
    expect(qs.some((q) => q.kind === 'meaning') && qs.some((q) => q.kind === 'word')).toBe(true);
  });
  it('records results and gives bounded points (once per word per day)', () => {
    const p = setup();
    const now = new Date('2026-10-17T10:00:00Z');
    recordVocab(p, 'תצפית', true, now, '2026-10-17');
    recordVocab(p, 'תצפית', true, now, '2026-10-17');
    recordVocab(p, 'יממה', false, now, '2026-10-17');
    expect(p.words.find((w) => w.id === 'תצפית')!.quiz).toMatchObject({ right: 2, wrong: 0 });
    expect(p.words.find((w) => w.id === 'יממה')!.quiz).toMatchObject({ right: 0, wrong: 1 });
    expect(Object.values(p.xp).reduce((a, b) => a + b, 0)).toBe(2);
  });
  it('asks the least-known words first', () => {
    const p = setup();
    p.words.find((w) => w.id === 'יממה')!.quiz = { right: 5, wrong: 0, lastAt: 'x' };
    const qs = buildVocabQuiz(p.words, true, seeded(), 2);
    expect(qs.map((q) => q.wordId)).not.toContain('יממה');
  });
});
