# Yahli’s Space Lab — Claude Code development prompt

Usage: Open your project folder in Claude Code, add the teacher-guide PDF, and paste the prompt below. Do not paste API keys into chat. This is a development specification; the application has not yet been built or tested.

---

Build a working browser application called “מעבדת החלל של יהלי” (Yahli’s Space Lab). Act as a product engineer and learning designer. Implement the application, rather than stopping at a proposal or mockup. Make routine technical decisions yourself; ask only about genuine blockers. Prioritize a usable learning experience over extra features.

## 1. Learner, outcome, deadline

Yahli is 10, in Israeli Grade 5, and previously studied in Australia. His science exam is in Hebrew on October 22, 2026. The first usable version is needed on October 17, 2026, giving five preparation days, October 17–21. These are the original planning dates: if execution happens later, explicitly request an updated exam date rather than silently scheduling past sessions.

His science knowledge varies by topic. English is his stronger language for understanding explanations and expressing ideas. He can read Hebrew, but unfamiliar vocabulary, complex syntax, and sentences containing several ideas create difficulty. He sometimes believes he understands a word when he does not. Therefore, a voluntary “I don’t understand” button is insufficient. He is willing to attempt spoken Hebrew. Long Hebrew passages and extensive typing discourage him.

Teach the science AND bridge from English understanding to Hebrew exam performance. Simplify language without making the science or visual style babyish. Do not describe him using an unsupported reading-grade diagnosis.

He can study up to two hours daily; this is a ceiling, not a target. His mother can contribute up to one hour daily, together or separately. Default to short 5–10-minute activities and 15–25-minute units, with pauses and resumability. These are adjustable design defaults, not established facts about his attention span.

## 2. Release priorities

### P0: usable learning application for tomorrow

Include all required content, a daily route, interactive explanations, English-to-Hebrew scaffolding, quizzes, Hebrew answer practice, spaced review, progress tracking, and a local parent summary. Core learning must require no API key, paid AI call, live AI grading, or conversational voice agent. Use authored content, questions, hints, and feedback.

Optional P0 read-aloud: test device speech synthesis or available prerecorded audio in Hebrew and English. If a suitable voice is unavailable or pronunciation is poor, show a brief message and keep the activity usable. Never autoplay audio; provide stop/replay and prevent overlapping playback. Do not purchase audio generation without explicit authorization.

### P1: optional conversational voice tutor

Defer implementation until P0 works and has been tried with Yahli. Do not let voice integration delay learning. A separate ChatGPT voice session may later be tested with adult assistance, but must not be a required step or be presented as automatically synchronized with the application.

## 3. Source material and exam scope

Use the supplied PDF: `כיתה-ה-נפלאות-המדע-מדריך-למורה-דיגיטל.pdf`.

This is a teacher guide containing student pages plus teacher notes and answers. Extract the relevant text AND inspect relevant pages visually. Distinguish printed textbook page numbers from PDF page indices. Keep teacher answers separate from learner-facing material. Maintain an internal content-to-source map.

The teacher assigned printed pages 168–190 and the topic list below. The topic list controls required coverage; the textbook controls terminology and expected depth. Do not include every textbook activity merely because it appears within those pages. Actual exam format and accommodations are unknown.

If a listed topic is missing from pages 168–190, locate it elsewhere in the supplied book and document that fact. If a source is missing or contradictory, flag the issue for the adult; use authoritative primary scientific sources for necessary supplementation. Do not invent textbook answers or citations. Write original explanations and activities rather than reproducing whole textbook pages.

Required topics:

1. Our place in the universe: universe, space, galaxy, solar system; Earth within the Solar System, within the Milky Way, within the universe. Do not depict “space” as another nested structure equivalent to a galaxy.
2. Star versus planet: a star produces light; a planet is illuminated by a star. The Sun is a star. Explicitly teach מֵאִיר versus מוּאָר.
3. Terrestrial/rocky planets, giant gaseous planets as grouped in the assigned material, and dwarf planets.
4. Inner versus outer planets and their positions relative to the Sun. Explain how the groups relate without treating “inner” and “rocky” as synonyms.
5. The asteroid belt between Mars and Jupiter.
6. A moon: a natural satellite of a planet, illuminated by reflected sunlight.
7. Periodic/repeating motion.
8. Earth’s orbit around the Sun: approximately 365 days, one year. Earth’s rotation about its axis: approximately 24 hours, one full day/יממה. The Moon’s orbit around Earth: approximately one month, using the school-level approximation.
9. Planet order from the Sun: חמה, נוגה, כדור הארץ, מאדים, צדק, שבתאי, אורנוס, נפטון; connect each to its English name.
10. Conditions enabling life on Earth, aligned with the assigned material.

Accuracy requirements:

- Distinguish rotation from revolution/orbit. Correct imprecise wording rather than teaching “orbiting itself.” Note source discrepancies for the adult.
- Do not require memorization of changing or outdated dwarf-planet/moon counts unless explicitly required and verified. Avoid irrelevant numerical detail.
- If the book groups Uranus and Neptune under gas giants, preserve the expected classroom grouping while noting the modern ice-giant distinction in adult-facing source notes without burdening the child.
- Mark diagrams/animations “not to scale” where appropriate.
- Do not imply Earth’s orbit causes day and night.

## 4. Learning sequence within each unit

1. Brief, nonblocking knowledge check. Familiar material can receive a shorter explanation, but Hebrew practice remains necessary.
2. Introduce a new scientific idea in concise English, supported by a visual.
3. Bridge to Hebrew: introduce 2–4 key terms, their meanings, pronunciation when available, and one simple Hebrew sentence. Present one idea per screen, rather than two long parallel-language paragraphs.
4. Provide a meaningful interaction: choose, sort, sequence, manipulate, play/pause an illustration. Every drag interaction needs a tap/click alternative.
5. Check conceptual understanding before asking for Hebrew production. Use 3–5 varied short questions: multiple choice, matching, true/false with a correction choice, diagram interpretation. Avoid relying on one correct guess or immediate repetition of the same item.
6. If an answer is wrong, simplify the Hebrew wording and offer English support to investigate whether language or science is the obstacle. One error is not a diagnosis. Record question language and support used.
7. Once the idea is understood, practice producing Hebrew: arrange words into a sentence; complete a sentence with reduced scaffolding; attempt a short spoken Hebrew answer without a word bank. Occasionally ask for one handwritten sentence on paper for review with his mother. Do not require paragraph typing.

P0 spoken-answer tasks are “say it aloud” activities, NOT automatically recorded or graded. Reveal an example answer only after the attempt. Allow self-check or “waiting for review with Mum.” Only an explicitly recorded human check can confirm an open-ended answer in P0. Never pretend to hear speech, recognize handwriting, or evaluate an answer the application did not receive. Pending parent review must not block further learning.

## 5. Help ladder, Hebrew support, repetition

Use this help sequence:

1. Small hint and another attempt.
2. Different explanation with a visual.
3. Worked example, followed by a NEW similar question.

The learner may request an explanation sooner. Do not punish help-seeking. Avoid endless retry loops. Give short, specific encouragement about what he did, including successful correction of an error.

Use fully vocalized Hebrew/niqqud in initial explanations and early practice. Later offer unvocalized practice with an accessible option to restore niqqud. Keep key terms available with niqqud and read-aloud where supported. Use prepared, reviewed vocalized text, not live AI generation. Check fonts, line spacing, punctuation, numbers, and mixed RTL Hebrew/LTR English. Do not remove support unexpectedly mid-attempt.

Include review within the unit, after an intervening activity, and on later days. Repeat terms and sentence patterns in varied contexts. Track nextReview, prior attempts, and assistance level. An answer immediately after seeing the solution does not demonstrate independent recall. Difficult topics receive more review without preventing exposure to the remaining syllabus.

Teach reusable Hebrew answer patterns, not only isolated labels: comparison, cause, location, and duration. For example, practice the same concept through “complete the sentence,” “explain why,” and a new example the following day.

Proposed evidence for independent Hebrew performance: a short, understandable, scientifically correct answer containing the required term, without translation or a ready-made sentence, on two separate occasions including a delayed attempt. Perfect grammar is not required. In P0, this evidence must be human-confirmed; otherwise show “not yet checked.”

## 6. Daily route and coverage

Provide a recommended daily route, plus an always-available “Review and reinforcement” area. Initial schedule:

- October 17: place in the universe; star versus planet; producing versus reflecting light.
- October 18: planet order, inner/outer, rocky/giant groups, dwarf planets; review previous material.
- October 19: asteroid belt, moons, periodic motion; introduce rotation versus orbit; review.
- October 20: year/day/month and conditions for life; finish exposure to every required topic.
- October 21: mixed practice across all topics, fresh questions, Hebrew production, and brief paper practice with Mum.
- October 22: optional light review; no new heavy content.

This is a planning default, not a guarantee of mastery. Adjust workload from actual attempts and active study time. Do not defer every difficult topic to the final day. Allow day selection and a compressed plan if starting late, without deleting progress. Calculate dates using Asia/Jerusalem. After the exam, show that the date has passed rather than a negative countdown.

## 7. Interface and motivation

Use an interactive SPACE LAB concept: real, relevant images; manipulable diagrams; short investigation goals. Visuals should teach, not merely decorate. Simple SVG/CSS animations are sufficient; no elaborate 3D engine. Examples: illuminate a rotating Earth, distinguish an orbit from rotation, arrange planet order, locate the asteroid belt.

Use reliable scientific image sources, verify reuse terms, and credit them. Store assets locally when permitted, and provide image-failure fallbacks. Do not depend on arbitrary hotlinked images.

Home screen sections:

- Learning units — יחידות לימוד
- My mission today — המשימה שלי להיום
- Review and reinforcement — חזרה ותגבור
- Days until the exam — עוד כמה ימים למבחן
- My progress — ההתקדמות שלי

Distinguish “introduced,” “practiced,” and “answered independently.”

Separate game XP from learning evidence. Award bounded XP for participation, completion, and correcting errors. No penalties for assistance, no unlimited points from repeating a click, no competitive leaderboard, no stressful countdown timer. Brief celebrations should be optional/mutable.

Progress feedback should make improvement visible without fabricating it:

- Track science understanding separately from Hebrew production.
- For repeated science checks, use fresh questions with comparable difficulty and coverage. Show question count and assistance level.
- For Hebrew open responses in P0, show parent-confirmed independent answers and opportunities, not an invented automatic score.
- Show “Starting to measure” until enough observations exist. A graph may stay flat or decline.
- Do not mix supported success with unaided performance in a single misleading percentage.
- Device-local graphs reflect only that device’s data; state this in the parent view.

Provide a local parent summary: topics studied, recurring errors, support required, pending open-answer checks, and three ready-to-use practice questions with example answers and a concise rubric. Do not send email or messages.

Videos are optional supplements only. Include links only after opening and verifying them; identify language, learning purpose, duration and relevant segment when known. Do not invent URLs, captions, or translations. Open separately and provide a return question. Every required objective must remain learnable without video.

## 8. Technical scope and availability

Choose the simplest stack compatible with the existing project. If starting empty, React + TypeScript + Vite is a reasonable default; P0 does not require a backend, database, or paid service. Avoid unnecessary dependencies.

Separate educational content from UI code. Use structured units, concepts, he/heNiqqud/en fields, source references, questions, distractors, explanations, hint levels, topic tags, difficulty, and review metadata.

Support Chrome on desktop and an Android tablet, portrait and landscape. Use touch targets around 44px or larger, no hover-only controls, and alternatives to dragging. Dedicated phone optimization is not required. Check representative 800×1280, 1280×800, and 1366×768 viewports. No installation, login, or registration.

Store versioned progress in localStorage, recover after refresh, and handle invalid stored data gracefully. Separate progress per device is an accepted simplification. Recommend a primary device; allow direct access to every unit on the second device. Protect reset from accidental taps. A simple JSON export/import backup is useful if inexpensive to implement, but not a mandatory workflow or automatic synchronization.

The mother’s computer stays on. Serve P0 from that computer; the Android tablet connects on the same Wi-Fi. Provide a single start command, appropriate network binding, a connection check, and focused firewall instructions without disabling security globally. Explain preventing sleep. Keep the same origin/port across launches to retain browser-local progress.

Do not impose HTTPS solely for P0, which has no microphone capture; test read-aloud on the actual devices. A future microphone feature needs a secure context on the tablet: ordinary LAN HTTP must not be presented as sufficient. Do not create a public tunnel or external deployment without the owner choosing that option.

## 9. Future voice tutor: specification only

Do not implement by default in P0. Preserve a clean extension point for push-to-talk questions in English or Hebrew and short spoken replies. Introduce new concepts in English, then bridge to and practice Hebrew. Supply current unit/question context. Give hints before solutions and request clarification when speech recognition is uncertain. Never mark a scientific answer wrong solely because transcription is unclear.

Whether off-syllabus curiosity questions should be allowed is still unresolved: propose a policy to the adult before activation; do not claim one was approved.

Before activation, test with Yahli, verify bilingual recognition/pronunciation, current official prices, and service terms/age requirements for the intended supervised use. Do not assume a ChatGPT or Claude subscription pays for API use; do not require the child to create an independent account.

Approved total AI budget: ILS 20 across the whole preparation period INCLUDING development tests. This is a ceiling, not an allowance to spend immediately. Spend nothing in P0. Before P1 spending, show an estimate using the selected models, transcription/synthesis/conversation approach, expected usage, and a dated currency-conversion assumption. Do not promise a price per minute without documented assumptions.

P1 requires protected server-side keys, rate limits, persistent aggregate usage accounting across BOTH devices and restarts, conservative remaining-budget checks, a reserve, and bounded worst-case cost per request. Provider budget alerts are not a guaranteed hard spending cap. Refuse new paid requests if remaining budget cannot be verified. Core learning must continue after voice is disabled. Never put secrets in client code, source control, or logs. Do not retain audio by default.

## 10. Execution and acceptance

Inspect the project and PDF first. Briefly report implementation order, source mapping, and unresolved content issues. Continue without seeking approval for routine reversible engineering choices.

Build one complete vertical slice for “star versus planet”: English explanation, Hebrew bridge, interaction, conceptual check, help ladder, Hebrew production, persistence, and review. Test it, provide an early runnable version, then complete ALL required topics. Do not stop with one demo unit or placeholder content.

Run meaningful acceptance checks:

- Every required topic maps to an explanation, activity, comprehension check, and Hebrew production task.
- English comprehension with Hebrew difficulty permits science progression while scheduling Hebrew review, without false mastery.
- Hint levels work; no dead-end loops; assisted answers are recorded correctly.
- Delayed review is scheduled and uses varied wording; manual review remains available.
- P0 spoken/written tasks explicitly require self/human checking; there is no fake recording or AI assessment.
- Persistence survives refresh; malformed storage does not crash the application; XP and measurements are not fabricated or double-counted.
- Date behavior works before, on, and after the exam, including Jerusalem day boundaries.
- Niqqud, unvocalized Hebrew, English, numbers, and diagrams display correctly without clipping; tap-only use works.
- Core learning works without API or read-aloud. Losing external internet does not prevent locally served learning with local assets while the host computer remains reachable. Do not claim operation without the host computer.
- Run a build and browser flow checks. If no physical tablet is available, state that limitation and provide a short real-device check rather than claiming hardware testing.

Deliver working code, structured content, source/discrepancy notes, a short Hebrew README for desktop/tablet startup and troubleshooting, and a clear implemented/tested/deferred summary.

Include a 10–15-minute first-use check with Yahli: can he navigate independently, where does he need adult help, does read-aloud help, and can he explain one idea in Hebrew? Adjust from observation. Completing activities alone must never be presented as proof of exam readiness.
