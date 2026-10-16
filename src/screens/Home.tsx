import { UNITS } from '../content/units';
import { QUESTIONS } from '../content/questions';
import { He } from '../components/Bi';
import { useStore } from '../progress/store';
import { jerusalemDate } from '../lib/dates';
import { dayInfo, daysUntilExam, PLAN } from '../lib/plan';
import { dueConcepts, hebrewEvidence, scienceSummary, unitStatus, type UnitStatus } from '../lib/learning';
import { xpTotal } from '../progress/model';

const STATUS: Record<UnitStatus, { label: string; cls: string }> = {
  new: { label: 'not started', cls: '' },
  introduced: { label: 'introduced', cls: 'warn' },
  practiced: { label: 'practised', cls: 'warn' },
  independent: { label: 'answered independently', cls: 'good' },
};
export const unitReady = (id: string) => QUESTIONS.some((q) => q.unit === id);

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

  const unitButton = (id: string) => {
    const u = UNITS.find((x) => x.id === id)!;
    const st = unitStatus(progress, id);
    const ready = unitReady(id);
    return (
      <button key={id} type="button" className="choice" disabled={!ready} onClick={() => onUnit(id)} data-testid={`open-${id}`}>
        <span className="row" style={{ justifyContent: 'space-between' }}>
          <He x={u.title} />
          <span className={`tag ${STATUS[st].cls}`}>{ready ? STATUS[st].label : 'coming soon'}</span>
        </span>
        <span lang="en" dir="ltr" className="muted small-text">{u.title.en} · ~{u.minutes} min</span>
      </button>
    );
  };

  return (
    <div className="stack">
      <section className="panel" data-testid="countdown">
        <h2>עוֹד כַּמָּה יָמִים לַמִּבְחָן <span className="muted small-text" lang="en">Days until the exam</span></h2>
        {left === null ? <p>The exam date ({exam}) has passed. Well done for all the work!</p>
          : left === 0 ? <p><strong>The exam is today.</strong> Light review only — good luck! · בְּהַצְלָחָה!</p>
          : <p><strong style={{ fontSize: '1.6rem' }}>{left}</strong> {left === 1 ? 'day' : 'days'} · מִבְחָן בְּ-{exam}</p>}
      </section>

      <section className="panel stack" data-testid="mission">
        <h2>הַמְּשִׂימָה שֶׁלִּי לְהַיּוֹם <span className="muted small-text" lang="en">My mission today</span></h2>
        {info.kind === 'before' && <p>The plan starts on {info.first.date}. You can already try Day 1:</p>}
        {info.kind === 'plan' && <p>Day {info.index + 1} of {PLAN.length}: <He x={info.day.focus} /></p>}
        {info.kind === 'exam-day' && <p>Exam day: a few review questions only.</p>}
        {info.kind === 'after' && <p>The plan is finished. Review is still available.</p>}
        {info.kind === 'exam-eve-gap' && <p>Free practice day: choose any unit or review.</p>}
        <div className="stack">{todayUnits.map(unitButton)}</div>
        {(info.kind === 'plan' && info.day.units.length === 0) || info.kind === 'exam-day' ? (
          <button type="button" className="primary" onClick={onReview}>Start mixed review →</button>
        ) : null}
        <p className="muted small-text">Study is short pieces with breaks. Up to two hours a day is a ceiling, not a goal.</p>
      </section>

      <section className="panel stack" data-testid="review-box">
        <h2>חֲזָרָה וְתִגְבּוּר <span className="muted small-text" lang="en">Review and reinforcement</span></h2>
        <p>{due ? `${due} idea${due > 1 ? 's' : ''} to review today.` : 'Nothing due today — you can still practise.'}</p>
        <button type="button" onClick={onReview} data-testid="start-review">Start review →</button>
      </section>

      <section className="panel stack">
        <h2>יְחִידוֹת לִימּוּד <span className="muted small-text" lang="en">Learning units</span></h2>
        <div className="stack">{UNITS.map((u) => unitButton(u.id))}</div>
      </section>

      <section className="panel stack" data-testid="my-progress">
        <h2>הַהִתְקַדְּמוּת שֶׁלִּי <span className="muted small-text" lang="en">My progress</span></h2>
        <p>⭐ {xpTotal(progress)} XP <span className="muted small-text">(points for taking part — not a test score)</span></p>
        {sci.attempts < 5 ? (
          <p className="muted">Science: starting to measure ({sci.attempts} answers so far).</p>
        ) : (
          <p>Science: {sci.unaidedFirstTry} of {sci.attempts} answers right first time without help; {sci.assisted} with help.</p>
        )}
        <p>Hebrew answers checked by Mum: {heb.confirmed}. {heb.pending ? `Not yet checked: ${heb.pending}.` : ''}</p>
      </section>

      <div className="row end">
        <button type="button" className="small ghost" onClick={onParent} data-testid="open-parent">Parent area · לַהוֹרִים</button>
      </div>
    </div>
  );
}
