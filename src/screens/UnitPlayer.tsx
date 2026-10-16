import { useMemo, useRef, useState } from 'react';
import { unitById } from '../content/units';
import { questionsFor } from '../content/questions';
import { productionFor } from '../content/production';
import type { Question } from '../content/types';
import { QuestionCard } from '../components/QuestionCard';
import { Interaction } from '../components/Interaction';
import { Production } from '../components/Production';
import { Bi, He } from '../components/Bi';
import { Speak } from '../components/Speak';
import { Visual } from '../visuals/Visual';
import { useActions } from '../progress/actions';
import { useStore } from '../progress/store';
import { pickQuestion } from '../lib/learning';
import type { Context } from '../progress/model';

export const STEPS = ['warmup', 'explain', 'terms', 'interact', 'check', 'produce', 'lookback', 'done'] as const;
type Step = (typeof STEPS)[number];
const STEP_LABEL: Record<Step, string> = {
  warmup: 'Quick check', explain: 'Explore', terms: 'Hebrew words', interact: 'Investigate',
  check: 'Check', produce: 'Say it in Hebrew', lookback: 'Look back', done: 'Done',
};

interface QItem { q: Question; afterWorked: boolean }

export function UnitPlayer({ unitId, onExit }: { unitId: string; onExit: () => void }) {
  const unit = unitById(unitId);
  const { progress } = useStore();
  const { answer, produce, stepDone } = useActions();
  const done = progress.units[unitId]?.stepsDone ?? [];
  const firstOpen = STEPS.find((s) => !done.includes(s)) ?? 'warmup';
  const [step, setStep] = useState<Step>(firstOpen === 'done' ? 'warmup' : firstOpen);
  const [sub, setSub] = useState(0);
  const used = useRef(new Set<string>());

  const warmups = useMemo(() => questionsFor(unitId, 'warmup').map((q) => ({ q, afterWorked: false })), [unitId]);
  const [checks, setChecks] = useState<QItem[]>(() => questionsFor(unitId, 'check').map((q) => ({ q, afterWorked: false })));
  const tasks = useMemo(() => productionFor(unitId, 'unit'), [unitId]);
  const [lookback, setLookback] = useState<QItem | null>(null);

  const go = (target: Step) => {
    let next = target;
    stepDone(unitId, step);
    setSub(0);
    if (next === 'lookback') {
      // Look back after an intervening activity: a different-wording question from this unit.
      const concepts = [...new Set(checks.map((c) => c.q.concept))];
      const q = concepts.map((c) => pickQuestion(progress, c, used.current, ['review'])).find(Boolean);
      if (q) setLookback({ q, afterWorked: false });
      else {
        stepDone(unitId, 'lookback');
        next = 'done';
      }
    }
    if (next === 'done') stepDone(unitId, 'done');
    setStep(next);
    window.scrollTo({ top: 0 });
  };
  const nextOf = (s: Step) => STEPS[STEPS.indexOf(s) + 1];

  function onAnswer(item: QItem, list: QItem[], setList: ((l: QItem[]) => void) | null, context: Context) {
    return (o: Parameters<Parameters<typeof QuestionCard>[0]['onDone']>[0]) => {
      used.current.add(item.q.id);
      answer(item.q, o, context, item.afterWorked);
      let nextList = list;
      if (o.wantsSibling && setList) {
        // After a worked example: a NEW similar question (never the same one again). It follows a shown
        // solution for this concept, so it is not counted as independent recall.
        const sib = pickQuestion(progress, item.q.concept, new Set([...used.current, ...list.map((l) => l.q.id)]));
        if (sib) {
          nextList = [...list.slice(0, sub + 1), { q: sib, afterWorked: true }, ...list.slice(sub + 1)];
          setList(nextList);
        }
      }
      if (sub + 1 < nextList.length) setSub(sub + 1);
      else go(nextOf(step));
    };
  }

  const stepIndex = STEPS.indexOf(step);
  return (
    <div className="stack" data-testid={`unit-${unitId}`}>
      <div className="row">
        <button type="button" className="small ghost" onClick={onExit}>← Home · בַּיִת</button>
        <He x={unit.title} as="h2" />
      </div>
      <div className="progress-bar" aria-label={`Step ${stepIndex + 1} of ${STEPS.length}: ${STEP_LABEL[step]}`}>
        <span style={{ width: `${(stepIndex / (STEPS.length - 1)) * 100}%` }} />
      </div>
      <p className="muted small-text">{STEP_LABEL[step]} · {stepIndex + 1}/{STEPS.length} · about {unit.minutes} min · you can stop any time and come back</p>

      {step === 'warmup' && warmups[sub] && (
        <>
          <p className="muted">Quick check — just to see what you already know. It's fine not to know!</p>
          <QuestionCard key={warmups[sub].q.id} q={warmups[sub].q} onDone={onAnswer(warmups[sub], warmups, null, 'warmup')} />
          <div className="row end"><button type="button" className="small ghost" onClick={() => go('explain')}>Skip →</button></div>
        </>
      )}
      {step === 'warmup' && !warmups[sub] && <div className="row end"><button className="primary" onClick={() => go('explain')}>Start →</button></div>}

      {step === 'explain' && (
        <section className="panel stack" data-testid="explain">
          <p lang="en" dir="ltr" style={{ fontSize: '1.15rem' }}>{unit.explain[sub].text}</p>
          <Speak text={unit.explain[sub].text} lang="en" />
          <Visual id={unit.explain[sub].visual} notToScale={unit.explain[sub].notToScale} />
          <div className="row end">
            {sub > 0 && <button type="button" onClick={() => setSub(sub - 1)}>← Back</button>}
            {sub + 1 < unit.explain.length
              ? <button type="button" className="primary" onClick={() => setSub(sub + 1)}>Next → ({sub + 1}/{unit.explain.length})</button>
              : <button type="button" className="primary" onClick={() => go('terms')}>To the Hebrew words →</button>}
          </div>
        </section>
      )}

      {step === 'terms' && (
        <section className="panel stack" data-testid="terms">
          <p className="muted small-text">Hebrew word {sub + 1} of {unit.terms.length}</p>
          <div className="row">
            <He x={unit.terms[sub].word} as="h2" />
            <Speak text={unit.terms[sub].word.heN} lang="he" />
            <span lang="en" dir="ltr" className="tag">{unit.terms[sub].word.en}</span>
          </div>
          <Bi x={unit.terms[sub].meaning} />
          <div className="panel"><Bi x={unit.terms[sub].sentence} /></div>
          <div className="row end">
            {sub > 0 && <button type="button" onClick={() => setSub(sub - 1)}>← Back</button>}
            {sub + 1 < unit.terms.length
              ? <button type="button" className="primary" onClick={() => setSub(sub + 1)}>Next word →</button>
              : <button type="button" className="primary" onClick={() => go('interact')}>Investigate →</button>}
          </div>
        </section>
      )}

      {step === 'interact' && <Interaction spec={unit.interaction} onDone={() => go('check')} />}

      {step === 'check' && checks[sub] && (
        <QuestionCard key={checks[sub].q.id + sub} q={checks[sub].q} onDone={onAnswer(checks[sub], checks, setChecks, 'unit')} />
      )}

      {step === 'produce' && tasks[sub] && (
        <Production
          key={tasks[sub].id}
          task={tasks[sub]}
          onDone={(o) => {
            produce(tasks[sub], o);
            if (sub + 1 < tasks.length) setSub(sub + 1);
            else go('lookback');
          }}
        />
      )}

      {step === 'lookback' && lookback && (
        <>
          <p className="muted">Look back: one more question about this unit, asked a different way.</p>
          <QuestionCard key={lookback.q.id} q={lookback.q} onDone={onAnswer(lookback, [lookback], null, 'lookback')} />
        </>
      )}

      {step === 'done' && (
        <section className="panel stack" data-testid="unit-done">
          <h2>{progress.settings.celebrations ? '🚀 ' : ''}Unit complete! · <He x={{ en: '', heN: 'סִיַּמְתָּ!', he: 'סיימת!' }} /></h2>
          <p>You explored the idea, learned {unit.terms.length} Hebrew words and practised saying them. It comes back for review on another day — that is how it sticks.</p>
          <p className="muted small-text">Finishing a unit is practice, not proof of exam readiness.</p>
          <div className="row end"><button type="button" className="primary" onClick={onExit}>Back home →</button></div>
        </section>
      )}
    </div>
  );
}
