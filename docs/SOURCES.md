# Sources and discrepancy notes (for the adult)

Textbook: **נפלאות המדע, כיתה ה — מדריך למורה** (teacher guide PDF). In the space chapter the printed page
number equals the PDF page index. Teacher answers printed in the guide are never shown to the learner;
explanations and questions in the app are original wording.

Rule (CLAUDE.md): every fact comes from the book (page cited) or a reliable scientific source (cited).
The page-coverage test (`tests/unit/coverage.test.ts`) checks that every page 168–190 is taught and asked.

## Where each unit comes from

| Unit | Book pages | Outside sources |
|---|---|---|
| 1 Our place in the universe | 171–173, 175, 183 | — |
| 2 Star or planet | 174, 183, glossary 214 | — |
| 3 Planet order | 175, 178–179, 182 | — |
| 4 Rocky, gas giants, dwarf | 175, 179–180, 182–183 | — |
| 5 Asteroid belt; inner/outer | 175–176 | "inner/outer" is from the teacher's topic list (NASA uses the same grouping); the book does not use these words |
| 6 The Moon | 179, 193–194, glossary 215 | pp.193–194 are outside 168–190 (the topic list requires the Moon) |
| 7 Periodic motion; rotation vs orbit | 185, 188–190 | — |
| 8 Year, month, calendar | 184–187, 193–194 | — |
| 9 Life on Earth | 173, 178–179 | — |
| 10 Looking at the sky | 168–171 | NASA: Galileo discovered Jupiter's four largest moons (1610) |
| 11 Fact files and a model | 176–180 | NASA: Venus's thick CO₂ atmosphere makes it hotter than Mercury; farther planets also move more slowly (Kepler's laws); relative planet sizes in the model |
| 12 Comets, meteors, two models | 175, 181–182 | NASA: comets as "cosmic snowballs" of frozen gas, rock and dust |
| 13 Day and night, sunrise, time | 188–190 | — |

## Discrepancies (the app follows the book for exam answers, and says so where it matters)

1. **Hubble launch year** — book p.171 says 1989; NASA: launched April 1990. The app does not ask the year.
2. **"Distance → colder" (p.180)** — Venus is hotter than Mercury despite being farther (book p.178 data: Venus ~450°C, Mercury's lit side 427°C). The app teaches the book's rule *and* the Venus exception (NASA). In the book's table Neptune (−213°C) is also listed slightly warmer than Uranus (−215°C); the app does not ask about this.
3. **Orbit time explanation (p.180)** — the book gives only "the path is longer"; the app adds "and it moves more slowly" (NASA, Kepler's laws).
4. **Dwarf planets (p.180)** — the book lists Charon as a dwarf planet; Charon is Pluto's moon (IAU/NASA). The app uses only Pluto, Ceres and Eris.
5. **Moon counts (p.179)** — e.g. Saturn "82 moons"; current counts are higher and keep changing. The app never asks moon counts.
6. **Uranus and Neptune** — the book groups them with the gas giants (as does the app, for the exam); scientists often call them "ice giants".
7. **"Space is empty" (p.173, glossary)** — the book also says there is gas and dust between stars (p.172). The app says space is the *almost* empty room between bodies.
8. **Meteorites (p.181)** — the book calls the rock in space a "meteorite"; scientists call it a *meteoroid* until it lands. The app follows the book's words.
9. **Month length (p.193)** — 29½ days is the time from new moon to new moon (the synodic month); one orbit relative to the stars is ~27.3 days. The app uses the book's 29½.
10. **Year length** — the book says 365¼ days and does not mention leap years (February 29); the app does not either.

## Added 2026-10-17 (Kip's dictionary, simplified Hebrew, new questions, seasons, rhymes)

- **Chapter dictionary** (`src/content/glossary.ts`, ~100 words) — every meaning is from pp.168–190 or the book's glossary pp.214–216; each entry names its pages. Simple Hebrew wording is ours.
- **Simplified Hebrew for every Explore screen** (`src/content/explain-he.ts`) — same facts as the English text beside it.
- **New questions** (`src/content/questions-extra.ts`) — observation (p.170), the telescope's first use (pp.169, 171), observatory (p.171), Stonehenge (p.168), dark-sky observing (p.170), dwarf planets (p.180), Earth's air (p.178), the human orbit model (pp.185–186), what a calendar is for (p.184), day length and tilt (p.189).
- **Seasons diagram** — the book (p.189) says the axis is tilted; the angle 23.4° and Israel's latitude (~31.8° N) are from NASA / standard geography. The day/night split is computed from them (≈14 h light on 21 June, ≈10 h on 21 December in Israel), matching published sunrise/sunset times for Jerusalem.
- **Memory rhymes** (`src/content/songs.ts`) — written for the lab; they only repeat facts the unit already teaches. The English planet mnemonic ("My Very Educated Mother Just Served Us Noodles") is a common memory aid, not a fact.

## Images

Real photos are from Wikimedia Commons with licenses checked by `ops/fetch-images.mjs`
(mostly NASA public domain; Moon CC BY-SA 3.0 G. H. Revera; Mars CC BY-SA 3.0 IGO ESA/MPS; Milky Way CC BY 4.0 ESO/S. Brunier).
Full credits: `src/content/image-credits.json` and the parent area in the app.
