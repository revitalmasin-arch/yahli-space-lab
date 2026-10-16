import type { ReactNode } from 'react';
import type { GlossaryEntry } from '../content/glossary';
import { formatPages } from '../lib/bookPages';
import { stripNiqqud } from '../lib/hebrew';
import { Bi, useNiqqud } from './Bi';
import { Speak } from './Speak';

/** One chapter-dictionary word: Hebrew, English translation, a simple explanation and the book page. */
export function WordCard({ entry, children }: { entry: GlossaryEntry; children?: ReactNode }) {
  const niqqud = useNiqqud();
  const word = niqqud ? entry.heN : stripNiqqud(entry.heN);
  return (
    <div className="panel stack kip-answer word-card" data-testid="word-card" data-word={entry.id}>
      <div className="row">
        <strong lang="he" dir="rtl" className={niqqud ? 'he-n' : ''}>{word}</strong>
        <Speak text={word} lang="he" />
        <span lang="en" className="tag" data-testid="word-en">{entry.en}</span>
      </div>
      <Bi x={entry.simple} />
      <p className="small-text">📑 Book: {formatPages({ pages: entry.pages.filter((p) => p < 214), glossary: entry.pages.filter((p) => p >= 214) })}</p>
      {children}
    </div>
  );
}
