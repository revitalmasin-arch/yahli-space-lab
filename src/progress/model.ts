// Progress data, schema version 2 (v2 added `words`, 2026-10-16). Every change to these shapes needs a schema bump and a
// migration in migrate.ts (see tests/unit/migrate.test.ts).

export type Context = 'warmup' | 'unit' | 'review' | 'lookback';

export interface Attempt {
  id: string;
  at: string; // ISO timestamp
  date: string; // Asia/Jerusalem YYYY-MM-DD
  qid: string;
  concept: string;
  unit: string;
  context: Context;
  correctFirstTry: boolean;
  finalCorrect: boolean;
  tries: number;
  /** 0 none, 1 hint, 2 different explanation, 3 worked example */
  assistance: 0 | 1 | 2 | 3;
  usedEnglish: boolean;
  usedSimpler: boolean;
  niqqud: boolean;
  /** answered right after seeing a worked solution: not evidence of independent recall */
  afterWorked: boolean;
  /** first time this question was ever shown on this device */
  fresh: boolean;
}

export type ProductionResult =
  | 'correct' // auto-checked arrange/complete
  | 'incorrect'
  | 'self-ok' // learner says "I said it"
  | 'self-unsure'
  | 'pending' // waiting for review with Mum
  | 'confirmed' // parent confirmed a good independent answer
  | 'not-yet'; // parent reviewed: not yet

export interface ProductionRecord {
  id: string;
  at: string;
  date: string;
  taskId: string;
  concept: string;
  unit: string;
  kind: 'arrange' | 'complete' | 'say' | 'paper';
  result: ProductionResult;
  /** a word bank or ready-made words were available */
  withBank: boolean;
  checkedAt?: string;
}

export interface Track {
  box: number; // spaced-review box 0..4
  due: string; // date the next review is due
  lastAt: string; // ISO of last update
}

export interface ConceptState {
  science?: Track;
  hebrew?: Track;
}

export interface UnitState {
  introducedAt?: string;
  practicedAt?: string;
  completedAt?: string;
  stepsDone: string[];
}

export interface Settings {
  niqqud: 'auto' | 'on' | 'off';
  celebrations: boolean;
  examDate: string;
  deviceLabel: string;
  /** Learner's name for greetings. Optional and additive: older releases ignore it (schema unchanged). */
  learnerName?: string;
}

/** A word the learner did not understand and saved to "My words" (schema 2). */
export interface SavedWord {
  /** normalized spelling (no niqqud, lower case): one entry per word */
  id: string;
  /** as the learner typed or pasted it */
  text: string;
  addedAt: string;
  /** chapter-dictionary entry that explains it, when there is one */
  glossId?: string;
  /** meaning written by the parent, for words not in the dictionary */
  meaning?: string;
  /** vocabulary-quiz results */
  quiz?: { right: number; wrong: number; lastAt: string };
}

export interface Progress {
  schema: 2;
  createdAt: string;
  updatedAt: string;
  attempts: Attempt[];
  productions: ProductionRecord[];
  concepts: Record<string, ConceptState>;
  units: Record<string, UnitState>;
  /** awarded XP by idempotency key: re-doing the same thing never adds points twice */
  xp: Record<string, number>;
  /** active study seconds per Jerusalem date */
  time: Record<string, number>;
  settings: Settings;
  words: SavedWord[];
}

export const DEFAULT_EXAM_DATE = '2026-10-22';

export function emptyProgress(now = new Date()): Progress {
  const iso = now.toISOString();
  return {
    schema: 2,
    createdAt: iso,
    updatedAt: iso,
    attempts: [],
    productions: [],
    concepts: {},
    units: {},
    xp: {},
    time: {},
    settings: { niqqud: 'auto', celebrations: true, examDate: DEFAULT_EXAM_DATE, deviceLabel: '' },
    words: [],
  };
}

export const xpTotal = (p: Progress) => Object.values(p.xp).reduce((a, b) => a + b, 0);

/** Latest learner activity timestamp (ISO), used to warn before an import would hide newer work. */
export function latestActivity(p: Progress): string | undefined {
  let max: string | undefined;
  for (const a of p.attempts) if (!max || a.at > max) max = a.at;
  for (const r of p.productions) {
    const t = r.checkedAt && r.checkedAt > r.at ? r.checkedAt : r.at;
    if (!max || t > max) max = t;
  }
  return max;
}
