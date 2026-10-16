import { useMemo, useState } from 'react';
import type { ProductionTask, Question } from '../content/types';
import { QUESTIONS } from '../content/questions';
import { PRODUCTION } from '../content/production';
import { QuestionCard } from '../components/QuestionCard';
import { Production } from '../components/Production';
import { useActions } from '../progress/actions';
import { useStore } from '../progress/store';
import { dueConcepts, pickQuestion } from '../lib/learning';
import { jerusalemDate } from '../lib/dates';

type Item = { kind: 'q'; q: Question } | { kind: 'p'; task: ProductionTask };
const MAX = 6;

/** Review & reinforcement: due concepts first (fresh wording), otherwise free practice from studied units. */
export function Review({ onExit }: { onExit: () => void }) {
  const { progress } = useStore();
  const { answer, produce } = useActions();
  const today = jerusalemDate();
  const items = useMemo<Item[]>(() => {
    const studied = new Set(Object.entries(progress.units).filter(([, u]) => u.introducedAt).map(([id]) => id));
    const due = dueConcepts(progress, today);
    const concepts = due.length ? due : [...new Set(QUESTIONS.filter((q) => studied.has(q.unit)).map((q) => q.concept))];
    const used = new Set<string>();
    const out: Item[] = [];
    // two rounds over the concepts so difficult ones get a second, differently-worded question
    for (let round = 0; round < 2 && out.length < MAX; round++) {
      for (const c of concepts) {
        if (out.length >= MAX) break;
        const q = pickQuestion(progress, c, used);
        if (q) { used.add(q.id); out.push({ kind: 'q', q }); }
      }
    }
    const hebrewDue = Object.entries(progress.concepts).filter(([, c]) => c.hebrew && c.hebrew.due <= today).map(([id]) => id);
    const say = PRODUCTION.find((t) => t.role === 'review' && studied.has(t.unit) && (hebrewDue.includes(t.concept) || !due.length));
    if (say) out.push({ kind: 'p', task: say });
    return out;
    // built once per visit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [i, setI] = useState(0);
  const item = items[i];
  const next = () => setI(i + 1);

  return (
    <div className="stack" data-testid="review">
      <div className="row">
        <button type="button" className="small ghost" onClick={onExit}>← Home · בַּיִת</button>
        <h2>Review and reinforcement · חֲזָרָה וְתִגְבּוּר</h2>
      </div>
      {items.length === 0 && <p className="panel">Nothing to review yet — start a unit first.</p>}
      {item && <p className="muted small-text">{i + 1} / {items.length}</p>}
      {item?.kind === 'q' && <QuestionCard key={item.q.id} q={item.q} onDone={(o) => { answer(item.q, o, 'review', false); next(); }} />}
      {item?.kind === 'p' && <Production key={item.task.id} task={item.task} onDone={(o) => { produce(item.task, o); next(); }} />}
      {items.length > 0 && !item && (
        <section className="panel stack" data-testid="review-done">
          <h3>Review done ✓</h3>
          <p>Questions you found hard will come back on another day.</p>
          <div className="row end"><button className="primary" onClick={onExit}>Back home →</button></div>
        </section>
      )}
    </div>
  );
}
