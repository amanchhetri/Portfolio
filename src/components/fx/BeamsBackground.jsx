import { useEffect, useRef } from 'react';
import { cn } from '../../lib/cn';

const LAYERS = 3;
const BEAMS_PER_LAYER = 8;

function createBeam(width, height, layer) {
  const angle = -35 + Math.random() * 10;
  const baseSpeed = 0.2 + layer * 0.2;
  const baseOpacity = 0.05 + layer * 0.04;
  const baseWidth = 10 + layer * 5;
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    width: baseWidth,
    length: height * 2.5,
    angle,
    speed: baseSpeed + Math.random() * 0.2,
    opacity: baseOpacity + Math.random() * 0.08,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.01 + Math.random() * 0.015,
    layer,
    hue: Math.random() < 0.55 ? 'violet' : 'cyan',
  };
}

const HUES = {
  violet: '124, 92, 255',
  cyan: '34, 211, 238',
};

export default function BeamsBackground({ className }) {
  const canvasRef = useRef(null);
  const beamsRef = useRef([]);
  const rafRef = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      beamsRef.current = [];
      for (let layer = 1; layer <= LAYERS; layer++) {
        for (let i = 0; i < BEAMS_PER_LAYER; i++) {
          beamsRef.current.push(createBeam(w, h, layer));
        }
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const drawBeam = (beam, w) => {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);

      const pulsing = Math.min(
        1,
        beam.opacity * (0.7 + Math.sin(beam.pulse) * 0.4),
      );
      const rgb = HUES[beam.hue];
      const grad = ctx.createLinearGradient(0, 0, 0, beam.length);
      grad.addColorStop(0, `rgba(${rgb},0)`);
      grad.addColorStop(0.2, `rgba(${rgb},${pulsing * 0.55})`);
      grad.addColorStop(0.5, `rgba(${rgb},${pulsing})`);
      grad.addColorStop(0.8, `rgba(${rgb},${pulsing * 0.55})`);
      grad.addColorStop(1, `rgba(${rgb},0)`);

      ctx.fillStyle = grad;
      ctx.filter = `blur(${2 + beam.layer * 2}px)`;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      ctx.restore();
    };

    const tick = () => {
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      const beams = beamsRef.current;
      for (let i = 0; i < beams.length; i++) {
        const b = beams[i];
        b.y -= b.speed * (b.layer / LAYERS + 0.5);
        b.pulse += b.pulseSpeed;
        if (b.y + b.length < -50) {
          b.y = h + 50;
          b.x = Math.random() * w;
        }
        drawBeam(b, w);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    if (reduced) {
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      beamsRef.current.forEach((b) => drawBeam(b, w));
    } else {
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 overflow-hidden',
        className,
      )}
      aria-hidden>
      <canvas ref={canvasRef} className="block h-full w-full" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center top, transparent 0%, rgba(5,6,10,0.7) 70%, #05060A 100%)',
        }}
      />
    </div>
  );
}
