import { useState } from 'react';
import { productionById } from '../content/production';
import { UNITS } from '../content/units';
import { useStore } from '../progress/store';
import { useActions } from '../progress/actions';
import { checkImport, importMerge, makeBackup, quarantinedCopies, rawItem, type ImportCheck } from '../progress/storage';
import { hebrewEvidence, scienceSummary, unitStatus } from '../lib/learning';
import { jerusalemDate } from '../lib/dates';

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function Parent({ onExit }: { onExit: () => void }) {
  const { progress, update, replaceAll, readOnly } = useStore();
  const { checkOpenAnswer } = useActions();
  const [imp, setImp] = useState<ImportCheck | null>(null);
  const pending = progress.productions.filter((r) => (r.kind === 'say' || r.kind === 'paper') && ['pending', 'self-ok', 'self-unsure'].includes(r.result));
  const s = progress.settings;
  const label = s.deviceLabel || 'device';

  const onFile = async (f: File | undefined) => {
    if (f) setImp(checkImport(await f.text(), progress));
  };

  return (
    <div className="stack" data-testid="parent">
      <div className="row">
        <button type="button" className="small ghost" onClick={onExit}>← Back</button>
        <h2>Parent area</h2>
      </div>
      <p className="muted small-text">
        Release {__RELEASE_ID__} · v{__APP_VERSION__} · {__APP_ENV__ === 'dev' ? 'DEVELOPMENT' : 'production'} · all numbers here are from this device only.
      </p>

      <section className="panel stack">
        <h3>Answers waiting for your check ({pending.length})</h3>
        <p className="muted small-text">Only a check you record here counts as confirmed Hebrew. The app never hears or grades spoken answers.</p>
        {pending.map((r) => {
          const t = productionById(r.taskId);
          if (!t || (t.kind !== 'say' && t.kind !== 'paper')) return null;
          return (
            <div key={r.id} className="panel stack" data-testid={`pending-${r.taskId}`}>
              <p><strong>{t.prompt.en}</strong> <span className="tag">{r.date}</span> <span className="tag">{r.result === 'self-ok' ? 'he thinks it was right' : r.result === 'self-unsure' ? 'he was unsure' : 'waiting for you'}</span></p>
              <p lang="he" dir="rtl">Example: {t.example.heN}</p>
              <ul className="small-text">{t.rubric.map((x) => <li key={x}>{x}</li>)}</ul>
              <p className="small-text">Ask him to say it again now (without help). Then:</p>
              <div className="row">
                <button type="button" onClick={() => checkOpenAnswer(r.id, 'confirmed')}>✓ Understandable and correct</button>
                <button type="button" onClick={() => checkOpenAnswer(r.id, 'not-yet')}>Not yet</button>
              </div>
            </div>
          );
        })}
      </section>

      <section className="panel stack">
        <h3>Summary</h3>
        <ul>
          {UNITS.map((u) => <li key={u.id}>{u.title.en}: {unitStatus(progress, u.id)}</li>)}
        </ul>
        {(() => {
          const sci = scienceSummary(progress);
          const heb = hebrewEvidence(progress);
          return (
            <p className="small-text">
              Science answers: {sci.attempts} (unaided first try {sci.unaidedFirstTry}, with help {sci.assisted}, English used {sci.usedEnglish}).
              Hebrew open answers: {heb.opportunities} attempted, {heb.confirmed} confirmed by you, {heb.pending} not yet checked.
              Study time today: {Math.round((progress.time[jerusalemDate()] ?? 0) / 60)} min.
            </p>
          );
        })()}
      </section>

      <section className="panel stack">
        <h3>Settings</h3>
        <label className="row">This device is: <input type="text" value={s.deviceLabel} placeholder="desktop / tablet" disabled={readOnly} onChange={(e) => update((p) => { p.settings.deviceLabel = e.target.value.slice(0, 40); })} /></label>
        <label className="row">Exam date: <input type="date" value={s.examDate} disabled={readOnly} onChange={(e) => e.target.value && update((p) => { p.settings.examDate = e.target.value; })} /></label>
        <label className="row">Niqqud:
          <select value={s.niqqud} disabled={readOnly} onChange={(e) => update((p) => { p.settings.niqqud = e.target.value as typeof s.niqqud; })}>
            <option value="auto">on (default)</option><option value="on">on</option><option value="off">off</option>
          </select>
        </label>
        <label className="row"><input type="checkbox" checked={s.celebrations} disabled={readOnly} onChange={(e) => update((p) => { p.settings.celebrations = e.target.checked; })} /> Short celebrations</label>
      </section>

      <section className="panel stack">
        <h3>Backup</h3>
        <p className="small-text">Progress lives in this browser on this device. Export regularly; the desktop and the tablet each keep their own.</p>
        <button type="button" onClick={() => download(`yahli-space-lab-${label}-${jerusalemDate()}.json`, JSON.stringify(makeBackup(progress), null, 2))}>Export backup</button>
        <label className="row">Import a backup (adds to this device, never deletes): <input type="file" accept="application/json,.json" onChange={(e) => onFile(e.target.files?.[0])} /></label>
        {imp && !imp.ok && <p className="notice warn">This file cannot be imported ({imp.error === 'newer' ? 'it is from a newer version of the app' : imp.error === 'too-old' ? 'it is too old for this version' : 'it is not a Space Lab backup'}). Nothing was changed.</p>}
        {imp && imp.ok && (
          <div className="notice stack">
            <p>Backup from “{imp.deviceLabel || 'unknown device'}” ({imp.fromEnv}): {imp.summary.attempts} answers, {imp.summary.productions} Hebrew tasks, last activity {imp.summary.latest ?? '—'}.</p>
            {imp.currentHasNewer && <p><strong>This device has newer activity than the backup.</strong> Importing merges both, so nothing newer is lost.</p>}
            {imp.fromEnv && imp.fromEnv !== __APP_ENV__ && <p><strong>Note:</strong> this backup is from the {imp.fromEnv} environment.</p>}
            <div className="row">
              <button type="button" className="primary" disabled={readOnly} onClick={() => { replaceAll(importMerge(progress, imp.data)); setImp(null); }}>Merge into this device</button>
              <button type="button" onClick={() => setImp(null)}>Cancel</button>
            </div>
          </div>
        )}
        {quarantinedCopies().length > 0 && (
          <div className="stack">
            <p className="small-text">Saved copies of unreadable data:</p>
            {quarantinedCopies().map((q) => (
              <button key={q.key} type="button" className="small" onClick={() => download(`${q.key.replace(/[:]/g, '_')}.json`, rawItem(q.key) ?? '')}>Download {q.key.split(':').pop()}</button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
