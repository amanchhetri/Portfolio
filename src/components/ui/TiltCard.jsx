import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function TiltCard({
  children,
  className,
  max = 8,
  scale = 1.02,
}) {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smx = useSpring(mx, { stiffness: 200, damping: 20 });
  const smy = useSpring(my, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(smy, [0, 1], [max, -max]);
  const rotateY = useTransform(smx, [0, 1], [-max, max]);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      whileHover={{ scale }}
      transition={{ scale: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
      className={className}>
      {children}
    </motion.div>
  );
}
