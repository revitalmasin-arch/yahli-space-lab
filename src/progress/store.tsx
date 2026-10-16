import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Progress } from './model';
import { KEYS, load, save, type LoadStatus } from './storage';
import { merge, sanitize, migrate } from './migrate';

interface Store {
  progress: Progress;
  status: LoadStatus;
  readOnly: boolean;
  storedSchema?: number;
  update: (fn: (p: Progress) => Progress | void) => void;
  replaceAll: (p: Progress) => void;
}

const Ctx = createContext<Store | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(() => load(), []);
  const [progress, setProgress] = useState<Progress>(initial.progress);
  const [readOnly, setReadOnly] = useState(initial.readOnly);
  const latest = useRef(progress);
  latest.current = progress;
  const timer = useRef<number | undefined>(undefined);

  const flush = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = undefined;
    if (!readOnly && !save(latest.current, false)) {
      // A newer release wrote here (another tab). Stop writing instead of overwriting it.
      if (initial.status !== 'storage-unavailable') setReadOnly(true);
    }
  }, [readOnly, initial.status]);

  const schedule = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(flush, 300);
  }, [flush]);

  const update = useCallback(
    (fn: (p: Progress) => Progress | void) => {
      setProgress((prev) => {
        const draft = structuredClone(prev);
        const next = fn(draft) ?? draft;
        latest.current = next;
        return next;
      });
      schedule();
    },
    [schedule],
  );

  const replaceAll = useCallback(
    (p: Progress) => {
      latest.current = p;
      setProgress(p);
      schedule();
    },
    [schedule],
  );

  useEffect(() => {
    const onHide = () => timer.current !== undefined && flush();
    const onVis = () => document.visibilityState === 'hidden' && onHide();
    // Another tab saved: merge its records in so neither tab's activity is lost.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEYS.progress || !e.newValue) return;
      try {
        const m = migrate(JSON.parse(e.newValue));
        if (!m.ok) {
          if (m.reason === 'newer') setReadOnly(true);
          return;
        }
        const theirs = sanitize(m.data).progress;
        setProgress((prev) => (latest.current = merge(prev, theirs)));
      } catch {
        /* ignore unreadable cross-tab writes */
      }
    };
    window.addEventListener('pagehide', onHide);
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('pagehide', onHide);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('storage', onStorage);
    };
  }, [flush]);

  const value = useMemo<Store>(
    () => ({ progress, status: initial.status, readOnly, storedSchema: initial.storedSchema, update, replaceAll }),
    [progress, readOnly, initial.status, initial.storedSchema, update, replaceAll],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore outside ProgressProvider');
  return s;
}
