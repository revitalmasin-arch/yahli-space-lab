// The stages of every unit, in order (the "mission path").
export const STEPS = ['warmup', 'explain', 'terms', 'interact', 'check', 'produce', 'lookback', 'done'] as const;
export type Step = (typeof STEPS)[number];
export const STEP_COUNT = STEPS.length;
