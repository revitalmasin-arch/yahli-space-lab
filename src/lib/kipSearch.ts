// Kip's "ask me" box: an offline search over the lab's own authored notes (no AI, nothing leaves
// the device). It matches the learner's words — Hebrew with or without niqqud, or English — against
// concept explanations, worked examples and Hebrew terms, and returns the best matches.
import { CONCEPTS } from '../content/concepts';
import { UNITS } from '../content/units';
import type { Concept } from '../content/types';
import { stripNiqqud } from './hebrew';
import { GLOSSARY, type GlossaryEntry } from '../content/glossary';

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

// ---- Chapter dictionary lookup (Kip as translator). Regression: "TAZPIT" found nothing, 2026-10-16.

const LOOKUP_STOP = new Set([...STOP, 'explain', 'translate', 'translation', 'define', 'definition', 'please', 'hebrew', 'english', 'in',
  'תרגם', 'תרגום', 'תסבירי', 'הסבירו', 'פירוש', 'משמעות', 'בעברית', 'באנגלית', 'אומר', 'אומרת']);
const HEB_SKELETON: Record<string, string> = {
  ב: 'B', ג: 'G', ד: 'D', ז: 'Z', ח: 'K', ט: 'T', כ: 'K', ך: 'K', ל: 'L', מ: 'M', ם: 'M', נ: 'N', ן: 'N',
  ס: 'S', פ: 'P', ף: 'P', צ: 'Z', ץ: 'Z', ק: 'K', ר: 'R', ש: 'S', ת: 'T',
};
/** Consonant outline of a word, so "tazpit" (typed in English letters) meets תצפית. */
export function skeleton(word: string): string {
  if (/[\u0590-\u05FF]/.test(word)) return [...stripNiqqud(word)].map((c) => HEB_SKELETON[c] ?? '').join('');
  return word.toLowerCase()
    .replace(/tz|ts/g, 'Z').replace(/sh/g, 'S').replace(/ch|kh/g, 'K').replace(/ph/g, 'P')
    .replace(/[^a-zZSKP]/g, '')
    .replace(/[aeiouyhw']/g, '')
    .replace(/[bv]/g, 'B').replace(/[kcqx]/g, 'K').replace(/f/g, 'P').replace(/j/g, 'G')
    .replace(/[a-z]/g, (c) => c.toUpperCase());
}
function editDistance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

interface GlossDoc { entry: GlossaryEntry; keys: string[]; skeletons: string[] }
let GLOSS_INDEX: GlossDoc[] | null = null;
function glossIndex(): GlossDoc[] {
  if (GLOSS_INDEX) return GLOSS_INDEX;
  GLOSS_INDEX = GLOSSARY.map((entry) => {
    const keys = [entry.heN, entry.en, ...(entry.alts ?? []), ...(entry.latin ?? [])]
      .flatMap((k) => [k, k.replace(/\(.*?\)/g, '')]).map(normalize).filter(Boolean);
    const hebrew = [entry.heN, ...(entry.alts ?? []).filter((a) => /[\u0590-\u05FF]/.test(a))].map(normalize);
    const skeletons = [...hebrew.map((h) => skeleton(h.replace(/ /g, ''))), ...(entry.latin ?? []).map((l) => skeleton(l.replace(/ /g, '')))];
    return { entry, keys: [...new Set(keys)], skeletons: [...new Set(skeletons)].filter((s) => s.length >= 3) };
  });
  return GLOSS_INDEX;
}

/** Looks a word up in the chapter dictionary: Hebrew (with or without niqqud and prefixes),
 *  English, or Hebrew typed in English letters. Best match first. */
export function lookupWord(question: string, max = 3): GlossaryEntry[] {
  const tokens = normalize(question).split(' ').filter((t) => t && !LOOKUP_STOP.has(t));
  if (!tokens.length) return [];
  const phrase = tokens.join(' ');
  const scored = glossIndex().map((d) => {
    let score = 0;
    for (const k of d.keys) {
      if (k === phrase) score = Math.max(score, 100);
      else if (k.includes(' ') && ` ${phrase} `.includes(` ${k} `)) score = Math.max(score, 50 + k.length);
    }
    for (const tok of tokens) {
      const vs = variants(tok);
      if (d.keys.some((k) => vs.includes(k))) score += 20;
      else if (d.keys.some((k) => k.split(' ').some((w) => vs.includes(w)))) score += 6;
      else if (/^[a-z']+$/.test(tok) && tok.length >= 4) {
        const sk = skeleton(tok);
        if (sk.length >= 3 && d.skeletons.includes(sk)) score += 15;
        else if (sk.length >= 4 && d.skeletons.some((s) => editDistance(s, sk) <= 1)) score += 8;
      }
    }
    return { entry: d.entry, score };
  });
  return scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, max).map((s) => s.entry);
}
