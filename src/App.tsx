import { useEffect, useRef, useState } from 'react';
import { StorageNotice } from './components/StorageNotice';
import { t } from './lib/hebrew';
import { jerusalemDate } from './lib/dates';
import { stopSpeaking } from './lib/speech';
import { useStore } from './progress/store';
import { Home } from './screens/Home';
import { UnitPlayer } from './screens/UnitPlayer';
import { Review } from './screens/Review';
import { Parent } from './screens/Parent';
import { useServerRelease } from './lib/ping';
import { Logo } from './visuals/Icons';
import { NameTab } from './components/NameTab';

const TITLE = t('My Space Lab', 'מַעְבֶּדֶת הֶחָלָל שֶׁלִּי');
type Screen = { name: 'home' } | { name: 'unit'; id: string } | { name: 'review' } | { name: 'parent' };

/** Count active study time: visible tab and an interaction in the last 90 seconds. */
function useActiveTime() {
  const { update, readOnly } = useStore();
  const last = useRef(Date.now());
  useEffect(() => {
    const mark = () => (last.current = Date.now());
    window.addEventListener('pointerdown', mark);
    window.addEventListener('keydown', mark);
    const id = window.setInterval(() => {
      if (readOnly || document.visibilityState !== 'visible' || Date.now() - last.current > 90_000) return;
      update((p) => {
        const d = jerusalemDate();
        p.time[d] = (p.time[d] ?? 0) + 30;
      });
    }, 30_000);
    return () => {
      window.removeEventListener('pointerdown', mark);
      window.removeEventListener('keydown', mark);
      window.clearInterval(id);
    };
  }, [update, readOnly]);
}

export function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' });
  useActiveTime();
  const serverRelease = useServerRelease();
  const go = (s: Screen) => {
    stopSpeaking();
    setScreen(s);
    window.scrollTo({ top: 0 });
  };
  const home = () => go({ name: 'home' });
  return (
    <div className="app">
      {__APP_ENV__ === 'dev' && <div className="dev-badge">DEV — not Yahli's version</div>}
      <header className="top">
        <Logo />
        <h1 lang="he" dir="rtl">{TITLE.heN}</h1>
        <p className="en" lang="en" dir="ltr">{TITLE.en}</p>
        <NameTab />
      </header>
      <StorageNotice />
      <main id="main">
        {screen.name === 'home' && <Home onUnit={(id) => go({ name: 'unit', id })} onReview={() => go({ name: 'review' })} onParent={() => go({ name: 'parent' })} />}
        {screen.name === 'unit' && <UnitPlayer key={screen.id} unitId={screen.id} onExit={home} />}
        {screen.name === 'review' && <Review onExit={home} />}
        {screen.name === 'parent' && <Parent onExit={home} serverRelease={serverRelease} />}
      </main>
    </div>
  );
}
