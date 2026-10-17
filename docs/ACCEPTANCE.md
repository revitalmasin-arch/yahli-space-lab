# Acceptance summary — Yahli's Space Lab (2026-10-17)

Production release **1.0.0-20261017-110836** (progress data v2), on http://localhost:8090.
Repository: https://github.com/revitalmasin-arch/yahli-space-lab (public, the parent's choice; the plan said private).

## Implemented

**Learning content (book pp.168–190, plus 193–194 and glossary 214–216)**
- 13 units over Days 1–4, Day 5 mixed practice, exam 22 Oct. 30 concepts; every page 168–190 is taught and asked.
- 147 questions (16 warm-up, 61 in-unit checks, 70 spaced review) and 53 Hebrew production tasks (arrange, complete, say, on paper).
- 48 Explore screens, each in English and simplified Hebrew with read-aloud; a memory rhyme per unit.
- Interactive diagrams with real NASA/ESA photos: universe zoom, star vs planet light, planet order and groups,
  asteroid belt, Moon orbit, rotation vs orbit, sky and North Star, telescope, planet table, comets, two models,
  calendar, day/night, Sun's path, clock, life on Earth, **seasons** (tilt and Israel's day length). Drag-and-drop
  everywhere it fits (tap always works too), including a Solar System model builder.
- Help ladder: hint → another explanation with a picture → worked example and a new question.

**Helpers**
- Kip, the helper: offline answers from a 109-word chapter dictionary (Hebrew with/without niqqud, prefixes, English,
  Hebrew typed in Latin letters) and the lesson notes. No AI; nothing leaves the device.
- "My words": save any word (bar in the header, select-to-save, from Kip); vocabulary quiz; the parent explains words
  that are not in the dictionary.

**Progress and parent area**
- Spaced review, honest evidence (help ≠ independent; Hebrew counts only when the parent confirms, on 2 days).
- Mission log with rocket and "Controllers" (science, Hebrew, XP); countdown "how many days to launch".
- Parent area: answers to check, ideas to go over together, Day 5 practice questions with marking guide, My words,
  summary, settings (niqqud, celebrations, exam date), backup export/import (merge, never deletes), start fresh with
  saved copies and restore, image credits, release id.

**Safety and operations**
- Dev (5180, `ysl-dev:`) and production (8090, `ysl-prod:`) fully separate; candidates built, smoke-tested and previewed
  (8091) before an explicit promote; the active and previous release are kept; promote/rollback refuse within 20 minutes
  of use; rollback is compatibility-aware (newer data opens read-only).
- Progress is never cleared: versioned schema with tested migrations, quarantine of unreadable data, pre-migration copies,
  cross-tab merge, newer data never overwritten.
- No service worker, no automatic reloads, no external network calls, no secrets, the teacher-guide PDF never in git.

## Tested (every phase ends with `npm run gate`)

- **Guardrails:** 14 checks (ports, storage namespaces, no reloads/service worker/network/secrets, Hebrew README…).
- **Regression:** `tsc` + 212 unit tests — migration v1→v2 on copied data, storage, learning rules, dates (Jerusalem
  midnight, DST, exam day), page coverage 168–190, content integrity, Hebrew on every screen, dictionary lookup
  (regression "TAZPIT"), My words, start fresh/restore, seasons maths, README commands.
- **E2E:** 30 browser flows on a throwaway server — every unit tap-only, help ladder, drag-and-drop, Kip, My words,
  parent area, dates, no sideways scrolling at 800×1280 / 1280×800 / 1366×768.
- **Release:** 20 checks in a sandbox — build, smoke, isolation from dev, promote guard, update and rollback keep progress.

## Not done / deferred / needs the parent

- **P1 voice tutor** — deferred (needs paid AI; budget ILS 20, not approved). The app never listens to or grades speech.
- **Tablet access** — Windows network must be set to Private and port 8090 opened (README, admin PowerShell).
- **First-use check with Yahli** (10–15 min, README) — to be done by the parent.
- **Hebrew wording** — the simplified Hebrew, dictionary explanations and rhymes are ours (facts from the book);
  a parent read-through of niqqud and phrasing is recommended.
- Pages 191–192 and 195–197 of the chapter are not covered (outside the assigned 168–190).
- Book/science discrepancies are listed in `docs/SOURCES.md`; exam answers follow the book.
