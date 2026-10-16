import type { ReactNode } from 'react';
import { UNITS } from '../content/units';
import { QUESTIONS } from '../content/questions';
import { He } from '../components/Bi';
import { UnitIcon } from '../visuals/Icons';
import { useStore } from '../progress/store';
import { jerusalemDate } from '../lib/dates';
import { dayInfo, daysUntilExam, PLAN } from '../lib/plan';
import { dueConcepts, hebrewEvidence, scienceSummary, unitStatus, type UnitStatus } from '../lib/learning';
import { xpTotal } from '../progress/model';
import { STEPS } from './UnitPlayer';

const STATUS: Record<UnitStatus, { label: string; cls: string }> = {
  new: { label: 'not started', cls: '' },
  introduced: { label: 'introduced', cls: 'warn' },
  practiced: { label: 'practised', cls: 'warn' },
  independent: { label: 'answered independently', cls: 'good' },
};
export const unitReady = (id: string) => QUESTIONS.some((q) => q.unit === id);

function ConsoleTitle({ icon, he, en }: { icon: string; he: string; en: string }) {
  return (
    <div className="console-title">
      <span className="ico" aria-hidden="true">{icon}</span>
      <h2 lang="he">{he}</h2>
      <span className="en" lang="en">{en}</span>
    </div>
  );
}
const Panel = ({ children, testid, className = '' }: { children: ReactNode; testid?: string; className?: string }) => (
  <section className={`panel stack ${className}`} data-testid={testid}>{children}</section>
);

export function Home({ onUnit, onReview, onParent }: { onUnit: (id: string) => void; onReview: () => void; onParent: () => void }) {
  const { progress } = useStore();
  const today = jerusalemDate();
  const exam = progress.settings.examDate;
  const info = dayInfo(today, exam);
  const left = daysUntilExam(today, exam);
  const due = dueConcepts(progress, today).length;
  const sci = scienceSummary(progress);
  const heb = hebrewEvidence(progress);
  const todayUnits = info.kind === 'plan' ? info.day.units : info.kind === 'before' ? info.first.units : [];

  const missionCard = (id: string) => {
    const u = UNITS.find((x) => x.id === id)!;
    const st = unitStatus(progress, id);
    const ready = unitReady(id);
    const stepsDone = progress.units[id]?.stepsDone.length ?? 0;
    return (
      <button key={id} type="button" className="choice mission-card" disabled={!ready} onClick={() => onUnit(id)} data-testid={`open-${id}`}>
        <UnitIcon unit={id} />
        <span className="body">
          <span className="num" lang="en">MISSION {String(u.order).padStart(2, '0')}</span>
          <He x={u.title} />
          <span lang="en" dir="ltr" className="muted small-text">{u.title.en} · ~{u.minutes} min</span>
          {ready && (
            <span className="steps" aria-hidden="true"><span style={{ width: `${(Math.min(stepsDone, STEPS.length) / STEPS.length) * 100}%` }} /></span>
          )}
          <span><span className={`tag ${STATUS[st].cls}`}>{ready ? STATUS[st].label : 'coming soon'}</span></span>
        </span>
      </button>
    );
  };

  return (
    <div className="stack">
      <Panel testid="countdown">
        <ConsoleTitle icon="⏱️" he="עוֹד כַּמָּה יָמִים לְשִׁיגּוּר" en="How many days to launch" />
        {left === null ? (
          <p>The exam date ({exam}) has passed. Well done for all the work!</p>
        ) : left === 0 ? (
          <p><strong>The exam is today.</strong> Light review only — good luck! · בְּהַצְלָחָה!</p>
        ) : (
          <div className="launch">
            <span className="days">{left}</span>
            <span>{left === 1 ? 'day' : 'days'} · מִבְחָן בְּ-{exam}</span>
          </div>
        )}
      </Panel>

      <Panel testid="mission" className="mission">
        <ConsoleTitle icon="🚀" he="הַמְּשִׂימָה שֶׁלִּי לְהַיּוֹם" en="My mission today" />
        {progress.settings.learnerName && (
          <p data-testid="greeting"><strong>שָׁלוֹם, <span dir="auto">{progress.settings.learnerName}</span>!</strong> <span lang="en">Ready for today's mission?</span></p>
        )}
        {info.kind === 'before' && <p>The plan starts on {info.first.date}. You can already try Day 1:</p>}
        {info.kind === 'plan' && <p>Day {info.index + 1} of {PLAN.length}: <He x={info.day.focus} /></p>}
        {info.kind === 'exam-day' && <p>Exam day: a few review questions only.</p>}
        {info.kind === 'after' && <p>The plan is finished. Review is still available.</p>}
        {info.kind === 'exam-eve-gap' && <p>Free practice day: choose any unit or review.</p>}
        <div className="cards">{todayUnits.map(missionCard)}</div>
        {(info.kind === 'plan' && info.day.units.length === 0) || info.kind === 'exam-day' ? (
          <button type="button" className="primary" onClick={onReview}>Start mixed review →</button>
        ) : null}
        <p className="muted small-text">Study is short pieces with breaks. Up to two hours a day is a ceiling, not a goal.</p>
      </Panel>

      <Panel testid="review-box">
        <ConsoleTitle icon="🔁" he="חֲזָרָה וְתִגְבּוּר" en="Review and reinforcement" />
        <p>{due ? `${due} idea${due > 1 ? 's' : ''} to review today.` : 'Nothing due today — you can still practise.'}</p>
        <div className="row"><button type="button" onClick={onReview} data-testid="start-review">Start review →</button></div>
      </Panel>

      <Panel>
        <ConsoleTitle icon="🪐" he="יְחִידוֹת לִימּוּד" en="Learning units" />
        <div className="cards">{UNITS.map((u) => missionCard(u.id))}</div>
      </Panel>

      <Panel testid="my-progress">
        <ConsoleTitle icon="📈" he="הַהִתְקַדְּמוּת שֶׁלִּי" en="My progress" />
        <p>⭐ {xpTotal(progress)} XP <span className="muted small-text">(points for taking part — not a test score)</span></p>
        {sci.attempts < 5 ? (
          <p className="muted">Science: starting to measure ({sci.attempts} answers so far).</p>
        ) : (
          <p>Science: {sci.unaidedFirstTry} of {sci.attempts} answers right first time without help; {sci.assisted} with help.</p>
        )}
        <p>Hebrew answers checked by Mum: {heb.confirmed}. {heb.pending ? `Not yet checked: ${heb.pending}.` : ''}</p>
      </Panel>

      <div className="row end">
        <button type="button" className="small ghost" onClick={onParent} data-testid="open-parent">Parent area · לַהוֹרִים</button>
      </div>
    </div>
  );
}
