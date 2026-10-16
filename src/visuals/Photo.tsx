import { useId, useState } from 'react';
import credits from '../content/image-credits.json';

// Real photos (NASA / ESA / ESO etc., licenses checked by ops/fetch-images.mjs, stored locally).
export type PhotoKey = keyof typeof credits;
export const photoUrl = (k: PhotoKey) => `./${credits[k].file}`;
export const PHOTO_CREDITS = credits;

/**
 * A round body drawn with a real photo. The coloured circle underneath is the fallback if the image
 * cannot load. `shade`: 'right' darkens the half facing away from a Sun on the left; 'all' = Sun off.
 */
export function PhotoBall({ k, cx, cy, r, fallback, shade }: { k: PhotoKey; cx: number; cy: number; r: number; fallback: string; shade?: 'right' | 'all' }) {
  const id = useId().replace(/:/g, '');
  const [failed, setFailed] = useState(false);
  return (
    <g>
      <defs>
        <clipPath id={`c${id}`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <linearGradient id={`s${id}`} x1="0" x2="1">
          <stop offset="0.47" stopColor="#000" stopOpacity="0" />
          <stop offset="0.53" stopColor="#000" stopOpacity="0.82" />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={fallback} />
      {!failed && (
        <image href={photoUrl(k)} x={cx - r} y={cy - r} width={r * 2} height={r * 2} preserveAspectRatio="xMidYMid slice" clipPath={`url(#c${id})`} onError={() => setFailed(true)} />
      )}
      {shade === 'right' && <circle cx={cx} cy={cy} r={r} fill={`url(#s${id})`} />}
      {shade === 'all' && <circle cx={cx} cy={cy} r={r} fill="#000" opacity="0.85" />}
    </g>
  );
}

/** Saturn keeps its rings: the photo is shown uncropped (it is wider than tall). */
export function SaturnPhoto({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const [failed, setFailed] = useState(false);
  const w = r * 4.2, h = w * (242 / 500);
  if (failed) {
    return (
      <g>
        <ellipse cx={cx} cy={cy} rx={r + 9} ry="4" fill="none" stroke="#d9c58a" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={r} fill="#e8d29a" />
      </g>
    );
  }
  return <image href={photoUrl('saturn')} x={cx - w / 2} y={cy - h / 2} width={w} height={h} onError={() => setFailed(true)} />;
}

/** A rectangular photo (e.g. a galaxy field); falls back to nothing on the dark background. */
export function PhotoRect({ k, x, y, w, h }: { k: PhotoKey; x: number; y: number; w: number; h: number }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return <image href={photoUrl(k)} x={x} y={y} width={w} height={h} preserveAspectRatio="xMidYMid slice" onError={() => setFailed(true)} />;
}
