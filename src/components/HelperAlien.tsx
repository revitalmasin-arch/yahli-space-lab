import { useState } from 'react';
import { unitById } from '../content/units';
import { speak } from '../lib/speech';
import { He, useNiqqud } from './Bi';
import { Speak } from './Speak';
import { useHelperState } from './helperState';
import { askKip, lookupWord, type KipAnswer } from '../lib/kipSearch';
import type { GlossaryEntry } from '../content/glossary';
import { WordCard } from './WordCard';
import { useAddWord } from './WordBar';
import { conceptPages, formatPages } from '../lib/bookPages';
import { Bi } from './Bi';

/** Kip riding his flying saucer: full body, no frame. Decorative; the button carries the label. */
function KipOnSaucer() {
  return (
    <svg viewBox="0 0 120 130" aria-hidden="true">
      <defs>
        <linearGradient id="kipSaucer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f1f4fb" />
          <stop offset="0.55" stopColor="#9aa4bd" />
          <stop offset="1" stopColor="#5a6380" />
        </linearGradient>
        <linearGradient id="kipSuit" x1="0" x2="1">
          <stop offset="0" stopColor="#b9c3db" />
          <stop offset="0.5" stopColor="#eef2fb" />
          <stop offset="1" stopColor="#a7b1cb" />
        </linearGradient>
        <radialGradient id="kipSkin" cx="0.4" cy="0.35">
          <stop offset="0" stopColor="#9cf0bf" />
          <stop offset="1" stopColor="#3fbf7f" />
        </radialGradient>
      </defs>
      {/* tractor beam */}
      <path d="M44 104 L30 130 H90 L76 104z" fill="#7fd3ff" opacity="0.14" />
      {/* antennae */}
      <path d="M52 16 Q46 6 41 3" stroke="#3fbf7f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M68 16 Q74 6 79 3" stroke="#3fbf7f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="41" cy="3" r="3" fill="#ffe08a" />
      <circle cx="79" cy="3" r="3" fill="#ffe08a" />
      {/* legs */}
      <rect x="52" y="70" width="7" height="18" rx="3" fill="url(#kipSuit)" />
      <rect x="62" y="70" width="7" height="18" rx="3" fill="url(#kipSuit)" />
      <ellipse cx="55" cy="89" rx="6" ry="3" fill="#5a6380" />
      <ellipse cx="66" cy="89" rx="6" ry="3" fill="#5a6380" />
      {/* arms: one waving */}
      <path d="M48 52 Q38 46 35 34" stroke="url(#kipSuit)" strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="35" cy="32" r="4" fill="url(#kipSkin)" />
      <path d="M72 52 Q80 60 80 68" stroke="url(#kipSuit)" strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="80" cy="70" r="4" fill="url(#kipSkin)" />
      {/* torso (space suit) with badge */}
      <rect x="47" y="45" width="26" height="28" rx="9" fill="url(#kipSuit)" stroke="#8d97b3" strokeWidth="1" />
      <circle cx="60" cy="57" r="4" fill="#ffb347" stroke="#c97d1f" strokeWidth="1" />
      {/* head */}
      <ellipse cx="60" cy="30" rx="17" ry="16" fill="url(#kipSkin)" />
      <ellipse cx="53" cy="28" rx="5" ry="6.5" fill="#0b1236" />
      <ellipse cx="67" cy="28" rx="5" ry="6.5" fill="#0b1236" />
      <circle cx="54.5" cy="26" r="1.8" fill="#fff" />
      <circle cx="68.5" cy="26" r="1.8" fill="#fff" />
      <path d="M54 38 q6 4 12 0" stroke="#0b1236" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* saucer */}
      <ellipse cx="60" cy="96" rx="52" ry="12" fill="url(#kipSaucer)" />
      <ellipse cx="60" cy="92" rx="30" ry="6" fill="#c9d1e6" opacity="0.8" />
      {[18, 36, 60, 84, 102].map((x, i) => <circle key={x} cx={x} cy={98} r="2.4" fill={i % 2 ? '#ffe08a' : '#7fd3ff'} />)}
    </svg>
  );
}

/** Kip, the lab helper: real help for the current screen, plus a question box that searches the lab's notes. */
export function HelperAlien() {
  const { unit, question } = useHelperState();
  const niqqud = useNiqqud();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'menu' | 'words' | 'how'>('menu');
  const [msg, setMsg] = useState('');
  const [q, setQ] = useState('');
  const [answers, setAnswers] = useState<KipAnswer[] | null>(null);
  const [words, setWords] = useState<GlossaryEntry[]>([]);
  const addWord = useAddWord();
  const [saved, setSaved] = useState('');
  const ask = () => {
    setSaved('');
    const found = lookupWord(q, 2);
    setWords(found);
    // the dictionary already explains a single word; lesson notes add the bigger picture
    setAnswers(askKip(q, found.length ? 2 : 3));
  };
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
              <form className="stack ask-kip" onSubmit={(e) => { e.preventDefault(); ask(); }}>
                <label className="small-text" htmlFor="kip-q">Ask me a word or a question — I translate and explain · <span lang="he">שְׁאַל אוֹתִי מִילָּה אוֹ שְׁאֵלָה</span></label>
                <div className="row">
                  <input id="kip-q" type="text" dir="auto" value={q} maxLength={120} onChange={(e) => setQ(e.target.value)} placeholder="e.g. תצפית / tazpit / What is a comet?" data-testid="kip-input" />
                  <button type="submit" className="small primary" style={{ width: 'auto' }} data-testid="kip-ask">Ask · שְׁאַל</button>
                </div>
              </form>
              {answers && (
                <div className="stack" data-testid="kip-answers" role="status">
                  {words.map((w) => (
                    <WordCard key={w.id} entry={w}>
                      <button type="button" className="small" onClick={() => setSaved(addWord(w.heN))} data-testid="kip-save-word">➕ Save to My words</button>
                    </WordCard>
                  ))}
                  {answers.length === 0 && words.length === 0 ? (
                    <p className="feedback help small-text" data-testid="kip-none">That word isn't in my space dictionary or lab notes. Try another word, or ask Mum! · <span lang="he">הַמִּילָּה לֹא בַּמִּילּוֹן שֶׁלִּי. נַסֵּה מִילָּה אַחֶרֶת.</span>
                      <button type="button" className="small" onClick={() => setSaved(addWord(q))} data-testid="kip-save-unknown">➕ Save it to My words — Mum will explain</button></p>
                  ) : (
                    answers.length > 0 && <>
                      <p className="small-text muted">{words.length ? 'More in my lab notes:' : 'Here is what my lab notes say:'}</p>
                      {answers.map(({ concept }) => (
                        <div key={concept.id} className="panel stack kip-answer">
                          <strong><He x={concept.name} as="span" /> <span className="muted small-text" lang="en">· {concept.name.en}</span></strong>
                          <Bi x={concept.alt} />
                          <p className="small-text">📑 Book: {formatPages(conceptPages(concept.id))}</p>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
              {saved && <p className="small-text feedback help" role="status" data-testid="kip-saved">{saved}</p>}
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
              <p className="muted small-text">I answer from the book's words (pages 168–190 and its dictionary) and the lab's lesson notes. For anything else, ask Mum!</p>
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
      <button type="button" className="kip-button" onClick={() => { setOpen(!open); setView('menu'); setMsg(''); setAnswers(null); setWords([]); }} aria-expanded={open} aria-label="Ask Kip, the lab helper" data-testid="helper-open">
        <KipOnSaucer />
        <span className="kip-label">Ask Kip · עֶזְרָה</span>
      </button>

    </div>
  );
}
