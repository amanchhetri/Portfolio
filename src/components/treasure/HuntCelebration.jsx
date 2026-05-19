import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useHunt } from './HuntProvider';

const TOAST_DURATION_MS = 6000;
const COMPLETION_KEY = 'hunt:celebrated';

export default function HuntCelebration() {
  const { completed, setPlayOpen } = useHunt();
  const [show, setShow] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!completed) return;
    if (firedRef.current) return;
    const alreadyCelebrated = (() => {
      try {
        return localStorage.getItem(COMPLETION_KEY) === '1';
      } catch {
        return false;
      }
    })();
    firedRef.current = true;

    if (!alreadyCelebrated) {
      const fire = (origin) =>
        confetti({
          particleCount: 80,
          spread: 90,
          startVelocity: 40,
          scalar: 0.9,
          origin,
          colors: ['#7C5CFF', '#22D3EE', '#F5F5F7', '#FFB454'],
          disableForReducedMotion: true,
        });
      fire({ x: 0.2, y: 0.6 });
      setTimeout(() => fire({ x: 0.8, y: 0.6 }), 180);
      setTimeout(() => fire({ x: 0.5, y: 0.35 }), 360);

      try {
        localStorage.setItem(COMPLETION_KEY, '1');
      } catch {
        // ignore
      }
    }

    setShow(true);
    const t = setTimeout(() => setShow(false), TOAST_DURATION_MS);
    return () => clearTimeout(t);
  }, [completed]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-2xl border border-accent-from/40 bg-bg/95 px-5 py-3 shadow-glow backdrop-blur-md">
            <span aria-hidden className="text-xl">
              🎉
            </span>
            <div className="flex flex-col">
              <p className="font-display text-sm font-semibold text-text">
                You found them all.
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                Press{' '}
                <kbd className="rounded border border-white/20 bg-white/[0.06] px-1.5 py-0.5 text-text">
                  P
                </kbd>{' '}
                to play
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShow(false);
                setPlayOpen(true);
              }}
              data-cursor-hover
              className="ml-2 rounded-full border border-accent-from/60 bg-accent-from/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text transition-colors hover:bg-accent-from/30">
              Play now
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
