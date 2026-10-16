// Daily route. A planning default, not a guarantee of mastery. Dates are Asia/Jerusalem.
import { daysBetween } from './dates';
import { t } from './hebrew';
import type { Tx } from '../content/types';

export interface PlanDay {
  date: string;
  units: string[];
  focus: Tx;
}

export const PLAN: PlanDay[] = [
  { date: '2026-10-17', units: ['u1', 'u2'], focus: t('Our place in the universe; star vs planet', 'הַמָּקוֹם שֶׁלָּנוּ בַּיְקוּם; כּוֹכָב וְכוֹכַב לֶכֶת') },
  { date: '2026-10-18', units: ['u3', 'u4'], focus: t('Planet order and groups; review', 'סֵדֶר כּוֹכְבֵי הַלֶּכֶת וּקְבוּצוֹת; חֲזָרָה') },
  { date: '2026-10-19', units: ['u5', 'u6', 'u7'], focus: t('Asteroid belt, moons, periodic motion; review', 'חֲגוֹרַת הָאַסְטֵרוֹאִידִים, יָרֵחַ, תְּנוּעָה מַחֲזוֹרִית; חֲזָרָה') },
  { date: '2026-10-20', units: ['u8', 'u9'], focus: t('Year, day, month; conditions for life', 'שָׁנָה, יְמָמָה, חוֹדֶשׁ; תְּנָאִים לְחַיִּים') },
  { date: '2026-10-21', units: [], focus: t('Mixed practice and paper practice with Mum', 'תִּרְגּוּל מְעוֹרָב וְתִרְגּוּל עַל דַּף עִם אִמָּא') },
];

export type DayInfo =
  | { kind: 'before'; first: PlanDay; daysToStart: number }
  | { kind: 'plan'; day: PlanDay; index: number }
  | { kind: 'exam-eve-gap' } // after the plan, before the exam (only if exam date was moved later)
  | { kind: 'exam-day' }
  | { kind: 'after' };

export function dayInfo(today: string, examDate: string): DayInfo {
  if (today === examDate) return { kind: 'exam-day' };
  if (today > examDate) return { kind: 'after' };
  const index = PLAN.findIndex((d) => d.date === today);
  if (index >= 0) return { kind: 'plan', day: PLAN[index], index };
  if (today < PLAN[0].date) return { kind: 'before', first: PLAN[0], daysToStart: daysBetween(today, PLAN[0].date) };
  return { kind: 'exam-eve-gap' };
}

/** Days until the exam, or null once the exam date has passed (never negative). */
export function daysUntilExam(today: string, examDate: string): number | null {
  const d = daysBetween(today, examDate);
  return d < 0 ? null : d;
}
