import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GRID = 18;
const CELL = 22;
const CANVAS = GRID * CELL;
const PROJECT_PICKUPS = [
  'leptonmaps',
  'mentorstudents',
  'cryptosky',
  'soundboard',
  'pictureyard',
];
const HIGH_SCORE_KEY = 'hunt:snake:high';

function randomEmpty(snake) {
  while (true) {
    const x = Math.floor(Math.random() * GRID);
    const y = Math.floor(Math.random() * GRID);
    if (!snake.some((s) => s.x === x && s.y === y)) return { x, y };
  }
}

function freshState() {
  const snake = [
    { x: 9, y: 9 },
    { x: 8, y: 9 },
    { x: 7, y: 9 },
  ];
  const food = randomEmpty(snake);
  food.project =
    PROJECT_PICKUPS[Math.floor(Math.random() * PROJECT_PICKUPS.length)];
  return {
    snake,
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food,
    tick: 140,
    dead: false,
  };
}

export default function Snake() {
  const canvasRef = useRef(null);
  const stateRef = useRef(freshState());
  const timerRef = useRef(0);
  const [score, setScore] = useState(0);
  const [dead, setDead] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem(HIGH_SCORE_KEY) || 0);
    } catch {
      return 0;
    }
  });
  const [floater, setFloater] = useState(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#05060A';
    ctx.fillRect(0, 0, CANVAS, CANVAS);

    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    for (let x = 0; x < GRID; x++) {
      for (let y = 0; y < GRID; y++) {
        ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);
      }
    }

    const { snake, food } = stateRef.current;
    snake.forEach((segment, i) => {
      const isHead = i === 0;
      const grad = ctx.createLinearGradient(
        segment.x * CELL,
        segment.y * CELL,
        (segment.x + 1) * CELL,
        (segment.y + 1) * CELL,
      );
      if (isHead) {
        grad.addColorStop(0, '#7C5CFF');
        grad.addColorStop(1, '#22D3EE');
      } else {
        const fade = Math.max(0.25, 1 - i / snake.length);
        grad.addColorStop(0, `rgba(124,92,255,${fade})`);
        grad.addColorStop(1, `rgba(34,211,238,${fade})`);
      }
      ctx.fillStyle = grad;
      const r = 4;
      const x = segment.x * CELL + 2;
      const y = segment.y * CELL + 2;
      const w = CELL - 4;
      const h = CELL - 4;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
      ctx.fill();
    });

    const pulse = 0.7 + Math.sin(Date.now() / 200) * 0.3;
    ctx.fillStyle = `rgba(255,180,84,${pulse})`;
    ctx.shadowBlur = 12;
    ctx.shadowColor = 'rgba(255,180,84,0.6)';
    ctx.beginPath();
    ctx.arc(
      food.x * CELL + CELL / 2,
      food.y * CELL + CELL / 2,
      CELL / 2 - 4,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.shadowBlur = 0;
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (s.dead) return;
    s.dir = s.nextDir;
    const head = s.snake[0];
    const next = { x: head.x + s.dir.x, y: head.y + s.dir.y };

    if (
      next.x < 0 ||
      next.x >= GRID ||
      next.y < 0 ||
      next.y >= GRID ||
      s.snake.some((seg) => seg.x === next.x && seg.y === next.y)
    ) {
      s.dead = true;
      setDead(true);
      setScore((prev) => {
        setHighScore((hi) => {
          if (prev > hi) {
            try {
              localStorage.setItem(HIGH_SCORE_KEY, String(prev));
            } catch {
              // ignore
            }
            return prev;
          }
          return hi;
        });
        return prev;
      });
      draw();
      return;
    }

    s.snake.unshift(next);

    if (next.x === s.food.x && next.y === s.food.y) {
      const eatenProject = s.food.project;
      setScore((v) => v + 1);
      setFloater({ key: Date.now(), text: `+ ${eatenProject}` });
      s.food = randomEmpty(s.snake);
      s.food.project =
        PROJECT_PICKUPS[Math.floor(Math.random() * PROJECT_PICKUPS.length)];
      s.tick = Math.max(70, s.tick * 0.95);
      clearInterval(timerRef.current);
      timerRef.current = setInterval(tick, s.tick);
    } else {
      s.snake.pop();
    }

    draw();
  }, [draw]);

  const reset = useCallback(() => {
    stateRef.current = freshState();
    setScore(0);
    setDead(false);
    setFloater(null);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(tick, stateRef.current.tick);
    draw();
  }, [tick, draw]);

  useEffect(() => {
    draw();
    timerRef.current = setInterval(tick, stateRef.current.tick);

    const onKey = (e) => {
      const key = e.key.toLowerCase();
      const s = stateRef.current;
      const setDir = (x, y) => {
        if (s.dir.x === -x && s.dir.y === -y) return;
        s.nextDir = { x, y };
      };
      if (key === 'arrowup' || key === 'w') {
        setDir(0, -1);
        e.preventDefault();
      } else if (key === 'arrowdown' || key === 's') {
        setDir(0, 1);
        e.preventDefault();
      } else if (key === 'arrowleft' || key === 'a') {
        setDir(-1, 0);
        e.preventDefault();
      } else if (key === 'arrowright' || key === 'd') {
        setDir(1, 0);
        e.preventDefault();
      } else if (key === 'r' && stateRef.current.dead) {
        reset();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      clearInterval(timerRef.current);
    };
  }, [draw, tick, reset]);

  useEffect(() => {
    if (!floater) return;
    const t = setTimeout(() => setFloater(null), 900);
    return () => clearTimeout(t);
  }, [floater]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full items-center justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
        <span>
          Score:{' '}
          <span className="font-semibold text-text">{score}</span>
        </span>
        <span>
          Best:{' '}
          <span className="font-semibold text-accent-from">{highScore}</span>
        </span>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS}
          height={CANVAS}
          className="rounded-xl border border-white/10 shadow-glow"
        />
        <AnimatePresence>
          {floater ? (
            <motion.div
              key={floater.key}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -28 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-accent-from/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-from">
              {floater.text}
            </motion.div>
          ) : null}
        </AnimatePresence>
        <AnimatePresence>
          {dead ? (
            <motion.div
              key="dead"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl bg-bg/85 backdrop-blur-sm">
              <p className="font-display text-2xl font-semibold text-text">
                Game over
              </p>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                You scored {score}
                {score > 0 && score >= highScore ? ' — new best!' : ''}
              </p>
              <button
                type="button"
                onClick={reset}
                data-cursor-hover
                className="rounded-full border border-accent-from/60 bg-accent-from/15 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-text transition-colors hover:bg-accent-from/30">
                Restart (R)
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        Arrow keys / WASD to move · ESC to close · R to restart
      </p>
    </div>
  );
}
