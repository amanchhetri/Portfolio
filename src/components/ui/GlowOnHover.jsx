import { cn } from '../../lib/cn';

export default function GlowOnHover({ children, className, glowClassName }) {
  return (
    <div className={cn('group relative', className)}>
      <div
        className={cn(
          'pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100',
          'bg-gradient-to-br from-accent-from/40 to-accent-to/40',
          glowClassName,
        )}
        aria-hidden
      />
      <div className="relative">{children}</div>
    </div>
  );
}
