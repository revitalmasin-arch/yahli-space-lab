// Small decorative icons for the lab look. Decorative only: aria-hidden, no information lives here.
import { PhotoBall, SaturnPhoto, type PhotoKey } from './Photo';

export function Logo() {
  return (
    <svg className="logo" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <radialGradient id="logoPlanet" cx="0.35" cy="0.35">
          <stop offset="0" stopColor="#9fd8ff" />
          <stop offset="1" stopColor="#2d5bd6" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="#0d1440" stroke="#3a4a92" strokeWidth="2" />
      <circle cx="32" cy="34" r="13" fill="url(#logoPlanet)" />
      <ellipse cx="32" cy="34" rx="24" ry="7" fill="none" stroke="#ffb347" strokeWidth="2.5" transform="rotate(-18 32 34)" />
      <path d="M45 11 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="#ffe08a" className="twinkle" />
      <circle cx="15" cy="17" r="1.5" fill="#fff" className="twinkle" />
      <circle cx="50" cy="50" r="1.2" fill="#fff" />
    </svg>
  );
}

const PLANET = (fill: string, extra?: JSX.Element) => (
  <>
    <circle cx="28" cy="28" r="14" fill={fill} />
    {extra}
  </>
);

const ART: Record<string, JSX.Element> = {
  // Our place in the universe: a spiral galaxy
  u1: (
    <>
      <ellipse cx="28" cy="28" rx="22" ry="10" fill="#6f7fd6" opacity="0.35" transform="rotate(-20 28 28)" />
      <path d="M28 28 C 38 16, 50 26, 44 34 M28 28 C 18 40, 6 30, 12 22" stroke="#cfd8ff" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="28" cy="28" r="5" fill="#fff3c4" />
    </>
  ),
  // Star or planet: a sun lighting a planet
  u2: (
    <>
      <circle cx="16" cy="28" r="10" fill="#ffb347" />
      <path d="M28 22 L34 22 M28 28 L35 28 M28 34 L34 34" stroke="#ffb347" strokeWidth="2" opacity="0.7" />
      <circle cx="44" cy="28" r="7" fill="#4fa3ff" />
      <path d="M44 21 a7 7 0 0 1 0 14z" fill="#0d1a33" />
    </>
  ),
  // Planet order: a row of planets
  u3: (
    <>
      {[['8', '#b0a89a', 2.5], ['17', '#e6c98a', 3.5], ['27', '#4fa3ff', 4], ['37', '#d0603a', 3], ['48', '#d8b48a', 6]].map(([x, c, r]) => (
        <circle key={x as string} cx={Number(x)} cy="28" r={Number(r)} fill={c as string} />
      ))}
    </>
  ),
  // Rocky, gas giants, dwarf: Saturn
  u4: PLANET('#e8d29a', <ellipse cx="28" cy="28" rx="24" ry="6" fill="none" stroke="#d9c58a" strokeWidth="3" transform="rotate(-15 28 28)" />),
  // Asteroid belt: rocks
  u5: (
    <>
      {[[10, 30, 4], [20, 20, 3], [27, 34, 5], [37, 22, 3.5], [45, 33, 4], [17, 40, 2.5], [40, 12, 2]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#9a8f80" stroke="#6b6358" />
      ))}
    </>
  ),
  // The Moon: crescent
  u6: (
    <>
      <circle cx="28" cy="28" r="15" fill="#e2e2e2" />
      <circle cx="35" cy="24" r="14" fill="#16204f" />
      <circle cx="20" cy="32" r="2" fill="#bdbdbd" />
    </>
  ),
  // Periodic motion / rotation vs orbit: orbit arrow around a planet
  u7: (
    <>
      <circle cx="28" cy="28" r="8" fill="#2f6fd6" />
      <ellipse cx="28" cy="28" rx="22" ry="12" fill="none" stroke="#7fd3ff" strokeWidth="2.5" strokeDasharray="5 4" />
      <path d="M48 24 l2 6 -6 -1z" fill="#7fd3ff" />
    </>
  ),
  // Day, year, month: half-lit Earth with a clock hand
  u8: (
    <>
      <circle cx="28" cy="28" r="15" fill="#2f6fd6" />
      <path d="M28 13 a15 15 0 0 1 0 30z" fill="#0d1a33" />
      <path d="M28 28 L28 18 M28 28 L35 31" stroke="#ffe08a" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  // Life on Earth: Earth with a leaf
  u9: (
    <>
      <circle cx="28" cy="28" r="15" fill="#2f6fd6" />
      <path d="M20 22 q8 -6 14 0 q-2 8 -10 8z" fill="#4caf6a" />
      <path d="M38 36 q6 -10 12 -8 q-2 10 -12 8z" fill="#7be08f" />
    </>
  ),
};

const PHOTO_FOR: Record<string, PhotoKey> = {
  u1: 'deepfield', u2: 'sun', u3: 'jupiter', u5: 'vesta', u6: 'moon', u7: 'earth', u8: 'earth', u9: 'earth',
};
const OVERLAY: Record<string, JSX.Element> = {
  u7: (
    <>
      <ellipse cx="28" cy="28" rx="25" ry="11" fill="none" stroke="#7fd3ff" strokeWidth="2.5" strokeDasharray="5 4" />
      <path d="M51 25 l2 6 -6 -1z" fill="#7fd3ff" />
    </>
  ),
  u8: <path d="M28 28 L28 16 M28 28 L36 32" stroke="#ffe08a" strokeWidth="3" strokeLinecap="round" />,
};

/** Mission-card icon: a real photo where we have one (drawn art underneath as the fallback). */
export function UnitIcon({ unit }: { unit: string }) {
  const k = PHOTO_FOR[unit];
  const clip = `icon-${unit}`;
  return (
    <svg className="unit-ico" viewBox="0 0 56 56" aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <circle cx="28" cy="28" r="27" />
        </clipPath>
      </defs>
      {/* space-black disc so photos with black backgrounds (e.g. Saturn) blend in */}
      <circle cx="28" cy="28" r="27" fill="#020309" />
      <g clipPath={`url(#${clip})`}>
        {ART[unit] ?? PLANET('#7fd3ff')}
        {unit === 'u4' && <SaturnPhoto cx={28} cy={28} r={11} />}
        {k && <PhotoBall k={k} cx={28} cy={28} r={k === 'deepfield' ? 27 : 18} fallback="transparent" shade={unit === 'u8' ? 'right' : undefined} />}
        {OVERLAY[unit]}
      </g>
      <circle cx="28" cy="28" r="27" fill="none" stroke="#3a4a92" />
    </svg>
  );
}

/** Small rocket badge for a finished unit (shown only when celebrations are on). */
export function RocketBadge() {
  return (
    <svg className="badge-done" viewBox="0 0 96 96" aria-hidden="true">
      <circle cx="48" cy="48" r="44" fill="#0d1440" stroke="#ffb347" strokeWidth="3" />
      <path d="M48 16 c10 10 14 24 10 40 h-20 c-4 -16 0 -30 10 -40z" fill="#eef1ff" />
      <circle cx="48" cy="38" r="6" fill="#4fa3ff" stroke="#3a4a92" strokeWidth="2" />
      <path d="M38 56 l-8 10 10 -2z M58 56 l8 10 -10 -2z" fill="#ff7a59" />
      <path d="M42 58 q6 16 12 0z" fill="#ffb347" />
    </svg>
  );
}
