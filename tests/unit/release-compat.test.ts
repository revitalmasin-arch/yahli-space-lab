import { describe, expect, it } from 'vitest';
// @ts-expect-error plain JS ops module
import { canServe } from '../../ops/lib.mjs';

const rel = (id: string, current: number, minReadable = 1) => ({ id, schema: { current, minReadable } });

describe('release compatibility (progress data)', () => {
  it('allows promoting a release with the same or newer data version', () => {
    expect(canServe(rel('B', 1), rel('A', 1)).ok).toBe(true);
    expect(canServe(rel('B', 2, 1), rel('A', 1)).ok).toBe(true);
  });
  it('blocks rolling back to a release that cannot read the newer data', () => {
    const r = canServe(rel('A', 1), rel('B', 2));
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/data version 2/);
  });
  it('blocks promoting a release that dropped support for the current data', () => {
    expect(canServe(rel('C', 3, 3), rel('B', 2)).ok).toBe(false);
  });
  it('first release has nothing to be compatible with', () => {
    expect(canServe(rel('A', 1), null).ok).toBe(true);
  });
});
