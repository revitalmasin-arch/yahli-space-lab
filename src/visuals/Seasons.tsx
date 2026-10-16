import { useState } from 'react';
import { PhotoBall } from './Photo';
import { PlayButton, useAnimTime } from './Visual';

// Why day length changes through the year (book p.189): Earth's axis is tilted, so in June our
// (northern) half leans toward the Sun and in December away from it. The tilt (23.4°) and Israel's
// latitude (about 31.8° N) are from NASA / standard geography; the day/night split is computed from them.

const TILT = (23.4 * Math.PI) / 180;
const ISRAEL_LAT = (31.8 * Math.PI) / 180;
const R = 58, CX = 222, CY = 112;

const SEASONS = [
  { key: 'june', tilt: TILT, btn: '☀️ June · יוּנִי', he: 'יוּנִי (קַיִץ): הַחֵצִי הַצְּפוֹנִי נוֹטֶה אֶל הַשֶּׁמֶשׁ — יוֹם אָרוֹךְ, לַיְלָה קָצָר.', en: 'June (summer): our northern half leans toward the Sun — long day, short night.' },
  { key: 'equinox', tilt: 0, btn: '🌸 March / September · מֶרְץ / סֶפְּטֶמְבֶּר', he: 'אָבִיב וּסְתָיו: אַף חֵצִי לֹא נוֹטֶה אֶל הַשֶּׁמֶשׁ — יוֹם וְלַיְלָה כִּמְעַט שָׁוִים.', en: 'Spring and autumn: neither half leans toward the Sun — day and night almost equal.' },
  { key: 'december', tilt: -TILT, btn: '❄️ December · דֶּצֶמְבֶּר', he: 'דֶּצֶמְבֶּר (חוֹרֶף): הַחֵצִי הַצְּפוֹנִי נוֹטֶה הַרְחֵק מֵהַשֶּׁמֶשׁ — יוֹם קָצָר, לַיְלָה אָרוֹךְ.', en: 'December (winter): our northern half leans away from the Sun — short day, long night.' },
];

/** A point on Earth at latitude `lat`, spin angle `lon`, for an axis tilted by `tilt` toward the Sun (on the left). */
function point(lat: number, lon: number, tilt: number) {
  const a = [-Math.sin(tilt), Math.cos(tilt)]; // axis in the picture plane (x right, y up)
  const u = [Math.cos(tilt), Math.sin(tilt)];
  const x = R * (Math.sin(lat) * a[0] + Math.cos(lat) * Math.cos(lon) * u[0]);
  const y = R * (Math.sin(lat) * a[1] + Math.cos(lat) * Math.cos(lon) * u[1]);
  const z = R * Math.cos(lat) * Math.sin(lon); // toward the viewer
  return { sx: CX + x, sy: CY - y, front: z >= 0, lit: x < 0 };
}

/** Share of one spin that Israel spends in sunlight. */
export function dayShare(tilt: number): number {
  const k = Math.tan(ISRAEL_LAT) * Math.tan(tilt);
  return 1 - Math.acos(Math.max(-1, Math.min(1, k))) / Math.PI;
}

function circlePath(lat: number, tilt: number, front: boolean): string {
  // the front half of the circle is drawn solid, the back half dashed
  let d = '';
  let drawing = false;
  for (let i = 0; i <= 72; i++) {
    const p = point(lat, (i / 72) * 2 * Math.PI, tilt);
    if (p.front !== front) { drawing = false; continue; }
    d += `${drawing ? 'L' : 'M'}${p.sx.toFixed(1)} ${p.sy.toFixed(1)} `;
    drawing = true;
  }
  return d;
}

export function Seasons() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const t = useAnimTime(playing);
  const s = SEASONS[i];
  const israel = point(ISRAEL_LAT, -Math.PI / 2 + t * 1.6, s.tilt);
  const share = dayShare(s.tilt);
  const hours = Math.round(share * 24);
  const axisTop = point(Math.PI / 2, 0, s.tilt), axisLen = 1.3;
  return (
    <div data-testid="seasons">
      <svg className="visual" direction="ltr" style={{ direction: 'ltr' }} viewBox="0 0 320 220" role="img" aria-label={`${s.en} Israel has about ${hours} hours of daylight.`}>
        <rect width="320" height="220" fill="#050818" />
        <PhotoBall k="sun" cx={-24} cy={CY} r={62} fallback="#ffb347" />
        {[0, 1, 2, 3].map((k) => <line key={k} x1="50" y1={70 + k * 28} x2="150" y2={70 + k * 28} stroke="#ffb347" opacity="0.35" strokeWidth="2" />)}
        <PhotoBall k="earth" cx={CX} cy={CY} r={R} fallback="#2f6fd6" />
        {/* night: the half facing away from the Sun */}
        <path d={`M${CX} ${CY - R} A${R} ${R} 0 0 1 ${CX} ${CY + R} Z`} fill="#000" opacity="0.62" />
        {/* tilted axis */}
        <line x1={CX - (axisTop.sx - CX) * axisLen} y1={CY - (axisTop.sy - CY) * axisLen} x2={CX + (axisTop.sx - CX) * axisLen} y2={CY + (axisTop.sy - CY) * axisLen}
          stroke="#e8ecff" strokeWidth="2" strokeDasharray="5 3" />
        <text x={CX + (axisTop.sx - CX) * 1.42} y={CY + (axisTop.sy - CY) * 1.42 - 2} fill="#e8ecff" fontSize="10" textAnchor="middle">N · צָפוֹן</text>
        {/* equator and Israel's latitude */}
        <path d={circlePath(0, s.tilt, true)} fill="none" stroke="#9fb3ff" strokeWidth="1" opacity="0.6" />
        <path d={circlePath(ISRAEL_LAT, s.tilt, false)} fill="none" stroke="#ffe08a" strokeWidth="1" strokeDasharray="2 3" opacity="0.45" />
        <path d={circlePath(ISRAEL_LAT, s.tilt, true)} fill="none" stroke="#ffe08a" strokeWidth="1.5" opacity="0.9" />
        <circle cx={israel.sx} cy={israel.sy} r={israel.front ? 6 : 4} fill={israel.lit ? '#ffe08a' : '#6f7fc8'} stroke="#fff" strokeWidth="1.5" opacity={israel.front ? 1 : 0.5} data-testid="seasons-israel" data-lit={israel.lit} />
        <text x="300" y="24" fill="#fff" fontSize="10" textAnchor="end">{israel.lit ? '☀️ day in Israel · יוֹם' : '🌙 night in Israel · לַיְלָה'}</text>
        <text x={CX - R + 6} y={CY + R + 22} fill="#ffe08a" fontSize="10">day · יוֹם</text>
        <text x={CX + R - 6} y={CY + R + 22} fill="#aab3dd" fontSize="10" textAnchor="end">night · לַיְלָה</text>
      </svg>
      <div className="row">
        {SEASONS.map((x, k) => <button key={x.key} type="button" className={`small ${k === i ? 'primary' : ''}`} aria-pressed={k === i} onClick={() => setI(k)} data-testid={`seasons-${x.key}`}>{x.btn}</button>)}
        <PlayButton playing={playing} onToggle={() => setPlaying(!playing)} label="סוֹבֵב · Spin Earth" />
      </div>
      <p lang="he" dir="rtl">{s.he}</p>
      <p className="small-text" lang="en">{s.en}</p>
      <div className="day-bar" dir="ltr" aria-label={`Israel: about ${hours} hours of light and ${24 - hours} of dark`} data-testid="seasons-bar" data-hours={hours}>
        <span className="day-part" style={{ flexGrow: share }}>☀️ ~{hours} h</span>
        <span className="night-part" style={{ flexGrow: 1 - share }}>🌙 ~{24 - hours} h</span>
      </div>
      <p className="muted small-text">One full spin (יְמָמָה) is always 24 hours — only the split between day and night changes. Not to scale.</p>
    </div>
  );
}
