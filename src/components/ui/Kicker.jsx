import { cn } from '../../lib/cn';

export default function Kicker({ number, children, className }) {
  return (
    <span
      className={cn(
        'font-mono text-xs uppercase tracking-[0.25em] text-muted',
        className,
      )}>
      <span className="text-accent-from">// </span>
      {number ? `${number} — ` : null}
      {children}
    </span>
  );
}
