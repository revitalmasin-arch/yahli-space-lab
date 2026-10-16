import type { Tx } from '../content/types';

// Hebrew points and cantillation marks (U+0591–U+05C7), excluding maqaf (U+05BE) and sof pasuq (U+05C3).
const NIQQUD = /[\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7]/g;

export function stripNiqqud(s: string): string {
  return s.replace(NIQQUD, '');
}

/** Build a Tx from English and vocalized Hebrew. Pass `he` only when the unvocalized
 *  spelling is not just the vocalized one without points (e.g. לַוְיָן → לוויין). */
export function t(en: string, heN: string, he?: string): Tx {
  return { en, heN, he: he ?? stripNiqqud(heN) };
}

export function heText(x: Tx, niqqud: boolean): string {
  return niqqud ? x.heN : x.he;
}
