import { useEffect, useState } from 'react';

// Production only: tells the local server "the app is in use" (so updates wait for a break) and
// learns which release the server now has. Never reloads anything by itself.
let lastInteraction = 0;
if (typeof window !== 'undefined') {
  const mark = () => (lastInteraction = Date.now());
  window.addEventListener('pointerdown', mark);
  window.addEventListener('keydown', mark);
}

export function useServerRelease(): string | null {
  const [serverRelease, setServerRelease] = useState<string | null>(null);
  useEffect(() => {
    if (__APP_ENV__ !== 'prod') return;
    const tick = async () => {
      if (document.visibilityState !== 'visible') return;
      const active = Date.now() - lastInteraction < 120_000 ? 1 : 0;
      try {
        const r = await fetch(`./__ping?active=${active}`, { cache: 'no-store' });
        if (r.ok) setServerRelease((await r.json()).releaseId ?? null);
      } catch {
        /* host computer unreachable: keep working with what is loaded */
      }
    };
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return serverRelease;
}
