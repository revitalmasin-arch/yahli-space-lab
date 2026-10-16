import { useState } from 'react';
import { useStore } from '../progress/store';
import { jerusalemDate } from '../lib/dates';
import { dayInfo } from '../lib/plan';
import { hebrewEvidence } from '../lib/learning';
import { dailyScience, enoughToChart, missionProgress, type DayScience } from '../lib/insights';
import { xpTotal } from '../progress/model';

// Validated (dataviz validator, dark mode vs #131b45): unaided first, then "with help / not yet".
const C_UNAIDED = '#2fa36b';
const C_OTHER = '#6f7fc8';

/** Today's mission as a rocket on a launch track: it climbs with each stage done and lifts off at 100%. */
function RocketGauge({ done, total, celebrate }: { done: number; total: number; celebrate: boolean }) {
  const frac = total ? done / total : 0;
  const complete = total > 0 && done >= total;
  const y = 176 - frac * 150; // rocket nose position on the track
  return (
    <div className="rocket-gauge" data-testid="rocket-gauge" role="img" aria-label={`Today's mission: ${done} of ${total} stages done`}>
      <svg viewBox="0 0 120 210" className={complete && celebrate ? 'liftoff' : ''}>
        <line x1="60" y1="20" x2="60" y2="190" stroke="#3a4a92" strokeWidth="2" strokeDasharray="3 6" />
        {[0.25, 0.5, 0.75].map((f) => <line key={f} x1="52" x2="68" y1={190 - f * 150} y2={190 - f * 150} stroke="#3a4a92" />)}
        <rect x="30" y="192" width="60" height="8" rx="3" fill="#4a5590" />
        <g className="rocket" transform={`translate(60 ${y})`}>
          {complete && <path className="flame" d="M-7 34 q7 22 14 0z" fill="#ffb347" />}
          <path d="M0 -6 c9 9 12 22 9 38 h-18 c-3 -16 0 -29 9 -38z" fill="#eef1ff" />
          <circle cx="0" cy="10" r="4.5" fill="#4fa3ff" stroke="#3a4a92" strokeWidth="1.5" />
          <path d="M-9 24 l-7 10 8 -2z M9 24 l7 10 -8 -2z" fill="#ff7a59" />
        </g>
      </svg>
      <p className="small-text">
        {total === 0 ? 'No units planned for today — try review!' : complete ? <strong data-testid="mission-complete">🚀 Mission complete!</strong> : `${done} / ${total} stages`}
      </p>
    </div>
  );
}

function ScienceChart({ days }: { days: DayScience[] }) {
  const [table, setTable] = useState(false);
  const shown = days.slice(-7);
  const max = Math.max(1, ...shown.map((d) => d.unaided + d.other));
  const W = 260, H = 130, base = 104, top = 18, bw = Math.min(26, (W - 20) / shown.length - 8);
  const scale = (n: number) => (n / max) * (base - top);
  const label = (date: string) => `${date.slice(8, 10)}/${date.slice(5, 7)}`;
  return (
    <div>
      <div className="legend small-text" aria-hidden="true">
        <span><i style={{ background: C_UNAIDED }} /> right first time, no help</span>
        <span><i style={{ background: C_OTHER }} /> with help / not yet</span>
      </div>
      {table ? (
        <table className="small-text data-table">
          <thead><tr><th>Day</th><th>No help</th><th>With help / not yet</th></tr></thead>
          <tbody>{shown.map((d) => <tr key={d.date}><td>{label(d.date)}</td><td>{d.unaided}</td><td>{d.other}</td></tr>)}</tbody>
        </table>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Science answers per day: right first time without help, and with help or not yet">
          <line x1="8" x2={W - 8} y1={base} y2={base} stroke="#3a4a92" />
          {shown.map((d, i) => {
            const x = 14 + i * ((W - 28) / shown.length) + ((W - 28) / shown.length - bw) / 2;
            const hu = scale(d.unaided), ho = scale(d.other);
            const gap = hu > 0 && ho > 0 ? 2 : 0;
            return (
              <g key={d.date}>
                {hu > 0 && <rect x={x} y={base - hu} width={bw} height={hu} rx="3" fill={C_UNAIDED}><title>{`${label(d.date)}: ${d.unaided} right first time, no help`}</title></rect>}
                {ho > 0 && <rect x={x} y={base - hu - gap - ho} width={bw} height={ho} rx="3" fill={C_OTHER}><title>{`${label(d.date)}: ${d.other} with help or not yet`}</title></rect>}
                <text x={x + bw / 2} y={base - hu - gap - ho - 4} fill="#eef1ff" fontSize="10" textAnchor="middle">{d.unaided}/{d.unaided + d.other}</text>
                <text x={x + bw / 2} y={base + 14} fill="#aab3dd" fontSize="9" textAnchor="middle">{label(d.date)}</text>
              </g>
            );
          })}
        </svg>
      )}
      <button type="button" className="small ghost" onClick={() => setTable(!table)}>{table ? 'Show chart' : 'Show as table'}</button>
    </div>
  );
}

/** Sidebar: today's mission rocket, science per day, Hebrew checks, XP. Device-local numbers only. */
export function MissionLog() {
  const { progress } = useStore();
  const today = jerusalemDate();
  const info = dayInfo(today, progress.settings.examDate);
  const todayUnits = info.kind === 'plan' ? info.day.units : info.kind === 'before' ? info.first.units : [];
  const { done, total } = missionProgress(progress, todayUnits);
  const days = dailyScience(progress);
  const heb = hebrewEvidence(progress);
  const motionOk = typeof window !== 'undefined' && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  return (
    <div className="stack" data-testid="mission-log">
      {/* One window: the rocket on top, the three controllers (separate readouts, never one blended score) below. */}
      <section className="panel stack mission-window">
        <h3>🚀 Today's mission · הַמְּשִׂימָה</h3>
        <RocketGauge done={done} total={total} celebrate={progress.settings.celebrations && motionOk} />
        <div className="controllers" data-testid="controllers">
          <h3>🎛️ Controllers · בַּקָּרִים</h3>
          <div className="controller">
            <h4>🔬 Science · מַדָּע</h4>
            {enoughToChart(days) ? <ScienceChart days={days} /> : <p className="muted small-text" data-testid="starting-to-measure">Starting to measure — the curve appears after a few answers on two different days. It may go up, stay flat or dip: that is normal.</p>}
          </div>
          <div className="controller">
            <h4>🗣️ Hebrew · עִבְרִית</h4>
            <p className="small-text">Answers Mum confirmed: <strong>{heb.confirmed}</strong>{heb.pending ? ` · waiting for Mum: ${heb.pending}` : ''}</p>
          </div>
          <div className="controller">
            <h4>⭐ XP</h4>
            <p className="small-text"><strong>{xpTotal(progress)}</strong> XP <span className="muted">— points for taking part, not a test score</span></p>
          </div>
          <p className="muted small-text">Numbers are from this device only.</p>
        </div>
      </section>
    </div>
  );
}
