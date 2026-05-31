import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import Lenis from 'lenis';

const LenisContext = createContext(null);

export function LenisProvider({ children }) {
  const lenisRef = useRef(null);
  const progressRef = useRef(0);
  const listenersRef = useRef(new Set());
  const [enhanced, setEnhanced] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const enhanceMq = window.matchMedia('(min-width: 1024px) and (hover: hover)');
    const cores = navigator.hardwareConcurrency || 8;

    const recalcEnhanced = () =>
      setEnhanced(!reducedMq.matches && enhanceMq.matches && cores >= 4);
    const recalcReduced = () => setReduced(reducedMq.matches);

    recalcReduced();
    recalcEnhanced();

    enhanceMq.addEventListener('change', recalcEnhanced);
    reducedMq.addEventListener('change', recalcReduced);
    reducedMq.addEventListener('change', recalcEnhanced);

    if (reducedMq.matches) {
      return () => {
        enhanceMq.removeEventListener('change', recalcEnhanced);
        reducedMq.removeEventListener('change', recalcReduced);
        reducedMq.removeEventListener('change', recalcEnhanced);
      };
    }

    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ({ progress }) => {
      progressRef.current = progress;
      listenersRef.current.forEach((fn) => fn());
    });

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      enhanceMq.removeEventListener('change', recalcEnhanced);
      reducedMq.removeEventListener('change', recalcReduced);
      reducedMq.removeEventListener('change', recalcEnhanced);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Pause the live Lenis instance if the user enables reduced-motion mid-session.
  // (If reduced-motion was already on at mount, Lenis was never created — the
  // guard below no-ops in that case.)
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (reduced) lenis.stop();
    else lenis.start();
  }, [reduced]);

  return (
    <LenisContext.Provider
      value={{ lenisRef, progressRef, listenersRef, enhanced, reduced }}
    >
      {children}
    </LenisContext.Provider>
  );
}

export function useLenisRaw() {
  const ctx = useContext(LenisContext);
  if (!ctx) throw new Error('useLenisRaw must be used inside <LenisProvider>');
  return ctx.lenisRef.current;
}

export function useLenisProgress() {
  const ctx = useContext(LenisContext);
  if (!ctx) throw new Error('useLenisProgress must be used inside <LenisProvider>');
  const { listenersRef, progressRef } = ctx;
  const subscribe = useCallback(
    (cb) => {
      listenersRef.current.add(cb);
      return () => listenersRef.current.delete(cb);
    },
    [listenersRef],
  );
  return useSyncExternalStore(
    subscribe,
    () => progressRef.current,
    () => 0,
  );
}

export function useEnhanced() {
  const ctx = useContext(LenisContext);
  if (!ctx) throw new Error('useEnhanced must be used inside <LenisProvider>');
  return ctx.enhanced;
}

export function useReducedMotionPref() {
  const ctx = useContext(LenisContext);
  if (!ctx) throw new Error('useReducedMotionPref must be used inside <LenisProvider>');
  return ctx.reduced;
}
