import { describe, expect, it } from 'vitest';
import { dayShare } from '../../src/visuals/Seasons';

// The seasons diagram computes Israel's daylight from Earth's tilt (book p.189). Real values for
// Jerusalem: about 14 h 12 min on 21 June, about 10 h 04 min on 21 December, about 12 h at the equinoxes.
describe('seasons diagram: Israel day length', () => {
  it('about 14 hours of light in June, 10 in December, 12 in March/September', () => {
    expect(Math.round(dayShare((23.4 * Math.PI) / 180) * 24)).toBe(14);
    expect(Math.round(dayShare((-23.4 * Math.PI) / 180) * 24)).toBe(10);
    expect(dayShare(0) * 24).toBeCloseTo(12, 5);
  });
});
