// Numbers for the Mission Log sidebar. Honest by construction: counts, not a blended score.
import type { Progress } from '../progress/model';
import { isIndependent } from './learning';
import { STEP_COUNT } from './steps';

export interface DayScience {
  date: string;
  /** right on the first try, no help, not right after a shown solution */
  unaided: number;
  /** answered with help, after a solution, or not yet right */
  other: number;
}

/** Science answers per study day (warm-ups excluded: they only check prior knowledge). */
export function dailyScience(p: Progress): DayScience[] {
  const byDay = new Map<string, DayScience>();
  for (const a of p.attempts) {
    if (a.context === 'warmup') continue;
    const d = byDay.get(a.date) ?? { date: a.date, unaided: 0, other: 0 };
    if (isIndependent(a)) d.unaided++;
    else d.other++;
    byDay.set(a.date, d);
  }
  return [...byDay.values()].sort((a, b) => a.date.localeCompare(b.date));
}

/** "Starting to measure" until there are enough answers on enough days to show a curve. */
export const enoughToChart = (days: DayScience[]) => days.length >= 2 && days.reduce((n, d) => n + d.unaided + d.other, 0) >= 5;

/** Mission progress for a set of units: stages done out of all stages. Participation, not mastery. */
export function missionProgress(p: Progress, units: string[]): { done: number; total: number } {
  const total = units.length * STEP_COUNT;
  const done = units.reduce((n, u) => n + Math.min(p.units[u]?.stepsDone.length ?? 0, STEP_COUNT), 0);
  return { done, total };
}
