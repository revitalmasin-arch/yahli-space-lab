# Yahli's Space Lab — working rules

## Plan before execution
- Unless the request already specifies the exact steps, write a short plan **by phases** before changing anything: for each phase, the steps and how it will be verified.
- The project phases live in `.claude/phases.json`. Check the current one with `npm run phase:status`.

## Phase gate (enforced by a hook)
Every phase ends with `npm run gate`, which runs, in this order, and stops at the first failure:
1. **Guardrails** (`ops/guardrails.mjs`) — run before any test: no service worker, no automatic reloads, progress never cleared, no secrets, no external network calls, dev/prod ports separate, tests never touch the production port, storage namespaced by environment.
2. **Regression** — `tsc --noEmit` and the unit/regression suite (`vitest run`, `tests/unit/`).
3. **E2E** — browser flow tests (`tests/browser/flow.mjs`) against a throwaway server on a test port, never production.

Do not continue to the next phase unless the gate passes. Advance only with `npm run phase:next`, which refuses without a passing gate record.
The PreToolUse hook `ops/hooks/phase-guard.mjs` (registered in `.claude/settings.json`) blocks edits while the previous phase's gate has not passed, and blocks hand-editing `.claude/phases.json` or `.claude/gates/`.

Each phase is developed on its own git branch (`phase-N-<slug>`), created from `main` after the previous phase's gate passes and merged back once its own gate passes. To change the order of future phases, use `npm run phase:replan -- <file.json>` (current and finished phases cannot change).

When a bug is fixed, add a regression test for it in `tests/unit/` (or an e2e step) before closing the phase.

## Backup
After each gate run (pass or fail) and at the end of a work session, back up to Obsidian:
`OBSIDIAN_VAULT="C:/Users/revit/Documents/AI COURSE/MyObsidian" npm run backup:obsidian`
This regenerates the vault folder `yahli-space-lab/`: overview, one note per phase with live gate status, these rules, and a full source snapshot. The phase plan lives in `docs/PHASES.md`.

## Production safety
- Yahli's version (production) is never served from the dev server, and is never promoted or restarted without an explicit request from the parent. See README.md for commands.
- Never clear or overwrite learner progress to resolve an incompatibility; migrate, protect read-only, or ask.
