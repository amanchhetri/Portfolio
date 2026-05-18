import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

export default function GradientHairline({ className }) {
  return (
    <motion.div
      className={cn(
        'mx-auto h-px w-full max-w-6xl origin-left',
        'bg-gradient-to-r from-transparent via-white/15 to-transparent',
        className,
      )}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.5 }}
    />
  );
}
