import { useState } from 'react';
import type { Tx } from '../content/types';
import { useStore } from '../progress/store';
import { Speak } from './Speak';

export function useNiqqud(): boolean {
  return useStore().progress.settings.niqqud !== 'off';
}

/** Hebrew text (vocalized unless turned off). */
export function He({ x, as: Tag = 'span', className = '' }: { x: Tx; as?: 'span' | 'p' | 'h2' | 'h3' | 'div'; className?: string }) {
  const niqqud = useNiqqud();
  return (
    <Tag lang="he" dir="rtl" className={`${niqqud ? 'he-n' : ''} ${className}`}>
      {niqqud ? x.heN : x.he}
    </Tag>
  );
}

/** Hebrew line with read-aloud and an "in English" toggle. onEnglish lets callers record that support was used. */
export function Bi({ x, as = 'p', onEnglish, showEnglish }: { x: Tx; as?: 'p' | 'h2' | 'h3' | 'div'; onEnglish?: () => void; showEnglish?: boolean }) {
  const niqqud = useNiqqud();
  const [open, setOpen] = useState(false);
  const shown = open || showEnglish;
  return (
    <div className="bi">
      <He x={x} as={as} />
      <div className="row">
        <Speak text={niqqud ? x.heN : x.he} lang="he" />
        <button type="button" className="small ghost" aria-expanded={shown} onClick={() => { if (!shown) onEnglish?.(); setOpen(!open); }}>
          {shown ? 'Hide English' : 'English'}
        </button>
      </div>
      {shown && <p className="en-box" lang="en" dir="ltr">{x.en}</p>}
    </div>
  );
}
