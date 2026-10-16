import { useMemo, useState } from 'react';
import type { InteractionSpec } from '../content/types';
import { Visual } from '../visuals/Visual';
import { Bi, He } from './Bi';
import { testAttr } from '../lib/testattr';

// Tap-only interactions (no dragging needed anywhere).

function seededOrder<T>(items: T[], seed: number): T[] {
  return items.map((x, i) => ({ x, k: (i * 7919 + seed * 104729) % 97 })).sort((a, b) => a.k - b.k).map((o) => o.x);
}

export function Interaction({ spec, onDone }: { spec: InteractionSpec; onDone: () => void }) {
  if (spec.kind === 'sort') return <Sort spec={spec} onDone={onDone} />;
  if (spec.kind === 'sequence') return <Sequence spec={spec} onDone={onDone} />;
  return (
    <section className="panel stack">
      <Bi x={spec.prompt} as="h3" />
      <Visual id={spec.visual} notToScale />
      <Bi x={spec.goal} />
      <div className="row end">
        <button type="button" className="primary" onClick={onDone}>I tried it → · נִיסִּיתִי</button>
      </div>
    </section>
  );
}

function Sort({ spec, onDone }: { spec: Extract<InteractionSpec, { kind: 'sort' }>; onDone: () => void }) {
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [misses, setMisses] = useState<Record<string, number>>({});
  const [msg, setMsg] = useState<{ ok: boolean; item: string } | null>(null);
  const order = useMemo(() => seededOrder(spec.items, spec.id.length), [spec]);
  const left = order.filter((i) => !placed[i.id]);
  const done = left.length === 0;

  const drop = (bin: string) => {
    if (!selected) return;
    const item = spec.items.find((i) => i.id === selected)!;
    if (item.bin === bin) {
      setPlaced({ ...placed, [item.id]: bin });
      setMsg({ ok: true, item: item.id });
      setSelected(null);
    } else {
      const m = (misses[item.id] ?? 0) + 1;
      setMisses({ ...misses, [item.id]: m });
      if (m >= 2) {
        // After two misses, place it and explain rather than looping.
        setPlaced({ ...placed, [item.id]: item.bin });
        setSelected(null);
      }
      setMsg({ ok: false, item: item.id });
    }
  };
  const msgItem = msg && spec.items.find((i) => i.id === msg.item);

  return (
    <section className="panel stack" data-testid={`interaction-${spec.id}`}>
      <Bi x={spec.prompt} as="h3" />
      {spec.visual && <Visual id={spec.visual} />}
      <p className="muted small-text">Tap a card, then tap its group · לְחַץ עַל כַּרְטִיס וְאָז עַל הַקְּבוּצָה</p>
      <div className="word-bank" role="group" aria-label="cards">
        {left.map((i) => (
          <button key={i.id} {...testAttr('bin', i.bin)} type="button" className={`choice ${selected === i.id ? 'picked' : ''}`} style={{ width: 'auto' }} aria-pressed={selected === i.id} onClick={() => setSelected(i.id)}>
            <He x={i.label} />
          </button>
        ))}
      </div>
      <div className="sort-bins">
        {spec.bins.map((b) => (
          <div key={b.id} className={`bin ${selected ? 'target' : ''}`}>
            <button type="button" className="small" style={{ width: '100%' }} disabled={!selected} onClick={() => drop(b.id)} data-testid={`bin-${b.id}`}>
              <He x={b.label} />
            </button>
            <div className="stack" style={{ marginTop: 6 }}>
              {spec.items.filter((i) => placed[i.id] === b.id).map((i) => (
                <div key={i.id} className="tag good"><He x={i.label} /></div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {msg && msgItem && (
        <div className={`feedback ${msg.ok ? 'good' : 'help'}`} role="status">
          {msg.ok ? <Bi x={msgItem.feedback} /> : (misses[msgItem.id] ?? 0) >= 2 ? <><p>It goes here:</p><Bi x={msgItem.feedback} /></> : <p>Not that group — try another one. · נַסֵּה קְבוּצָה אַחֶרֶת.</p>}
        </div>
      )}
      {done && (
        <div className="row end">
          <button type="button" className="primary" onClick={onDone}>Continue →</button>
        </div>
      )}
    </section>
  );
}

function Sequence({ spec, onDone }: { spec: Extract<InteractionSpec, { kind: 'sequence' }>; onDone: () => void }) {
  const [chosen, setChosen] = useState<string[]>([]);
  const [miss, setMiss] = useState(0);
  const [note, setNote] = useState('');
  const done = chosen.length === spec.order.length;
  const tap = (id: string) => {
    const expected = spec.order[chosen.length];
    if (id === expected) {
      setChosen([...chosen, id]);
      setNote('');
      setMiss(0);
    } else {
      setMiss(miss + 1);
      setNote(miss + 1 >= 2 ? 'Placed the next one for you — look where it goes.' : 'Not this one yet — which comes next?');
      if (miss + 1 >= 2) {
        setChosen([...chosen, expected]);
        setMiss(0);
      }
    }
  };
  const label = (id: string) => spec.items.find((i) => i.id === id)!.label;
  return (
    <section className="panel stack" data-testid={`interaction-${spec.id}`}>
      <Bi x={spec.prompt} as="h3" />
      {spec.visual && <Visual id={spec.visual} notToScale />}
      <ol className="answer-line" aria-label="your order" style={{ listStyle: 'none' }}>
        {chosen.map((id, n) => (
          <li key={id} className="tag good">{n + 1}. <He x={label(id)} /></li>
        ))}
      </ol>
      <div className="word-bank" role="group" aria-label="choices">
        {spec.items.filter((i) => !chosen.includes(i.id)).map((i) => (
          <button key={i.id} {...testAttr('pos', spec.order.indexOf(i.id))} type="button" className="choice" style={{ width: 'auto' }} onClick={() => tap(i.id)}>
            <He x={i.label} />
          </button>
        ))}
      </div>
      {note && <p className="feedback help" role="status">{note}</p>}
      {done && (
        <div className="feedback good stack">
          <Bi x={spec.done} />
          <div className="row end"><button type="button" className="primary" onClick={onDone}>Continue →</button></div>
        </div>
      )}
    </section>
  );
}
