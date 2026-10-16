import { useEffect, useRef, useState } from 'react';
import { PhotoBall } from './Photo';

// The mission-window spaceship. On the pad its flame grows with each stage done; when today's mission
// is complete it lifts off and then flies in orbit through a small solar system.
// `animate` = celebrations on AND the device does not ask for reduced motion; otherwise still pictures.

function Rocket({ flame }: { flame: number }) {
  // flame: 0..1 → flame length and width
  const len = 0.15 + 0.85 * flame;
  const wid = 0.55 + 0.45 * flame;
  return (
    <g>
      <defs>
        <linearGradient id="rkBody" x1="0" x2="1">
          <stop offset="0" stopColor="#8e97ab" />
          <stop offset="0.45" stopColor="#ffffff" />
          <stop offset="1" stopColor="#7d869a" />
        </linearGradient>
        <linearGradient id="rkRed" x1="0" x2="1">
          <stop offset="0" stopColor="#8f1f1c" />
          <stop offset="0.5" stopColor="#e2483f" />
          <stop offset="1" stopColor="#8f1f1c" />
        </linearGradient>
        <radialGradient id="rkGlass" cx="0.35" cy="0.35">
          <stop offset="0" stopColor="#bfe6ff" />
          <stop offset="1" stopColor="#1f5fb3" />
        </radialGradient>
        <linearGradient id="flOuter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3b0" />
          <stop offset="0.35" stopColor="#ffb347" />
          <stop offset="1" stopColor="#ff4d1a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="flCore" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ffe08a" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* flame (drawn first, below the nozzle) */}
      <g data-testid="flame" data-scale={len.toFixed(2)} transform={`translate(0 30) scale(${wid} ${len})`}>
        <g className="flame-flicker">
          <path d="M-9 0 C -11 18, -5 40, 0 62 C 5 40, 11 18, 9 0 Z" fill="url(#flOuter)" />
          <path d="M-4.5 0 C -5 12, -2 24, 0 36 C 2 24, 5 12, 4.5 0 Z" fill="url(#flCore)" />
        </g>
      </g>
      {/* nozzle */}
      <path d="M-7 24 h14 l3 7 h-20z" fill="#3b4256" />
      {/* fins */}
      <path d="M-11 6 L-22 26 L-11 22z" fill="url(#rkRed)" />
      <path d="M11 6 L22 26 L11 22z" fill="url(#rkRed)" />
      {/* body */}
      <path d="M-11 -30 C -11 -36, 11 -36, 11 -30 V 24 H -11z" fill="url(#rkBody)" stroke="#5c6478" strokeWidth="0.8" />
      <line x1="-11" y1="-6" x2="11" y2="-6" stroke="#9aa3b5" strokeWidth="0.8" />
      <line x1="-11" y1="12" x2="11" y2="12" stroke="#9aa3b5" strokeWidth="0.8" />
      {/* nose cone */}
      <path d="M-11 -30 C -10 -46, -4 -56, 0 -60 C 4 -56, 10 -46, 11 -30z" fill="url(#rkRed)" />
      {/* porthole */}
      <circle cx="0" cy="-17" r="5.5" fill="url(#rkGlass)" stroke="#5c6478" strokeWidth="1.6" />
      <circle cx="-1.6" cy="-18.6" r="1.4" fill="#fff" opacity="0.7" />
      <text x="0" y="5" fontSize="5" fill="#2b3346" textAnchor="middle" fontFamily="monospace">YSL-5</text>
    </g>
  );
}

export function Spaceship({ done, total, animate }: { done: number; total: number; animate: boolean }) {
  const frac = total ? Math.min(1, done / total) : 0;
  const complete = total > 0 && done >= total;
  const [phase, setPhase] = useState<'pad' | 'liftoff' | 'orbit'>(complete ? 'orbit' : 'pad');
  const wasComplete = useRef(complete);
  useEffect(() => {
    if (complete && !wasComplete.current) setPhase(animate ? 'liftoff' : 'orbit');
    if (!complete) setPhase('pad');
    wasComplete.current = complete;
  }, [complete, animate]);

  if (phase === 'orbit') {
    // Not to scale: a small solar system the ship flies around.
    const orbitPath = 'M 150 120 A 70 50 0 1 1 10 120 A 70 50 0 1 1 150 120';
    return (
      <svg viewBox="0 0 160 240" className="ship-scene" data-testid="orbit-scene" role="img" aria-label="Mission complete: the ship is in orbit, flying around the Solar System">
        <rect width="160" height="240" fill="#02040d" />
        {[[12, 20], [140, 34], [30, 210], [120, 220], [78, 12], [150, 180], [6, 150]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="0.9" fill="#fff" opacity="0.8" />)}
        <ellipse cx="80" cy="120" rx="70" ry="50" fill="none" stroke="#3a4a92" strokeDasharray="2 4" />
        <ellipse cx="80" cy="120" rx="34" ry="24" fill="none" stroke="#2a3670" strokeDasharray="2 4" />
        <PhotoBall k="sun" cx={80} cy={120} r={13} fallback="#ffb347" />
        <PhotoBall k="mercury" cx={110} cy={110} r={3} fallback="#b0a89a" />
        <PhotoBall k="earth" cx={52} cy={136} r={5} fallback="#4fa3ff" />
        <PhotoBall k="mars" cx={140} cy={96} r={4} fallback="#d0603a" />
        <PhotoBall k="jupiter" cx={22} cy={92} r={8} fallback="#d8b48a" />
        {/* Moving along the orbit when animation is allowed; otherwise parked on the orbit. */}
        <g transform={animate ? undefined : 'translate(150 120) rotate(-90)'} data-testid={animate ? 'orbit-moving' : 'orbit-still'}>
          <g transform="rotate(90) scale(0.32)">
            <Rocket flame={0.6} />
          </g>
          {animate && <animateMotion dur="14s" repeatCount="indefinite" rotate="auto" path={orbitPath} />}
        </g>
        <text x="80" y="232" fill="#ffe08a" fontSize="9" textAnchor="middle">🚀 In orbit · navigating the Solar System</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 160 240" className="ship-scene" role="img" aria-label={`Ship on the launch pad: ${done} of ${total} stages done, the engine flame grows with each stage`}>
      <defs>
        <linearGradient id="padSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#02040d" />
          <stop offset="1" stopColor="#141c48" />
        </linearGradient>
      </defs>
      <rect width="160" height="240" fill="url(#padSky)" />
      {[[14, 18], [140, 30], [30, 60], [124, 74], [70, 14], [150, 120]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="0.9" fill="#fff" opacity="0.7" />)}
      {/* gantry tower */}
      <g stroke="#5a6488" strokeWidth="1.2">
        <line x1="34" y1="70" x2="34" y2="214" />
        <line x1="48" y1="70" x2="48" y2="214" />
        {Array.from({ length: 9 }, (_, i) => (
          <g key={i}>
            <line x1="34" y1={74 + i * 16} x2="48" y2={90 + i * 16} />
            <line x1="48" y1={74 + i * 16} x2="34" y2={90 + i * 16} />
          </g>
        ))}
        <line x1="48" y1="110" x2="68" y2="110" strokeWidth="2" />
      </g>
      {/* pad + ground */}
      <rect x="0" y="214" width="160" height="26" fill="#1b2140" />
      <rect x="52" y="206" width="56" height="10" rx="2" fill="#4a5590" />
      {frac > 0.5 && (
        <g fill="#cfd6ea" opacity={0.25 + 0.4 * frac}>
          <circle cx="60" cy="210" r={6 + 6 * frac} />
          <circle cx="100" cy="210" r={6 + 6 * frac} />
        </g>
      )}
      <g className={phase === 'liftoff' ? 'ship liftoff-ship' : 'ship'} transform="translate(80 150)" onAnimationEnd={() => phase === 'liftoff' && setPhase('orbit')}>
        <Rocket flame={phase === 'liftoff' ? 1 : frac} />
      </g>
    </svg>
  );
}
