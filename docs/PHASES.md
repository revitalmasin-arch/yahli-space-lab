# Yahli's Space Lab — phased plan

Each phase ends with `npm run gate`: **guardrails → regression → e2e**, stopping at the first failure.
The next phase is unlocked only by `npm run phase:next` after a passing gate (enforced by the
`ops/hooks/phase-guard.mjs` PreToolUse hook). Live status: `npm run phase:status`.
Each phase is developed on its own git branch (`phase-N-<slug>`) and merged into `main` after its gate passes.

Order changed on 2026-10-16 so Day 1 (17 Oct) is usable tonight: production setup moved before the remaining units.

## Phase 1 — Foundation  (branch: main)
Scope
- Vite + React + TypeScript scaffold; content model (`src/content/types.ts`) with he / heNiqqud / en fields.
- Versioned progress data (`schema-version.json`, schema 1), migrations, per-record sanitizing,
  quarantine of unreadable data, read-only protection for data from a newer schema, merge-based import.
- Storage namespaced by environment (`ysl-dev:` vs `ysl-prod:`); app shell with storage notices.
- Phase-gate tooling: guardrails, gate runner, phase advance/replan, hook; Obsidian backup.

Verification
- Guardrails pass (no service worker, no auto reload, progress never cleared, no secrets, ports separate, env-namespaced storage).
- Regression: schema/migration tests on copied fixture data; storage load/save/quarantine/read-only/import/snapshots.
- E2E: shell loads without errors; malformed storage → app renders + copy kept; newer-schema data → read-only, untouched.

## Phase 2 — Day 1 learning  (branch: phase-2-day1)
Scope
- Unit engine: knowledge check → English explanation + visual → Hebrew bridge (terms, niqqud) →
  tap-only interaction → 3–5 varied checks → help ladder (hint → different explanation with visual → worked example
  + NEW similar question) → Hebrew production (arrange, complete, say-aloud with self/Mum check) → look-back review.
- Units 1 (place in the universe) and 2 (star vs planet) with questions and production tasks.
- Day 1 home: today's mission, units, countdown, simple progress; attempt recording, spaced review, bounded XP.

Verification
- Regression: review scheduling, XP idempotency, evidence rules (assisted ≠ independent, after-solution ≠ recall), date logic.
- E2E: complete unit 2 by tapping only, including a wrong-answer path through all help levels; reload → progress persists; review due.

## Phase 3 — Minimal production for Day 1  (branch: phase-3-prod)
Scope
- Dev: `npm run dev` (port 5180, hot reload, `ysl-dev` storage).
- Candidates: `npm run candidate` builds into `releases/candidates/<id>` after typecheck/tests/smoke; failed builds leave nothing behind.
- Production: `npm run prod:start|stop|status` serves the active release on fixed port 8090 (LAN), no service worker, no auto reload.
- `npm run release:promote -- <id>` / `release:rollback`: explicit only, refuse while Yahli was active recently, check progress-schema compatibility.
- Release version shown discreetly; release Day 1 to production.

Verification
- Guardrails: release tooling present, prod server has no file watching.
- E2E/system: dev edit + candidate build + failed build leave production files and served bytes unchanged;
  progress persists after promote and after a compatible rollback (sandbox releases dir and port, never the real production).

## Phase 4 — Days 2–5  (branch: phase-4-days2-5)
Scope
- Units 3–9 (planet order, groups, asteroid belt/inner-outer, Moon, periodic motion/rotation vs orbit, day/year/month, life).
- Review & reinforcement area, full daily route (Oct 17–22, compressed plan), progress view (science vs Hebrew),
  parent view (summary, errors, support, pending checks, practice questions + rubric, export/import, protected reset),
  read-aloud with stop/replay, niqqud on/off. Each day's units released to production before that study day.

Verification
- Regression: content coverage for all 10 topics; date logic before/on/after exam and at Jerusalem midnight.
- E2E: every unit completes tap-only; viewports 800×1280, 1280×800, 1366×768 without horizontal scroll; parent view renders.

## Phase 5 — Documentation, acceptance, GitHub  (branch: phase-5-docs)
Scope
- Short Hebrew README: desktop/tablet addresses, startup, update procedure, keep-awake, firewall (Private network only).
- Source map and discrepancy notes for the adult; 10–15 minute first-use check with Yahli.
- Create a **private** GitHub repo and push (teacher-guide PDF, node_modules, releases and local state excluded); open the app.

Verification
- Guardrail: Hebrew README present. Full gate re-run; final implemented/tested/deferred summary.
- Repo reachable with `gh repo view`; production app opens at http://localhost:8090.
