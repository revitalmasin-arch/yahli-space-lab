// Learning rules that do not depend on the UI: spaced review, evidence, XP.
import type { Question } from '../content/types';
import { QUESTIONS } from '../content/questions';
import { CONCEPTS } from '../content/concepts';
import type { Attempt, Progress, ProductionRecord, Track } from '../progress/model';
import { addDays, jerusalemDate } from './dates';

/** Days until the next review, by box. Box 0 = struggled: review tomorrow. */
export const INTERVALS = [1, 1, 2, 4, 7];

/** A struggle resets to tomorrow. A success promotes at most once per day, so a concept that was hard
 *  earlier today still comes back tomorrow even if later answers today were right. */
export function nextTrack(prev: Track | undefined, success: boolean, today: string, nowIso: string): Track {
  if (!success) return { box: 0, due: addDays(today, INTERVALS[0]), lastAt: nowIso };
  if (prev && jerusalemDate(new Date(prev.lastAt)) === today) return { ...prev, lastAt: nowIso };
  const box = Math.min((prev?.box ?? 0) + 1, INTERVALS.length - 1);
  return { box, due: addDays(today, INTERVALS[box]), lastAt: nowIso };
}

/** Only an unaided first-try answer that did not follow a shown solution counts toward "independent". */
export const isIndependent = (a: Attempt) => a.correctFirstTry && a.assistance === 0 && !a.afterWorked;

export function recordAttempt(p: Progress, a: Attempt): void {
  p.attempts.push(a);
  const c = (p.concepts[a.concept] ??= {});
  c.science = nextTrack(c.science, isIndependent(a), a.date, a.at);
}

export function recordProduction(p: Progress, r: ProductionRecord): void {
  const existing = p.productions.findIndex((x) => x.id === r.id);
  if (existing >= 0) p.productions[existing] = r;
  else p.productions.push(r);
  // Auto-checked, scaffolded work schedules Hebrew review; open answers wait for a human check.
  if (r.kind === 'arrange' || r.kind === 'complete') {
    const c = (p.concepts[r.concept] ??= {});
    c.hebrew = nextTrack(c.hebrew, r.result === 'correct', r.date, r.at);
  } else if (r.result === 'confirmed' || r.result === 'not-yet') {
    const c = (p.concepts[r.concept] ??= {});
    c.hebrew = nextTrack(c.hebrew, r.result === 'confirmed' && !r.withBank, r.date, r.checkedAt ?? r.at);
  } else {
    const c = (p.concepts[r.concept] ??= {});
    c.hebrew ??= { box: 0, due: addDays(r.date, 1), lastAt: r.at };
  }
}

// ---- XP: bounded and idempotent. Never removed for using help. ----
export const XP = { step: 5, unit: 10, corrected: 3, review: 2, say: 3 };
export const REVIEW_XP_PER_DAY = 10; // review answers stop earning after this many per day

export function awardXp(p: Progress, key: string, points: number, today: string): number {
  if (p.xp[key] !== undefined) return 0;
  if (key.startsWith('review:')) {
    const todays = Object.keys(p.xp).filter((k) => k.startsWith('review:') && k.endsWith(`:${today}`)).length;
    if (todays >= REVIEW_XP_PER_DAY) return 0;
  }
  p.xp[key] = points;
  return points;
}

// ---- Evidence ----
export type UnitStatus = 'new' | 'introduced' | 'practiced' | 'independent';

export function unitStatus(p: Progress, unit: string): UnitStatus {
  const u = p.units[unit];
  if (!u?.introducedAt) return 'new';
  const introDay = u.introducedAt.slice(0, 10);
  const concepts = CONCEPTS.filter((c) => c.unit === unit).map((c) => c.id);
  // Independent = an unaided correct answer to a fresh question on a LATER day, for every concept in the unit.
  const allDelayed = concepts.length > 0 && concepts.every((cid) =>
    p.attempts.some((a) => a.concept === cid && isIndependent(a) && a.fresh && a.date > introDay),
  );
  if (allDelayed) return 'independent';
  return u.practicedAt ? 'practiced' : 'introduced';
}

export interface ScienceSummary {
  attempts: number;
  unaidedFirstTry: number;
  assisted: number;
  usedEnglish: number;
}
export function scienceSummary(p: Progress, filter: (a: Attempt) => boolean = () => true): ScienceSummary {
  const list = p.attempts.filter(filter);
  return {
    attempts: list.length,
    unaidedFirstTry: list.filter(isIndependent).length,
    assisted: list.filter((a) => a.assistance > 0 || a.afterWorked).length,
    usedEnglish: list.filter((a) => a.usedEnglish).length,
  };
}

/** Hebrew evidence counts only parent-confirmed answers given without a word bank. */
export function hebrewEvidence(p: Progress, concept?: string) {
  const open = p.productions.filter((r) => (r.kind === 'say' || r.kind === 'paper') && (!concept || r.concept === concept));
  const confirmed = open.filter((r) => r.result === 'confirmed' && !r.withBank);
  const days = new Set(confirmed.map((r) => r.date));
  return {
    opportunities: open.length,
    confirmed: confirmed.length,
    confirmedDays: days.size,
    pending: open.filter((r) => r.result === 'pending' || r.result === 'self-ok' || r.result === 'self-unsure').length,
    independent: days.size >= 2,
  };
}

// ---- Review selection ----
export function dueConcepts(p: Progress, today: string): string[] {
  return Object.entries(p.concepts)
    .filter(([, c]) => (c.science && c.science.due <= today) || (c.hebrew && c.hebrew.due <= today))
    .map(([id]) => id);
}

/** A question for this concept, avoiding the ones already used in this session and preferring
 *  questions never seen before, then the least recently seen. */
export function pickQuestion(p: Progress, concept: string, exclude: Set<string>, roles: Question['role'][] = ['review', 'check']): Question | undefined {
  const lastSeen = new Map<string, string>();
  for (const a of p.attempts) lastSeen.set(a.qid, a.at);
  const pool = QUESTIONS.filter((q) => q.concept === concept && roles.includes(q.role) && !exclude.has(q.id));
  pool.sort((a, b) => (lastSeen.get(a.id) ?? '').localeCompare(lastSeen.get(b.id) ?? ''));
  return pool[0];
}

export const isFresh = (p: Progress, qid: string) => !p.attempts.some((a) => a.qid === qid);
