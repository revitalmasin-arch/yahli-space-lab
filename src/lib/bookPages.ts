// Where a unit's material is in Yahli's textbook ("נפלאות המדע", grade 5). Printed page numbers.
// Pages from 214 on are the book's glossary (מילון מושגים).
import { CONCEPTS } from '../content/concepts';
import { UNITS } from '../content/units';

export const BOOK_TITLE = { he: 'נִפְלְאוֹת הַמַּדָּע, כִּיתָּה ה', en: 'Wonders of Science, Grade 5' };
const GLOSSARY_FROM = 214;

export interface BookPages { pages: number[]; glossary: number[] }

function split(all: number[]): BookPages {
  const uniq = [...new Set(all)].filter((p) => p > 0).sort((a, b) => a - b); // page 0 = outside source
  return { pages: uniq.filter((p) => p < GLOSSARY_FROM), glossary: uniq.filter((p) => p >= GLOSSARY_FROM) };
}

export function unitPages(unitId: string): BookPages {
  const unit = UNITS.find((u) => u.id === unitId);
  const fromConcepts = CONCEPTS.filter((c) => c.unit === unitId).flatMap((c) => c.sources.map((s) => s.page));
  return split([...(unit?.sources.map((s) => s.page) ?? []), ...fromConcepts]);
}

export function conceptPages(conceptId: string): BookPages {
  return split(CONCEPTS.find((c) => c.id === conceptId)?.sources.map((s) => s.page) ?? []);
}

/** "pp. 174, 183 · glossary p. 214" */
export function formatPages({ pages, glossary }: BookPages): string {
  const parts: string[] = [];
  if (pages.length) parts.push(`${pages.length > 1 ? 'pages' : 'page'} ${pages.join(', ')}`);
  if (glossary.length) parts.push(`glossary p. ${glossary.join(', ')}`);
  return parts.join(' · ');
}
export function formatPagesHe({ pages, glossary }: BookPages): string {
  const parts: string[] = [];
  if (pages.length) parts.push(`${pages.length > 1 ? 'עַמּוּדִים' : 'עַמּוּד'} ${pages.join(', ')}`);
  if (glossary.length) parts.push(`מִילּוֹן מוּשָּׂגִים עַמּוּד ${glossary.join(', ')}`);
  return parts.join(' · ');
}
