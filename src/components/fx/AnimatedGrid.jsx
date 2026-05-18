import { cn } from '../../lib/cn';

export default function AnimatedGrid({ className, fade = true }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-0 overflow-hidden',
        className,
      )}
      aria-hidden>
      <div
        className="absolute inset-0 animate-grid-drift opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {fade ? (
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 0%, #05060A 80%)',
          }}
        />
      ) : null}
    </div>
  );
}
