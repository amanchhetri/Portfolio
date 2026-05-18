import { motion } from 'framer-motion';
import { fadeUp, slideInX, blurReveal } from '../../utils/motion';

const VARIANTS = {
  up: fadeUp,
  left: (delay, duration) => slideInX('left', delay, duration),
  right: (delay, duration) => slideInX('right', delay, duration),
  blur: blurReveal,
};

export default function Reveal({
  children,
  variant = 'up',
  delay = 0,
  duration = 0.7,
  amount = 0.3,
  once = true,
  className,
  as: Component = 'div',
}) {
  const MotionTag = motion[Component] || motion.div;
  const variants = (VARIANTS[variant] || VARIANTS.up)(delay, duration);

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}>
      {children}
    </MotionTag>
  );
}
