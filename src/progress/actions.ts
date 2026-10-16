import { useCallback } from 'react';
import type { ProductionTask, Question } from '../content/types';
import type { QuestionOutcome } from '../components/QuestionCard';
import type { ProductionOutcome } from '../components/Production';
import { jerusalemDate } from '../lib/dates';
import { awardXp, isFresh, recordAttempt, recordProduction, XP } from '../lib/learning';
import type { Context } from './model';
import { useStore } from './store';

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** All learner actions go through here so recording rules live in one place. */
export function useActions() {
  const { update } = useStore();

  const answer = useCallback(
    (q: Question, o: QuestionOutcome, context: Context, afterWorked: boolean) =>
      update((p) => {
        const now = new Date();
        const date = jerusalemDate(now);
        recordAttempt(p, {
          id: newId(), at: now.toISOString(), date, qid: q.id, concept: q.concept, unit: q.unit, context,
          correctFirstTry: o.correctFirstTry, finalCorrect: o.finalCorrect, tries: o.tries, assistance: o.assistance,
          usedEnglish: o.usedEnglish, usedSimpler: o.usedSimpler, niqqud: p.settings.niqqud !== 'off',
          afterWorked, fresh: isFresh(p, q.id),
        });
        if (o.finalCorrect && o.tries > 1) awardXp(p, `fix:${q.id}:${date}`, XP.corrected, date);
        if (context === 'review') awardXp(p, `review:${q.id}:${date}`, XP.review, date);
      }),
    [update],
  );

  const produce = useCallback(
    (task: ProductionTask, o: ProductionOutcome) =>
      update((p) => {
        const now = new Date();
        const date = jerusalemDate(now);
        recordProduction(p, {
          id: newId(), at: now.toISOString(), date, taskId: task.id, concept: task.concept, unit: task.unit,
          kind: task.kind, result: o.result, withBank: o.withBank,
        });
        if (task.kind === 'say' || task.kind === 'paper') awardXp(p, `say:${task.id}:${date}`, XP.say, date);
      }),
    [update],
  );

  const stepDone = useCallback(
    (unit: string, step: string) =>
      update((p) => {
        const now = new Date();
        const u = (p.units[unit] ??= { stepsDone: [] });
        if (!u.stepsDone.includes(step)) u.stepsDone.push(step);
        if (step === 'explain') u.introducedAt ??= now.toISOString();
        if (step === 'check') u.practicedAt ??= now.toISOString();
        if (step === 'done') u.completedAt ??= now.toISOString();
        awardXp(p, step === 'done' ? `unit:${unit}` : `step:${unit}:${step}`, step === 'done' ? XP.unit : XP.step, jerusalemDate(now));
      }),
    [update],
  );

  const checkOpenAnswer = useCallback(
    (recordId: string, result: 'confirmed' | 'not-yet') =>
      update((p) => {
        const r = p.productions.find((x) => x.id === recordId);
        if (r) recordProduction(p, { ...r, result, checkedAt: new Date().toISOString() });
      }),
    [update],
  );

  return { answer, produce, stepDone, checkOpenAnswer };
}
