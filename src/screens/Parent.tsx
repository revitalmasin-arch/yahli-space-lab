import { useState } from 'react';
import { PRODUCTION, productionById } from '../content/production';
import { CONCEPTS } from '../content/concepts';
import { conceptPages, formatPages } from '../lib/bookPages';
import { UNITS } from '../content/units';
import { useStore } from '../progress/store';
import { useActions } from '../progress/actions';
import { archivedCopies, checkImport, importMerge, makeBackup, quarantinedCopies, rawItem, restoreCopy, startFresh, type ImportCheck } from '../progress/storage';
import { hebrewEvidence, scienceSummary, trickyConcepts, unitStatus } from '../lib/learning';
import { jerusalemDate } from '../lib/dates';
import { PHOTO_CREDITS } from '../visuals/Photo';
import { glossaryById } from '../content/glossary';

/** Ideas Yahli found hard: what to talk through together (not a grade). */
function TrickyIdeas() {
  const { progress } = useStore();
  const list = trickyConcepts(progress);
  return (
    <section className="panel stack" data-testid="tricky">
      <h3>Ideas to go over together</h3>
      {list.length === 0 ? <p className="muted small-text">Nothing yet — this fills in as Yahli answers questions.</p> : (
        <ul className="small-text" dir="ltr">
          {list.map((c) => {
            const concept = CONCEPTS.find((x) => x.id === c.concept);
            return (
              <li key={c.concept}>
                <strong>{concept?.name.en ?? c.concept}</strong> <span lang="he" dir="rtl">({concept?.name.heN})</span> — wrong first try {c.wrongFirstTry} of {c.attempts}, help used {c.helped} · book {formatPages(conceptPages(c.concept))}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/** Day 5 (21 Oct): written practice with Mum. Questions and what a good answer includes. */
function PaperPractice() {
  const tasks = PRODUCTION.filter((t) => t.kind === 'paper' || t.kind === 'say');
  return (
    <details className="panel stack" data-testid="paper-practice">
      <summary><strong>Practice questions for Day 5 — spoken and on paper ({tasks.length}, with marking guide)</strong></summary>
      <ol className="small-text" dir="ltr">
        {tasks.map((t) => t.kind === 'paper' || t.kind === 'say' ? (
          <li key={t.id}>
            <span lang="he" dir="rtl">{t.prompt.heN}</span> <span className="muted">({t.prompt.en})</span>
            <ul>{t.rubric.map((r) => <li key={r}>{r}</li>)}</ul>
            <p className="muted">Example answer: <span lang="he" dir="rtl">{t.example.heN}</span></p>
          </li>
        ) : null)}
      </ol>
    </details>
  );
}

/** Start fresh: keeps a copy first and never deletes; any copy can be restored. */
function StartFresh() {
  const { progress, replaceAll, readOnly } = useStore();
  const [typed, setTyped] = useState('');
  const [msg, setMsg] = useState('');
  const [, refresh] = useState(0);
  const copies = archivedCopies();
  const confirmWord = 'START FRESH';
  return (
    <section className="panel stack" data-testid="start-fresh">
      <h3>Start fresh (a copy is kept)</h3>
      <p className="small-text">Saves everything Yahli did as a copy on this device, then starts the lab from zero. Name and settings stay. Nothing is deleted — you can bring any copy back below. Close other tabs of the lab first.</p>
      <div className="row">
        <input type="text" value={typed} onChange={(e) => setTyped(e.target.value)} placeholder={`type ${confirmWord}`} aria-label={`Type ${confirmWord} to confirm`} disabled={readOnly} data-testid="fresh-confirm" />
        <button type="button" className="small" disabled={readOnly || typed.trim().toUpperCase() !== confirmWord} data-testid="fresh-go"
          onClick={() => {
            const next = startFresh(progress);
            if (!next) { setMsg('Could not save a copy (storage full?), so nothing was changed.'); return; }
            replaceAll(next);
            setTyped('');
            setMsg('Done: a copy was saved and the lab starts from zero.');
            refresh((n) => n + 1);
          }}>Start fresh</button>
      </div>
      {msg && <p className="notice" role="status" data-testid="fresh-msg">{msg}</p>}
      {copies.length > 0 && (
        <>
          <p className="small-text"><strong>Saved copies</strong> (newest first):</p>
          <ul className="small-text">
            {copies.map((c) => (
              <li key={c.key} className="row" data-testid="saved-copy">
                <span>{c.savedAt ? new Date(c.savedAt).toLocaleString('he-IL') : c.key} — {c.attempts} answers, {c.words} words{c.learnerName ? ` (${c.learnerName})` : ''}</span>
                <button type="button" className="small ghost" disabled={readOnly} data-testid="restore-copy"
                  onClick={() => {
                    const back = restoreCopy(c.key, progress);
                    if (!back) { setMsg('This copy could not be restored; nothing was changed.'); return; }
                    replaceAll(back);
                    setMsg('Restored. The progress from before the restore was saved as a copy too.');
                    refresh((n) => n + 1);
                  }}>Restore</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

/** Words Yahli saved in "My words": explain the ones the chapter dictionary does not know. */
function ParentWords() {
  const { progress, update, readOnly } = useStore();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const words = progress.words;
  const waiting = words.filter((w) => !w.glossId);
  return (
    <section className="panel stack" data-testid="parent-words">
      <h3>My words ({words.length} saved, {waiting.filter((w) => !w.meaning).length} waiting for you)</h3>
      {words.length === 0 && <p className="muted small-text">No saved words yet.</p>}
      {words.filter((w) => w.glossId).length > 0 && (
        <p className="small-text">Explained by the book dictionary: {words.filter((w) => w.glossId).map((w) => `${w.text} (${glossaryById(w.glossId!)?.en ?? ''})`).join(' · ')}</p>
      )}
      {waiting.map((w) => (
        <form key={w.id} className="row" onSubmit={(e) => { e.preventDefault(); const m = (drafts[w.id] ?? '').trim().slice(0, 200); if (m) update((p) => { const x = p.words.find((y) => y.id === w.id); if (x) x.meaning = m; }); }}>
          <strong dir="auto">{w.text}</strong>
          <input type="text" dir="auto" aria-label={`Meaning of ${w.text}`} placeholder={w.meaning || 'Write a simple meaning (Hebrew or English)'} value={drafts[w.id] ?? ''}
            onChange={(e) => setDrafts({ ...drafts, [w.id]: e.target.value })} disabled={readOnly} data-testid="parent-meaning-input" />
          <button type="submit" className="small" disabled={readOnly} data-testid="parent-meaning-save">{w.meaning ? 'Update' : 'Save'}</button>
          {w.meaning && <span className="muted small-text" dir="auto">now: {w.meaning}</span>}
        </form>
      ))}
    </section>
  );
}

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function Parent({ onExit, serverRelease }: { onExit: () => void; serverRelease: string | null }) {
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
        Release <span data-testid="release-id">{__RELEASE_ID__}</span> · v{__APP_VERSION__} · {__APP_ENV__ === 'dev' ? 'DEVELOPMENT' : 'production'} · all numbers here are from this device only.
      </p>
      {serverRelease && serverRelease !== __RELEASE_ID__ && (
        <p className="notice" data-testid="new-version">A different version ({serverRelease}) is now on the computer. Reload this page during a break to switch. Progress is kept.</p>
      )}

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

      <TrickyIdeas />
      <PaperPractice />
      <ParentWords />
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
      <StartFresh />
      <section className="panel stack" data-testid="image-credits">
        <h3>Image credits</h3>
        <p className="small-text muted">Real space photos, stored on this computer. Licenses were checked when the images were added.</p>
        <ul className="small-text">
          {Object.entries(PHOTO_CREDITS).map(([k, c]) => (
            <li key={k}>{k}: {c.author || c.credit} — {c.license} · <span lang="en" dir="ltr">{c.page}</span></li>
          ))}
        </ul>
      </section>
    </div>
  );
}
