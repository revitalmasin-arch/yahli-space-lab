import { useState } from 'react';
import type { InteractionSpec } from '../content/types';
import { photoUrl, type PhotoKey } from '../visuals/Photo';
import { testAttr } from '../lib/testattr';
import { Bi, He } from './Bi';
import { DragButton } from './DragButton';
import { t } from '../lib/hebrew';

// Simulated model building (book pp.176–177): place the planets in order, add each planet's special
// feature (fact sheets pp.178–179), then check the model against the book's requirements.
// Relative sizes (giants bigger, Mercury smallest) follow NASA planet sizes; distances are NOT to scale.

const PLANETS: { id: PhotoKey; name: ReturnType<typeof t>; px: number }[] = [
  { id: 'mercury', name: t('Mercury', 'חַמָּה'), px: 24 },
  { id: 'venus', name: t('Venus', 'נוֹגַהּ'), px: 30 },
  { id: 'earth', name: t('Earth', 'כַּדּוּר הָאָרֶץ'), px: 31 },
  { id: 'mars', name: t('Mars', 'מַאֲדִים'), px: 27 },
  { id: 'jupiter', name: t('Jupiter', 'צֶדֶק'), px: 56 },
  { id: 'saturn', name: t('Saturn', 'שַׁבְּתַאי'), px: 52 },
  { id: 'uranus', name: t('Uranus', 'אוּרָנוּס'), px: 40 },
  { id: 'neptune', name: t('Neptune', 'נֶפְּטוּן'), px: 40 },
];

function PlanetImg({ id, px }: { id: PhotoKey; px: number }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="model-dot" style={{ width: px, height: px }} />;
  return (
    <img src={photoUrl(id)} alt="" width={id === 'saturn' ? px * 1.6 : px} height={px} draggable={false}
      style={{ objectFit: id === 'saturn' ? 'contain' : 'cover', borderRadius: id === 'saturn' ? 0 : '50%' }} onError={() => setFailed(true)} />
  );
}

export function ModelBuilder({ spec, onDone }: { spec: Extract<InteractionSpec, { kind: 'model' }>; onDone: () => void }) {
  const [stage, setStage] = useState<'place' | 'features' | 'check'>('place');
  const [slots, setSlots] = useState<Record<number, PhotoKey>>({}); // slot index → planet
  const [chosen, setChosen] = useState<string | null>(null); // selected chip (tap path)
  const [misses, setMisses] = useState<Record<string, number>>({});
  const [msg, setMsg] = useState('');
  const [features, setFeatures] = useState<Record<string, string>>({}); // feature id → planet
  const placedIds = Object.values(slots);

  const place = (planet: PhotoKey, slot: number) => {
    const right = PLANETS[slot].id === planet;
    if (right) {
      const next = { ...slots, [slot]: planet };
      setSlots(next);
      setMsg('');
      setChosen(null);
      if (Object.keys(next).length === PLANETS.length) setStage('features');
      return;
    }
    const m = (misses[planet] ?? 0) + 1;
    setMisses({ ...misses, [planet]: m });
    if (m >= 2) {
      // After two misses, put it in place and say why, instead of looping.
      const correctSlot = PLANETS.findIndex((p) => p.id === planet);
      const next = { ...slots, [correctSlot]: planet };
      setSlots(next);
      setChosen(null);
      setMsg(`${PLANETS[correctSlot].name.en} is planet number ${correctSlot + 1} from the Sun.`);
      if (Object.keys(next).length === PLANETS.length) setStage('features');
    } else setMsg('Not that orbit — count from the Sun. · סְפוֹר מֵהַשֶּׁמֶשׁ.');
  };

  const attach = (featureId: string, planet: string) => {
    const f = spec.features.find((x) => x.id === featureId)!;
    if (f.planet === planet) {
      const next = { ...features, [featureId]: planet };
      setFeatures(next);
      setMsg('');
      setChosen(null);
      if (Object.keys(next).length === spec.features.length) setStage('check');
      return;
    }
    const m = (misses[featureId] ?? 0) + 1;
    setMisses({ ...misses, [featureId]: m });
    if (m >= 2) {
      const next = { ...features, [featureId]: f.planet };
      setFeatures(next);
      setChosen(null);
      setMsg(`“${f.label.en}” belongs to ${PLANETS.find((p) => p.id === f.planet)!.name.en}.`);
      if (Object.keys(next).length === spec.features.length) setStage('check');
    } else setMsg('Not that planet — check the fact files. · בְּדוֹק בַּמִּידְעוֹנִים.');
  };

  return (
    <section className="panel stack" data-testid={`interaction-${spec.id}`}>
      <Bi x={spec.prompt} as="h3" />
      <p className="muted small-text">
        {stage === 'place' && 'Step 1 of 3 — drag each planet onto its orbit, counting from the Sun (or tap the planet, then the orbit). · שָׁלָב 1: סַדֵּר אֶת כּוֹכְבֵי הַלֶּכֶת'}
        {stage === 'features' && 'Step 2 of 3 — drag each special feature onto its planet (or tap the card, then the planet). · שָׁלָב 2: מַאֲפְיָינִים'}
        {stage === 'check' && 'Step 3 of 3 — check your model against the book’s requirements. · שָׁלָב 3: בְּדִיקַת הַדֶּגֶם'}
      </p>

      {/* the model: the Sun and 8 orbit slots (not to scale) */}
      <div className="model-track" dir="ltr">
        <img src={photoUrl('sun')} alt="Sun" className="model-sun" draggable={false} />
        {PLANETS.map((_, n) => {
          const placed = slots[n];
          return (
            <div key={n} className={`model-slot ${placed ? 'filled' : ''} ${n === 4 ? 'after-belt' : ''}`} data-drop={placed ? `planet-${placed}` : `slot-${n}`}>
              {placed ? (
                <button type="button" className="model-planet" data-testid={`model-planet-${placed}`} disabled={stage !== 'features'} onClick={() => chosen && attach(chosen, placed)}>
                  <PlanetImg id={placed} px={PLANETS[n].px} />
                  <He x={PLANETS[n].name} />
                  {spec.features.filter((f) => features[f.id] === placed).map((f) => <span key={f.id} className="tag good small-text"><He x={f.label} /></span>)}
                </button>
              ) : (
                <button type="button" className="model-empty" data-testid={`slot-${n}`} disabled={stage !== 'place' || !chosen} onClick={() => chosen && place(chosen as PhotoKey, n)}>
                  {n + 1}
                </button>
              )}
            </div>
          );
        })}
      </div>
      <p className="scale-note">Not to scale · לֹא לְפִי קְנֵה מִידָּה — the asteroid belt is between orbits 4 and 5</p>

      {stage === 'place' && (
        <div className="word-bank" role="group" aria-label="planets">
          {[...PLANETS].sort((a, b) => a.name.en.localeCompare(b.name.en)).filter((p) => !placedIds.includes(p.id)).map((p) => (
            <DragButton key={p.id} {...testAttr('slot', PLANETS.indexOf(p))} type="button" className={`choice model-chip ${chosen === p.id ? 'picked' : ''}`} style={{ width: 'auto' }}
              aria-pressed={chosen === p.id} onClick={() => setChosen(chosen === p.id ? null : p.id)}
              onDropOn={(target) => target.startsWith('slot-') && place(p.id, Number(target.slice(5)))}>
              <PlanetImg id={p.id} px={Math.min(p.px, 36)} /> <He x={p.name} />
            </DragButton>
          ))}
        </div>
      )}

      {stage === 'features' && (
        <div className="word-bank" role="group" aria-label="features">
          {spec.features.filter((f) => !features[f.id]).map((f) => (
            <DragButton key={f.id} {...testAttr('planet', f.planet)} type="button" className={`choice ${chosen === f.id ? 'picked' : ''}`} style={{ width: 'auto' }}
              aria-pressed={chosen === f.id} onClick={() => setChosen(chosen === f.id ? null : f.id)}
              onDropOn={(target) => target.startsWith('planet-') && attach(f.id, target.slice(7))}>
              <He x={f.label} />
            </DragButton>
          ))}
        </div>
      )}

      {msg && <p className="feedback help" role="status">{msg}</p>}

      {stage === 'check' && (
        <div className="feedback good stack" data-testid="model-check">
          <strong>🛠️ Model check · בְּדִיקַת הַדֶּגֶם (book p.176)</strong>
          <ul>
            <li>✓ The Sun and all 8 planets that orbit it</li>
            <li>✓ The planets in the right order from the Sun</li>
            <li>✓ Relative sizes: the giants are bigger, Mercury is the smallest</li>
            <li>✓ A special feature for each planet</li>
            <li>⚠️ Distances are not to scale: the real distances are far too big to fit in a model.</li>
          </ul>
          <details>
            <summary>✂️ Build it for real with Mum (optional)</summary>
            <p className="small-text">The book suggests reusing things: balloons of different sizes, papier-mâché, sticks, plastic bottles, cardboard, newspapers, straws, balls of different sizes, nets and packaging (p.177). Plan the steps, build, then check your model against the list above and improve it.</p>
          </details>
          <div className="row end"><button type="button" className="primary" onClick={onDone}>Continue →</button></div>
        </div>
      )}
    </section>
  );
}
