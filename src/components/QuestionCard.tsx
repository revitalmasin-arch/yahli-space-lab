import { useMemo, useState } from 'react';
import type { Choice, Question } from '../content/types';
import { conceptById } from '../content/concepts';
import { TF_CHOICES } from '../content/questions';
import { Visual } from '../visuals/Visual';
import { Bi, He } from './Bi';
import { testAttr } from '../lib/testattr';

export interface QuestionOutcome {
  correctFirstTry: boolean;
  finalCorrect: boolean;
  tries: number;
  assistance: 0 | 1 | 2 | 3;
  usedEnglish: boolean;
  usedSimpler: boolean;
  /** learner reached the worked example; the caller should offer a NEW similar question */
  wantsSibling: boolean;
}

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}
/** Stable shuffle per question, so the right answer is not always first but does not jump on re-render. */
function shuffled<T>(items: T[], seed: string): T[] {
  const a = [...items];
  let h = hash(seed);
  for (let i = a.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    const j = h % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ENCOURAGE_FIX = 'You corrected it — well done for not giving up.';

export function QuestionCard({ q, onDone }: { q: Question; onDone: (o: QuestionOutcome) => void }) {
  const concept = conceptById(q.concept);
  const [level, setLevel] = useState<0 | 1 | 2 | 3>(0);
  const [tries, setTries] = useState(0); // wrong answers so far
  const [usedEnglish, setUsedEnglish] = useState(false);
  const [usedSimpler, setUsedSimpler] = useState(false);
  const [stage, setStage] = useState<'main' | 'fix'>('main');
  const [wrong, setWrong] = useState<Set<string>>(new Set());
  const [solved, setSolved] = useState(false);
  // matching
  const [left, setLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());

  const raise = (to?: 0 | 1 | 2 | 3) => {
    const next = (to ?? Math.min(3, level + 1)) as 0 | 1 | 2 | 3;
    if (next >= 1 && q.simpler) setUsedSimpler(true);
    setLevel(next);
  };

  const choices: Choice[] = useMemo(() => {
    if (q.kind === 'mc') return shuffled(q.choices, q.id);
    if (q.kind === 'tf') return stage === 'fix' && q.fix ? shuffled(q.fix.choices, q.id + 'fix') : TF_CHOICES;
    return [];
  }, [q, stage]);

  const correctId = q.kind === 'mc' ? q.correct : q.kind === 'tf' ? (stage === 'fix' ? q.fix!.correct : q.truth ? 'true' : 'false') : '';

  function pick(id: string) {
    if (solved || level === 3 || wrong.has(id)) return;
    if (id === correctId) {
      if (q.kind === 'tf' && stage === 'main' && !q.truth && q.fix) {
        setStage('fix');
        setWrong(new Set());
        return;
      }
      setSolved(true);
      return;
    }
    const w = new Set(wrong).add(id);
    setWrong(w);
    setTries(tries + 1);
    const remaining = choices.filter((c) => !w.has(c.id)).length;
    // Never let the last remaining option count as an answer: go to the worked example instead.
    raise(remaining <= 1 ? 3 : undefined);
  }

  const rights = useMemo(() => (q.kind === 'match' ? shuffled(q.pairs.map((_, i) => i), q.id) : []), [q]);
  function pickRight(i: number) {
    if (q.kind !== 'match' || left === null || solved || level === 3) return;
    if (i === left) {
      const m = new Set(matched).add(i);
      setMatched(m);
      setLeft(null);
      if (m.size === q.pairs.length) setSolved(true);
      return;
    }
    const t = tries + 1;
    setTries(t);
    setLeft(null);
    if (t % 2 === 0) raise(); // matching: one ladder step per two mismatches
  }

  const finish = (wantsSibling: boolean) =>
    onDone({
      correctFirstTry: solved && tries === 0 && level === 0,
      finalCorrect: solved,
      tries: tries + (solved ? 1 : 0),
      assistance: level,
      usedEnglish,
      usedSimpler,
      wantsSibling,
    });

  const prompt = q.kind === 'tf' && stage === 'fix' && q.fix ? q.fix.prompt : q.prompt;
  const correctChoice = q.kind === 'mc' ? q.choices.find((c) => c.id === q.correct) : q.kind === 'tf' && q.fix ? q.fix.choices.find((c) => c.id === q.fix!.correct) : undefined;

  return (
    <section className="panel stack" aria-live="polite" data-testid={`question-${q.id}`}>
      {q.kind === 'tf' && stage === 'fix' && <p className="feedback good">✓ <He x={{ en: '', heN: 'צָדַקְתָּ, זֶה לֹא נָכוֹן!', he: 'צדקת, זה לא נכון!' }} /> Right, it is not true. Now fix it:</p>}
      <Bi x={prompt} as="h3" onEnglish={() => setUsedEnglish(true)} />
      {q.visual && <Visual id={q.visual} />}

      {q.kind !== 'match' && (
        <div className="stack" role="group" aria-label="answers">
          {choices.map((c) => {
            const state = solved && c.id === correctId ? 'correct' : wrong.has(c.id) ? 'wrong' : '';
            return (
              <button key={c.id} {...testAttr('ok', c.id === correctId)} type="button" className={`choice ${state}`} disabled={wrong.has(c.id) || (level === 3 && !solved)} onClick={() => pick(c.id)}>
                <He x={c.text} />
              </button>
            );
          })}
        </div>
      )}

      {q.kind === 'match' && (
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="stack">
            {q.pairs.map((p, i) => (
              <button key={i} {...testAttr('pair', i)} type="button" className={`choice ${matched.has(i) ? 'correct' : left === i ? 'picked' : ''}`} disabled={matched.has(i) || level === 3} onClick={() => setLeft(i)} aria-pressed={left === i}>
                <He x={p.left} />
              </button>
            ))}
          </div>
          <div className="stack">
            {rights.map((i) => (
              <button key={i} {...testAttr('pair', i)} type="button" className={`choice ${matched.has(i) ? 'correct' : ''}`} disabled={matched.has(i) || left === null || level === 3} onClick={() => pickRight(i)}>
                <He x={q.pairs[i].right} />
              </button>
            ))}
          </div>
        </div>
      )}

      {!solved && level >= 1 && (
        <div className="feedback help stack" data-testid="help-1">
          <strong>💡 Hint · רֶמֶז</strong>
          {q.simpler && <Bi x={q.simpler} onEnglish={() => setUsedEnglish(true)} />}
          <Bi x={q.hint} onEnglish={() => setUsedEnglish(true)} />
          {level === 1 && <p className="muted small-text">Not sure if it is the Hebrew or the science? Tap “English” on the question.</p>}
        </div>
      )}
      {!solved && level >= 2 && (
        <div className="feedback help stack" data-testid="help-2">
          <strong>🔭 Another way to see it · הֶסְבֵּר אַחֵר</strong>
          <Bi x={concept.alt} onEnglish={() => setUsedEnglish(true)} />
          <Visual id={concept.altVisual} />
        </div>
      )}
      {!solved && level === 3 && (
        <div className="feedback help stack" data-testid="help-3">
          <strong>🧑‍🚀 Worked example · דּוּגְמָה פְּתוּרָה</strong>
          <Bi x={concept.worked} onEnglish={() => setUsedEnglish(true)} />
          {q.kind === 'match' ? (
            <ul>{q.pairs.map((p, i) => <li key={i}><He x={p.left} /> — <He x={p.right} /></li>)}</ul>
          ) : (
            correctChoice && <p>The answer here: <He x={correctChoice.text} /></p>
          )}
          <Bi x={q.why} />
          <div className="row end">
            <button type="button" className="primary" onClick={() => finish(true)}>Try a new question →</button>
          </div>
        </div>
      )}

      {solved && (
        <div className="feedback good stack" data-testid="solved">
          <strong>✓ {tries > 0 ? ENCOURAGE_FIX : 'Correct!'}</strong>
          <Bi x={q.why} />
          <div className="row end">
            <button type="button" className="primary" onClick={() => finish(false)}>Next →</button>
          </div>
        </div>
      )}

      {!solved && level < 3 && (
        <div className="row">
          <button type="button" className="small ghost" onClick={() => raise()} data-testid="ask-help">
            {level === 0 ? '🙋 Help me · עֶזְרָה' : 'More help'}
          </button>
        </div>
      )}
    </section>
  );
}
