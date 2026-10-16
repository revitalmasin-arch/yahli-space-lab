// Kip's "ask me" box: an offline search over the lab's own authored notes (no AI, nothing leaves
// the device). It matches the learner's words — Hebrew with or without niqqud, or English — against
// concept explanations, worked examples and Hebrew terms, and returns the best matches.
import { CONCEPTS } from '../content/concepts';
import { UNITS } from '../content/units';
import type { Concept } from '../content/types';
import { stripNiqqud } from './hebrew';

const STOP = new Set([
  'what', 'is', 'the', 'a', 'an', 'why', 'how', 'does', 'do', 'of', 'in', 'and', 'to', 'are', 'it', 'its', 'can', 'you', 'me', 'tell', 'about', 'mean', 'means', 'meaning', 'word', 'i', 'dont', 'understand',
  'מה', 'זה', 'הוא', 'היא', 'של', 'את', 'למה', 'איך', 'יש', 'על', 'אם', 'כי', 'לא', 'אני', 'מבין', 'מבינה', 'פירוש', 'המילה', 'בבקשה', 'תסביר', 'הסבר',
]);
const PREFIXES = ['ה', 'ו', 'ב', 'ל', 'מ', 'ש', 'כ'];

export function normalize(s: string): string {
  return stripNiqqud(s).toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
}
export function queryTokens(q: string): string[] {
  return normalize(q).split(' ').filter((t) => t.length >= 2 && !STOP.has(t));
}
/** A Hebrew word may carry one-letter prefixes (הַ, וְ, בְּ…): also try it without them. */
function variants(token: string): string[] {
  const out = [token];
  let t = token;
  for (let i = 0; i < 2 && t.length > 3 && PREFIXES.includes(t[0]); i++) {
    t = t.slice(1);
    out.push(t);
  }
  return out;
}

interface Doc { concept: Concept; title: string; body: string }
let INDEX: Doc[] | null = null;
function index(): Doc[] {
  if (INDEX) return INDEX;
  INDEX = CONCEPTS.map((c) => {
    const unit = UNITS.find((u) => u.id === c.unit);
    const terms = unit ? unit.terms.map((t) => [t.word.heN, t.word.en, t.meaning.heN, t.meaning.en, t.sentence.heN, t.sentence.en].join(' ')).join(' ') : '';
    const explain = unit ? unit.explain.map((e) => e.text).join(' ') : '';
    return {
      concept: c,
      title: normalize(`${c.name.heN} ${c.name.en}`),
      body: normalize(`${c.alt.heN} ${c.alt.en} ${c.worked.heN} ${c.worked.en} ${terms} ${explain}`),
    };
  });
  return INDEX;
}

export interface KipAnswer { concept: Concept; score: number }

export function askKip(question: string, max = 3): KipAnswer[] {
  const tokens = queryTokens(question);
  if (!tokens.length) return [];
  const scored = index().map((d) => {
    let score = 0;
    for (const tok of tokens) {
      const vs = variants(tok);
      if (vs.some((v) => d.title.includes(v))) score += 3;
      else if (vs.some((v) => d.body.includes(v))) score += 1;
    }
    return { concept: d.concept, score };
  });
  return scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, max);
}
