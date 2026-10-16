import { useState } from 'react';
import { PhotoBall, photoUrl } from './Photo';

// Diagrams for the units that cover pages 168–171, 176–181 and 184–190.
// Data shown here is from the textbook (pages noted) or NASA; diagrams that are not to scale say so.

const btn = (on: boolean) => `small ${on ? 'primary' : ''}`;

/** The Big Dipper's two "pointer" stars lead to the North Star (book pp.168, 170). Not to scale. */
export function Sky() {
  const [lines, setLines] = useState(true);
  // Big Dipper: handle (Alkaid, Mizar, Alioth) then the bowl (Megrez, Dubhe, Merak, Phecda).
  // The two "pointer" stars Merak → Dubhe, extended, lead to Polaris.
  const dipper = [[60, 112], [92, 124], [124, 128], [160, 132], [214, 112], [222, 152], [170, 164], [160, 132]];
  const dubhe = [214, 112], merak = [222, 152];
  const polaris = [dubhe[0] + (dubhe[0] - merak[0]) * 2.1, dubhe[1] + (dubhe[1] - merak[1]) * 2.1];
  return (
    <div>
      <svg className="visual" viewBox="0 0 320 220" role="img" aria-label="The Big Dipper constellation; its two end stars point to the North Star">
        <rect width="320" height="220" fill="#050818" />
        {[[30, 30], [290, 190], [40, 190], [300, 90], [140, 30], [260, 150], [100, 70]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1" fill="#cfd8ff" opacity="0.6" />)}
        {lines && <polyline points={dipper.map((p) => p.join(',')).join(' ')} fill="none" stroke="#7fd3ff" strokeWidth="1.5" strokeDasharray="4 3" />}
        {lines && <line x1={merak[0]} y1={merak[1]} x2={polaris[0]} y2={polaris[1]} stroke="#ffe08a" strokeWidth="1.2" strokeDasharray="2 4" />}
        {dipper.slice(0, 7).map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.2" fill="#fff" />)}
        <circle cx={polaris[0]} cy={polaris[1]} r="4.5" fill="#ffe08a" />
        <text x={polaris[0] - 80} y={polaris[1] + 2} fill="#ffe08a" fontSize="11" textAnchor="middle">כּוֹכַב הַצָּפוֹן</text>
        <text x={polaris[0] - 80} y={polaris[1] + 16} fill="#ffe08a" fontSize="10" textAnchor="middle">North Star (Polaris)</text>
        <text x="140" y="196" fill="#cfe8ff" fontSize="11" textAnchor="middle">הָעֲגָלָה הַגְּדוֹלָה · Big Dipper</text>
        <text x="288" y="40" fill="#ffe08a" fontSize="10" textAnchor="middle">↑ north</text>
        <text x="288" y="54" fill="#ffe08a" fontSize="10" textAnchor="middle">צָפוֹן</text>
      </svg>
      <div className="row">
        <button type="button" className={btn(lines)} onClick={() => setLines(!lines)} aria-pressed={lines}>✏️ Imaginary lines · קַוִּים דִּמְיוֹנִיִּים</button>
      </div>
      <p className="scale-note">Not to scale · לֹא לְפִי קְנֵה מִידָּה</p>
    </div>
  );
}

/** Jupiter seen with the eye (a bright dot) vs through a telescope (with moons, as Galileo saw — NASA). */
export function Telescope() {
  const [scope, setScope] = useState(false);
  return (
    <div>
      <svg className="visual" viewBox="0 0 320 180" role="img" aria-label={scope ? 'Through a telescope: Jupiter as a disc with small moons beside it' : 'With the eye: Jupiter is just a bright dot'}>
        <rect width="320" height="180" fill="#050818" />
        {scope ? (
          <g>
            <circle cx="160" cy="90" r="80" fill="#02030a" stroke="#4b5372" strokeWidth="4" />
            <PhotoBall k="jupiter" cx={160} cy={90} r={24} fallback="#d8b48a" />
            {[[100, 92], [122, 88], [204, 91], [228, 89]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.6" fill="#f2f2f2" />)}
            <text x="160" y="168" fill="#ffe08a" fontSize="11" textAnchor="middle">🔭 In a telescope: Jupiter and its moons</text>
          </g>
        ) : (
          <g>
            {[[40, 40], [270, 60], [90, 140], [250, 150], [180, 30]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.2" fill="#cfd8ff" />)}
            <circle cx="160" cy="90" r="3.5" fill="#fff6d0" />
            <text x="160" y="168" fill="#ffe08a" fontSize="11" textAnchor="middle">👀 With the eye: a bright dot</text>
          </g>
        )}
      </svg>
      <div className="row">
        <button type="button" className={btn(!scope)} onClick={() => setScope(false)} aria-pressed={!scope}>👀 Eye · עַיִן</button>
        <button type="button" className={btn(scope)} onClick={() => setScope(true)} aria-pressed={scope}>🔭 Telescope · טֶלֶסְקוֹפּ</button>
      </div>
    </div>
  );
}

// Fact sheets, book pp.178–179 (distance in million km; temperature as given in the book).
const FACTS = [
  { he: 'חַמָּה', en: 'Mercury', dist: 58, temp: '−183 to 427°C', orbit: '88 days' },
  { he: 'נוֹגַהּ', en: 'Venus', dist: 108, temp: 'about 450°C', orbit: '225 days', note: true },
  { he: 'כַּדּוּר הָאָרֶץ', en: 'Earth', dist: 150, temp: '−35 to 25°C', orbit: '365 days' },
  { he: 'מַאֲדִים', en: 'Mars', dist: 227, temp: 'about −55°C', orbit: '687 days' },
  { he: 'צֶדֶק', en: 'Jupiter', dist: 778, temp: 'about −150°C', orbit: '12 years' },
  { he: 'שַׁבְּתַאי', en: 'Saturn', dist: 1429, temp: 'about −180°C', orbit: '29½ years' },
  { he: 'אוּרָנוּס', en: 'Uranus', dist: 2875, temp: 'about −215°C', orbit: '84 years' },
  { he: 'נֶפְּטוּן', en: 'Neptune', dist: 4504, temp: 'about −213°C', orbit: '165 years' },
];

/** The fact-sheet table (book pp.178–180) — the book's own method: organise the data in a table. */
export function PlanetTable() {
  return (
    <div className="planet-table">
      <table className="data-table small-text" dir="ltr">
        <thead>
          <tr><th>Planet</th><th>Distance from the Sun (million km)</th><th>Temperature</th><th>Orbit time</th></tr>
        </thead>
        <tbody>
          {FACTS.map((f) => (
            <tr key={f.en} className={f.note ? 'note-row' : ''}>
              <td><span lang="he">{f.he}</span> <span className="muted">{f.en}</span></td>
              <td>{f.dist.toLocaleString('en-US')}</td>
              <td>{f.temp}{f.note ? ' ⚠️' : ''}</td>
              <td>{f.orbit}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted small-text">Data: textbook pp.178–179. Farther → usually colder and a longer orbit (p.180). ⚠️ Venus is hotter than Mercury: its thick layer of gas traps heat (NASA).</p>
    </div>
  );
}

/** A comet (tail pointing away from the Sun) and a meteor/meteorite (book p.181). Not to scale. */
export function CometMeteor() {
  const [view, setView] = useState<'comet' | 'meteor'>('comet');
  return (
    <div>
      <svg className="visual" viewBox="0 0 320 180" role="img" aria-label={view === 'comet' ? 'A comet with its head and a long glowing tail pointing away from the Sun' : 'A meteor glowing in the air, and a meteorite on the ground'}>
        <rect width="320" height="180" fill="#050818" />
        {view === 'comet' ? (
          <g>
            <PhotoBall k="sun" cx={30} cy={90} r={22} fallback="#ffb347" />
            <defs>
              <linearGradient id="tail" x1="0" x2="1">
                <stop offset="0" stopColor="#bfe9ff" stopOpacity="0.9" />
                <stop offset="1" stopColor="#bfe9ff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M160 90 L300 60 L300 120 Z" fill="url(#tail)" />
            <circle cx="160" cy="90" r="7" fill="#e8f6ff" />
            <text x="160" y="118" fill="#ffe08a" fontSize="11" textAnchor="middle">רֹאשׁ · head</text>
            <text x="262" y="140" fill="#cfe8ff" fontSize="11" textAnchor="middle">זָנָב · tail</text>
            <text x="160" y="170" fill="#aab3dd" fontSize="10" textAnchor="middle">ice and dust · קֶרַח וְאָבָק</text>
          </g>
        ) : (
          <g>
            <rect x="0" y="110" width="320" height="40" fill="#18306a" opacity="0.6" />
            <text x="8" y="124" fill="#9fc3ff" fontSize="10">air · אֲוִויר</text>
            <line x1="90" y1="20" x2="190" y2="118" stroke="#ffd27a" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
            <circle cx="190" cy="118" r="4" fill="#fff3c4" />
            <text x="120" y="100" fill="#ffe08a" fontSize="11">מֶטֶאוֹר · meteor ("shooting star")</text>
            <rect x="0" y="150" width="320" height="30" fill="#3a2e22" />
            <path d="M226 152 l8 -6 l10 2 l4 6 z" fill="#6b6358" />
            <text x="238" y="174" fill="#e8d6b8" fontSize="11" textAnchor="middle">מֶטֶאוֹרִיט · meteorite</text>
          </g>
        )}
      </svg>
      <div className="row">
        <button type="button" className={btn(view === 'comet')} onClick={() => setView('comet')} aria-pressed={view === 'comet'}>☄️ Comet · שָׁבִיט</button>
        <button type="button" className={btn(view === 'meteor')} onClick={() => setView('meteor')} aria-pressed={view === 'meteor'}>🌠 Meteor · מֶטֶאוֹר</button>
      </div>
      <p className="scale-note">Not to scale · לֹא לְפִי קְנֵה מִידָּה</p>
    </div>
  );
}

/** Earth-centred (ancient Greeks) vs Sun-centred (Copernicus) — book pp.181–182. Not to scale. */
export function Models() {
  const [helio, setHelio] = useState(false);
  const centre = helio ? 'sun' : 'earth';
  const ring = helio ? (['mercury', 'venus', 'earth', 'mars'] as const) : (['moon', 'mercury', 'sun', 'mars'] as const);
  return (
    <div>
      <svg className="visual" viewBox="0 0 320 200" role="img" aria-label={helio ? 'Sun-centred model: the Sun in the centre, Earth and the planets around it' : 'Earth-centred model: Earth in the centre, the Moon, the Sun and planets around it'}>
        <rect width="320" height="200" fill="#050818" />
        {[40, 62, 84, 106].map((r) => <circle key={r} cx="160" cy="100" r={r * 0.85} fill="none" stroke="#34407a" strokeDasharray="3 4" />)}
        <PhotoBall k={centre} cx={160} cy={100} r={centre === 'sun' ? 16 : 11} fallback={centre === 'sun' ? '#ffb347' : '#4fa3ff'} />
        {ring.map((k, i) => {
          const r = [40, 62, 84, 106][i] * 0.85, a = (i * 95 + 30) * (Math.PI / 180);
          return <PhotoBall key={k} k={k} cx={160 + r * Math.cos(a)} cy={100 + r * Math.sin(a)} r={k === 'sun' ? 9 : 5} fallback="#cfd8ff" />;
        })}
        <text x="160" y="194" fill="#ffe08a" fontSize="11" textAnchor="middle">{helio ? 'Copernicus: the Sun in the centre · הֶלְיוֹצֶנְטְרִי' : 'Ancient Greeks: Earth in the centre · גֵּאוֹצֶנְטְרִי'}</text>
      </svg>
      <div className="row">
        <button type="button" className={btn(!helio)} onClick={() => setHelio(false)} aria-pressed={!helio}>🏛️ Ancient Greeks</button>
        <button type="button" className={btn(helio)} onClick={() => setHelio(true)} aria-pressed={helio}>☀️ Copernicus</button>
      </div>
      <p className="scale-note">Not to scale · לֹא לְפִי קְנֵה מִידָּה</p>
    </div>
  );
}

/** A calendar page: page = month, row = week, square = day (book p.184). October 2026 starts on a Thursday. */
export function Calendar() {
  const first = 4; // Sunday = 0 … Thursday = 4
  const cells = [...Array(first).fill(null), ...Array.from({ length: 31 }, (_, i) => i + 1)];
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return (
    <div className="calendar-visual">
      <p className="small-text"><strong>October 2026</strong> — one page = a month · עַמּוּד = חוֹדֶשׁ</p>
      <table className="cal" dir="ltr">
        <thead><tr>{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <th key={d}>{d}</th>)}</tr></thead>
        <tbody>
          {weeks.map((w, i) => (
            <tr key={i}>{Array.from({ length: 7 }, (_, j) => w[j] ?? null).map((d, j) => <td key={j} className={d === 22 ? 'exam' : ''}>{d ?? ''}</td>)}</tr>
          ))}
        </tbody>
      </table>
      <p className="muted small-text">A row = a week · שׁוּרָה = שָׁבוּעַ. A square = a day · מִשְׁבֶּצֶת = יוֹם. 12 pages (months) make a year.</p>
    </div>
  );
}

const DAY_STATES = [
  { label: 'Day in Israel · יוֹם', a: 180 },
  { label: 'Evening in Israel · עֶרֶב', a: 270 },
  { label: 'Night in Israel · לַיְלָה', a: 0 },
  { label: 'Morning in Israel · בּוֹקֶר', a: 90 },
];
/** Globe-and-lamp model (book p.188): turn Earth west→east and watch Israel move from day into night. */
export function DayNight() {
  const [i, setI] = useState(0);
  const s = DAY_STATES[i];
  const rad = (s.a * Math.PI) / 180;
  const ix = 200 + 46 * Math.cos(rad), iy = 100 - 46 * Math.sin(rad);
  return (
    <div>
      <svg className="visual" viewBox="0 0 320 200" role="img" aria-label={`Earth from above, lit on the side facing the Sun. ${s.label}`}>
        <rect width="320" height="200" fill="#050818" />
        <PhotoBall k="sun" cx={-20} cy={100} r={70} fallback="#ffb347" />
        {[0, 1, 2].map((k) => <line key={k} x1="60" y1={70 + k * 30} x2="140" y2={70 + k * 30} stroke="#ffb347" opacity="0.4" strokeWidth="2" />)}
        <PhotoBall k="earth" cx={200} cy={100} r={52} fallback="#2f6fd6" shade="right" />
        <circle cx={ix} cy={iy} r="6" fill="#ff5d5d" stroke="#fff" strokeWidth="1.5" />
        <text x={ix} y={iy - 10} fill="#fff" fontSize="10" textAnchor="middle">Israel</text>
        <text x="270" y="40" fill="#aab3dd" fontSize="10" textAnchor="middle">↻ west → east</text>
        <text x="200" y="190" fill="#ffe08a" fontSize="12" textAnchor="middle">{s.label}</text>
      </svg>
      <div className="row">
        <button type="button" className="small" onClick={() => setI((i + 1) % DAY_STATES.length)}>🔄 Turn Earth · סוֹבֵב אֶת כַּדּוּר הָאָרֶץ</button>
      </div>
      <p className="scale-note">Not to scale · לֹא לְפִי קְנֵה מִידָּה</p>
    </div>
  );
}

const SUN_POS = [
  { key: 'morning', label: 'Morning: sunrise in the east · זְרִיחָה בַּמִּזְרָח', x: 50, y: 150 },
  { key: 'noon', label: 'Noon: high in the sky · צָהֳרַיִים', x: 160, y: 50 },
  { key: 'evening', label: 'Evening: sunset in the west · שְׁקִיעָה בַּמַּעֲרָב', x: 270, y: 150 },
];
/** The Sun's apparent path (book p.190), as seen facing south: east on the left, west on the right. */
export function SunPath() {
  const [i, setI] = useState(0);
  const p = SUN_POS[i];
  return (
    <div>
      <svg className="visual" viewBox="0 0 320 200" role="img" aria-label={p.label}>
        <rect width="320" height="200" fill={i === 1 ? '#3a6fc0' : '#1f2f6a'} />
        <path d="M40 160 Q160 -20 280 160" fill="none" stroke="#ffe08a" strokeDasharray="4 5" opacity="0.7" />
        <PhotoBall k="sun" cx={p.x} cy={p.y} r={14} fallback="#ffb347" />
        <rect x="0" y="160" width="320" height="40" fill="#2a4a2a" />
        <text x="46" y="178" fill="#fff" fontSize="12" textAnchor="middle">מִזְרָח</text>
        <text x="46" y="193" fill="#cfe8ff" fontSize="10" textAnchor="middle">east</text>
        <text x="274" y="178" fill="#fff" fontSize="12" textAnchor="middle">מַעֲרָב</text>
        <text x="274" y="193" fill="#cfe8ff" fontSize="10" textAnchor="middle">west</text>
      </svg>
      <div className="row">
        {SUN_POS.map((s, k) => <button key={s.key} type="button" className={btn(k === i)} onClick={() => setI(k)} aria-pressed={k === i}>{['🌅 Morning', '☀️ Noon', '🌇 Evening'][k]}</button>)}
      </div>
      <p className="small-text">{p.label}</p>
      <p className="muted small-text">The Sun only seems to move: Earth is the one turning, west → east (p.190).</p>
    </div>
  );
}

/** Units of time (book p.190): 24 hours in a יְמָמָה, 60 minutes in an hour, 60 seconds in a minute. */
export function Clock() {
  return (
    <div>
      <svg className="visual" viewBox="0 0 240 200" role="img" aria-label="A clock with hour, minute and second hands">
        <rect width="240" height="200" fill="#050818" />
        <circle cx="120" cy="100" r="80" fill="#eef1ff" stroke="#3a4a92" strokeWidth="4" />
        {Array.from({ length: 12 }, (_, k) => {
          const a = (k * 30 - 90) * (Math.PI / 180);
          return <text key={k} x={120 + 64 * Math.cos(a)} y={104 + 64 * Math.sin(a)} fontSize="12" textAnchor="middle" fill="#1a2350">{k === 0 ? 12 : k}</text>;
        })}
        <line x1="120" y1="100" x2="120" y2="58" stroke="#8a4fd6" strokeWidth="6" strokeLinecap="round" />
        <line x1="120" y1="100" x2="170" y2="100" stroke="#2f6fd6" strokeWidth="4" strokeLinecap="round" />
        <line x1="120" y1="100" x2="90" y2="150" stroke="#e2483f" strokeWidth="2" strokeLinecap="round" />
        <circle cx="120" cy="100" r="4" fill="#1a2350" />
      </svg>
      <p className="small-text" dir="ltr">
        <span style={{ color: '#8a4fd6' }}>■</span> hour · שָׁעָה &nbsp; <span style={{ color: '#2f6fd6' }}>■</span> minute · דַּקָּה &nbsp; <span style={{ color: '#e2483f' }}>■</span> second · שְׁנִיָּה
      </p>
      <p className="muted small-text">1 יְמָמָה = 24 hours · 1 hour = 60 minutes · 1 minute = 60 seconds</p>
    </div>
  );
}

const LIFE = [
  { k: 'earth' as const, he: 'כַּדּוּר הָאָרֶץ', en: 'Earth', water: true, temp: true, air: true, note: 'water, suitable temperature, air with oxygen (p.178)' },
  { k: 'venus' as const, he: 'נוֹגַהּ', en: 'Venus', water: false, temp: false, air: false, note: 'about 450°C, no liquid water (p.178)' },
  { k: 'mars' as const, he: 'מַאֲדִים', en: 'Mars', water: false, temp: false, air: false, note: 'about −55°C, ice only at the poles, thin air (p.179)' },
];
/** What life needs, compared for Earth, Venus and Mars (book pp.178–179). */
export function LifeCompare() {
  const mark = (ok: boolean) => (ok ? '✅' : '❌');
  return (
    <div className="life-grid">
      {LIFE.map((p) => (
        <div key={p.k} className="life-card">
          <img src={photoUrl(p.k)} alt={p.en} width={64} height={64} style={{ borderRadius: '50%' }} />
          <strong><span lang="he">{p.he}</span> · {p.en}</strong>
          <span className="small-text">{mark(p.water)} liquid water · מַיִם נוֹזְלִיִּים</span>
          <span className="small-text">{mark(p.temp)} suitable temperature · טֶמְפֶּרָטוּרָה מַתְאִימָה</span>
          <span className="small-text">{mark(p.air)} air with oxygen · חַמְצָן</span>
          <span className="muted small-text">{p.note}</span>
        </div>
      ))}
    </div>
  );
}
