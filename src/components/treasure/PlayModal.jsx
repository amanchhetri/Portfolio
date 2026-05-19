import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useHunt } from './HuntProvider';
import Snake from './Snake';

export default function PlayModal() {
  const { playOpen, setPlayOpen, completed } = useHunt();

  useEffect(() => {
    if (!completed) return;
    const onKey = (e) => {
      if (e.key.toLowerCase() === 'p' && !playOpen) {
        const tag = (e.target?.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        setPlayOpen(true);
      } else if (e.key === 'Escape' && playOpen) {
        setPlayOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [completed, playOpen, setPlayOpen]);

  return (
    <AnimatePresence>
      {playOpen ? (
        <motion.div
          key="play-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-bg/80 px-4 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl border border-white/10 bg-surface/95 p-6 shadow-glow">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                  Easter egg unlocked
                </p>
                <h2 className="font-display text-xl font-semibold text-text">
                  Snake — project edition
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPlayOpen(false)}
                data-cursor-hover
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-text transition-colors hover:bg-white/10">
                ✕
              </button>
            </div>
            <Snake />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
