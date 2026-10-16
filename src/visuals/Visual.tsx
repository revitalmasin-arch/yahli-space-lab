import { useState } from 'react';
import type { VisualId } from '../content/types';

// Teaching diagrams. Simple SVG; diagrams that are not to scale say so.

export function Visual({ id, notToScale }: { id: VisualId; notToScale?: boolean }) {
  const body = (() => {
    switch (id) {
      case 'universe-zoom':
        return <UniverseZoom />;
      case 'star-planet-light':
        return <StarPlanetLight />;
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
