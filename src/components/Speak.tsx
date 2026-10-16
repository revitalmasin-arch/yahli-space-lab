import { useEffect, useState } from 'react';
import { onSpeakingChange, speak, speechSupported, stopSpeaking } from '../lib/speech';

// Read-aloud: only on tap, one at a time, with stop. If no voice exists, say so briefly and carry on.
export function Speak({ text, lang, label }: { text: string; lang: 'he' | 'en'; label?: string }) {
  const [speaking, setSpeaking] = useState(false);
  const [mine, setMine] = useState(false);
  const [msg, setMsg] = useState('');
  useEffect(() => onSpeakingChange((s) => { setSpeaking(s); if (!s) setMine(false); }), []);
  if (!speechSupported()) return null;
  const play = () => {
    setMsg('');
    if (speak(text, lang)) setMine(true);
    else setMsg(lang === 'he' ? 'No Hebrew voice on this device — read it with Mum.' : 'No English voice on this device.');
  };
  return (
    <span className="speak">
      {speaking && mine ? (
        <button type="button" className="small ghost" onClick={stopSpeaking} aria-label="Stop reading">■ Stop</button>
      ) : (
        <button type="button" className="small ghost" onClick={play} aria-label={label ?? (lang === 'he' ? 'Read aloud in Hebrew' : 'Read aloud in English')}>
          🔊 {lang === 'he' ? 'הַקְרָאָה' : 'Read'}
        </button>
      )}
      {msg && <span className="muted small-text" role="status"> {msg}</span>}
    </span>
  );
}
