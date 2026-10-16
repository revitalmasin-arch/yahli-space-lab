// The only module that reads/writes progress keys in localStorage.
// Rules: never clear progress; preserve anything unreadable; never write over data from a newer schema.
import { CURRENT_SCHEMA, merge, migrate, sanitize, schemaOf } from './migrate';
import { emptyProgress, latestActivity, type Progress } from './model';

// Dev and production builds use different key namespaces (and different ports, hence origins).
export const NS = `ysl-${__APP_ENV__}`;
export const KEYS = {
  progress: `${NS}:progress`,
  snapshotPrefix: `${NS}:snapshot:`,
  quarantinePrefix: `${NS}:quarantine:`,
  preMigrationPrefix: `${NS}:pre-migration:v`,
};
const MAX_SNAPSHOTS = 3;

export type LoadStatus = 'new' | 'ok' | 'migrated' | 'repaired' | 'quarantined' | 'newer-schema' | 'storage-unavailable';

export interface Loaded {
  progress: Progress;
  status: LoadStatus;
  /** true when saving would destroy data this version cannot understand */
  readOnly: boolean;
  /** the stored schema number, when known */
  storedSchema?: number;
}

function ls(): Storage | null {
  try {
    const s = window.localStorage;
    const probe = `${NS}:probe`;
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

/** Keep a raw copy under its own key. Old snapshots beyond MAX_SNAPSHOTS are pruned; quarantine copies never are. */
function keepCopy(s: Storage, prefix: string, raw: string, prune: boolean) {
  try {
    s.setItem(prefix + stamp(), raw);
  } catch {
    return; // quota: leave the original key untouched instead
  }
  if (!prune) return;
  const keys = Object.keys(s).filter((k) => k.startsWith(prefix)).sort();
  for (const k of keys.slice(0, Math.max(0, keys.length - MAX_SNAPSHOTS))) s.removeItem(k);
}

export function load(): Loaded {
  const s = ls();
  if (!s) return { progress: emptyProgress(), status: 'storage-unavailable', readOnly: true };
  const raw = s.getItem(KEYS.progress);
  if (raw === null) return { progress: emptyProgress(), status: 'new', readOnly: false };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    keepCopy(s, KEYS.quarantinePrefix, raw, false);
    return { progress: emptyProgress(), status: 'quarantined', readOnly: false };
  }
  const storedSchema = schemaOf(parsed);
  const m = migrate(parsed);
  if (!m.ok) {
    if (m.reason === 'newer') {
      // Written by a newer release (e.g. after a rollback). Show it read-only; never overwrite.
      return { progress: sanitize(parsed).progress, status: 'newer-schema', readOnly: true, storedSchema };
    }
    keepCopy(s, KEYS.quarantinePrefix, raw, false);
    return { progress: emptyProgress(), status: 'quarantined', readOnly: false, storedSchema };
  }
  if (m.migrated) s.setItem(KEYS.preMigrationPrefix + m.from, raw);
  const { progress, dropped } = sanitize(m.data);
  if (dropped > 0) keepCopy(s, KEYS.quarantinePrefix, raw, false);
  return { progress, status: m.migrated ? 'migrated' : dropped > 0 ? 'repaired' : 'ok', readOnly: false, storedSchema };
}

/** Returns false when nothing was written (read-only or storage error). */
export function save(p: Progress, readOnly: boolean): boolean {
  if (readOnly) return false;
  const s = ls();
  if (!s) return false;
  // Re-check at write time: another tab running a newer release may have upgraded the data.
  const existing = s.getItem(KEYS.progress);
  if (existing) {
    try {
      const sch = schemaOf(JSON.parse(existing));
      if (sch !== undefined && sch > CURRENT_SCHEMA) return false;
    } catch {
      /* unparseable existing data was quarantined at load */
    }
  }
  try {
    s.setItem(KEYS.progress, JSON.stringify({ ...p, updatedAt: new Date().toISOString() }));
    return true;
  } catch {
    return false;
  }
}

export function snapshot(p: Progress): void {
  const s = ls();
  if (s) keepCopy(s, KEYS.snapshotPrefix, JSON.stringify(p), true);
}

export function quarantinedCopies(): { key: string; size: number }[] {
  const s = ls();
  if (!s) return [];
  return Object.keys(s)
    .filter((k) => k.startsWith(KEYS.quarantinePrefix))
    .sort()
    .map((key) => ({ key, size: (s.getItem(key) ?? '').length }));
}

export function rawItem(key: string): string | null {
  return ls()?.getItem(key) ?? null;
}

// ---- Export / import ----

export interface Backup {
  kind: 'yahli-space-lab-progress';
  schema: number;
  exportedAt: string;
  release: string;
  env: string;
  deviceLabel: string;
  data: Progress;
}

export function makeBackup(p: Progress): Backup {
  return {
    kind: 'yahli-space-lab-progress',
    schema: CURRENT_SCHEMA,
    exportedAt: new Date().toISOString(),
    release: __RELEASE_ID__,
    env: __APP_ENV__,
    deviceLabel: p.settings.deviceLabel,
    data: p,
  };
}

export type ImportCheck =
  | { ok: true; data: Progress; summary: { attempts: number; productions: number; latest?: string }; currentHasNewer: boolean; fromEnv: string; deviceLabel: string }
  | { ok: false; error: 'not-json' | 'not-backup' | 'newer' | 'too-old' };

export function checkImport(text: string, current: Progress): ImportCheck {
  let obj: any;
  try {
    obj = JSON.parse(text);
  } catch {
    return { ok: false, error: 'not-json' };
  }
  if (obj?.kind !== 'yahli-space-lab-progress' || typeof obj.data !== 'object') return { ok: false, error: 'not-backup' };
  const m = migrate(obj.data);
  if (!m.ok) return { ok: false, error: m.reason === 'newer' ? 'newer' : m.reason === 'too-old' ? 'too-old' : 'not-backup' };
  const { progress } = sanitize(m.data);
  const latest = latestActivity(progress);
  const mine = latestActivity(current);
  return {
    ok: true,
    data: progress,
    summary: { attempts: progress.attempts.length, productions: progress.productions.length, latest },
    currentHasNewer: !!mine && (!latest || mine > latest),
    fromEnv: String(obj.env ?? ''),
    deviceLabel: String(obj.deviceLabel ?? ''),
  };
}

/** Merge is the default import: nothing on this device is lost. A snapshot is taken first. */
export function importMerge(current: Progress, incoming: Progress): Progress {
  snapshot(current);
  return merge(current, incoming);
}
