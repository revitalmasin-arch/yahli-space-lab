import { useMemo, useState } from 'react';
import type { ProductionTask } from '../content/types';
import type { ProductionResult } from '../progress/model';
import { stripNiqqud } from '../lib/hebrew';
import { Bi, useNiqqud } from './Bi';
import { Speak } from './Speak';
import { testAttr } from '../lib/testattr';

export interface ProductionOutcome {
  result: ProductionResult;
  withBank: boolean;
}

const words = (s: string, niqqud: boolean) => (niqqud ? s : stripNiqqud(s));

function rotate<T>(a: T[], seed: string): T[] {
  // deterministic, never the identity order for 2+ items
  const k = (seed.length % (a.length - 1 || 1)) + 1;
  return [...a.slice(k), ...a.slice(0, k)];
}

export function Production({ task, onDone }: { task: ProductionTask; onDone: (o: ProductionOutcome) => void }) {
  if (task.kind === 'arrange') return <Arrange task={task} onDone={onDone} />;
  if (task.kind === 'complete') return <Complete task={task} onDone={onDone} />;
  return <SayAloud task={task} onDone={onDone} />;
}

function Arrange({ task, onDone }: { task: Extract<ProductionTask, { kind: 'arrange' }>; onDone: (o: ProductionOutcome) => void }) {
  const niqqud = useNiqqud();
  const bank = useMemo(() => rotate(task.words.map((w, i) => ({ w, i })), task.id), [task]);
  const [line, setLine] = useState<number[]>([]);
  const [misses, setMisses] = useState(0);
  const [state, setState] = useState<'work' | 'right' | 'revealed'>('work');
  const sentence = line.map((i) => task.words[i]).join(' ');
  const check = () => {
    if (line.every((idx, pos) => idx === pos) && line.length === task.words.length) return setState('right');
    const m = misses + 1;
    setMisses(m);
    if (m >= 2) setState('revealed');
    else setLine(line[0] === 0 ? [0] : []); // keep a correct first word as a scaffold
  };
  return (
    <section className="panel stack" data-testid={`production-${task.id}`}>
      <Bi x={task.prompt} as="h3" />
      <div className="answer-line" lang="he" dir="rtl" aria-label="your sentence">
        {line.map((i, n) => (
          <button key={n} type="button" className="small" disabled={state !== 'work'} onClick={() => setLine(line.filter((_, k) => k !== n))}>{words(task.words[i], niqqud)}</button>
        ))}
      </div>
      {state === 'work' && (
        <>
          <div className="word-bank" lang="he" dir="rtl">
            {bank.filter((b) => !line.includes(b.i)).map((b) => (
              <button key={b.i} {...testAttr('pos', b.i)} type="button" onClick={() => setLine([...line, b.i])}>{words(b.w, niqqud)}</button>
            ))}
          </div>
          {misses === 1 && <p className="feedback help">Almost. Start with the word the sentence is about. · כִּמְעַט! הַתְחֵל בַּמִּלָּה שֶׁהַמִּשְׁפָּט מְדַבֵּר עָלֶיהָ.</p>}
          <div className="row end">
            <button type="button" className="primary" disabled={line.length !== task.words.length} onClick={check}>Check · בְּדִיקָה</button>
          </div>
        </>
      )}
      {state !== 'work' && (
        <div className={`feedback ${state === 'right' ? 'good' : 'help'} stack`}>
          <strong>{state === 'right' ? '✓ Great sentence!' : 'Here is the sentence — read it aloud once:'}</strong>
          <p lang="he" dir="rtl" className="he-n">{words(task.words.join(' '), niqqud)}</p>
          <p className="en-box" lang="en" dir="ltr">{task.meaningEn}</p>
          <Speak text={task.words.join(' ')} lang="he" />
          <div className="row end">
            <button type="button" className="primary" onClick={() => onDone({ result: state === 'right' ? 'correct' : 'incorrect', withBank: true })}>Next →</button>
          </div>
        </div>
      )}
      {state === 'work' && sentence && <p className="muted small-text" lang="he" dir="rtl">{words(sentence, niqqud)}</p>}
    </section>
  );
}

function Complete({ task, onDone }: { task: Extract<ProductionTask, { kind: 'complete' }>; onDone: (o: ProductionOutcome) => void }) {
  const niqqud = useNiqqud();
  const bank = useMemo(() => rotate(task.bank, task.id), [task]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [state, setState] = useState<'work' | 'right' | 'revealed'>('work');
  const pick = (w: string) => {
    if (w === task.answer) return setState('right');
    const next = [...wrong, w];
    setWrong(next);
    if (next.length >= 2) setState('revealed');
  };
  const blank = state === 'work' ? '_____' : words(task.answer, niqqud);
  return (
    <section className="panel stack" data-testid={`production-${task.id}`}>
      <Bi x={task.prompt} as="h3" />
      <p lang="he" dir="rtl" className="he-n" style={{ fontSize: '1.3rem' }}>
        {words(task.before, niqqud)} <strong>{blank}</strong> {words(task.after, niqqud)}
      </p>
      {state === 'work' && (
        <div className="word-bank" lang="he" dir="rtl">
          {bank.map((w) => (
            <button key={w} {...testAttr('ok', w === task.answer)} type="button" disabled={wrong.includes(w)} onClick={() => pick(w)}>{words(w, niqqud)}</button>
          ))}
        </div>
      )}
      {wrong.length === 1 && state === 'work' && <p className="feedback help">Not that word. Which one makes the sentence true? · אֵיזוֹ מִלָּה מַתְאִימָה?</p>}
      {state !== 'work' && (
        <div className={`feedback ${state === 'right' ? 'good' : 'help'} stack`}>
          <strong>{state === 'right' ? (wrong.length ? '✓ You fixed it!' : '✓ Correct!') : 'The missing word:'}</strong>
          <p className="en-box" lang="en" dir="ltr">{task.meaningEn}</p>
          <Speak text={`${task.before} ${task.answer} ${task.after}`} lang="he" />
          <div className="row end">
            <button type="button" className="primary" onClick={() => onDone({ result: state === 'right' ? 'correct' : 'incorrect', withBank: true })}>Next →</button>
          </div>
        </div>
      )}
    </section>
  );
}

/** Say-aloud / paper task. The app does not listen, record or grade: the learner self-checks or waits for Mum. */
function SayAloud({ task, onDone }: { task: Extract<ProductionTask, { kind: 'say' | 'paper' }>; onDone: (o: ProductionOutcome) => void }) {
  const niqqud = useNiqqud();
  const [tried, setTried] = useState(false);
  const paper = task.kind === 'paper';
  return (
    <section className="panel stack" data-testid={`production-${task.id}`}>
      <p className="tag">{paper ? '✍️ On paper · עַל דַּף' : '🗣️ Say it aloud · אֱמוֹר בְּקוֹל'}</p>
      <Bi x={task.prompt} as="h3" />
      <p className="muted small-text">Words to try: {task.requiredTerms.map((w) => <span key={w} className="tag" lang="he">{words(w, niqqud)}</span>)}</p>
      <p className="muted small-text">The app does not listen or record. {paper ? 'Write it, then show Mum.' : 'Say your answer out loud first.'}</p>
      {!tried ? (
        <div className="row end">
          <button type="button" className="primary" onClick={() => setTried(true)}>{paper ? 'I wrote it · כָּתַבְתִּי' : 'I said it · אָמַרְתִּי'}</button>
        </div>
      ) : (
        <div className="feedback help stack" data-testid="example-answer">
          <strong>Example answer · תְּשׁוּבָה לְדוּגְמָה</strong>
          <Bi x={task.example} />
          <p>Did your answer say the same idea, with the words above? Grammar does not have to be perfect.</p>
          <div className="row">
            <button type="button" onClick={() => onDone({ result: 'self-ok', withBank: false })}>✓ Mine was like this</button>
            <button type="button" onClick={() => onDone({ result: 'self-unsure', withBank: false })}>🤔 Not sure</button>
            <button type="button" onClick={() => onDone({ result: 'pending', withBank: false })}>👩 Check with Mum later</button>
          </div>
        </div>
      )}
    </section>
  );
}
