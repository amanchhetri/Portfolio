import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function MouseOrb({ size = 480 }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 50, damping: 18, mass: 1 });
  const sy = useSpring(y, { stiffness: 50, damping: 18, mass: 1 });

  useEffect(() => {
    const onMove = (e) => {
      x.set(e.clientX - size / 2);
      y.set(e.clientY - size / 2);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [x, y, size]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 -z-10 rounded-full blur-3xl"
      style={{
        x: sx,
        y: sy,
        width: size,
        height: size,
        background:
          'radial-gradient(circle, rgba(124,92,255,0.18), transparent 60%)',
      }}
    />
  );
}
