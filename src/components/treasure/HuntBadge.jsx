import { AnimatePresence, motion } from 'framer-motion';
import { useHunt } from './HuntProvider';

export default function HuntBadge() {
  const { count, total, completed, setPlayOpen, hydrated } = useHunt();
  if (!hydrated || count === 0) return null;

  return (
    <AnimatePresence>
      <motion.button
        key="badge"
        type="button"
        onClick={() => completed && setPlayOpen(true)}
        aria-label={
          completed
            ? 'Open mini-game'
            : `Treasure hunt progress: ${count} of ${total} found`
        }
        data-cursor-hover
        initial={{ opacity: 0, y: -8, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.9 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed right-4 top-20 z-50 flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] backdrop-blur-md transition-colors sm:right-8 ${
          completed
            ? 'cursor-pointer border-accent-from/60 bg-accent-from/10 text-text hover:bg-accent-from/20'
            : 'border-white/10 bg-bg/70 text-muted'
        }`}>
        <span aria-hidden className="text-base leading-none">
          {completed ? '🎮' : '👻'}
        </span>
        <span>
          {count}/{total}
        </span>
        {completed ? (
          <span className="ml-1 hidden font-semibold text-accent-from sm:inline">
            press P
          </span>
        ) : null}
      </motion.button>
    </AnimatePresence>
  );
}
