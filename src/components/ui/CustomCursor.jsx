import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, [data-cursor-hover], [role="button"]';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 220, damping: 26, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 220, damping: 26, mass: 0.5 });

  useEffect(() => {
    const noHover = window.matchMedia('(hover: none)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (noHover || coarse || reduced) return;

    setEnabled(true);
    document.documentElement.classList.add('cursor-hidden');

    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      setHovering(!!target.closest(INTERACTIVE_SELECTOR));
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => {
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      document.documentElement.classList.remove('cursor-hidden');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  const ringSize = hovering ? 56 : 28;
  const dotSize = hovering ? 0 : 6;
  const scale = pressed ? 0.85 : 1;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full bg-white mix-blend-difference"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ width: dotSize, height: dotSize, scale }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          scale,
          borderColor: hovering
            ? 'rgba(124, 92, 255, 0.9)'
            : 'rgba(245, 245, 247, 0.35)',
          boxShadow: hovering
            ? '0 0 24px rgba(124, 92, 255, 0.45), inset 0 0 12px rgba(34, 211, 238, 0.25)'
            : '0 0 0 rgba(0,0,0,0)',
        }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
}
