import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { CURRENT_SCHEMA, merge, migrate, sanitize, type Migration } from '../../src/progress/migrate';
import { xpTotal } from '../../src/progress/model';

// Always work on a copy of the test data, never the fixture object itself.
const fixture = () => JSON.parse(readFileSync(new URL('../fixtures/progress/v1-sample.json', import.meta.url), 'utf8'));

describe('schema versioning', () => {
  it('current schema is 1 and the fixture loads untouched', () => {
    expect(CURRENT_SCHEMA).toBe(1);
    const m = migrate(fixture());
    expect(m.ok && m.migrated).toBe(false);
    const { progress, dropped } = sanitize(m.ok ? m.data : null);
    expect(dropped).toBe(0);
    expect(progress.attempts).toHaveLength(3);
    expect(progress.productions).toHaveLength(2);
  });

  it('refuses data from a newer schema instead of guessing', () => {
    expect(migrate({ ...fixture(), schema: 2 })).toEqual({ ok: false, reason: 'newer', from: 2 });
  });

  it('rejects things that are not progress data', () => {
    expect(migrate({ hello: 1 })).toEqual({ ok: false, reason: 'not-progress' });
    expect(migrate(null)).toEqual({ ok: false, reason: 'not-progress' });
  });

  it('runs a migration chain on copied data without losing records or mutating the input', () => {
    const input = fixture();
    const before = JSON.stringify(input);
    // Example future migration: v1 -> v2 adds a field to every attempt.
    const migrations: Record<number, Migration> = { 1: (d) => ({ ...d, attempts: d.attempts.map((a: any) => ({ ...a, source: 'app' })) }) };
    const m = migrate(input, migrations, 2, 1);
    expect(m.ok).toBe(true);
    if (!m.ok) return;
    expect(m.data.schema).toBe(2);
    expect(m.data.attempts).toHaveLength(input.attempts.length);
    expect(m.data.attempts.every((a: any) => a.source === 'app')).toBe(true);
    expect(m.data.productions).toEqual(input.productions);
    expect(JSON.stringify(input)).toBe(before);
  });

  it('reports a missing migration step rather than skipping it', () => {
    expect(migrate(fixture(), {}, 2, 1)).toEqual({ ok: false, reason: 'too-old', from: 1 });
  });

  it('refuses data older than the minimum readable schema', () => {
    expect(migrate(fixture(), {}, 3, 2)).toEqual({ ok: false, reason: 'too-old', from: 1 });
  });
});

describe('sanitize', () => {
  it('drops only the broken records and keeps the rest', () => {
    const d = fixture();
    d.attempts.push({ id: 'broken' }, 'junk');
    d.xp.bad = -5;
    const { progress, dropped } = sanitize(d);
    expect(dropped).toBe(3);
    expect(progress.attempts.map((a) => a.id)).toEqual(['a1', 'a2', 'a3']);
    expect(progress.xp).toEqual({ 'step:u2:explain': 5, 'unit:u2': 10 });
  });

  it('keeps a learner name (trimmed, max 30) and omits a blank one', () => {
    const d = fixture();
    d.settings.learnerName = '  Yahli  ';
    expect(sanitize(d).progress.settings.learnerName).toBe('Yahli');
    d.settings.learnerName = '   ';
    expect(sanitize(d).progress.settings.learnerName).toBeUndefined();
    d.settings.learnerName = 'x'.repeat(50);
    expect(sanitize(d).progress.settings.learnerName).toHaveLength(30);
  });

  it('turns total garbage into an empty, valid progress object', () => {
    const { progress } = sanitize('nonsense');
    expect(progress.attempts).toEqual([]);
    expect(progress.settings.examDate).toBe('2026-10-22');
  });
});

describe('merge (import / second tab)', () => {
  const base = () => sanitize(fixture()).progress;

  it('is a union: newer local work survives an older backup', () => {
    const local = base();
    local.attempts.push({ ...local.attempts[0], id: 'a-new', at: '2026-10-19T08:00:00.000Z', date: '2026-10-19' });
    const backup = base();
    const merged = merge(local, backup);
    expect(merged.attempts.map((a) => a.id)).toContain('a-new');
    expect(merged.attempts).toHaveLength(4);
  });

  it('merging the same data twice does not duplicate attempts or XP', () => {
    const p = base();
    const once = merge(p, p);
    const twice = merge(once, p);
    expect(twice.attempts).toHaveLength(p.attempts.length);
    expect(xpTotal(twice)).toBe(xpTotal(p));
  });

  it('keeps a parent check recorded in either copy', () => {
    const local = base();
    const other = base();
    other.productions[0] = { ...other.productions[0], result: 'confirmed', checkedAt: '2026-10-18T19:00:00.000Z' };
    expect(merge(local, other).productions.find((r) => r.id === 'p1')?.result).toBe('confirmed');
    expect(merge(other, local).productions.find((r) => r.id === 'p1')?.result).toBe('confirmed');
  });

  it('keeps the more recent review schedule per concept', () => {
    const local = base();
    const other = base();
    other.concepts['c-star'].science = { box: 3, due: '2026-10-22', lastAt: '2026-10-19T06:00:00.000Z' };
    expect(merge(local, other).concepts['c-star'].science?.box).toBe(3);
  });
});
