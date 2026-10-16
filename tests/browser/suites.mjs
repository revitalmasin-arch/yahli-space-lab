// E2E suites by phase. A suite runs in its own phase's gate and in every later gate (regression).
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};
const KEY = 'ysl-dev:progress';

async function setStored(page, url, value) {
  await page.goto(url);
  await page.evaluate(([k, v]) => localStorage.setItem(k, v), [KEY, value]);
  await page.reload();
}

const stored = (page) => page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? 'null'), KEY);
const visible = async (loc) => (await loc.count()) > 0 && (await loc.first().isVisible());

/**
 * Walks a unit by tapping only, using the dev-only data-* answer hints.
 * opts.wrongFor: question id to answer wrongly until the worked example appears.
 * opts.helpFor: question id where the learner taps "Help me" twice before answering.
 * Returns which help levels were seen.
 */
async function driveUnit(page, opts = {}) {
  const seen = new Set();
  const q = page.locator('section[data-testid^="question-"]');
  for (let i = 0; i < 200; i++) {
    await page.waitForTimeout(30);
    if (await visible(page.getByTestId('unit-done'))) return seen;
    for (const h of ['help-1', 'help-2', 'help-3']) if (await visible(page.getByTestId(h))) seen.add(h);
    if (await visible(page.getByTestId('help-3'))) { await page.getByRole('button', { name: /Try a new question/ }).click(); continue; }
    if (await visible(page.getByTestId('solved'))) { await page.getByTestId('solved').getByRole('button', { name: /Next/ }).click(); continue; }

    if (await visible(q)) {
      const qid = (await q.first().getAttribute('data-testid')).replace('question-', '');
      if (opts.helpFor === qid && (opts.helpTaps ?? 0) < 2) { opts.helpTaps = (opts.helpTaps ?? 0) + 1; await page.getByTestId('ask-help').click(); continue; }
      const wrong = q.locator('button[data-ok="false"]:not([disabled])');
      if (opts.wrongFor === qid && (await wrong.count())) { await wrong.first().click(); continue; }
      const right = q.locator('button[data-ok="true"]:not([disabled])');
      if (await right.count()) { await right.first().click(); continue; }
      const leftBtn = q.locator('.grid > .stack:first-child button[data-pair]:not([disabled])');
      if (await leftBtn.count()) {
        const pair = await leftBtn.first().getAttribute('data-pair');
        await leftBtn.first().click();
        await q.locator(`.grid > .stack:nth-child(2) button[data-pair="${pair}"]`).click();
        continue;
      }
    }
    const inter = page.locator('section[data-testid^="interaction-"]');
    if (await visible(inter)) {
      const card = inter.locator('button[data-bin]');
      if (await card.count()) {
        const bin = await card.first().getAttribute('data-bin');
        await card.first().click();
        await page.getByTestId(`bin-${bin}`).click();
        continue;
      }
      const seq = inter.locator('button[data-pos]');
      if (await seq.count()) {
        const positions = await seq.evaluateAll((els) => els.map((e) => Number(e.dataset.pos)));
        await inter.locator(`button[data-pos="${Math.min(...positions)}"]`).click();
        continue;
      }
    }
    const prod = page.locator('section[data-testid^="production-"]');
    if (await visible(prod)) {
      const chips = prod.locator('.word-bank button[data-pos]');
      if (await chips.count()) {
        const positions = await chips.evaluateAll((els) => els.map((e) => Number(e.dataset.pos)));
        await prod.locator(`.word-bank button[data-pos="${Math.min(...positions)}"]`).click();
        continue;
      }
      const okWord = prod.locator('button[data-ok="true"]');
      if (await okWord.count()) { await okWord.click(); continue; }
      const said = prod.getByRole('button', { name: /I said it|I wrote it/ });
      if (await visible(said)) { await said.click(); continue; }
      const later = prod.getByRole('button', { name: /Check with Mum later/ });
      if (await visible(later)) { await later.click(); continue; }
    }
    const primary = page.locator('main button.primary:not([disabled])');
    if (await visible(primary)) { await primary.last().click(); continue; }
    throw new Error(`driver stuck at iteration ${i}`);
  }
  throw new Error('unit did not finish');
}

/** Answer/advance until the given stage is showing. */
async function driveUntil(page, testid) {
  for (let i = 0; i < 40; i++) {
    if (await visible(page.getByTestId(testid))) return;
    if (await visible(page.getByTestId('solved'))) { await page.getByTestId('solved').getByRole('button', { name: /Next/ }).click(); continue; }
    const right = page.locator('section[data-testid^="question-"] button[data-ok="true"]:not([disabled])');
    if (await right.count()) { await right.first().click(); continue; }
    await page.waitForTimeout(50);
  }
  throw new Error(`never reached ${testid}`);
}

export const suites = [
  {
    phase: 1,
    tests: {
      'app shell loads with Hebrew title and dev badge': async ({ page, url }) => {
        await page.goto(url);
        await page.getByRole('heading', { level: 1 }).waitFor();
        const h1 = await page.getByRole('heading', { level: 1 }).textContent();
        assert(h1?.includes('מַעְבֶּדֶת'), `unexpected title: ${h1}`);
        assert(await page.getByText("DEV — not Yahli's version").isVisible(), 'dev badge missing');
        assert(/My Space Lab/.test(await page.locator('header').textContent()), 'English title missing');
      },
      'malformed stored progress: app still renders and a copy is kept': async ({ page, url }) => {
        await setStored(page, url, '{garbage');
        await page.getByTestId('notice-quarantine').waitFor();
        const copies = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('ysl-dev:quarantine:')).map((k) => localStorage.getItem(k)));
        assert(copies.length === 1 && copies[0] === '{garbage', `quarantine copy missing: ${JSON.stringify(copies)}`);
      },
      'progress from a newer schema is shown read-only and never overwritten': async ({ page, url }) => {
        const raw = JSON.stringify({ schema: 9, attempts: [], productions: [], concepts: {}, units: {}, xp: {}, time: {}, settings: {} });
        await setStored(page, url, raw);
        await page.getByTestId('notice-readonly').waitFor();
        await page.waitForTimeout(800); // longer than the save debounce
        assert((await page.evaluate((k) => localStorage.getItem(k), KEY)) === raw, 'newer-schema data was modified');
      },
    },
  },
  {
    phase: 2,
    tests: {
      'Day 1 home: countdown, mission with units 1-2, later units marked coming soon': async ({ page, url }) => {
        await page.goto(url);
        await page.getByTestId('countdown').waitFor();
        const mission = page.getByTestId('mission');
        assert(await mission.getByTestId('open-u1').isEnabled(), 'unit 1 not available');
        assert(await mission.getByTestId('open-u2').isEnabled(), 'unit 2 not available');
        // Units without written content are disabled and say so; ready ones are enabled.
        for (const b of await page.locator('button[data-testid^="open-u"]').all()) {
          const txt = await b.textContent();
          assert((await b.isDisabled()) === /coming soon/.test(txt), `inconsistent unit button: ${txt}`);
        }
      },
      'unit 2 tap-only with wrong answers through every help level; assistance recorded honestly': async ({ page, url }) => {
        await page.goto(url);
        await page.getByTestId('mission').getByTestId('open-u2').click();
        const seen = await driveUnit(page, { wrongFor: 'u2-q2', helpFor: 'u2-q7' });
        for (const h of ['help-1', 'help-2', 'help-3']) assert(seen.has(h), `${h} never shown`);
        await page.waitForTimeout(500); // save debounce
        const p = await stored(page);
        const q2 = p.attempts.find((a) => a.qid === 'u2-q2');
        assert(q2 && q2.assistance === 3 && !q2.finalCorrect && !q2.correctFirstTry, `u2-q2 wrongly recorded: ${JSON.stringify(q2)}`);
        const sibling = p.attempts.find((a) => a.afterWorked);
        assert(sibling && sibling.concept === 'c-star' && sibling.qid !== 'u2-q2', 'no NEW similar question after the worked example');
        const q7 = p.attempts.find((a) => a.qid === 'u2-q7');
        assert(q7 && q7.assistance === 2 && q7.finalCorrect && !q7.correctFirstTry, `u2-q7 help not recorded: ${JSON.stringify(q7)}`);
        assert(p.productions.some((r) => r.taskId === 'u2-p4' && r.result === 'pending' && !r.withBank), 'spoken answer not left for Mum');
        assert(p.units.u2.stepsDone.includes('done'), 'unit not marked done');
        assert(p.concepts['c-star'].science.box === 0, 'struggled concept should come back tomorrow');
      },
      'progress survives reload; review is available; Mum confirms a spoken answer': async ({ page, url }) => {
        await page.goto(url);
        await page.getByTestId('mission').getByTestId('open-u2').click();
        await driveUnit(page);
        await page.waitForTimeout(500);
        await page.reload();
        const tag = await page.getByTestId('mission').getByTestId('open-u2').textContent();
        assert(/practised/.test(tag), `status after reload: ${tag}`);
        await page.getByTestId('start-review').click();
        await page.locator('section[data-testid^="question-"]').first().waitFor();
        await page.getByRole('button', { name: /Home/ }).click();
        await page.getByTestId('open-parent').click();
        await page.getByTestId('pending-u2-p4').getByRole('button', { name: /Understandable and correct/ }).click();
        await page.waitForTimeout(500);
        const p = await stored(page);
        assert(p.productions.find((r) => r.taskId === 'u2-p4').result === 'confirmed', 'parent check not saved');
      },
      'unit 1 completes tap-only': async ({ page, url }) => {
        await page.goto(url);
        await page.getByTestId('mission').getByTestId('open-u1').click();
        await driveUnit(page);
      },
    },
  },
  {
    phase: 4,
    tests: {
      'Day 2: unit 3 (planet order) completes tap-only; tapping a planet shows its names': async ({ page, url }) => {
        await page.goto(url);
        await page.getByTestId('open-u3').last().click();
        await page.getByRole('button', { name: /Skip/ }).click(); // straight to the explanation
        await page.locator('g[aria-label="3. Earth"] circle').last().click();
        const info = await page.getByRole('status').first().textContent();
        assert(/Earth/.test(info) && /כַּדּוּר הָאָרֶץ/.test(info), `planet info: ${info}`);
        await driveUnit(page);
      },
      'Day 2: unit 4 (groups, dwarf planets) completes tap-only, with a wrong-answer path': async ({ page, url }) => {
        await page.goto(url);
        await page.getByTestId('open-u4').last().click();
        const seen = await driveUnit(page, { wrongFor: 'u4-q2' });
        assert(seen.has('help-1'), 'hint not shown after a wrong answer');
        await page.waitForTimeout(500);
        const p = await stored(page);
        assert(p.productions.some((r) => r.taskId === 'u4-p1' && r.result === 'correct'), 'arrange task with repeated word not accepted');
      },
      'name tab: the learner name is saved, greeted, and kept after reload': async ({ page, url }) => {
        await page.goto(url);
        await page.getByTestId('name-tab').click();
        await page.getByTestId('name-input').fill('Yahli');
        await page.getByTestId('name-save').click();
        await page.waitForTimeout(500);
        await page.reload();
        assert(/Yahli/.test(await page.getByTestId('name-tab').textContent()), 'name not shown after reload');
        assert(/Yahli/.test(await page.getByTestId('greeting').textContent()), 'no greeting');
      },
      'go back a stage and start a part over; earlier answers are kept': async ({ page, url }) => {
        await page.goto(url);
        await page.getByTestId('open-u2').last().click();
        // answer the warm-ups, reach the explanation
        await driveUntil(page, 'explain');
        await page.waitForTimeout(500); // save debounce
        const before = (await stored(page)).attempts.length;
        await page.getByTestId('stage-back').click();
        assert(await page.locator('section[data-testid^="question-"]').isVisible(), 'back did not return to the warm-up');
        await page.getByTestId('stop-explain').click(); // jump forward to a stage already reached
        await page.getByRole('button', { name: /Next →/ }).click();
        await page.getByTestId('stage-restart').click(); // explanation starts again from screen 1
        assert(/\(1\/3\)/.test(await page.getByRole('button', { name: /Next →/ }).textContent()), 'restart did not go back to the first screen');
        assert(await page.getByTestId('stop-check').isDisabled(), 'skipping ahead to an unreached stage should be blocked');
        await page.waitForTimeout(400);
        assert((await stored(page)).attempts.length === before, 'going back must not delete answers');
      },
      'Kip the helper: a hint from Kip shows on the card and is recorded as help': async ({ page, url }) => {
        await page.goto(url);
        await page.getByTestId('open-u2').last().click();
        await page.getByTestId('helper-open').click();
        await page.getByTestId('helper-hint').click();
        await page.getByTestId('help-1').waitFor();
        await page.getByTestId('helper-open').click(); // close Kip
        await page.locator('section[data-testid^="question-"] button[data-ok="true"]').first().click();
        await page.getByTestId('solved').getByRole('button', { name: /Next/ }).click();
        await page.waitForTimeout(500);
        const a = (await stored(page)).attempts[0];
        assert(a && a.assistance >= 1 && !a.correctFirstTry && a.finalCorrect, `help from Kip not recorded: ${JSON.stringify(a)}`);
      },
      'Kip the helper: lists the words of the current unit': async ({ page, url }) => {
        await page.goto(url);
        await page.getByTestId('open-u2').last().click();
        await page.getByTestId('helper-open').click();
        await page.getByTestId('helper-words').click();
        assert(/מוּאָר/.test(await page.getByRole('dialog').textContent()), 'unit words missing');
      },
      'Mission log: opens on tablet width, rocket climbs, unit completion launches (not when celebrations are off)': async ({ page, url }) => {
        await page.setViewportSize({ width: 800, height: 1280 });
        await page.goto(url);
        await page.getByTestId('log-toggle').click();
        assert(/0 \/ 16/.test(await page.getByTestId('rocket-gauge').textContent()), 'gauge should start at 0 / 16');
        assert(await page.getByTestId('starting-to-measure').isVisible(), 'should say starting to measure');
        await page.getByTestId('open-u1').last().click();
        await driveUnit(page);
        assert(await page.getByTestId('rocket-launch').isVisible(), 'no launch on unit completion');
        await page.getByRole('button', { name: /Back home/ }).click();
        assert(/8 \/ 16/.test(await page.getByTestId('rocket-gauge').textContent()), `gauge after unit 1: ${await page.getByTestId('rocket-gauge').textContent()}`);
        await page.getByTestId('open-parent').click();
        await page.getByLabel('Short celebrations').uncheck();
        await page.getByRole('button', { name: /← Back/ }).first().click();
        await page.getByTestId('open-u2').last().click();
        await driveUnit(page);
        assert((await page.getByTestId('rocket-launch').count()) === 0, 'launch shown although celebrations are off');
        await page.getByRole('button', { name: /Back home/ }).click();
        await page.getByTestId('mission-complete').waitFor();
      },
      'Day 3: unit 5 (asteroid belt, inner/outer) completes tap-only': async ({ page, url }) => {
        await page.goto(url);
        await page.getByTestId('open-u5').last().click();
        await driveUnit(page, { wrongFor: 'u5-q5' });
      },
      'Day 3: unit 6 (the Moon) completes tap-only; the Moon animation plays and pauses': async ({ page, url }) => {
        await page.goto(url);
        await page.getByTestId('open-u6').last().click();
        await page.getByRole('button', { name: /Skip/ }).click();
        await page.getByRole('button', { name: /Play/ }).click();
        await page.waitForTimeout(400);
        await page.getByRole('button', { name: /Pause/ }).click();
        await driveUnit(page);
      },
      'Day 3: unit 7: spinning and orbiting are separate motions; unit completes tap-only': async ({ page, url }) => {
        await page.goto(url);
        await page.getByTestId('open-u7').last().click();
        await page.getByRole('button', { name: /Skip/ }).click();
        await page.getByRole('button', { name: /Next/ }).click(); // to the rotation/orbit screen
        await page.getByRole('button', { name: /Spin/ }).click();
        await page.waitForTimeout(3400);
        await page.getByRole('button', { name: /Spin/ }).click();
        const status = await page.locator('p[role="status"]').filter({ hasText: 'Spins' }).textContent();
        const [spins, orbits] = [...status.matchAll(/(\d+)/g)].map((m) => Number(m[1]));
        assert(spins >= 2 && orbits === 0, `spin-only should not orbit: ${status}`);
        await driveUnit(page);
      },
    },
  },
];
