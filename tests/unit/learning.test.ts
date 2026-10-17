import { describe, expect, it } from 'vitest';
import { emptyProgress, xpTotal, type Attempt } from '../../src/progress/model';
import { awardXp, dueConcepts, hebrewEvidence, trickyConcepts, nextTrack, pickQuestion, recordAttempt, recordProduction, REVIEW_XP_PER_DAY, unitStatus } from '../../src/lib/learning';
import { dayInfo, daysUntilExam, PLAN } from '../../src/lib/plan';
import { UNITS } from '../../src/content/units';
import { isValidDate, jerusalemDate } from '../../src/lib/dates';

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

  it('exam day starts at midnight Jerusalem time, not UTC midnight', () => {
    // 20:59 UTC Oct 21 = 23:59 in Jerusalem (Day 5); 21:00 UTC = 00:00 Oct 22 (exam day).
    const before = jerusalemDate(new Date('2026-10-21T20:59:00Z'));
    const at = jerusalemDate(new Date('2026-10-21T21:00:00Z'));
    expect(dayInfo(before, '2026-10-22')).toMatchObject({ kind: 'plan', index: 4 });
    expect(daysUntilExam(before, '2026-10-22')).toBe(1);
    expect(dayInfo(at, '2026-10-22')).toEqual({ kind: 'exam-day' });
    expect(daysUntilExam(at, '2026-10-22')).toBe(0);
  });

  it('every plan day maps to its units; Day 5 is mixed practice with no new units', () => {
    const days = ['2026-10-17', '2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21'];
    days.forEach((d, i) => expect(dayInfo(d, '2026-10-22')).toMatchObject({ kind: 'plan', index: i }));
    const day5 = dayInfo('2026-10-21', '2026-10-22');
    expect(day5.kind === 'plan' && day5.day.units).toEqual([]);
    expect(PLAN.flatMap((d) => d.units).sort()).toEqual(UNITS.map((u) => u.id).sort()); // every unit is scheduled once
  });

  it('if the exam is moved later, the days after the plan are a gap, not "after the exam"', () => {
    expect(dayInfo('2026-10-23', '2026-10-27')).toEqual({ kind: 'exam-eve-gap' });
    expect(daysUntilExam('2026-10-23', '2026-10-27')).toBe(4);
  });

  it('still the right Jerusalem day after daylight saving ends (Sun 25 Oct 2026, UTC+2)', () => {
    expect(jerusalemDate(new Date('2026-10-25T21:30:00Z'))).toBe('2026-10-25');
    expect(jerusalemDate(new Date('2026-10-25T22:30:00Z'))).toBe('2026-10-26');
  });

  it('rejects impossible dates', () => {
    expect(isValidDate('2026-10-22')).toBe(true);
    expect(isValidDate('2026-02-30')).toBe(false);
    expect(isValidDate('22/10/2026')).toBe(false);
  });
});

describe('parent view: ideas Yahli found hard', () => {
  const att = (concept: string, correctFirstTry: boolean, assistance: 0 | 1 | 2 | 3, i: number): Attempt => ({
    id: `t${i}`, at: '2026-10-17T10:00:00Z', date: '2026-10-17', qid: `q${i}`, concept, unit: 'u1', context: 'unit',
    correctFirstTry, finalCorrect: true, tries: correctFirstTry ? 1 : 2, assistance, usedEnglish: false, usedSimpler: false,
    niqqud: true, afterWorked: false, fresh: true,
  });
  it('lists only ideas with mistakes or help, most trouble first', () => {
    const p = emptyProgress();
    p.attempts = [att('c-star', false, 1, 1), att('c-star', false, 0, 2), att('c-lit', false, 0, 3), att('c-order', true, 0, 4)];
    const t = trickyConcepts(p);
    expect(t.map((x) => x.concept)).toEqual(['c-star', 'c-lit']);
    expect(t[0]).toMatchObject({ wrongFirstTry: 2, helped: 1, attempts: 2 });
  });
  it('is empty before any answers', () => {
    expect(trickyConcepts(emptyProgress())).toEqual([]);
  });
});
