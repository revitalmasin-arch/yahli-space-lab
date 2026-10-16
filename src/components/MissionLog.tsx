import { useState } from 'react';
import { useStore } from '../progress/store';
import { jerusalemDate } from '../lib/dates';
import { dayInfo } from '../lib/plan';
import { hebrewEvidence } from '../lib/learning';
import { dailyScience, enoughToChart, missionProgress, type DayScience } from '../lib/insights';
import { xpTotal } from '../progress/model';
import { Spaceship } from '../visuals/Spaceship';

// Validated with the dataviz palette checker (dark mode) against the monitor screen #03140e:
// unaided first, then "with help / not yet". Always shown with a legend + labelled counts.
const C_UNAIDED = '#2fa36b';
const C_OTHER = '#6f7fc8';
const pad2 = (n: number) => String(n).padStart(2, '0');

/** Science monitor: per-day trace of answers, two honest series, on a ship's screen. */
function ScienceMonitor({ days }: { days: DayScience[] }) {
  const [table, setTable] = useState(false);
  const shown = days.slice(-7);
  const max = Math.max(1, ...shown.map((d) => d.unaided + d.other));
  const W = 240, H = 120, base = 98, top = 18, slot = (W - 24) / shown.length, bw = Math.min(22, slot - 8);
  const scale = (n: number) => (n / max) * (base - top);
  const label = (date: string) => `${date.slice(8, 10)}/${date.slice(5, 7)}`;
  return (
    <>
      <div className="legend small-text" aria-hidden="true">
        <span><i style={{ background: C_UNAIDED }} /> no help</span>
        <span><i style={{ background: C_OTHER }} /> with help / not yet</span>
      </div>
      {table ? (
        <table className="small-text data-table">
          <thead><tr><th>Day</th><th>No help</th><th>With help / not yet</th></tr></thead>
          <tbody>{shown.map((d) => <tr key={d.date}><td>{label(d.date)}</td><td>{d.unaided}</td><td>{d.other}</td></tr>)}</tbody>
        </table>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Science answers per day: right first time without help, and with help or not yet">
          {[0.33, 0.66].map((f) => <line key={f} x1="8" x2={W - 8} y1={base - f * (base - top)} y2={base - f * (base - top)} stroke="#0f3a2a" />)}
          <line x1="8" x2={W - 8} y1={base} y2={base} stroke="#1d6b4b" />
          {shown.map((d, i) => {
            const x = 12 + i * slot + (slot - bw) / 2;
            const hu = scale(d.unaided), ho = scale(d.other);
            const gap = hu > 0 && ho > 0 ? 2 : 0;
            return (
              <g key={d.date}>
                {hu > 0 && <rect x={x} y={base - hu} width={bw} height={hu} rx="3" fill={C_UNAIDED}><title>{`${label(d.date)}: ${d.unaided} right first time, no help`}</title></rect>}
                {ho > 0 && <rect x={x} y={base - hu - gap - ho} width={bw} height={ho} rx="3" fill={C_OTHER}><title>{`${label(d.date)}: ${d.other} with help or not yet`}</title></rect>}
                <text x={x + bw / 2} y={base - hu - gap - ho - 4} fill="#d9f5e6" fontSize="10" textAnchor="middle">{d.unaided}/{d.unaided + d.other}</text>
                <text x={x + bw / 2} y={base + 13} fill="#8fc4ab" fontSize="9" textAnchor="middle">{label(d.date)}</text>
              </g>
            );
          })}
        </svg>
      )}
      <button type="button" className="small ghost" onClick={() => setTable(!table)}>{table ? 'Show chart' : 'Show as table'}</button>
    </>
  );
}

/** Mission window: the ship (flame grows with each stage, orbits on completion) above the Controllers panel. */
export function MissionLog() {
  const { progress } = useStore();
  const today = jerusalemDate();
  const info = dayInfo(today, progress.settings.examDate);
  const todayUnits = info.kind === 'plan' ? info.day.units : info.kind === 'before' ? info.first.units : [];
  const { done, total } = missionProgress(progress, todayUnits);
  const complete = total > 0 && done >= total;
  const days = dailyScience(progress);
  const heb = hebrewEvidence(progress);
  const motionOk = typeof window !== 'undefined' && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const xp = xpTotal(progress);

  return (
    <div data-testid="mission-log">
      <section className="console" aria-label="Mission control">
        <div className="console-head">
          <span className={`led ${complete ? 'green' : 'amber'}`} aria-hidden="true" />
          <strong lang="en">MISSION CONTROL</strong> · <span lang="he">בַּקָּרַת מְשִׂימָה</span>
          <span className="led green" aria-hidden="true" />
        </div>

        <div data-testid="rocket-gauge">
          <div className="viewport">
            <Spaceship done={done} total={total} animate={progress.settings.celebrations && motionOk} />
          </div>
          <div className="readout" role="status" dir="ltr">
            {total === 0 ? (
              <span>No units planned today — try review!</span>
            ) : complete ? (
              <strong data-testid="mission-complete">🚀 Mission complete! · {done} / {total} stages</strong>
            ) : (
              <span><span className="lbl">STAGES · שְׁלַבִּים</span> <b className="digits">{done} / {total} stages</b></span>
            )}
          </div>
        </div>

        <div className="controllers" data-testid="controllers">
          <div className="plate-title">🎛️ Controllers · בַּקָּרִים</div>

          <div className="instrument">
            <div className="plate"><span className="led green" aria-hidden="true" /> SCIENCE · מַדָּע</div>
            <div className="crt">
              {enoughToChart(days) ? (
                <ScienceMonitor days={days} />
              ) : (
                <p className="calibrating small-text" data-testid="starting-to-measure">
                  CALIBRATING… Starting to measure — the trace appears after a few answers on two different days. It may go up, stay flat or dip: that is normal.
                </p>
              )}
            </div>
          </div>

          <div className="instrument">
            <div className="plate"><span className={`led ${heb.pending ? 'amber' : 'green'}`} aria-hidden="true" /> HEBREW · עִבְרִית</div>
            <div className="digital-row">
              <div className="digital"><span className="lbl">MUM ✓ · אִמָּא אִישְּׁרָה</span><b>{pad2(heb.confirmed)}</b></div>
              <div className="digital"><span className="lbl">WAITING · מְחַכֶּה</span><b>{pad2(heb.pending)}</b></div>
            </div>
          </div>

          <div className="instrument">
            <div className="plate"><span className="led blue" aria-hidden="true" /> XP</div>
            <div className="odometer" aria-label={`${xp} XP`}>
              {String(xp).padStart(4, '0').split('').map((d, i) => <span key={i}>{d}</span>)}
              <em>XP</em>
            </div>
            <p className="muted small-text">Points for taking part — not a test score.</p>
          </div>

          <p className="muted small-text">Numbers are from this device only.</p>
        </div>
      </section>
    </div>
  );
}
