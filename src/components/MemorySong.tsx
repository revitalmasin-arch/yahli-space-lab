import { useState } from 'react';
import { SONGS } from '../content/songs';
import { stripNiqqud } from '../lib/hebrew';
import { useNiqqud } from './Bi';
import { Speak } from './Speak';

/** The unit's memory rhyme, with read-aloud and its meaning in English. */
export function MemorySong({ unitId }: { unitId: string }) {
  const niqqud = useNiqqud();
  const [en, setEn] = useState(false);
  const song = SONGS[unitId];
  if (!song) return null;
  const lines = song.lines.map((l) => (niqqud ? l : stripNiqqud(l)));
  return (
    <div className="memory-song" data-testid="memory-song">
      <p className="small-text"><strong>🎵 שִׁיר זִיכָּרוֹן · Memory rhyme</strong> — say it out loud, clap the beat!</p>
      <div lang="he" dir="rtl" className={niqqud ? 'he-n' : ''}>
        {lines.map((l, i) => <p key={i}>{l}</p>)}
      </div>
      <div className="row">
        <Speak text={lines.join(' ')} lang="he" />
        <button type="button" className="small ghost" aria-expanded={en} onClick={() => setEn(!en)}>{en ? 'Hide English' : 'English'}</button>
      </div>
      {en && <p className="en-box" lang="en" dir="ltr">{song.en}</p>}
    </div>
  );
}
