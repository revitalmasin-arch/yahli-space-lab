import { useEffect, useState } from 'react';
import { glossaryById } from '../content/glossary';
import { useStore } from '../progress/store';
import { addWord, MAX_WORD_LENGTH, wordKey } from '../lib/words';

/** Saves a word to "My words" and says what happened. */
export function useAddWord() {
  const { progress, update, readOnly } = useStore();
  return (text: string): string => {
    if (readOnly) return 'Saving is paused on this device — ask Mum.';
    const probe = addWord({ ...progress, words: [...progress.words] }, text);
    if (probe.status === 'empty') return 'Type or paste a word first.';
    if (probe.status === 'too-long') return `That is long — save one word or a short phrase (up to ${MAX_WORD_LENGTH} letters).`;
    if (probe.status === 'exists') return `“${probe.word.text}” is already in My words.`;
    update((p) => { addWord(p, text); });
    const g = probe.word.glossId ? glossaryById(probe.word.glossId) : undefined;
    return g ? `Saved ✓ “${probe.word.text}” = ${g.en}. It will be in your word quiz.` : `Saved ✓ “${probe.word.text}”. Mum will add what it means.`;
  };
}

/** The "didn't understand a word?" bar under the header, on every screen. */
export function WordBar({ onOpen }: { onOpen: () => void }) {
  const { progress } = useStore();
  const add = useAddWord();
  const [text, setText] = useState('');
  const [msg, setMsg] = useState('');
  return (
    <form className="word-bar row" onSubmit={(e) => { e.preventDefault(); const m = add(text); setMsg(m); if (m.startsWith('Saved')) setText(''); }} data-testid="word-bar">
      <label htmlFor="word-bar-input" className="small-text" title="Didn't understand a word? Paste it here">📝 <span lang="he">לֹא הֵבַנְתִּי:</span></label>
      <input id="word-bar-input" type="text" dir="auto" value={text} maxLength={80} onChange={(e) => { setText(e.target.value); setMsg(''); }}
        placeholder="a word I didn't understand · מִילָּה" data-testid="word-bar-input" />
      <button type="submit" className="small primary" data-testid="word-bar-add">➕ Save</button>
      <button type="button" className="small" onClick={onOpen} data-testid="my-words-open">📖 My words ({progress.words.length})</button>
      {msg && <p className="small-text feedback help" role="status" data-testid="word-bar-msg">{msg}</p>}
    </form>
  );
}

/** Select a word anywhere on the page → a small "Save to My words" button appears. */
export function SelectionSaver() {
  const add = useAddWord();
  const [sel, setSel] = useState('');
  const [msg, setMsg] = useState('');
  useEffect(() => {
    const onChange = () => {
      const s = window.getSelection();
      const text = s?.toString().replace(/\s+/g, ' ').trim() ?? '';
      const node = s?.anchorNode instanceof Element ? s.anchorNode : s?.anchorNode?.parentElement;
      const inField = !!node?.closest('input, textarea');
      setSel(!inField && text && text.length <= MAX_WORD_LENGTH && wordKey(text) ? text : '');
      if (text) setMsg('');
    };
    document.addEventListener('selectionchange', onChange);
    return () => document.removeEventListener('selectionchange', onChange);
  }, []);
  useEffect(() => {
    if (!msg) return;
    const id = window.setTimeout(() => setMsg(''), 5000);
    return () => window.clearTimeout(id);
  }, [msg]);
  if (!sel && !msg) return null;
  return (
    <div className="selection-saver" role="status">
      {sel ? (
        <button type="button" className="small primary" data-testid="selection-save"
          onPointerDown={(e) => e.preventDefault() /* keep the selection */}
          onClick={() => { setMsg(add(sel)); setSel(''); window.getSelection()?.removeAllRanges(); }}>
          ➕ Save “{sel}” to My words
        </button>
      ) : (
        <span className="small-text" onClick={() => setMsg('')}>{msg}</span>
      )}
    </div>
  );
}
