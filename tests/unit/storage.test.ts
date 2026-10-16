import { beforeEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { installStorage, type MemStorage } from './memstorage';
import { checkImport, importMerge, KEYS, load, makeBackup, save, snapshot } from '../../src/progress/storage';

const fixtureText = () => readFileSync(new URL('../fixtures/progress/v2-sample.json', import.meta.url), 'utf8');
const v1Text = () => readFileSync(new URL('../fixtures/progress/v1-sample.json', import.meta.url), 'utf8');
let s: MemStorage;
beforeEach(() => {
  s = installStorage();
});
const keys = (prefix: string) => Object.keys(s).filter((k) => k.startsWith(prefix));

describe('storage namespace', () => {
  it('is separated by environment', () => {
    expect(KEYS.progress).toBe('ysl-dev:progress'); // tests run as the dev build
  });
});

describe('load', () => {
  it('starts fresh when nothing is stored', () => {
    expect(load().status).toBe('new');
  });

  it('round-trips progress through save and load (refresh)', () => {
    s.setItem(KEYS.progress, fixtureText());
    const l = load();
    expect(l.status).toBe('ok');
    l.progress.xp['extra'] = 2;
    expect(save(l.progress, l.readOnly)).toBe(true);
    expect(load().progress.xp['extra']).toBe(2);
  });

  it('v1 data (production today) loads migrated, keeps a pre-migration copy, and saves as v2 with every record', () => {
    s.setItem(KEYS.progress, v1Text());
    const l = load();
    expect(l.status).toBe('migrated');
    expect(s.getItem(KEYS.preMigrationPrefix + 1)).toBe(v1Text());
    expect(l.progress.attempts).toHaveLength(3);
    expect(save(l.progress, l.readOnly)).toBe(true);
    const again = load();
    expect(again.status).toBe('ok');
    expect(again.progress.schema).toBe(2);
    expect(again.progress.attempts).toHaveLength(3);
  });

  it('saved words survive save and reload', () => {
    s.setItem(KEYS.progress, fixtureText());
    const l = load();
    expect(l.progress.words.map((w) => w.glossId ?? w.meaning)).toEqual(['tazpit', 'the pull that keeps planets in orbit']);
  });

  it('quarantines unreadable data instead of deleting it', () => {
    s.setItem(KEYS.progress, '{garbage');
    const l = load();
    expect(l.status).toBe('quarantined');
    expect(l.readOnly).toBe(false);
    const q = keys(KEYS.quarantinePrefix);
    expect(q).toHaveLength(1);
    expect(s.getItem(q[0])).toBe('{garbage');
    save(l.progress, l.readOnly);
    expect(s.getItem(q[0])).toBe('{garbage'); // still preserved after the next save
  });

  it('regression: loading the same unreadable data twice keeps a single copy', () => {
    s.setItem(KEYS.progress, '{garbage');
    load();
    load();
    expect(keys(KEYS.quarantinePrefix)).toHaveLength(1);
  });

  it('keeps a copy when some records had to be repaired', () => {
    const d = JSON.parse(fixtureText());
    d.attempts.push({ id: 'broken' });
    s.setItem(KEYS.progress, JSON.stringify(d));
    const l = load();
    expect(l.status).toBe('repaired');
    expect(l.progress.attempts).toHaveLength(3);
    expect(keys(KEYS.quarantinePrefix)).toHaveLength(1);
  });

  it('opens newer-schema data read-only and never overwrites it', () => {
    const raw = JSON.stringify({ ...JSON.parse(fixtureText()), schema: 9 });
    s.setItem(KEYS.progress, raw);
    const l = load();
    expect(l.status).toBe('newer-schema');
    expect(l.readOnly).toBe(true);
    expect(save(l.progress, l.readOnly)).toBe(false);
    expect(s.getItem(KEYS.progress)).toBe(raw);
  });

  it('refuses to save if another tab wrote a newer schema in the meantime', () => {
    const l = load();
    const raw = JSON.stringify({ schema: 9 });
    s.setItem(KEYS.progress, raw);
    expect(save(l.progress, false)).toBe(false);
    expect(s.getItem(KEYS.progress)).toBe(raw);
  });
});

describe('backup import', () => {
  it('exports and re-imports losslessly', () => {
    s.setItem(KEYS.progress, fixtureText());
    const p = load().progress;
    const c = checkImport(JSON.stringify(makeBackup(p)), p);
    expect(c.ok).toBe(true);
    if (c.ok) expect(c.summary.attempts).toBe(3);
  });

  it('flags when this device has newer activity than the backup, and merge keeps it', () => {
    s.setItem(KEYS.progress, fixtureText());
    const local = load().progress;
    const backup = JSON.stringify(makeBackup(structuredClone(local)));
    local.attempts.push({ ...local.attempts[0], id: 'later', at: '2026-10-20T10:00:00.000Z', date: '2026-10-20' });
    const c = checkImport(backup, local);
    expect(c.ok && c.currentHasNewer).toBe(true);
    if (!c.ok) return;
    const merged = importMerge(local, c.data);
    expect(merged.attempts.some((a) => a.id === 'later')).toBe(true);
    expect(keys(KEYS.snapshotPrefix)).toHaveLength(1); // safety snapshot before import
  });

  it('refuses a backup from a newer schema and non-backups', () => {
    const p = load().progress;
    const b = makeBackup(p);
    expect(checkImport(JSON.stringify({ ...b, data: { ...b.data, schema: 5 } }), p)).toEqual({ ok: false, error: 'newer' });
    expect(checkImport('{"a":1}', p)).toEqual({ ok: false, error: 'not-backup' });
    expect(checkImport('nope', p)).toEqual({ ok: false, error: 'not-json' });
  });

  it('keeps at most three safety snapshots', async () => {
    const p = load().progress;
    for (let i = 0; i < 5; i++) {
      p.xp[`k${i}`] = i; // distinct contents (identical snapshots are deduplicated)
      snapshot(p);
      await new Promise((r) => setTimeout(r, 2)); // distinct timestamps
    }
    expect(keys(KEYS.snapshotPrefix)).toHaveLength(3);
  });
});
