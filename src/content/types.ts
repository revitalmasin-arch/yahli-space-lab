// Structured educational content. UI code reads these shapes; it never hard-codes lesson text.

/** One piece of learner-facing text in both languages. `heN` is vocalized (niqqud);
 *  `he` is the unvocalized form (derived from heN unless the spelling differs). */
export interface Tx {
  en: string;
  heN: string;
  he: string;
}

/** Printed textbook page (equal to the PDF page index in the assigned chapter).
 *  page 0 = a source outside the book; `note` then names it (e.g. NASA). */
export interface SourceRef {
  page: number;
  note?: string;
}

export type VisualId =
  | 'universe-zoom'
  | 'star-planet-light'
  | 'solar-order'
  | 'planet-groups'
  | 'asteroid-belt'
  | 'moon-orbit'
  | 'periodic'
  | 'rotation-orbit'
  | 'day-night'
  | 'life-compare'
  | 'sky'
  | 'telescope'
  | 'planet-table'
  | 'comet'
  | 'models'
  | 'calendar'
  | 'sun-path'
  | 'clock';

export type AnswerPattern = 'definition' | 'comparison' | 'cause' | 'location' | 'duration';

export interface Term {
  id: string;
  word: Tx; // the term itself (en = English equivalent)
  meaning: Tx; // short meaning
  sentence: Tx; // one simple sentence using the term
}

export interface Concept {
  id: string;
  unit: string;
  name: Tx;
  /** Help-ladder step 2: a different explanation, shown with a visual. */
  alt: Tx;
  altVisual: VisualId;
  /** Help-ladder step 3: a worked example on a parallel item (not the answer to the current question). */
  worked: Tx;
  /** Book uses this concept on these pages. */
  sources: SourceRef[];
}

export interface Choice {
  id: string;
  text: Tx;
}

interface QBase {
  id: string;
  unit: string;
  concept: string;
  /** warmup = nonblocking knowledge check; check = in-unit comprehension; review = later-day / varied wording. */
  role: 'warmup' | 'check' | 'review';
  prompt: Tx;
  /** Simpler Hebrew wording offered after an error. */
  simpler?: Tx;
  /** Help-ladder step 1. */
  hint: Tx;
  /** Short explanation shown after answering. */
  why: Tx;
  visual?: VisualId;
  difficulty: 1 | 2 | 3;
}

export interface McQuestion extends QBase {
  kind: 'mc';
  choices: Choice[];
  correct: string;
}

/** True/false; when the statement is false the learner then picks the correction. */
export interface TfQuestion extends QBase {
  kind: 'tf';
  truth: boolean;
  fix?: { prompt: Tx; choices: Choice[]; correct: string };
}

export interface MatchQuestion extends QBase {
  kind: 'match';
  pairs: { left: Tx; right: Tx }[];
}

export type Question = McQuestion | TfQuestion | MatchQuestion;

export type InteractionSpec =
  | { kind: 'sort'; id: string; prompt: Tx; bins: { id: string; label: Tx }[]; items: { id: string; label: Tx; bin: string; feedback: Tx }[]; visual?: VisualId }
  | { kind: 'sequence'; id: string; prompt: Tx; items: { id: string; label: Tx }[]; /** ids in correct order */ order: string[]; visual?: VisualId; done: Tx }
  | { kind: 'explore'; id: string; prompt: Tx; visual: VisualId; goal: Tx }
  /** Build a Solar System model: planets onto orbit slots, then feature cards onto planets (pp.176–179). */
  | { kind: 'model'; id: string; prompt: Tx; features: { id: string; label: Tx; planet: string }[] };

export type ProductionTask =
  | {
      kind: 'arrange';
      id: string;
      unit: string;
      concept: string;
      pattern: AnswerPattern;
      role: 'unit' | 'review';
      prompt: Tx;
      /** vocalized words in the correct order */
      words: string[];
      meaningEn: string;
    }
  | {
      kind: 'complete';
      id: string;
      unit: string;
      concept: string;
      pattern: AnswerPattern;
      role: 'unit' | 'review';
      prompt: Tx;
      before: string; // vocalized
      after: string; // vocalized
      answer: string; // vocalized word that fills the gap
      bank: string[]; // reduced scaffolding: answer + 2 distractors
      meaningEn: string;
    }
  | {
      kind: 'say' | 'paper';
      id: string;
      unit: string;
      concept: string;
      pattern: AnswerPattern;
      role: 'unit' | 'review';
      prompt: Tx;
      /** term(s) a good answer must include (vocalized) */
      requiredTerms: string[];
      example: Tx;
      rubric: string[]; // English, for the parent
    };

export interface Unit {
  id: string;
  order: number;
  title: Tx;
  subtitle: Tx;
  topics: number[]; // required-topic numbers from the teacher's list (1-10)
  minutes: number;
  sources: SourceRef[];
  /** English explanation screens, one idea each, with a visual. */
  explain: { text: string; visual: VisualId; notToScale?: boolean }[];
  terms: Term[];
  interaction: InteractionSpec;
  /** One simple Hebrew bridge sentence per explanation idea is in `terms[].sentence`. */
}
