import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed left-0 right-0 top-[64px] z-30 h-px origin-left bg-gradient-to-r from-accent-from to-accent-to"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
