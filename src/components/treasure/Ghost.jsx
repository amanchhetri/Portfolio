import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useHunt } from './HuntProvider';
import { cn } from '../../lib/cn';

export default function Ghost({ id, className }) {
  const { found, markFound, hydrated } = useHunt();
  const buttonRef = useRef(null);
  const [poofing, setPoofing] = useState(false);

  if (!hydrated) return null;
  const already = found.has(id);
  if (already && !poofing) return null;

  const onClick = () => {
    if (already || poofing) return;
    setPoofing(true);

    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      confetti({
        particleCount: 24,
        spread: 60,
        startVelocity: 22,
        scalar: 0.7,
        ticks: 80,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        colors: ['#7C5CFF', '#22D3EE', '#F5F5F7'],
        disableForReducedMotion: true,
      });
    }

    markFound(id);
    setTimeout(() => setPoofing(false), 420);
  };

  return (
    <AnimatePresence>
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={onClick}
        aria-label={`Hidden ghost ${id}`}
        data-cursor-hover
        initial={{ opacity: 0, scale: 0.6 }}
        animate={
          poofing
            ? { opacity: 0, scale: 1.8, rotate: 8 }
            : { opacity: 0.18, scale: 1 }
        }
        whileHover={poofing ? undefined : { opacity: 0.85, scale: 1.15 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'pointer-events-auto inline-flex h-6 w-6 items-center justify-center text-text/80 transition-colors hover:text-accent-from',
          className,
        )}>
        <svg
          viewBox="0 0 24 28"
          fill="currentColor"
          className="h-full w-full drop-shadow-[0_0_6px_rgba(124,92,255,0.45)]">
          <path d="M12 1 C6 1 3 6 3 12 L3 26 L5.5 24 L8 26 L10.5 24 L13 26 L15.5 24 L18 26 L20.5 24 L21 12 C21 6 18 1 12 1 Z" />
          <circle cx="9" cy="11" r="1.6" fill="#05060A" />
          <circle cx="15" cy="11" r="1.6" fill="#05060A" />
        </svg>
      </motion.button>
    </AnimatePresence>
  );
}
