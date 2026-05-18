import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

export default function AuroraBeams({ className }) {
  return (
    <div
      className={cn(
        'absolute inset-0 -z-10 overflow-hidden',
        className,
      )}
      aria-hidden>
      <motion.div
        className="absolute -top-1/4 -left-1/4 h-[60vh] w-[60vw] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(124,92,255,0.35), transparent 70%)',
        }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 h-[55vh] w-[55vw] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(34,211,238,0.28), transparent 70%)',
        }}
        animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-1/3 top-1/4 h-[40vh] w-[40vw] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(124,92,255,0.18), transparent 70%)',
        }}
        animate={{ x: [0, 80, 0], y: [0, -60, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
