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
import { RocketBadge } from '../visuals/Icons';
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

const STEP_ICON: Record<Step, string> = {
  warmup: '🧭', explain: '🔭', terms: '🔤', interact: '🧪', check: '✅', produce: '🗣️', lookback: '🔁', done: '🚀',
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
  const initialChecks = () => questionsFor(unitId, 'check').map((q) => ({ q, afterWorked: false }));
  const [checks, setChecks] = useState<QItem[]>(initialChecks);
  const tasks = useMemo(() => productionFor(unitId, 'unit'), [unitId]);
  const [lookback, setLookback] = useState<QItem | null>(null);
  // Bumped when a part is started over, so its question/task components start fresh.
  const [round, setRound] = useState(0);
  // Furthest stage reached this visit (stages done earlier also count): the learner may jump back
  // to any of these, but not skip ahead past unfinished ones.
  const [reached, setReached] = useState(STEPS.indexOf(step));

  /** Look back after an intervening activity: a different-wording question from this unit. */
  const prepareLookback = (): boolean => {
    const concepts = [...new Set(initialChecks().map((c) => c.q.concept))];
    const q = concepts.map((c) => pickQuestion(progress, c, used.current, ['review'])).find(Boolean);
    setLookback(q ? { q, afterWorked: false } : null);
    return !!q;
  };

  const go = (target: Step) => {
    let next = target;
    stepDone(unitId, step);
    setSub(0);
    if (next === 'lookback' && !prepareLookback()) {
      stepDone(unitId, 'lookback');
      next = 'done';
    }
    if (next === 'done') stepDone(unitId, 'done');
    setStep(next);
    setReached((r) => Math.max(r, STEPS.indexOf(next)));
    window.scrollTo({ top: 0 });
  };

  /** Go back to a stage, or start the current one over. Nothing already recorded is removed:
   *  answers given again are saved as new attempts (not "first time") and XP is never given twice. */
  const restartAt = (target: Step) => {
    setSub(0);
    setRound((r) => r + 1);
    if (target === 'check') setChecks(initialChecks());
    if (target === 'lookback' && !prepareLookback()) target = 'done';
    setStep(target);
    window.scrollTo({ top: 0 });
  };
  const canJump = (s: Step) => done.includes(s) || STEPS.indexOf(s) <= reached;
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
      <nav className="path" aria-label="Mission path">
        {STEPS.map((s, i) => (
          <button
            key={s}
            type="button"
            className={`stop ${s === step ? 'now' : done.includes(s) || i < stepIndex ? 'done' : ''}`}
            disabled={!canJump(s) || s === step}
            aria-current={s === step ? 'step' : undefined}
            aria-label={`Stage ${i + 1}: ${STEP_LABEL[s]}`}
            title={STEP_LABEL[s]}
            onClick={() => restartAt(s)}
            data-testid={`stop-${s}`}
          >
            {STEP_ICON[s]}
          </button>
        ))}
      </nav>
      <p className="muted small-text">{STEP_LABEL[step]} · {stepIndex + 1}/{STEPS.length} · about {unit.minutes} min · you can stop any time and come back</p>
      <div className="row">
        {stepIndex > 0 && (
          <button type="button" className="small ghost" onClick={() => restartAt(STEPS[stepIndex - 1])} data-testid="stage-back">← Back a stage · אֲחוֹרָה</button>
        )}
        {step !== 'done' && (
          <button type="button" className="small ghost" onClick={() => restartAt(step)} data-testid="stage-restart">↺ Start this part over · מֵהַהַתְחָלָה</button>
        )}
        {stepIndex > 0 && (
          <button type="button" className="small ghost" onClick={() => restartAt('warmup')} data-testid="unit-restart">⟲ Start the whole unit over</button>
        )}
      </div>

      {step === 'warmup' && warmups[sub] && (
        <>
          <p className="muted">Quick check — just to see what you already know. It's fine not to know!</p>
          <QuestionCard key={`${warmups[sub].q.id}-${round}`} q={warmups[sub].q} onDone={onAnswer(warmups[sub], warmups, null, 'warmup')} />
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

      {step === 'interact' && <Interaction key={`int-${round}`} spec={unit.interaction} onDone={() => go('check')} />}

      {step === 'check' && checks[sub] && (
        <QuestionCard key={`${checks[sub].q.id}-${sub}-${round}`} q={checks[sub].q} onDone={onAnswer(checks[sub], checks, setChecks, 'unit')} />
      )}

      {step === 'produce' && tasks[sub] && (
        <Production
          key={`${tasks[sub].id}-${round}`}
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
          <QuestionCard key={`${lookback.q.id}-${round}`} q={lookback.q} onDone={onAnswer(lookback, [lookback], null, 'lookback')} />
        </>
      )}

      {step === 'done' && (
        <section className="panel stack" data-testid="unit-done">
          {progress.settings.celebrations && <RocketBadge />}
          <h2>Mission complete! · <He x={{ en: '', heN: 'סִיַּמְתָּ!', he: 'סיימת!' }} /></h2>
          <p>You explored the idea, learned {unit.terms.length} Hebrew words and practised saying them. It comes back for review on another day — that is how it sticks.</p>
          <p className="muted small-text">Finishing a unit is practice, not proof of exam readiness.</p>
          <div className="row end"><button type="button" className="primary" onClick={onExit}>Back home →</button></div>
        </section>
      )}
    </div>
  );
}
