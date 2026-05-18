import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

export default function TextShimmer({ children, className }) {
  return (
    <motion.span
      className={cn(
        'bg-[linear-gradient(110deg,#F5F5F7_30%,#7C5CFF_45%,#22D3EE_55%,#F5F5F7_70%)]',
        'bg-[length:200%_100%] bg-clip-text text-transparent',
        className,
      )}
      animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}>
      {children}
    </motion.span>
  );
}
