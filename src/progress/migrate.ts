import versions from './schema-version.json';
import { emptyProgress, type Attempt, type ConceptState, type Progress, type ProductionRecord, type Track, type UnitState } from './model';

export const CURRENT_SCHEMA: number = versions.current;
export const MIN_READABLE_SCHEMA: number = versions.minReadable;

/** MIGRATIONS[n] converts schema n data to schema n+1. Never drop learner records in a migration. */
export type Migration = (data: any) => any;
export const MIGRATIONS: Record<number, Migration> = {};

export type MigrateResult =
  | { ok: true; data: any; from: number; migrated: boolean }
  | { ok: false; reason: 'newer' | 'too-old' | 'not-progress'; from?: number };

export function schemaOf(data: unknown): number | undefined {
  const s = (data as { schema?: unknown } | null)?.schema;
  return typeof s === 'number' && Number.isInteger(s) && s > 0 ? s : undefined;
}

export function migrate(data: unknown, migrations: Record<number, Migration> = MIGRATIONS, target = CURRENT_SCHEMA, minReadable = MIN_READABLE_SCHEMA): MigrateResult {
  const from = schemaOf(data);
  if (from === undefined) return { ok: false, reason: 'not-progress' };
  if (from > target) return { ok: false, reason: 'newer', from };
  if (from < minReadable) return { ok: false, reason: 'too-old', from };
  let d: any = structuredClone(data);
  for (let v = from; v < target; v++) {
    const m = migrations[v];
    if (!m) return { ok: false, reason: 'too-old', from };
    d = m(d);
    d.schema = v + 1;
  }
  return { ok: true, data: d, from, migrated: from !== target };
}

// ---- Sanitizing: keep every valid record, drop only individually broken ones. ----

const isStr = (x: unknown): x is string => typeof x === 'string';
const isBool = (x: unknown): x is boolean => typeof x === 'boolean';
const isNum = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);
const isObj = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);

function validAttempt(a: any): a is Attempt {
  return isObj(a) && isStr(a.id) && isStr(a.at) && isStr(a.date) && isStr(a.qid) && isStr(a.concept) && isStr(a.unit) &&
    isStr(a.context) && isBool(a.correctFirstTry) && isBool(a.finalCorrect) && isNum(a.tries) &&
    [0, 1, 2, 3].includes(a.assistance as number) && isBool(a.usedEnglish) && isBool(a.usedSimpler) && isBool(a.niqqud) &&
    isBool(a.afterWorked) && isBool(a.fresh);
}
function validProduction(r: any): r is ProductionRecord {
  return isObj(r) && isStr(r.id) && isStr(r.at) && isStr(r.date) && isStr(r.taskId) && isStr(r.concept) && isStr(r.unit) &&
    ['arrange', 'complete', 'say', 'paper'].includes(r.kind as string) &&
    ['correct', 'incorrect', 'self-ok', 'self-unsure', 'pending', 'confirmed', 'not-yet'].includes(r.result as string) &&
    isBool(r.withBank) && (r.checkedAt === undefined || isStr(r.checkedAt));
}
const validTrack = (t: any): t is Track => isObj(t) && isNum(t.box) && isStr(t.due) && isStr(t.lastAt);

/** Returns a well-formed Progress plus how many records had to be dropped (0 = untouched). */
export function sanitize(input: any): { progress: Progress; dropped: number } {
  const base = emptyProgress();
  let dropped = 0;
  const src = isObj(input) ? input : {};
  const keep = <T,>(arr: unknown, ok: (x: any) => x is T): T[] => {
    if (!Array.isArray(arr)) return [];
    const out = arr.filter(ok);
    dropped += arr.length - out.length;
    return out;
  };
  const concepts: Record<string, ConceptState> = {};
  if (isObj(src.concepts)) {
    for (const [k, v] of Object.entries(src.concepts)) {
      if (!isObj(v)) { dropped++; continue; }
      const c: ConceptState = {};
      if (v.science !== undefined) { if (validTrack(v.science)) c.science = v.science; else dropped++; }
      if (v.hebrew !== undefined) { if (validTrack(v.hebrew)) c.hebrew = v.hebrew; else dropped++; }
      concepts[k] = c;
    }
  }
  const units: Record<string, UnitState> = {};
  if (isObj(src.units)) {
    for (const [k, v] of Object.entries(src.units)) {
      if (!isObj(v)) { dropped++; continue; }
      units[k] = {
        introducedAt: isStr(v.introducedAt) ? v.introducedAt : undefined,
        practicedAt: isStr(v.practicedAt) ? v.practicedAt : undefined,
        completedAt: isStr(v.completedAt) ? v.completedAt : undefined,
        stepsDone: Array.isArray(v.stepsDone) ? v.stepsDone.filter(isStr) : [],
      };
    }
  }
  const numMap = (m: unknown) => {
    const out: Record<string, number> = {};
    if (isObj(m)) for (const [k, v] of Object.entries(m)) { if (isNum(v) && v >= 0) out[k] = v; else dropped++; }
    return out;
  };
  const s = isObj(src.settings) ? src.settings : {};
  const progress: Progress = {
    schema: 1,
    createdAt: isStr(src.createdAt) ? src.createdAt : base.createdAt,
    updatedAt: isStr(src.updatedAt) ? src.updatedAt : base.updatedAt,
    attempts: keep(src.attempts, validAttempt),
    productions: keep(src.productions, validProduction),
    concepts,
    units,
    xp: numMap(src.xp),
    time: numMap(src.time),
    settings: {
      niqqud: s.niqqud === 'on' || s.niqqud === 'off' ? s.niqqud : 'auto',
      celebrations: isBool(s.celebrations) ? s.celebrations : true,
      examDate: isStr(s.examDate) && /^\d{4}-\d{2}-\d{2}$/.test(s.examDate) ? s.examDate : base.settings.examDate,
      deviceLabel: isStr(s.deviceLabel) ? s.deviceLabel.slice(0, 40) : '',
    },
  };
  return { progress, dropped };
}

// ---- Merging (import backup, second tab): a union, so no learner activity is lost. ----

function newerTrack(a?: Track, b?: Track): Track | undefined {
  if (!a) return b;
  if (!b) return a;
  return b.lastAt > a.lastAt ? b : a;
}
const minStr = (a?: string, b?: string) => (!a ? b : !b ? a : a < b ? a : b);

export function merge(current: Progress, other: Progress): Progress {
  const attempts = new Map(current.attempts.map((a) => [a.id, a]));
  for (const a of other.attempts) if (!attempts.has(a.id)) attempts.set(a.id, a);
  const productions = new Map(current.productions.map((r) => [r.id, r]));
  for (const r of other.productions) {
    const mine = productions.get(r.id);
    // a parent check recorded on either side wins over an unchecked copy
    if (!mine || (r.checkedAt ?? '') > (mine.checkedAt ?? '')) productions.set(r.id, r);
  }
  const concepts: Record<string, ConceptState> = { ...current.concepts };
  for (const [k, v] of Object.entries(other.concepts)) {
    const c = concepts[k] ?? {};
    concepts[k] = { science: newerTrack(c.science, v.science), hebrew: newerTrack(c.hebrew, v.hebrew) };
  }
  const units: Record<string, UnitState> = { ...current.units };
  for (const [k, v] of Object.entries(other.units)) {
    const u = units[k] ?? { stepsDone: [] };
    units[k] = {
      introducedAt: minStr(u.introducedAt, v.introducedAt),
      practicedAt: minStr(u.practicedAt, v.practicedAt),
      completedAt: minStr(u.completedAt, v.completedAt),
      stepsDone: [...new Set([...u.stepsDone, ...v.stepsDone])],
    };
  }
  const time: Record<string, number> = { ...current.time };
  for (const [d, s] of Object.entries(other.time)) time[d] = Math.max(time[d] ?? 0, s);
  const byTime = <T extends { at: string }>(x: T, y: T) => (x.at < y.at ? -1 : x.at > y.at ? 1 : 0);
  return {
    ...current,
    createdAt: minStr(current.createdAt, other.createdAt) ?? current.createdAt,
    updatedAt: new Date().toISOString(),
    attempts: [...attempts.values()].sort(byTime),
    productions: [...productions.values()].sort(byTime),
    concepts,
    units,
    xp: { ...other.xp, ...current.xp },
    time,
  };
}
