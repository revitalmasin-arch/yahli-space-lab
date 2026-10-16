import { useEffect, useRef, useState } from 'react';
import type { VisualId } from '../content/types';

/** Seconds of animation time, advancing only while `playing`. Animations never start by themselves. */
function useAnimTime(playing: boolean): number {
  const [t, setT] = useState(0);
  const last = useRef<number | null>(null);
  useEffect(() => {
    if (!playing) {
      last.current = null;
      return;
    }
    let raf = 0;
    const step = (now: number) => {
      if (last.current !== null) {
        const dt = (now - last.current) / 1000;
        setT((x) => x + Math.min(dt, 0.1));
      }
      last.current = now;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing]);
  return t;
}

function PlayButton({ playing, onToggle, label }: { playing: boolean; onToggle: () => void; label?: string }) {
  return (
    <button type="button" className="small" onClick={onToggle} aria-pressed={playing}>
      {playing ? '⏸ עֲצוֹר · Pause' : `▶ ${label ?? 'הַפְעֵל · Play'}`}
    </button>
  );
}

const LIT_DEFS = (
  <defs>
    <linearGradient id="litLeft" x1="0" x2="1">
      <stop offset="0.5" stopColor="#4fa3ff" />
      <stop offset="0.5" stopColor="#0d1a33" />
    </linearGradient>
    <linearGradient id="moonLitLeft" x1="0" x2="1">
      <stop offset="0.5" stopColor="#e2e2e2" />
      <stop offset="0.5" stopColor="#1a1a1a" />
    </linearGradient>
  </defs>
);

/** The Moon orbits Earth; the half facing the Sun is lit. Play/pause and switch the Sun off. */
function MoonOrbit() {
  const [playing, setPlaying] = useState(false);
  const [sun, setSun] = useState(true);
  const t = useAnimTime(playing);
  const a = (t / 8) * 2 * Math.PI; // one orbit per 8 s here; about a month in reality
  const ex = 250, ey = 115;
  const mx = ex + 75 * Math.cos(a), my = ey + 75 * Math.sin(a);
  return (
    <div>
      <svg className="visual" viewBox="0 0 400 230" role="img" aria-label={sun ? 'The Moon orbits Earth; the side facing the Sun is lit' : 'Sun off: Earth and Moon are dark'}>
        <rect width="400" height="230" fill="#050818" />
        {LIT_DEFS}
        <circle cx="30" cy="115" r="40" fill={sun ? '#ffb347' : '#3a2a10'} />
        <text x="30" y="175" fill="#ffe08a" fontSize="11" textAnchor="middle">שֶׁמֶשׁ</text>
        {sun && [0, 1, 2].map((i) => <line key={i} x1="75" y1={95 + i * 20} x2="160" y2={95 + i * 20} stroke="#ffb347" opacity="0.4" strokeWidth="2" />)}
        <circle cx={ex} cy={ey} r="75" fill="none" stroke="#34407a" strokeDasharray="4 5" />
        <circle cx={ex} cy={ey} r="20" fill={sun ? 'url(#litLeft)' : '#0d1a33'} stroke="#34407a" />
        <text x={ex} y={ey + 38} fill="#cfe8ff" fontSize="11" textAnchor="middle">כַּדּוּר הָאָרֶץ</text>
        <circle cx={mx} cy={my} r="8" fill={sun ? 'url(#moonLitLeft)' : '#1a1a1a'} stroke="#555" />
        <text x={mx} y={my - 12} fill="#ddd" fontSize="10" textAnchor="middle">יָרֵחַ</text>
      </svg>
      <div className="row">
        <PlayButton playing={playing} onToggle={() => setPlaying(!playing)} />
        <button type="button" className="small" onClick={() => setSun(!sun)} aria-pressed={!sun}>
          {sun ? '☀️ לְכַבּוֹת אֶת הַשֶּׁמֶשׁ · Sun off' : '☀️ לְהַדְלִיק אֶת הַשֶּׁמֶשׁ · Sun on'}
        </button>
      </div>
    </div>
  );
}

/** A pendulum (repeats: periodic) next to a ball that rolls down once and stops (not periodic). */
function Periodic() {
  const [playing, setPlaying] = useState(false);
  const [ballStart, setBallStart] = useState(0);
  const t = useAnimTime(playing);
  const angle = 28 * Math.sin((t / 2) * 2 * Math.PI);
  const rad = (angle * Math.PI) / 180;
  const bx = 90 + 110 * Math.sin(rad), by = 30 + 110 * Math.cos(rad);
  const p = Math.min(1, Math.max(0, (t - ballStart) / 2.5)); // rolls once, then stays
  const ballX = 250 + p * 120;
  const ballY = 80 + (ballX - 240) * 0.6 - 1; // on the slope line (240,80)→(380,164); drawn 10px above as radius
  return (
    <div>
      <svg className="visual" viewBox="0 0 400 200" role="img" aria-label="A pendulum swinging again and again, and a ball that rolls down once and stops">
        <rect width="400" height="200" fill="#050818" />
        <line x1="40" y1="30" x2="140" y2="30" stroke="#888" strokeWidth="3" />
        <line x1="90" y1="30" x2={bx} y2={by} stroke="#cfd8ff" strokeWidth="2" />
        <circle cx={bx} cy={by} r="12" fill="#ffb347" />
        <text x="90" y="190" fill="#9be3b5" fontSize="11" textAnchor="middle">מְטוּטֶלֶת — מַחֲזוֹרִית</text>
        <line x1="240" y1="80" x2="380" y2="164" stroke="#888" strokeWidth="3" />
        <circle cx={ballX} cy={ballY - 10} r="10" fill="#7fd3ff" />
        <text x="310" y="190" fill="#ff9a9a" fontSize="11" textAnchor="middle">כַּדּוּר — לֹא מַחֲזוֹרִית</text>
      </svg>
      <div className="row">
        <PlayButton playing={playing} onToggle={() => setPlaying(!playing)} />
        <button type="button" className="small" onClick={() => { setBallStart(t); if (!playing) setPlaying(true); }}>↺ Roll the ball again</button>
      </div>
    </div>
  );
}

/** Earth's two motions, each with its own button: rotation (spin on the axis) and orbit (around the Sun). */
function RotationOrbit() {
  const [spin, setSpin] = useState(false);
  const [orbit, setOrbit] = useState(false);
  const ts = useAnimTime(spin);
  const to = useAnimTime(orbit);
  const SPIN_S = 1.5, ORBIT_S = 14; // not to scale: really 365 spins per orbit
  const phi = (to / ORBIT_S) * 2 * Math.PI;
  const ex = 210 + 150 * Math.cos(phi), ey = 120 + 75 * Math.sin(phi);
  const psi = (ts / SPIN_S) * 2 * Math.PI;
  const markX = ex + 11 * Math.sin(psi);
  const markVisible = Math.cos(psi) > 0;
  return (
    <div>
      <svg className="visual" viewBox="0 0 420 240" role="img" aria-label="Earth spinning on its axis and travelling around the Sun">
        <rect width="420" height="240" fill="#050818" />
        <ellipse cx="210" cy="120" rx="150" ry="75" fill="none" stroke="#34407a" strokeDasharray="4 5" />
        <circle cx="210" cy="120" r="24" fill="#ffb347" />
        <text x="210" y="160" fill="#ffe08a" fontSize="11" textAnchor="middle">שֶׁמֶשׁ</text>
        <line x1={ex - 6} y1={ey - 22} x2={ex + 6} y2={ey + 22} stroke="#ffe08a" strokeWidth="1.5" />
        <circle cx={ex} cy={ey} r="15" fill="#2f6fd6" />
        {markVisible && <circle cx={markX} cy={ey - 4} r="3.5" fill="#ff5d5d" />}
        <text x={ex} y={ey + 32} fill="#cfe8ff" fontSize="10" textAnchor="middle">כַּדּוּר הָאָרֶץ</text>
      </svg>
      <div className="row">
        <button type="button" className={`small ${spin ? 'primary' : ''}`} onClick={() => setSpin(!spin)} aria-pressed={spin}>🔄 סִיבּוּב · Spin {spin ? '⏸' : '▶'}</button>
        <button type="button" className={`small ${orbit ? 'primary' : ''}`} onClick={() => setOrbit(!orbit)} aria-pressed={orbit}>🪐 הַקָּפָה · Orbit {orbit ? '⏸' : '▶'}</button>
      </div>
      <p className="muted small-text" role="status">
        Spins (סִיבּוּבִים): <strong>{Math.floor(ts / SPIN_S)}</strong> · Orbits (הַקָּפוֹת): <strong>{Math.floor(to / ORBIT_S)}</strong> · red dot = Israel. Really, Earth spins about 365 times in one orbit.
      </p>
    </div>
  );
}

// Teaching diagrams. Simple SVG; diagrams that are not to scale say so.

export function Visual({ id, notToScale }: { id: VisualId; notToScale?: boolean }) {
  const body = (() => {
    switch (id) {
      case 'universe-zoom':
        return <UniverseZoom />;
      case 'star-planet-light':
        return <StarPlanetLight />;
      case 'solar-order':
        return <SolarSystem mode="order" />;
      case 'planet-groups':
        return <SolarSystem mode="groups" />;
      case 'asteroid-belt':
        return <SolarSystem mode="innerOuter" />;
      case 'moon-orbit':
        return <MoonOrbit />;
      case 'periodic':
        return <Periodic />;
      case 'rotation-orbit':
        return <RotationOrbit />;
      default:
        return null; // diagrams for later units are added in phase 4
    }
  })();
  if (!body) return null;
  return (
    <figure className="visual-wrap">
      {body}
      {notToScale && <figcaption className="scale-note">Not to scale · לֹא לְפִי קְנֵה מִידָּה</figcaption>}
    </figure>
  );
}

const LEVELS = [
  { id: 'universe', en: 'Universe: space + all the bodies', he: 'יְקוּם' },
  { id: 'galaxy', en: 'Milky Way galaxy', he: 'שְׁבִיל הֶחָלָב' },
  { id: 'solar', en: 'Solar System', he: 'מַעֲרֶכֶת הַשֶּׁמֶשׁ' },
  { id: 'earth', en: 'Earth', he: 'כַּדּוּר הָאָרֶץ' },
] as const;

/** Zoom from the universe to Earth. Space is the dark background at every level — never a box. */
function UniverseZoom() {
  const [level, setLevel] = useState(0);
  const stars = Array.from({ length: 60 }, (_, i) => ({ x: (i * 97) % 400, y: (i * 53) % 240, r: (i % 3) * 0.5 + 0.6 }));
  return (
    <div>
      <svg className="visual" viewBox="0 0 400 240" role="img" aria-label={LEVELS[level].en}>
        <rect width="400" height="240" fill="#050818" />
        {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#cfd8ff" opacity="0.6" />)}
        {level === 0 && (
          <g>
            {[[80, 60], [300, 70], [200, 150], [110, 190], [320, 190]].map(([x, y], i) => (
              <ellipse key={i} cx={x} cy={y} rx="34" ry="12" fill={i === 2 ? '#9fb7ff' : '#7a6fb0'} opacity="0.8" transform={`rotate(${i * 25} ${x} ${y})`} />
            ))}
            <text x="200" y="182" fill="#ffe08a" fontSize="12" textAnchor="middle">Milky Way</text>
          </g>
        )}
        {level === 1 && (
          <g>
            <ellipse cx="200" cy="120" rx="150" ry="55" fill="#6f7fd6" opacity="0.35" />
            <path d="M200 120 C 260 60, 340 110, 330 150 M200 120 C 140 180, 60 130, 70 90" stroke="#b9c6ff" strokeWidth="10" fill="none" opacity="0.5" />
            <circle cx="200" cy="120" r="14" fill="#fff3c4" />
            <circle cx="300" cy="140" r="4" fill="#ffb347" />
            <text x="300" y="160" fill="#ffe08a" fontSize="12" textAnchor="middle">Solar System</text>
          </g>
        )}
        {level === 2 && (
          <g>
            <circle cx="70" cy="120" r="26" fill="#ffb347" />
            {[45, 65, 85, 110, 150, 190, 230, 265].map((r, i) => (
              <circle key={i} cx="70" cy="120" r={r + 26} fill="none" stroke="#34407a" strokeWidth="1" />
            ))}
            <circle cx={70 + 85 + 26} cy="120" r="6" fill="#4fa3ff" />
            <text x={70 + 85 + 26} y="108" fill="#ffe08a" fontSize="12" textAnchor="middle">Earth</text>
          </g>
        )}
        {level === 3 && (
          <g>
            <circle cx="200" cy="120" r="80" fill="#2f6fd6" />
            <path d="M160 80 q30 -20 60 0 q10 30 -20 40 q-30 10 -40 -40z M210 150 q30 -10 40 10 q-10 25 -40 15z" fill="#4caf6a" />
            <text x="200" y="225" fill="#ffe08a" fontSize="12" textAnchor="middle">Earth — our planet</text>
          </g>
        )}
        <text x="10" y="20" fill="#aab3dd" fontSize="11">space (חלל) is all around</text>
      </svg>
      <div className="row" role="group" aria-label="Zoom level">
        {LEVELS.map((l, i) => (
          <button key={l.id} type="button" className={`small ${i === level ? 'primary' : ''}`} onClick={() => setLevel(i)} aria-pressed={i === level}>
            <span lang="he">{l.he}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const PLANETS = [
  { he: 'חַמָּה', en: 'Mercury', r: 4, color: '#b0a89a', group: 'rocky' },
  { he: 'נוֹגַהּ', en: 'Venus', r: 6, color: '#e6c98a', group: 'rocky' },
  { he: 'כַּדּוּר הָאָרֶץ', en: 'Earth', r: 6.5, color: '#4fa3ff', group: 'rocky' },
  { he: 'מַאֲדִים', en: 'Mars', r: 5, color: '#d0603a', group: 'rocky' },
  { he: 'צֶדֶק', en: 'Jupiter', r: 15, color: '#d8b48a', group: 'gas' },
  { he: 'שַׁבְּתַאי', en: 'Saturn', r: 12, color: '#e8d29a', group: 'gas', rings: true },
  { he: 'אוּרָנוּס', en: 'Uranus', r: 9, color: '#9fe3e8', group: 'gas' },
  { he: 'נֶפְּטוּן', en: 'Neptune', r: 9, color: '#4f6fe0', group: 'gas' },
] as const;
const GROUP_LABEL = { rocky: 'אַרְצִי · rocky', gas: 'גַּז עֲנָק · gas giant', dwarf: 'נַנָּסִי · dwarf planet' };

/** The Sun and the eight planets in order, the asteroid belt between Mars and Jupiter. Tap a planet. */
function SolarSystem({ mode }: { mode: 'order' | 'groups' | 'innerOuter' }) {
  const [sel, setSel] = useState<number | null>(null);
  const [showGroups, setShowGroups] = useState(mode === 'groups');
  const innerOuter = mode === 'innerOuter';
  const x = (i: number) => 70 + i * 52 + (i >= 4 ? 30 : 0); // a gap for the asteroid belt
  const belt = Array.from({ length: 26 }, (_, i) => ({ x: x(3) + 22 + (i % 5) * 7, y: 40 + ((i * 37) % 120) }));
  const p = sel !== null ? PLANETS[sel] : null;
  return (
    <div>
      <svg className="visual" viewBox="0 0 520 200" role="img" aria-label="The Sun and the eight planets in order, with the asteroid belt between Mars and Jupiter">
        <rect width="520" height="200" fill="#050818" />
        <circle cx="-30" cy="100" r="80" fill="#ffb347" />
        <text x="18" y="190" fill="#ffe08a" fontSize="11" textAnchor="middle">שֶׁמֶשׁ</text>
        {showGroups && (
          <g>
            <rect x={x(0) - 16} y="20" width={x(3) - x(0) + 32} height="160" rx="10" fill="#4caf6a" opacity="0.12" />
            <rect x={x(4) - 20} y="20" width={x(7) - x(4) + 40} height="160" rx="10" fill="#7fd3ff" opacity="0.12" />
            <text x={(x(0) + x(3)) / 2} y="34" fill="#9be3b5" fontSize="11" textAnchor="middle">אַרְצִיִּים · rocky</text>
            <text x={(x(4) + x(7)) / 2} y="34" fill="#bfe9ff" fontSize="11" textAnchor="middle">גַּזִּים עֲנָקִיִּים · gas giants</text>
            <circle cx={x(3) + 36} cy="150" r="2.5" fill="#ddd" />
            <text x={x(3) + 36} y="168" fill="#ddd" fontSize="9" textAnchor="middle">Ceres</text>
            <circle cx="505" cy="60" r="2.5" fill="#ddd" />
            <text x="503" y="78" fill="#ddd" fontSize="9" textAnchor="end">Pluto →</text>
          </g>
        )}
        {innerOuter && (
          <g>
            <rect x={x(0) - 16} y="20" width={x(3) - x(0) + 32} height="160" rx="10" fill="#ffb347" opacity="0.1" />
            <rect x={x(4) - 20} y="20" width={x(7) - x(4) + 40} height="160" rx="10" fill="#7fd3ff" opacity="0.1" />
            <text x={(x(0) + x(3)) / 2} y="34" fill="#ffd89a" fontSize="11" textAnchor="middle">פְּנִימִיִּים · inner</text>
            <text x={(x(4) + x(7)) / 2} y="34" fill="#bfe9ff" fontSize="11" textAnchor="middle">חִיצוֹנִיִּים · outer</text>
            <line x1={x(3) + 36} y1="40" x2={x(3) + 36} y2="172" stroke="#9a8f80" strokeDasharray="3 4" />
          </g>
        )}
        {belt.map((b, i) => <circle key={i} cx={b.x} cy={b.y} r={innerOuter ? 1.8 : 1.3} fill="#9a8f80" />)}
        <text x={x(3) + 36} y="190" fill="#aab3dd" fontSize="9" textAnchor="middle">asteroid belt</text>
        {PLANETS.map((pl, i) => (
          <g key={pl.en} role="button" tabIndex={0} aria-label={`${i + 1}. ${pl.en}`} onClick={() => setSel(i)} onKeyDown={(e) => e.key === 'Enter' && setSel(i)} style={{ cursor: 'pointer' }}>
            <circle cx={x(i)} cy="100" r={Math.max(pl.r, 14)} fill="transparent" />
            {'rings' in pl && <ellipse cx={x(i)} cy="100" rx={pl.r + 9} ry="4" fill="none" stroke="#d9c58a" strokeWidth="2" />}
            <circle cx={x(i)} cy="100" r={pl.r} fill={pl.color} stroke={sel === i ? '#ffe08a' : 'none'} strokeWidth="2" />
            <text x={x(i)} y="128" fill="#cfd8ff" fontSize="10" textAnchor="middle">{i + 1}</text>
            <text x={x(i)} y="143" fill="#eef1ff" fontSize="11" textAnchor="middle">{pl.he}</text>
          </g>
        ))}
      </svg>
      <div className="row">
        <span className="muted small-text">Tap a planet · לְחַץ עַל כּוֹכַב לֶכֶת</span>
        {!innerOuter && <button type="button" className="small" onClick={() => setShowGroups(!showGroups)} aria-pressed={showGroups}>{showGroups ? 'Hide groups' : 'Show groups · קְבוּצוֹת'}</button>}
      </div>
      {p && sel !== null && (
        <p className="feedback help" role="status">
          <strong>{sel + 1}.</strong> <span lang="he">{p.he}</span> — <span lang="en">{p.en}</span> · <span lang="he">{innerOuter ? (sel < 4 ? 'פְּנִימִי · inner' : 'חִיצוֹנִי · outer') : GROUP_LABEL[p.group]}</span>
        </p>
      )}
    </div>
  );
}

/** The Sun makes light; the planet and its moon are lit on the side facing the Sun. Toggle the Sun. */
function StarPlanetLight() {
  const [on, setOn] = useState(true);
  return (
    <div>
      <svg className="visual" viewBox="0 0 400 200" role="img" aria-label={on ? 'Sun on: planet and moon lit on one side' : 'Sun off: planet and moon dark'}>
        <rect width="400" height="200" fill="#050818" />
        <defs>
          <linearGradient id="lit" x1="0" x2="1">
            <stop offset="0.5" stopColor="#4fa3ff" />
            <stop offset="0.5" stopColor="#0d1a33" />
          </linearGradient>
          <linearGradient id="litMoon" x1="0" x2="1">
            <stop offset="0.5" stopColor="#d9d9d9" />
            <stop offset="0.5" stopColor="#1a1a1a" />
          </linearGradient>
        </defs>
        {on && [0, 1, 2, 3, 4].map((i) => <line key={i} x1="95" y1={60 + i * 20} x2="215" y2={70 + i * 15} stroke="#ffb347" strokeWidth="2" opacity="0.5" />)}
        <circle cx="60" cy="100" r="42" fill={on ? '#ffb347' : '#3a2a10'} />
        <text x="60" y="160" fill="#ffe08a" fontSize="12" textAnchor="middle">Sun · מאיר</text>
        <circle cx="250" cy="100" r="28" fill={on ? 'url(#lit)' : '#0d1a33'} stroke="#34407a" />
        <text x="250" y="150" fill="#cfe8ff" fontSize="12" textAnchor="middle">Planet · מואר</text>
        <circle cx="330" cy="70" r="10" fill={on ? 'url(#litMoon)' : '#1a1a1a'} stroke="#34407a" />
        <text x="330" y="52" fill="#ddd" fontSize="11" textAnchor="middle">Moon · מואר</text>
      </svg>
      <div className="row">
        <button type="button" className="small" onClick={() => setOn(!on)} aria-pressed={!on}>
          {on ? '☀️ לְכַבּוֹת אֶת הַשֶּׁמֶשׁ · Sun off' : '☀️ לְהַדְלִיק אֶת הַשֶּׁמֶשׁ · Sun on'}
        </button>
      </div>
    </div>
  );
}
