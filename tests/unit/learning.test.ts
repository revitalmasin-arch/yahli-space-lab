import { describe, expect, it } from 'vitest';
import { emptyProgress, xpTotal, type Attempt } from '../../src/progress/model';
import { awardXp, dueConcepts, hebrewEvidence, nextTrack, pickQuestion, recordAttempt, recordProduction, REVIEW_XP_PER_DAY, unitStatus } from '../../src/lib/learning';
import { dayInfo, daysUntilExam } from '../../src/lib/plan';
import { jerusalemDate } from '../../src/lib/dates';

const att = (over: Partial<Attempt>): Attempt => ({
  id: Math.random().toString(36).slice(2), at: '2026-10-17T06:00:00.000Z', date: '2026-10-17', qid: 'u2-q2', concept: 'c-star', unit: 'u2',
  context: 'unit', correctFirstTry: true, finalCorrect: true, tries: 1, assistance: 0, usedEnglish: false, usedSimpler: false,
  niqqud: true, afterWorked: false, fresh: true, ...over,
});

describe('spaced review', () => {
  it('moves up a box on independent success and back to tomorrow on struggle', () => {
    const t1 = nextTrack(undefined, true, '2026-10-17', '2026-10-17T06:00:00.000Z');
    expect(t1).toMatchObject({ box: 1, due: '2026-10-18' });
    const t2 = nextTrack(t1, true, '2026-10-18', '2026-10-18T06:00:00.000Z');
    expect(t2).toMatchObject({ box: 2, due: '2026-10-20' });
    expect(nextTrack(t2, false, '2026-10-20', '2026-10-20T06:00:00.000Z')).toMatchObject({ box: 0, due: '2026-10-21' });
  });

  it('regression: a concept that was hard earlier today still comes back tomorrow', () => {
    const struggled = nextTrack(undefined, false, '2026-10-17', '2026-10-17T06:00:00.000Z');
    const later = nextTrack(struggled, true, '2026-10-17', '2026-10-17T06:20:00.000Z');
    const again = nextTrack(later, true, '2026-10-17', '2026-10-17T06:30:00.000Z');
    expect(again).toMatchObject({ box: 0, due: '2026-10-18' });
  });

  it('an assisted answer does not advance review, even when finally correct', () => {
    const p = emptyProgress();
    recordAttempt(p, att({ correctFirstTry: false, assistance: 1, tries: 2 }));
    expect(p.concepts['c-star'].science?.box).toBe(0);
    expect(dueConcepts(p, '2026-10-18')).toEqual(['c-star']);
  });

  it('an answer right after a worked solution is not independent recall', () => {
    const p = emptyProgress();
    recordAttempt(p, att({ afterWorked: true }));
    expect(p.concepts['c-star'].science?.box).toBe(0);
  });

  it('picks a different question than the ones already used, preferring unseen ones', () => {
    const p = emptyProgress();
    recordAttempt(p, att({ qid: 'u2-q4' }));
    const q = pickQuestion(p, 'c-star', new Set(['u2-q2']));
    expect(q && !['u2-q2', 'u2-q4'].includes(q.id)).toBe(true);
  });
});

describe('evidence', () => {
  it('a unit is not "answered independently" on the same day it was introduced', () => {
    const p = emptyProgress();
    p.units.u2 = { introducedAt: '2026-10-17T05:00:00.000Z', practicedAt: '2026-10-17T05:30:00.000Z', stepsDone: [] };
    recordAttempt(p, att({ concept: 'c-star' }));
    recordAttempt(p, att({ concept: 'c-lit', qid: 'u2-q7' }));
    expect(unitStatus(p, 'u2')).toBe('practiced');
    recordAttempt(p, att({ concept: 'c-star', qid: 'u2-q4', date: '2026-10-18', context: 'review' }));
    recordAttempt(p, att({ concept: 'c-lit', qid: 'u2-q10', date: '2026-10-18', context: 'review' }));
    expect(unitStatus(p, 'u2')).toBe('independent');
  });

  it('Hebrew evidence needs parent confirmation without a word bank on two separate days', () => {
    const p = emptyProgress();
    const base = { at: '2026-10-17T06:00:00.000Z', date: '2026-10-17', taskId: 'u2-p4', concept: 'c-star', unit: 'u2', kind: 'say' as const, withBank: false };
    recordProduction(p, { ...base, id: 'r1', result: 'self-ok' });
    expect(hebrewEvidence(p)).toMatchObject({ confirmed: 0, pending: 1, independent: false });
    recordProduction(p, { ...base, id: 'r1', result: 'confirmed', checkedAt: '2026-10-17T18:00:00.000Z' });
    expect(hebrewEvidence(p)).toMatchObject({ confirmed: 1, independent: false });
    recordProduction(p, { ...base, id: 'r2', date: '2026-10-19', result: 'confirmed' });
    expect(hebrewEvidence(p)).toMatchObject({ confirmed: 2, confirmedDays: 2, independent: true });
  });
});

describe('XP', () => {
  it('is idempotent: repeating the same step never adds points twice', () => {
    const p = emptyProgress();
    expect(awardXp(p, 'step:u2:explain', 5, '2026-10-17')).toBe(5);
    expect(awardXp(p, 'step:u2:explain', 5, '2026-10-17')).toBe(0);
    expect(xpTotal(p)).toBe(5);
  });

  it('caps review XP per day', () => {
    const p = emptyProgress();
    for (let i = 0; i < REVIEW_XP_PER_DAY + 5; i++) awardXp(p, `review:q${i}:2026-10-18`, 2, '2026-10-18');
    expect(xpTotal(p)).toBe(REVIEW_XP_PER_DAY * 2);
  });
});

describe('dates (Asia/Jerusalem)', () => {
  it('uses the Jerusalem calendar day, not UTC', () => {
    // 22:30 UTC on Oct 16 is already Oct 17 in Jerusalem (UTC+3 in October).
    expect(jerusalemDate(new Date('2026-10-16T22:30:00Z'))).toBe('2026-10-17');
    expect(jerusalemDate(new Date('2026-10-16T20:59:00Z'))).toBe('2026-10-16');
  });

  it('countdown and day info before, during, on and after the exam', () => {
    expect(dayInfo('2026-10-16', '2026-10-22')).toMatchObject({ kind: 'before', daysToStart: 1 });
    expect(dayInfo('2026-10-17', '2026-10-22')).toMatchObject({ kind: 'plan', index: 0 });
    expect(dayInfo('2026-10-22', '2026-10-22')).toEqual({ kind: 'exam-day' });
    expect(dayInfo('2026-10-23', '2026-10-22')).toEqual({ kind: 'after' });
    expect(daysUntilExam('2026-10-17', '2026-10-22')).toBe(5);
    expect(daysUntilExam('2026-10-22', '2026-10-22')).toBe(0);
    expect(daysUntilExam('2026-10-23', '2026-10-22')).toBeNull();
  });
});
