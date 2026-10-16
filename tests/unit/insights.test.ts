import { describe, expect, it } from 'vitest';
import { emptyProgress, type Attempt } from '../../src/progress/model';
import { dailyScience, enoughToChart, missionProgress } from '../../src/lib/insights';

const att = (over: Partial<Attempt>): Attempt => ({
  id: Math.random().toString(36).slice(2), at: '2026-10-17T06:00:00.000Z', date: '2026-10-17', qid: 'q', concept: 'c-star', unit: 'u2',
  context: 'unit', correctFirstTry: true, finalCorrect: true, tries: 1, assistance: 0, usedEnglish: false, usedSimpler: false,
  niqqud: true, afterWorked: false, fresh: true, ...over,
});

describe('Mission Log numbers', () => {
  it('splits answers per day into unaided vs other, excluding warm-ups', () => {
    const p = emptyProgress();
    p.attempts.push(
      att({}),
      att({ assistance: 1, correctFirstTry: false }),
      att({ afterWorked: true }), // right after a shown solution: not unaided
      att({ context: 'warmup' }),
      att({ date: '2026-10-18' }),
    );
    expect(dailyScience(p)).toEqual([
      { date: '2026-10-17', unaided: 1, other: 2 },
      { date: '2026-10-18', unaided: 1, other: 0 },
    ]);
  });

  it('says "starting to measure" until there are 5 answers on at least 2 days', () => {
    expect(enoughToChart([{ date: 'a', unaided: 9, other: 9 }])).toBe(false);
    expect(enoughToChart([{ date: 'a', unaided: 2, other: 0 }, { date: 'b', unaided: 1, other: 1 }])).toBe(false);
    expect(enoughToChart([{ date: 'a', unaided: 2, other: 1 }, { date: 'b', unaided: 1, other: 1 }])).toBe(true);
  });

  it('mission progress counts stages done, capped per unit', () => {
    const p = emptyProgress();
    p.units.u1 = { stepsDone: ['warmup', 'explain', 'terms'] };
    p.units.u2 = { stepsDone: ['warmup', 'explain', 'terms', 'interact', 'check', 'produce', 'lookback', 'done', 'done'] };
    expect(missionProgress(p, ['u1', 'u2'])).toEqual({ done: 11, total: 16 });
    expect(missionProgress(p, [])).toEqual({ done: 0, total: 0 });
  });
});
