import { useSyncExternalStore } from 'react';

// What the helper alien can do right now. The screen in view registers its actions; the alien
// only calls them, so help from the alien is recorded exactly like the on-card help buttons.
export interface QuestionHelp {
  hint: () => void; // help-ladder step 1
  another: () => void; // help-ladder step 2 (different explanation + picture)
  english: () => void; // show the question in English (recorded as English support)
  promptHe: string; // for read-aloud
  canHelp: boolean; // false once solved or at the worked example
}
interface HelperState {
  unit?: string;
  question?: QuestionHelp;
}

let state: HelperState = {};
const listeners = new Set<() => void>();
const set = (next: HelperState) => {
  state = next;
  listeners.forEach((l) => l());
};

export function setHelperUnit(unit: string | undefined) {
  set({ ...state, unit });
}
export function setHelperQuestion(question: QuestionHelp | undefined) {
  set({ ...state, question });
}
export function useHelperState(): HelperState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
  );
}
