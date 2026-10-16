import { useState } from 'react';
import { unitById } from '../content/units';
import { speak } from '../lib/speech';
import { He, useNiqqud } from './Bi';
import { Speak } from './Speak';
import { useHelperState } from './helperState';

/** Kip, the lab helper. Offers only help that really exists in the app (no typed-question answering yet). */
export function HelperAlien() {
  const { unit, question } = useHelperState();
  const niqqud = useNiqqud();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'menu' | 'words' | 'how'>('menu');
  const [msg, setMsg] = useState('');
  const terms = unit ? unitById(unit).terms : [];
  const act = (fn: () => void, note: string) => {
    fn();
    setMsg(note);
  };

  return (
    <div className="helper" data-testid="helper">
      {open && (
        <div className="helper-panel panel stack" role="dialog" aria-label="Kip the lab helper">
          <div className="row">
            <strong>👽 Kip · קִיפּ</strong>
            <button type="button" className="small ghost" style={{ marginInlineStart: 'auto' }} onClick={() => setOpen(false)} aria-label="Close helper">✕</button>
          </div>
          {view === 'menu' && (
            <>
              <p className="small-text">Hi! I'm Kip, your lab helper. Asking for help is a smart move. · <span lang="he">שָׁלוֹם! אֲנִי קִיפּ.</span></p>
              {question?.canHelp && (
                <div className="stack">
                  <button type="button" onClick={() => act(question.hint, 'Look under the question for a hint.')} data-testid="helper-hint">💡 Give me a hint · רֶמֶז</button>
                  <button type="button" onClick={() => act(question.another, 'I opened another way to see it, with a picture.')} data-testid="helper-another">🔭 Explain it another way</button>
                  <button type="button" onClick={() => act(question.english, 'The question is now shown in English too.')} data-testid="helper-english">🇬🇧 Show the question in English</button>
                  <button type="button" onClick={() => act(() => { if (!speak(question.promptHe, 'he')) setMsg('No Hebrew voice on this device — ask Mum to read it.'); }, '')}>🔊 Read the question to me</button>
                </div>
              )}
              {terms.length > 0 && <button type="button" onClick={() => setView('words')} data-testid="helper-words">📖 What does this word mean?</button>}
              <button type="button" onClick={() => setView('how')}>❓ How does the lab work?</button>
              {msg && <p className="feedback help small-text" role="status">{msg}</p>}
              <p className="muted small-text">I can't read typed questions yet. For anything else, ask Mum!</p>
            </>
          )}
          {view === 'words' && (
            <>
              <p className="small-text">Words in this unit:</p>
              <ul className="stack" style={{ listStyle: 'none', padding: 0 }}>
                {terms.map((t) => (
                  <li key={t.id} className="panel">
                    <div className="row"><He x={t.word} as="span" /> <Speak text={niqqud ? t.word.heN : t.word.he} lang="he" /> <span lang="en" className="tag">{t.word.en}</span></div>
                    <p className="small-text" lang="en">{t.meaning.en}</p>
                  </li>
                ))}
              </ul>
              <button type="button" className="small" onClick={() => setView('menu')}>← Back</button>
            </>
          )}
          {view === 'how' && (
            <>
              <ul className="small-text">
                <li>Each unit is a mission with stages: explore, Hebrew words, investigate, check, say it in Hebrew.</li>
                <li>Wrong answers are fine: you get a hint, then another explanation, then an example and a new question.</li>
                <li>Tap the stage icons to go back. “Start this part over” is always allowed.</li>
                <li>Spoken answers are checked with Mum — the app does not listen.</li>
              </ul>
              <button type="button" className="small" onClick={() => setView('menu')}>← Back</button>
            </>
          )}
        </div>
      )}
      <button type="button" className="helper-button" onClick={() => { setOpen(!open); setView('menu'); setMsg(''); }} aria-expanded={open} aria-label="Ask Kip, the lab helper" data-testid="helper-open">
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <line x1="22" y1="14" x2="16" y2="4" stroke="#7be08f" strokeWidth="3" strokeLinecap="round" />
          <line x1="42" y1="14" x2="48" y2="4" stroke="#7be08f" strokeWidth="3" strokeLinecap="round" />
          <circle cx="16" cy="4" r="3.5" fill="#ffe08a" />
          <circle cx="48" cy="4" r="3.5" fill="#ffe08a" />
          <ellipse cx="32" cy="34" rx="22" ry="24" fill="#5fd39b" stroke="#2f8a5f" strokeWidth="2" />
          <ellipse cx="23" cy="30" rx="7" ry="9" fill="#0b1236" />
          <ellipse cx="41" cy="30" rx="7" ry="9" fill="#0b1236" />
          <circle cx="25" cy="27" r="2.5" fill="#fff" />
          <circle cx="43" cy="27" r="2.5" fill="#fff" />
          <path d="M24 46 q8 6 16 0" stroke="#0b1236" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
        <span className="helper-label">Help · עֶזְרָה</span>
      </button>
    </div>
  );
}
