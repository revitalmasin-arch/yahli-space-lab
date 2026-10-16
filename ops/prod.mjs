// Production server control: npm run prod:start | prod:stop | prod:status
import { PROD_PORT } from './config.mjs';
import { activityByClient, lanAddresses, minutesSinceActivity, prodPid, prodPing, readState, startProd, stopProd } from './lib.mjs';

const cmd = process.argv[2];
const addresses = () => [`  desktop: http://localhost:${PROD_PORT}`, ...lanAddresses().map((ip) => `  tablet:  http://${ip}:${PROD_PORT}`)].join('\n');

if (cmd === 'start') {
  const { active } = readState();
  if (!active) {
    console.error('No active release yet. Build one with `npm run candidate`, then `npm run release:promote -- <id>`.');
    process.exit(1);
  }
  const running = await prodPing();
  if (running) {
    console.log(`Production is already running release ${running.releaseId}.\n${addresses()}`);
    process.exit(0);
  }
  try {
    await startProd(active);
  } catch (e) {
    console.error(String(e.message ?? e));
    process.exit(1);
  }
  console.log(`Production started: release ${active}\n${addresses()}\nKeep this computer awake while Yahli studies.`);
} else if (cmd === 'stop') {
  console.log((await stopProd()) ? 'Production stopped.' : 'Production was not running (started by this tool).');
} else {
  const s = readState();
  const ping = await prodPing();
  console.log(`Active release:   ${s.active ?? '(none)'}\nPrevious release: ${s.previous ?? '(none)'}`);
  console.log(ping ? `Running:          yes, serving ${ping.releaseId} (pid ${prodPid() ?? '?'})\n${addresses()}` : 'Running:          no');
  if (ping && s.active && ping.releaseId !== s.active) console.log(`NOTE: serving ${ping.releaseId} but the active release is ${s.active}. Restart with prod:stop then prod:start during a break.`);
  const m = minutesSinceActivity();
  console.log(m === null ? 'Last use:         never recorded' : `Last use:         ${m.toFixed(1)} min ago`);
  for (const [ip, a] of Object.entries(activityByClient())) console.log(`  ${ip}: ${a.lastActive}`);
}
