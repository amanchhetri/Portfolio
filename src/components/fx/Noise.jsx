import { cn } from '../../lib/cn';

export default function Noise({ className, opacity = 0.04 }) {
  return (
    <svg
      aria-hidden
      className={cn(
        'pointer-events-none fixed inset-0 -z-10 h-full w-full mix-blend-overlay',
        className,
      )}
      style={{ opacity }}>
      <filter id="portfolio-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#portfolio-noise)" />
    </svg>
  );
}
