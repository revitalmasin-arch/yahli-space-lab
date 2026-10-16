// "My words": words the learner did not understand, collected for a vocabulary quiz.
import { GLOSSARY, glossaryById } from '../content/glossary';
import type { Progress, SavedWord } from '../progress/model';
import { bestWordMatch, normalize } from './kipSearch';
import { stripNiqqud } from './hebrew';
import { awardXp } from './learning';

export const MAX_WORD_LENGTH = 40;
export const VOCAB_XP = 2;

export const wordKey = (text: string) => normalize(text);

export type AddResult = { status: 'added'; word: SavedWord } | { status: 'exists'; word: SavedWord } | { status: 'empty' } | { status: 'too-long' };

const EDGE_PUNCT = /^[\s.,:;!?"'()–-]+|[\s.,:;!?"'()–-]+$/g;

/** Adds a word (typed, pasted or selected). Links it to the chapter dictionary when there is a sure match. */
export function addWord(p: Progress, raw: string, now = new Date()): AddResult {
  const text = raw.replace(/\s+/g, ' ').trim().replace(EDGE_PUNCT, '');
  if (!text) return { status: 'empty' };
  if (text.length > MAX_WORD_LENGTH) return { status: 'too-long' };
  const id = wordKey(text);
  if (!id) return { status: 'empty' };
  const existing = p.words.find((w) => w.id === id);
  if (existing) return { status: 'exists', word: existing };
  const gloss = bestWordMatch(text);
  const word: SavedWord = { id, text, addedAt: now.toISOString(), ...(gloss ? { glossId: gloss.id } : {}) };
  p.words.push(word);
  return { status: 'added', word };
}

export function removeWord(p: Progress, id: string) {
  p.words = p.words.filter((w) => w.id !== id);
}

/** What the word means: the dictionary's simple explanation, or Mum's own explanation. */
export function meaningOf(w: SavedWord): { heN?: string; en?: string; text?: string } | undefined {
  const g = w.glossId ? glossaryById(w.glossId) : undefined;
  if (g) return { heN: g.simple.heN, en: g.simple.en };
  if (w.meaning?.trim()) return { text: w.meaning.trim() };
  return undefined;
}

export interface VocabQuestion {
  wordId: string;
  /** 'meaning': show the word, choose its meaning. 'word': show the meaning, choose the word. */
  kind: 'meaning' | 'word';
  prompt: string;
  choices: string[];
  answer: number;
}

function shuffle<T>(xs: T[], rng: () => number): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const score = (w: SavedWord) => (w.quiz?.right ?? 0) - (w.quiz?.wrong ?? 0);

/** Up to `max` questions about the explained words, least-known first. Wrong choices come from the chapter dictionary. */
export function buildVocabQuiz(words: SavedWord[], niqqud: boolean, rng: () => number = Math.random, max = 8): VocabQuestion[] {
  const he = (s: string) => (niqqud ? s : stripNiqqud(s));
  const known = words.filter((w) => meaningOf(w)).sort((a, b) => score(a) - score(b));
  return known.slice(0, max).map((w, i) => {
    const m = meaningOf(w)!;
    const correctMeaning = m.heN ? he(m.heN) : m.text!;
    const correctWord = w.glossId ? he(glossaryById(w.glossId)!.heN) : w.text;
    const others = shuffle(GLOSSARY.filter((g) => g.id !== w.glossId), rng).slice(0, 3);
    const kind: VocabQuestion['kind'] = i % 2 === 0 ? 'meaning' : 'word';
    const right = kind === 'meaning' ? correctMeaning : correctWord;
    const wrong = others.map((g) => he(kind === 'meaning' ? g.simple.heN : g.heN));
    const choices = shuffle([right, ...wrong], rng);
    return { wordId: w.id, kind, prompt: kind === 'meaning' ? correctWord : correctMeaning, choices, answer: choices.indexOf(right) };
  });
}

/** Records the first answer to a quiz question; at most VOCAB_XP points per word per day. */
export function recordVocab(p: Progress, wordId: string, right: boolean, now: Date, today: string) {
  const w = p.words.find((x) => x.id === wordId);
  if (!w) return;
  const q = w.quiz ?? { right: 0, wrong: 0, lastAt: '' };
  w.quiz = { right: q.right + (right ? 1 : 0), wrong: q.wrong + (right ? 0 : 1), lastAt: now.toISOString() };
  if (right) awardXp(p, `vocab:${wordId}:${today}`, VOCAB_XP, today);
}
