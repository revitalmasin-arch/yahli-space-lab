import { useState } from 'react';
import { unitById } from '../content/units';
import { CONCEPTS } from '../content/concepts';
import { BOOK_TITLE, conceptPages, formatPages, formatPagesHe, unitPages } from '../lib/bookPages';
import { Bi, He } from './Bi';
import { Speak } from './Speak';

/** Unit bookmark: where this is in the textbook (page numbers), and the full explanation on tap.
 *  Points to Yahli's own book pages; the teacher-guide PDF (which contains answers) is never shown. */
export function BookRef({ unitId }: { unitId: string }) {
  const [open, setOpen] = useState(false);
  const unit = unitById(unitId);
  const pages = unitPages(unitId);
  const concepts = CONCEPTS.filter((c) => c.unit === unitId);
  return (
    <div className="bookref">
      <button type="button" className="small bookmark" aria-expanded={open} onClick={() => setOpen(!open)} data-testid="bookmark-open">
        📑 <span lang="en">Book</span> · <span lang="he">{formatPagesHe(pages)}</span> — <span lang="en">full explanation</span> {open ? '▲' : '▼'}
      </button>
      {open && (
        <section className="panel stack bookref-panel" data-testid="bookmark-panel">
          <p className="book-line">
            📖 <strong lang="he">{BOOK_TITLE.he}</strong> · <span lang="en">{BOOK_TITLE.en}</span>:{' '}
            <strong lang="en" data-testid="bookmark-pages">{formatPages(pages)}</strong>
          </p>
          <p className="muted small-text">Open your science book at these pages to read it there too.</p>

          <h3>🔭 The idea, step by step</h3>
          <ol className="stack">
            {unit.explain.map((e, i) => (
              <li key={i} lang="en" dir="ltr">{e.text}</li>
            ))}
          </ol>
          <Speak text={unit.explain.map((e) => e.text).join(' ')} lang="en" />

          <h3>🔤 Hebrew words · מִילִּים</h3>
          <ul className="stack" style={{ listStyle: 'none', padding: 0 }}>
            {unit.terms.map((t) => (
              <li key={t.id} className="term-line">
                <span className="row"><He x={t.word} as="span" /> <Speak text={t.word.heN} lang="he" /> <span className="tag" lang="en">{t.word.en}</span></span>
                <He x={t.sentence} as="p" />
                <p className="muted small-text" lang="en" dir="ltr">{t.meaning.en} — “{t.sentence.en}”</p>
              </li>
            ))}
          </ul>

          <h3>💡 Explained another way</h3>
          {concepts.map((c) => (
            <div key={c.id} className="stack concept-note">
              <p><He x={c.name} as="span" /> <span className="muted small-text">({formatPages(conceptPages(c.id))})</span></p>
              <Bi x={c.alt} />
              <Bi x={c.worked} />
            </div>
          ))}
          <div className="row end"><button type="button" className="small" onClick={() => setOpen(false)}>Close · סְגוֹר</button></div>
        </section>
      )}
    </div>
  );
}
