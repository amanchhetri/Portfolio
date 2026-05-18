# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing light-theme portfolio's visuals, layout, and motion with a dark "Quiet Cinematic" redesign — preserving 100% of copy and project data — using React + Vite + Tailwind + Framer Motion + 21st.dev MCP components.

**Architecture:** Single-page React app. Section components compose layout + content. Reusable motion wrappers (`src/components/ui/`) handle reveal/magnetic/tilt/glow. Background visuals (`src/components/fx/`) handle animated grid, aurora beams, mouse orb, noise. `constants/index.js` data is preserved verbatim. Lenis provides smooth scroll.

**Tech Stack:** React 18, Vite 4, Tailwind 3, Framer Motion 10, Lenis, JetBrains Mono / Inter / Space Grotesk (Google Fonts), 21st.dev MCP for premium backgrounds + marquee.

**Testing strategy:** This is a visual redesign with no existing test setup. Verification is **manual visual + behavioral checks at `http://localhost:5173`** at each task's checkpoint. The dev server is started once and stays running; HMR reflects changes immediately. Where motion behavior is non-trivial (magnetic, tilt, scroll progress), the checkpoint enumerates the exact interaction to perform.

**Spec reference:** `docs/superpowers/specs/2026-05-18-portfolio-redesign-design.md`

---

## File map

**Create:**
- `src/lib/cn.js`
- `src/components/ui/Reveal.jsx`
- `src/components/ui/Magnetic.jsx`
- `src/components/ui/TiltCard.jsx`
- `src/components/ui/GlowOnHover.jsx`
- `src/components/ui/TextShimmer.jsx`
- `src/components/ui/GradientHairline.jsx`
- `src/components/ui/ScrollProgress.jsx`
- `src/components/ui/Kicker.jsx`
- `src/components/fx/AnimatedGrid.jsx`
- `src/components/fx/AuroraBeams.jsx`
- `src/components/fx/MouseOrb.jsx`
- `src/components/fx/Noise.jsx`
- `src/components/Skills.jsx` (replaces `Tech.jsx`)
- `src/components/Footer.jsx`
- `src/components/icons/Socials.jsx` (inline SVG socials: GitHub, LinkedIn, LeetCode, Mail)

**Modify:**
- `package.json` (deps)
- `tailwind.config.cjs`
- `src/index.css`
- `src/styles.js`
- `src/utils/motion.js`
- `src/App.jsx`
- `src/components/Navbar.jsx`
- `src/components/Hero.jsx`
- `src/components/About.jsx`
- `src/components/Projects.jsx`
- `src/components/Experience.jsx`
- `src/components/Contact.jsx`
- `src/components/index.js` (barrel)
- `src/hoc/SectionWrapper.jsx`

**Delete (cleanup at end):**
- `src/components/Tech.jsx`
- `src/components/canvas/` (whole folder — Ball + Loader 3D)
- `src/components/Loader.jsx` (if only used by 3D)
- `src/fonts/` (whole folder — custom display fonts no longer used)
- `src/assets/backgrounds/` (bw-map, nairobi, white-abstract, world-map — no longer used)
- `src/assets/personal/shaq.png` (hero portrait removed)
- `src/assets/icons/{download,downloadHover,pineapple,pineappleHover,send,sendHover,resume}.png`

---

## Phase 0 — Foundation

### Task 0.1: Swap dependencies

**Files:**
- Modify: `D:/Code/Portfolio/package.json`

- [ ] **Step 1: Remove obsolete packages**

Run:
```
npm --prefix D:/Code/Portfolio uninstall @react-three/drei @react-three/fiber three maath react-vertical-timeline-component react-tilt react-router-dom @emailjs/browser use
```

Expected: deps removed from `package.json` and `node_modules`.

- [ ] **Step 2: Add new packages**

Run:
```
npm --prefix D:/Code/Portfolio install lenis clsx tailwind-merge
```

Expected: three packages added under `dependencies`.

- [ ] **Step 3: Verify build still parses**

The dev server (running in background as task `byn40mroo`) will hot-reload. Refresh `http://localhost:5173`. Expected: build errors in the terminal because `App.jsx` still imports `BrowserRouter` and `Tech` still imports `BallCanvas`. That's expected — we'll fix in later tasks. Confirm Vite is still serving (not crashed).

- [ ] **Step 4: Commit**

```
git -C D:/Code/Portfolio add package.json package-lock.json
git -C D:/Code/Portfolio commit -m "chore: swap deps for redesign — drop three.js/timeline/router/emailjs, add lenis/clsx/tailwind-merge"
```

---

### Task 0.2: Replace Tailwind config

**Files:**
- Modify: `D:/Code/Portfolio/tailwind.config.cjs`

- [ ] **Step 1: Replace entire file contents with the new dark-theme config**

Replace the entire file with:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#05060A',
        surface: '#0B0D14',
        text: '#F5F5F7',
        muted: '#A1A1AA',
        accent: {
          from: '#7C5CFF',
          to: '#22D3EE',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #7C5CFF 0%, #22D3EE 100%)',
        'radial-fade':
          'radial-gradient(ellipse at top, rgba(124,92,255,0.18), transparent 60%)',
      },
      boxShadow: {
        glow: '0 0 60px -10px rgba(124, 92, 255, 0.45)',
        'glow-cyan': '0 0 60px -10px rgba(34, 211, 238, 0.4)',
      },
      screens: {
        xs: '450px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'marquee-reverse': 'marquee-reverse 40s linear infinite',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        'grid-drift': 'grid-drift 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
        'grid-drift': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: Verify dev server reloads without Tailwind crash**

Open the terminal output for task `byn40mroo`. Expected: no Tailwind parse errors. Page may look broken due to old class names — that's fine for now.

- [ ] **Step 3: Commit**

```
git -C D:/Code/Portfolio add tailwind.config.cjs
git -C D:/Code/Portfolio commit -m "feat(theme): swap tailwind config to dark cinematic palette + new fonts/keyframes"
```

---

### Task 0.3: Rewrite `index.css`

**Files:**
- Modify: `D:/Code/Portfolio/src/index.css`

- [ ] **Step 1: Replace entire file contents**

Replace `src/index.css` with:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

html,
body {
  background: #05060A;
  color: #F5F5F7;
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

@layer utilities {
  .glass {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .text-gradient {
    background: linear-gradient(135deg, #7C5CFF 0%, #22D3EE 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }

  .border-gradient {
    position: relative;
    isolation: isolate;
  }

  .border-gradient::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 1px;
    border-radius: inherit;
    background: linear-gradient(135deg, rgba(124, 92, 255, 0.6), rgba(34, 211, 238, 0.6));
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    z-index: -1;
  }
}

::selection {
  background: rgba(124, 92, 255, 0.35);
  color: #F5F5F7;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #05060A;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.16);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Verify**

Refresh `http://localhost:5173`. Expected: page is dark (`#05060A` bg), text white. Old components still render with broken styling — that's expected.

- [ ] **Step 3: Commit**

```
git -C D:/Code/Portfolio add src/index.css
git -C D:/Code/Portfolio commit -m "feat(style): rewrite index.css with new fonts, glass/gradient utilities, dark base"
```

---

### Task 0.4: Add `cn()` helper

**Files:**
- Create: `D:/Code/Portfolio/src/lib/cn.js`

- [ ] **Step 1: Create directory and file**

Create `src/lib/cn.js`:

```js
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Commit**

```
git -C D:/Code/Portfolio add src/lib/cn.js
git -C D:/Code/Portfolio commit -m "feat(lib): add cn() class-merging helper"
```

---

### Task 0.5: Rewrite `utils/motion.js`

**Files:**
- Modify: `D:/Code/Portfolio/src/utils/motion.js`

- [ ] **Step 1: Replace entire file contents**

Replace `src/utils/motion.js` with:

```js
export const EASE = [0.22, 1, 0.36, 1];

export const fadeUp = (delay = 0, duration = 0.7) => ({
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration, delay, ease: EASE },
  },
});

export const fadeIn = (delay = 0, duration = 0.7) => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration, delay, ease: EASE } },
});

export const slideInX = (direction = 'left', delay = 0, duration = 0.7) => ({
  hidden: { opacity: 0, x: direction === 'left' ? -40 : 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration, delay, ease: EASE },
  },
});

export const stagger = (staggerChildren = 0.06, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});

export const blurReveal = (delay = 0, duration = 0.9) => ({
  hidden: { opacity: 0, y: 16, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration, delay, ease: EASE },
  },
});
```

- [ ] **Step 2: Commit**

```
git -C D:/Code/Portfolio add src/utils/motion.js
git -C D:/Code/Portfolio commit -m "feat(motion): replace variants library with new fadeUp/blurReveal/stagger"
```

---

## Phase 1 — Reusable UI / motion wrappers

### Task 1.1: `Reveal` wrapper

**Files:**
- Create: `D:/Code/Portfolio/src/components/ui/Reveal.jsx`

- [ ] **Step 1: Create the component**

```jsx
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
```

- [ ] **Step 2: Commit**

```
git -C D:/Code/Portfolio add src/components/ui/Reveal.jsx
git -C D:/Code/Portfolio commit -m "feat(ui): add Reveal scroll-fade wrapper"
```

---

### Task 1.2: `Magnetic` wrapper

**Files:**
- Create: `D:/Code/Portfolio/src/components/ui/Magnetic.jsx`

- [ ] **Step 1: Create the component**

```jsx
import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Magnetic({
  children,
  strength = 0.35,
  radius = 120,
  className,
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < radius) {
      x.set(dx * strength);
      y.set(dy * strength);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: sx, y: sy }}
      className={className}>
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```
git -C D:/Code/Portfolio add src/components/ui/Magnetic.jsx
git -C D:/Code/Portfolio commit -m "feat(ui): add Magnetic mouse-attract wrapper"
```

---

### Task 1.3: `TiltCard` wrapper

**Files:**
- Create: `D:/Code/Portfolio/src/components/ui/TiltCard.jsx`

- [ ] **Step 1: Create the component**

```jsx
import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function TiltCard({
  children,
  className,
  max = 8,
  scale = 1.02,
}) {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smx = useSpring(mx, { stiffness: 200, damping: 20 });
  const smy = useSpring(my, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(smy, [0, 1], [max, -max]);
  const rotateY = useTransform(smx, [0, 1], [-max, max]);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      whileHover={{ scale }}
      transition={{ scale: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
      className={className}>
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```
git -C D:/Code/Portfolio add src/components/ui/TiltCard.jsx
git -C D:/Code/Portfolio commit -m "feat(ui): add TiltCard 3D mouse-tilt wrapper"
```

---

### Task 1.4: `GlowOnHover` wrapper

**Files:**
- Create: `D:/Code/Portfolio/src/components/ui/GlowOnHover.jsx`

- [ ] **Step 1: Create the component**

```jsx
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
```

- [ ] **Step 2: Commit**

```
git -C D:/Code/Portfolio add src/components/ui/GlowOnHover.jsx
git -C D:/Code/Portfolio commit -m "feat(ui): add GlowOnHover wrapper"
```

---

### Task 1.5: `TextShimmer`

**Files:**
- Create: `D:/Code/Portfolio/src/components/ui/TextShimmer.jsx`

- [ ] **Step 1: Create the component**

```jsx
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
```

- [ ] **Step 2: Commit**

```
git -C D:/Code/Portfolio add src/components/ui/TextShimmer.jsx
git -C D:/Code/Portfolio commit -m "feat(ui): add TextShimmer animated gradient text"
```

---

### Task 1.6: `GradientHairline`

**Files:**
- Create: `D:/Code/Portfolio/src/components/ui/GradientHairline.jsx`

- [ ] **Step 1: Create the component**

```jsx
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
```

- [ ] **Step 2: Commit**

```
git -C D:/Code/Portfolio add src/components/ui/GradientHairline.jsx
git -C D:/Code/Portfolio commit -m "feat(ui): add GradientHairline section divider"
```

---

### Task 1.7: `ScrollProgress`

**Files:**
- Create: `D:/Code/Portfolio/src/components/ui/ScrollProgress.jsx`

- [ ] **Step 1: Create the component**

```jsx
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed left-0 right-0 top-[64px] z-30 h-px origin-left bg-gradient-to-r from-accent-from to-accent-to"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
```

- [ ] **Step 2: Commit**

```
git -C D:/Code/Portfolio add src/components/ui/ScrollProgress.jsx
git -C D:/Code/Portfolio commit -m "feat(ui): add ScrollProgress top bar"
```

---

### Task 1.8: `Kicker`

**Files:**
- Create: `D:/Code/Portfolio/src/components/ui/Kicker.jsx`

- [ ] **Step 1: Create the component**

```jsx
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
```

- [ ] **Step 2: Commit**

```
git -C D:/Code/Portfolio add src/components/ui/Kicker.jsx
git -C D:/Code/Portfolio commit -m "feat(ui): add Kicker mono label"
```

---

## Phase 2 — Background fx

### Task 2.1: `AnimatedGrid`

**Files:**
- Create: `D:/Code/Portfolio/src/components/fx/AnimatedGrid.jsx`

- [ ] **Step 1: Try 21st.dev MCP first**

Call the MCP tool `mcp__magic__21st_magic_component_inspiration` with query `"animated dotted grid background dark"`. If a good match returns, use `mcp__magic__21st_magic_component_builder` to fetch the implementation into this file. Otherwise fall back to the inline implementation in Step 2.

- [ ] **Step 2: Fallback inline implementation**

Use this if 21st.dev did not provide a suitable component:

```jsx
import { cn } from '../../lib/cn';

export default function AnimatedGrid({ className, fade = true }) {
  return (
    <div
      className={cn(
        'absolute inset-0 -z-10 overflow-hidden',
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
```

- [ ] **Step 3: Commit**

```
git -C D:/Code/Portfolio add src/components/fx/AnimatedGrid.jsx
git -C D:/Code/Portfolio commit -m "feat(fx): add AnimatedGrid background"
```

---

### Task 2.2: `AuroraBeams`

**Files:**
- Create: `D:/Code/Portfolio/src/components/fx/AuroraBeams.jsx`

- [ ] **Step 1: Try 21st.dev MCP first**

Call `mcp__magic__21st_magic_component_inspiration` with query `"aurora light beams hero background"`. If suitable, integrate via `mcp__magic__21st_magic_component_builder`. Otherwise use Step 2.

- [ ] **Step 2: Fallback inline implementation**

```jsx
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
```

- [ ] **Step 3: Commit**

```
git -C D:/Code/Portfolio add src/components/fx/AuroraBeams.jsx
git -C D:/Code/Portfolio commit -m "feat(fx): add AuroraBeams background"
```

---

### Task 2.3: `MouseOrb`

**Files:**
- Create: `D:/Code/Portfolio/src/components/fx/MouseOrb.jsx`

- [ ] **Step 1: Create the component**

```jsx
import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function MouseOrb({ size = 480 }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 50, damping: 18, mass: 1 });
  const sy = useSpring(y, { stiffness: 50, damping: 18, mass: 1 });

  useEffect(() => {
    const onMove = (e) => {
      x.set(e.clientX - size / 2);
      y.set(e.clientY - size / 2);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [x, y, size]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 -z-10 rounded-full blur-3xl"
      style={{
        x: sx,
        y: sy,
        width: size,
        height: size,
        background:
          'radial-gradient(circle, rgba(124,92,255,0.18), transparent 60%)',
      }}
    />
  );
}
```

- [ ] **Step 2: Commit**

```
git -C D:/Code/Portfolio add src/components/fx/MouseOrb.jsx
git -C D:/Code/Portfolio commit -m "feat(fx): add MouseOrb cursor-tracking blob"
```

---

### Task 2.4: `Noise`

**Files:**
- Create: `D:/Code/Portfolio/src/components/fx/Noise.jsx`

- [ ] **Step 1: Create the component**

```jsx
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
```

- [ ] **Step 2: Commit**

```
git -C D:/Code/Portfolio add src/components/fx/Noise.jsx
git -C D:/Code/Portfolio commit -m "feat(fx): add Noise SVG grain overlay"
```

---

## Phase 3 — Sections

### Task 3.1: Replace `styles.js`

**Files:**
- Modify: `D:/Code/Portfolio/src/styles.js`

- [ ] **Step 1: Replace entire file**

```js
export const styles = {
  section: 'relative w-full py-32 sm:py-40 px-6 sm:px-10 lg:px-12',
  inner: 'mx-auto max-w-6xl',
  heading:
    'font-display text-[clamp(2rem,5vw,4rem)] font-semibold tracking-tight text-text',
  heroHeading:
    'font-display text-[clamp(2.75rem,8vw,7rem)] font-bold leading-[0.95] tracking-tight text-text uppercase',
  heroSub:
    'font-sans text-[clamp(1rem,1.6vw,1.25rem)] leading-relaxed text-muted',
  body: 'font-sans text-base leading-[1.75] text-muted',
  paddingX: 'px-6 sm:px-10 lg:px-12',
};
```

- [ ] **Step 2: Commit**

```
git -C D:/Code/Portfolio add src/styles.js
git -C D:/Code/Portfolio commit -m "feat(style): rewrite shared styles object"
```

---

### Task 3.2: Replace `SectionWrapper`

**Files:**
- Modify: `D:/Code/Portfolio/src/hoc/SectionWrapper.jsx`

- [ ] **Step 1: Replace entire file**

```jsx
import { motion } from 'framer-motion';
import { stagger } from '../utils/motion';
import { styles } from '../styles';
import { cn } from '../lib/cn';

const SectionWrapper = (Component, idName, sectionClassName) => {
  function HOC() {
    return (
      <motion.section
        id={idName}
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className={cn(styles.section, sectionClassName)}>
        <div className={styles.inner}>
          <Component />
        </div>
      </motion.section>
    );
  }
  return HOC;
};

export default SectionWrapper;
```

- [ ] **Step 2: Commit**

```
git -C D:/Code/Portfolio add src/hoc/SectionWrapper.jsx
git -C D:/Code/Portfolio commit -m "feat(hoc): rewrite SectionWrapper with new styles + once-only reveal"
```

---

### Task 3.3: Socials icon component

**Files:**
- Create: `D:/Code/Portfolio/src/components/icons/Socials.jsx`

- [ ] **Step 1: Create the file with inline SVGs**

```jsx
const base = 'h-5 w-5 fill-current';

export const GitHubIcon = (props) => (
  <svg viewBox="0 0 24 24" className={base} aria-hidden {...props}>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.18c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.26 5.69.41.36.78 1.06.78 2.13v3.16c0 .31.21.68.8.56C20.21 21.39 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
  </svg>
);

export const LinkedInIcon = (props) => (
  <svg viewBox="0 0 24 24" className={base} aria-hidden {...props}>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.62 0 4.29 2.38 4.29 5.47v6.27zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .78 0 1.74v20.51C0 23.21.79 24 1.77 24h20.45c.98 0 1.78-.79 1.78-1.75V1.74C24 .78 23.2 0 22.22 0z"/>
  </svg>
);

export const LeetCodeIcon = (props) => (
  <svg viewBox="0 0 24 24" className={base} aria-hidden {...props}>
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
  </svg>
);

export const MailIcon = (props) => (
  <svg viewBox="0 0 24 24" className={base} aria-hidden {...props}>
    <path d="M1.5 4.5h21A1.5 1.5 0 0 1 24 6v12a1.5 1.5 0 0 1-1.5 1.5h-21A1.5 1.5 0 0 1 0 18V6a1.5 1.5 0 0 1 1.5-1.5zm.75 1.93v.32l9.75 6.5 9.75-6.5v-.32H2.25zm19.5 1.85-9.34 6.23a.75.75 0 0 1-.82 0L2.25 8.28V18h19.5V8.28z"/>
  </svg>
);

export const SOCIALS = [
  { name: 'GitHub', href: 'https://github.com/amanchhetri', Icon: GitHubIcon },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/aman-chhetri/', Icon: LinkedInIcon },
  { name: 'LeetCode', href: 'https://leetcode.com/u/gattiflab/', Icon: LeetCodeIcon },
  { name: 'Email', href: 'mailto:gattiflab@gmail.com', Icon: MailIcon },
];
```

- [ ] **Step 2: Commit**

```
git -C D:/Code/Portfolio add src/components/icons/Socials.jsx
git -C D:/Code/Portfolio commit -m "feat(icons): add inline social SVG icons + SOCIALS list"
```

---

### Task 3.4: Rewrite `Navbar`

**Files:**
- Modify: `D:/Code/Portfolio/src/components/Navbar.jsx`

- [ ] **Step 1: Replace entire file**

```jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks } from '../constants';
import { cn } from '../lib/cn';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-colors duration-500',
        scrolled
          ? 'border-b border-white/5 bg-bg/70 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}>
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-10 lg:px-12">
        <a
          href="#top"
          className="font-mono text-sm tracking-[0.3em] text-text transition-colors hover:text-transparent hover:bg-clip-text hover:bg-accent-gradient">
          AC
        </a>

        <ul className="hidden items-center gap-10 sm:flex">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className="group relative font-mono text-xs uppercase tracking-[0.25em] text-muted transition-colors hover:text-text">
                {link.title}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent-gradient transition-transform duration-500 ease-out group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="sm:hidden">
          <div className="flex flex-col gap-1.5">
            <span
              className={cn(
                'block h-px w-6 bg-text transition-transform duration-300',
                open && 'translate-y-[6px] rotate-45',
              )}
            />
            <span
              className={cn(
                'block h-px w-6 bg-text transition-opacity duration-300',
                open && 'opacity-0',
              )}
            />
            <span
              className={cn(
                'block h-px w-6 bg-text transition-transform duration-300',
                open && '-translate-y-[6px] -rotate-45',
              )}
            />
          </div>
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-16 z-30 bg-bg/95 backdrop-blur-xl sm:hidden">
            <ul className="flex h-full flex-col items-start justify-center gap-8 px-10">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1, duration: 0.4 }}>
                  <a
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    className="font-display text-5xl font-semibold tracking-tight text-text">
                    {link.title}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
```

- [ ] **Step 2: Verify**

Refresh `http://localhost:5173`. Expected: top nav shows "AC" left, "ABOUT · PROJECTS · CONTACT" links right (mono, muted). Scroll down — nav background turns to glass. On mobile width (< 640), hamburger toggles full-screen menu.

- [ ] **Step 3: Commit**

```
git -C D:/Code/Portfolio add src/components/Navbar.jsx
git -C D:/Code/Portfolio commit -m "feat(nav): rewrite Navbar with glass scroll + mono links + animated underline"
```

---

### Task 3.5: Rewrite `Hero`

**Files:**
- Modify: `D:/Code/Portfolio/src/components/Hero.jsx`

- [ ] **Step 1: Replace entire file**

```jsx
import { motion } from 'framer-motion';
import { styles } from '../styles';
import { fadeUp, blurReveal, stagger, EASE } from '../utils/motion';
import AnimatedGrid from './fx/AnimatedGrid';
import AuroraBeams from './fx/AuroraBeams';
import Magnetic from './ui/Magnetic';
import TextShimmer from './ui/TextShimmer';
import Kicker from './ui/Kicker';

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-6 pt-24 sm:px-10 lg:px-12">
      <AuroraBeams />
      <AnimatedGrid />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-6xl"
        variants={stagger(0.08, 0.2)}
        initial="hidden"
        animate="show">
        <motion.div variants={fadeUp(0)}>
          <Kicker number="01">Introduction</Kicker>
        </motion.div>

        <motion.h1
          variants={blurReveal(0.1)}
          className={`${styles.heroHeading} mt-6`}>
          Hi, I'm{' '}
          <TextShimmer className="font-display">AMAN</TextShimmer>
        </motion.h1>

        <motion.p
          variants={fadeUp(0.25)}
          className={`${styles.heroSub} mt-6 max-w-xl`}>
          Frontend Developer
          <br className="hidden sm:block" />
          I build meaningful experiences.
        </motion.p>

        <motion.div
          variants={fadeUp(0.4)}
          className="mt-10 flex flex-wrap items-center gap-4">
          <Magnetic>
            <a
              href="#projects"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent-gradient px-7 py-3 font-mono text-xs uppercase tracking-[0.25em] text-bg shadow-glow transition-shadow duration-500 hover:shadow-glow-cyan">
              View Projects
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </Magnetic>

          <Magnetic>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.02] px-7 py-3 font-mono text-xs uppercase tracking-[0.25em] text-text backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.06]">
              Get in touch
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6, ease: EASE }}>
        <div className="flex h-12 w-7 items-start justify-center rounded-full border border-white/15 p-2">
          <motion.span
            className="block h-2 w-2 rounded-full bg-text"
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.a>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Refresh `http://localhost:5173`. Expected:
- Dark page, soft violet/cyan aurora blobs drift in background
- Faint dotted grid
- Kicker "// 01 — INTRODUCTION" appears, then headline "Hi, I'm AMAN" reveals with blur clear, "AMAN" has shimmering gradient sweep
- Subtitle and two CTA buttons fade up in sequence
- Hover over CTAs — they spring toward your cursor (magnetic). Filled CTA glow strengthens.
- Scroll cue bounces at bottom.

- [ ] **Step 3: Commit**

```
git -C D:/Code/Portfolio add src/components/Hero.jsx
git -C D:/Code/Portfolio commit -m "feat(hero): rebuild hero with aurora/grid/shimmer/magnetic CTAs"
```

---

### Task 3.6: Rewrite `About`

**Files:**
- Modify: `D:/Code/Portfolio/src/components/About.jsx`

- [ ] **Step 1: Replace entire file**

```jsx
import { motion } from 'framer-motion';
import { services } from '../constants';
import { styles } from '../styles';
import { fadeUp, stagger } from '../utils/motion';
import SectionWrapper from '../hoc/SectionWrapper';
import Reveal from './ui/Reveal';
import TiltCard from './ui/TiltCard';
import GlowOnHover from './ui/GlowOnHover';
import Kicker from './ui/Kicker';

function ServiceCard({ title, icon, index }) {
  return (
    <motion.div variants={fadeUp(index * 0.06)}>
      <GlowOnHover className="rounded-2xl">
        <TiltCard className="glass relative h-full rounded-2xl p-6">
          <div className="relative z-10 flex h-full flex-col items-start gap-5">
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-white/[0.03] ring-1 ring-white/10 shadow-glow">
              <img src={icon} alt="" className="h-7 w-7 object-contain" />
            </div>
            <h3 className="font-display text-lg font-semibold text-text">
              {title}
            </h3>
          </div>
        </TiltCard>
      </GlowOnHover>
    </motion.div>
  );
}

function About() {
  return (
    <div className="grid grid-cols-1 gap-16 lg:grid-cols-5 lg:gap-12">
      <div className="lg:col-span-2">
        <Reveal>
          <Kicker number="02">About</Kicker>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className={`${styles.heading} mt-4`}>Overview.</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className={`${styles.body} mt-6 max-w-prose`}>
            As an enthusiastic front-end developer, I bring extensive expertise in JavaScript, React.js, Next.js, and Redux to the table. My primary focus revolves around crafting visually stunning and responsive web applications that captivate users. By harnessing the power of tools such as Tailwind CSS, Material UI, and Bootstrap, I strive to deliver seamless user experiences that leave a lasting impression.
          </p>
          <p className={`${styles.body} mt-4 max-w-prose`}>
            Moreover, I excel in integrating interactive maps using technologies like Deck GL and the Google Maps API, enriching applications with dynamic and engaging functionalities. My proficiency extends to efficiently working with REST APIs, enabling seamless data exchange and enhancing the overall user experience.
          </p>
        </Reveal>
      </div>

      <motion.div
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-3">
        {services.map((service, index) => (
          <ServiceCard key={service.title} {...service} index={index} />
        ))}
      </motion.div>
    </div>
  );
}

export default SectionWrapper(About, 'about');
```

- [ ] **Step 2: Verify**

Refresh, scroll to About. Expected:
- Left: kicker "// 02 — ABOUT", heading "Overview.", existing two paragraphs (verbatim)
- Right: 2×2 grid of service cards (Frontend, Backend, UI/UX, Software Testing), glass surfaces with icons. Cards tilt slightly on mouse-over and show a gradient glow ring.

- [ ] **Step 3: Commit**

```
git -C D:/Code/Portfolio add src/components/About.jsx
git -C D:/Code/Portfolio commit -m "feat(about): rebuild About with split layout + tilt/glow service cards"
```

---

### Task 3.7: Create `Skills` (replacing `Tech`)

**Files:**
- Create: `D:/Code/Portfolio/src/components/Skills.jsx`

- [ ] **Step 1: Create the new file**

```jsx
import { motion } from 'framer-motion';
import { technologies } from '../constants';
import { styles } from '../styles';
import { fadeUp, stagger } from '../utils/motion';
import SectionWrapper from '../hoc/SectionWrapper';
import Reveal from './ui/Reveal';
import GlowOnHover from './ui/GlowOnHover';
import Kicker from './ui/Kicker';

function Marquee({ items }) {
  const doubled = [...items, ...items];
  return (
    <div
      className="relative w-full overflow-hidden py-10"
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}>
      <div className="flex w-max animate-marquee gap-14 hover:[animation-play-state:paused]">
        {doubled.map((tech, i) => (
          <div
            key={`${tech.name}-${i}`}
            className="flex shrink-0 items-center gap-4">
            <img src={tech.icon} alt="" className="h-9 w-9 object-contain opacity-80" />
            <span className="font-mono text-sm uppercase tracking-widest text-muted">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TechCard({ tech, index }) {
  return (
    <motion.div variants={fadeUp(index * 0.04)}>
      <GlowOnHover className="rounded-xl">
        <div className="glass flex items-center gap-4 rounded-xl p-4 transition-transform duration-300 hover:-translate-y-1">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/[0.03] ring-1 ring-white/10">
            <img src={tech.icon} alt="" className="h-6 w-6 object-contain" />
          </div>
          <span className="font-sans text-sm text-text">{tech.name}</span>
        </div>
      </GlowOnHover>
    </motion.div>
  );
}

function Skills() {
  return (
    <div>
      <Reveal>
        <Kicker number="03">Skills</Kicker>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className={`${styles.heading} mt-4`}>Technologies.</h2>
      </Reveal>

      <Marquee items={technologies} />

      <motion.div
        variants={stagger(0.04)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {technologies.map((tech, i) => (
          <TechCard key={tech.name} tech={tech} index={i} />
        ))}
      </motion.div>
    </div>
  );
}

export default SectionWrapper(Skills, 'skills');
```

- [ ] **Step 2: Commit**

```
git -C D:/Code/Portfolio add src/components/Skills.jsx
git -C D:/Code/Portfolio commit -m "feat(skills): add new Skills section with marquee + glass grid (replaces Tech.jsx)"
```

---

### Task 3.8: Rewrite `Projects` (bento)

**Files:**
- Modify: `D:/Code/Portfolio/src/components/Projects.jsx`

- [ ] **Step 1: Replace entire file**

```jsx
import { motion } from 'framer-motion';
import { projects } from '../constants';
import { github as githubIcon } from '../assets';
import { styles } from '../styles';
import { fadeUp, stagger } from '../utils/motion';
import SectionWrapper from '../hoc/SectionWrapper';
import Reveal from './ui/Reveal';
import TiltCard from './ui/TiltCard';
import GlowOnHover from './ui/GlowOnHover';
import Kicker from './ui/Kicker';
import { cn } from '../lib/cn';

const TAG_COLORS = {
  'blue-text-gradient': 'text-sky-300 border-sky-300/30',
  'green-text-gradient': 'text-emerald-300 border-emerald-300/30',
  'pink-text-gradient': 'text-fuchsia-300 border-fuchsia-300/30',
};

const BENTO_LAYOUT = [
  'sm:col-span-2 sm:row-span-2',
  'sm:col-span-1 sm:row-span-1',
  'sm:col-span-1 sm:row-span-1',
  'sm:col-span-1 sm:row-span-1',
  'sm:col-span-1 sm:row-span-1',
];

function ProjectCard({ project, layoutClass, index }) {
  return (
    <motion.article
      variants={fadeUp(index * 0.06)}
      className={cn('h-[260px] sm:h-full sm:min-h-[260px]', layoutClass)}>
      <GlowOnHover className="h-full rounded-2xl">
        <TiltCard
          max={6}
          className="group relative h-full overflow-hidden rounded-2xl border border-white/5">
          <img
            src={project.image}
            alt={project.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />

          <div className="relative z-10 flex h-full flex-col justify-between p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag.name}
                    className={cn(
                      'rounded-full border bg-white/[0.04] px-3 py-1 font-mono text-[10px] uppercase tracking-widest backdrop-blur',
                      TAG_COLORS[tag.color] || 'text-muted border-white/15',
                    )}>
                    {tag.name}
                  </span>
                ))}
              </div>
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label={`${project.name} source code`}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-bg/60 backdrop-blur transition-colors hover:bg-white/10">
                <img src={githubIcon} alt="" className="h-4 w-4" />
              </a>
            </div>

            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="block">
              <h3 className="font-display text-2xl font-semibold text-text">
                {project.name}
              </h3>
              <p className="mt-2 max-w-prose font-sans text-sm leading-relaxed text-muted line-clamp-3">
                {project.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-text">
                Live Demo
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </a>
          </div>
        </TiltCard>
      </GlowOnHover>
    </motion.article>
  );
}

function Projects() {
  return (
    <div>
      <Reveal>
        <Kicker number="04">Projects</Kicker>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className={`${styles.heading} mt-4`}>Projects.</h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className={`${styles.body} mt-6 max-w-2xl`}>
          These projects demonstrate my expertise with practical examples of
          some of my work, including brief descriptions and links to code
          repositories and live demos. They showcase my ability to tackle
          intricate challenges, adapt to various technologies, and efficiently
          oversee projects.
        </p>
      </Reveal>

      <motion.div
        variants={stagger(0.06)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mt-14 grid auto-rows-[260px] grid-cols-1 gap-5 sm:grid-cols-3 lg:auto-rows-[280px]">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            layoutClass={BENTO_LAYOUT[i] || ''}
            index={i}
          />
        ))}
      </motion.div>
    </div>
  );
}

export default SectionWrapper(Projects, 'projects');
```

- [ ] **Step 2: Verify**

Refresh, scroll to Projects. Expected:
- Kicker `// 04 — PROJECTS`, heading "Projects.", existing description text
- Bento grid: Lepton Maps is the large tile (2x2), other four projects fill smaller tiles
- Each project image is grayscale → full color on hover, lifts slightly with glow ring
- Tags shown as glass pills (colored borders)
- GitHub icon top-right opens repo, clicking elsewhere opens live demo

- [ ] **Step 3: Commit**

```
git -C D:/Code/Portfolio add src/components/Projects.jsx
git -C D:/Code/Portfolio commit -m "feat(projects): rebuild Projects as bento grid with tilt/glow/grayscale-to-color"
```

---

### Task 3.9: Rewrite `Experience` (custom rail)

**Files:**
- Modify: `D:/Code/Portfolio/src/components/Experience.jsx`

- [ ] **Step 1: Replace entire file**

```jsx
import { motion } from 'framer-motion';
import { experiences } from '../constants';
import { styles } from '../styles';
import { fadeUp, stagger } from '../utils/motion';
import SectionWrapper from '../hoc/SectionWrapper';
import Reveal from './ui/Reveal';
import GlowOnHover from './ui/GlowOnHover';
import Kicker from './ui/Kicker';

function ExperienceItem({ experience, index }) {
  return (
    <motion.div
      variants={fadeUp(0)}
      className="relative pl-16 sm:pl-24">
      <span className="absolute left-3 sm:left-7 top-3 grid h-6 w-6 -translate-x-1/2 place-items-center">
        <span className="absolute inset-0 rounded-full bg-accent-gradient opacity-40 blur-md animate-pulse-glow" />
        <span className="relative h-3 w-3 rounded-full bg-accent-gradient shadow-glow" />
      </span>

      <GlowOnHover className="rounded-2xl">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/[0.04] ring-1 ring-white/10">
              <img
                src={experience.icon}
                alt={experience.company_name}
                className="h-7 w-7 object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-lg font-semibold text-text">
                {experience.title}
              </h3>
              <p className="font-sans text-sm text-muted">
                {experience.company_name}
              </p>
            </div>
            <span className="hidden shrink-0 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted sm:inline">
              {experience.date}
            </span>
          </div>
          <span className="mt-3 inline-block rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted sm:hidden">
            {experience.date}
          </span>
        </div>
      </GlowOnHover>
    </motion.div>
  );
}

function Experience() {
  return (
    <div>
      <Reveal>
        <Kicker number="05">Experience</Kicker>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className={`${styles.heading} mt-4`}>Work Experience.</h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className={`${styles.body} mt-4 max-w-2xl`}>What I've done so far.</p>
      </Reveal>

      <div className="relative mt-16">
        <span className="absolute left-3 sm:left-7 top-2 bottom-2 w-px bg-gradient-to-b from-accent-from/60 via-white/10 to-accent-to/40" />
        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="flex flex-col gap-10">
          {experiences.map((experience, i) => (
            <ExperienceItem
              key={`${experience.company_name}-${i}`}
              experience={experience}
              index={i}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default SectionWrapper(Experience, 'experience');
```

- [ ] **Step 2: Verify**

Scroll to Experience. Expected:
- Kicker `// 05 — EXPERIENCE`, heading "Work Experience."
- Vertical violet→cyan gradient rail on left
- Each role: pulsing glowing bead on rail + glass card with company icon, role, company name, date pill on right
- Cards reveal staggered as you scroll

- [ ] **Step 3: Commit**

```
git -C D:/Code/Portfolio add src/components/Experience.jsx
git -C D:/Code/Portfolio commit -m "feat(experience): rebuild as custom glowing rail (drops react-vertical-timeline-component)"
```

---

### Task 3.10: Rewrite `Contact`

**Files:**
- Modify: `D:/Code/Portfolio/src/components/Contact.jsx`

- [ ] **Step 1: Replace entire file**

```jsx
import { styles } from '../styles';
import SectionWrapper from '../hoc/SectionWrapper';
import Reveal from './ui/Reveal';
import Magnetic from './ui/Magnetic';
import Kicker from './ui/Kicker';
import { SOCIALS } from './icons/Socials';

function Contact() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Reveal>
        <Kicker number="06">Get in touch</Kicker>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className={`${styles.heading} mt-4`}>Let's build something.</h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className={`${styles.body} mx-auto mt-6 max-w-lg`}>
          Have an idea, role, or project in mind? Drop me a line — I'm usually quick to reply.
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mt-12 flex justify-center">
          <Magnetic>
            <a
              href="mailto:gattiflab@gmail.com"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-accent-gradient px-10 py-4 font-mono text-xs uppercase tracking-[0.3em] text-bg shadow-glow transition-shadow duration-500 hover:shadow-glow-cyan">
              Email me
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </Magnetic>
        </div>
      </Reveal>

      <Reveal delay={0.3}>
        <ul className="mt-10 flex justify-center gap-5">
          {SOCIALS.map(({ name, href, Icon }) => (
            <li key={name}>
              <a
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer"
                aria-label={name}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.02] text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:text-text">
                <Icon />
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}

export default SectionWrapper(Contact, 'contact');
```

- [ ] **Step 2: Verify**

Scroll to Contact. Expected:
- Centered glass-feel composition
- Kicker `// 06 — GET IN TOUCH`, oversized heading "Let's build something."
- Short tagline
- Single magnetic "Email me →" CTA — hover springs toward cursor; clicking opens default mail client with `gattiflab@gmail.com` populated
- Four social pills (GitHub, LinkedIn, LeetCode, Email) underneath

- [ ] **Step 3: Commit**

```
git -C D:/Code/Portfolio add src/components/Contact.jsx
git -C D:/Code/Portfolio commit -m "feat(contact): replace emailjs form with magnetic mailto CTA + socials"
```

---

### Task 3.11: Add `Footer`

**Files:**
- Create: `D:/Code/Portfolio/src/components/Footer.jsx`

- [ ] **Step 1: Create the file**

```jsx
import { SOCIALS } from './icons/Socials';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 sm:px-10 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
          © 2026 Aman Chhetri
        </span>
        <ul className="flex items-center gap-5">
          {SOCIALS.map(({ name, href, Icon }) => (
            <li key={name}>
              <a
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer"
                aria-label={name}
                className="text-muted transition-colors hover:text-text">
                <Icon />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```
git -C D:/Code/Portfolio add src/components/Footer.jsx
git -C D:/Code/Portfolio commit -m "feat(footer): add minimal footer with socials row"
```

---

### Task 3.12: Update barrel `components/index.js`

**Files:**
- Modify: `D:/Code/Portfolio/src/components/index.js`

- [ ] **Step 1: Replace entire file**

```js
import Hero from './Hero';
import Navbar from './Navbar';
import About from './About';
import Skills from './Skills';
import Experience from './Experience';
import Projects from './Projects';
import Contact from './Contact';
import Footer from './Footer';

export { Hero, Navbar, About, Skills, Experience, Projects, Contact, Footer };
```

- [ ] **Step 2: Commit**

```
git -C D:/Code/Portfolio add src/components/index.js
git -C D:/Code/Portfolio commit -m "feat(components): update barrel exports (Skills, Footer; drop Tech, BallCanvas)"
```

---

## Phase 4 — Composition + Lenis + cleanup

### Task 4.1: Rewrite `App.jsx`

**Files:**
- Modify: `D:/Code/Portfolio/src/App.jsx`

- [ ] **Step 1: Replace entire file**

```jsx
import { useEffect } from 'react';
import Lenis from 'lenis';
import {
  Hero,
  Navbar,
  About,
  Skills,
  Experience,
  Projects,
  Contact,
  Footer,
} from './components';
import ScrollProgress from './components/ui/ScrollProgress';
import GradientHairline from './components/ui/GradientHairline';
import MouseOrb from './components/fx/MouseOrb';
import Noise from './components/fx/Noise';

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-bg text-text">
      <MouseOrb />
      <Noise />
      <Navbar />
      <ScrollProgress />

      <main>
        <Hero />
        <GradientHairline />
        <About />
        <GradientHairline />
        <Skills />
        <GradientHairline />
        <Projects />
        <GradientHairline />
        <Experience />
        <GradientHairline />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Verify full page top-to-bottom**

Refresh `http://localhost:5173` and scroll from top to bottom:
- Smooth (Lenis) scroll feel
- Top scroll-progress bar fills as you scroll
- Background mouse-following orb is visible
- Subtle noise grain over everything
- Hero → hairline → About → hairline → Skills → hairline → Projects → hairline → Experience → hairline → Contact → Footer
- All sections render correctly, all kickers/headings visible

- [ ] **Step 3: Commit**

```
git -C D:/Code/Portfolio add src/App.jsx
git -C D:/Code/Portfolio commit -m "feat(app): compose new page with Lenis smooth scroll + global fx + section hairlines"
```

---

### Task 4.2: Update `index.html` page metadata

**Files:**
- Modify: `D:/Code/Portfolio/index.html`

- [ ] **Step 1: Read current index.html**

Run: `cat D:/Code/Portfolio/index.html`
Inspect title and any default meta tags.

- [ ] **Step 2: Update `<title>` and add a meta description**

Replace the existing `<title>...</title>` line with:

```html
<title>Aman Chhetri — Frontend Developer</title>
<meta name="description" content="Frontend Developer building meaningful, performant web experiences." />
<meta name="theme-color" content="#05060A" />
```

(Leave the rest of the file alone.)

- [ ] **Step 3: Commit**

```
git -C D:/Code/Portfolio add index.html
git -C D:/Code/Portfolio commit -m "chore: update page title and meta theme-color"
```

---

### Task 4.3: Delete obsolete files

**Files:**
- Delete: `D:/Code/Portfolio/src/components/Tech.jsx`
- Delete: `D:/Code/Portfolio/src/components/Loader.jsx`
- Delete: `D:/Code/Portfolio/src/components/canvas/` (entire folder)
- Delete: `D:/Code/Portfolio/src/fonts/` (entire folder)

- [ ] **Step 1: Delete files and folders**

Run via PowerShell:
```
Remove-Item D:/Code/Portfolio/src/components/Tech.jsx -Force
Remove-Item D:/Code/Portfolio/src/components/Loader.jsx -Force
Remove-Item D:/Code/Portfolio/src/components/canvas -Recurse -Force
Remove-Item D:/Code/Portfolio/src/fonts -Recurse -Force
```

- [ ] **Step 2: Verify dev server reloads with no errors**

Refresh `http://localhost:5173`. Expected: page still renders correctly. No import errors in terminal.

- [ ] **Step 3: Commit**

```
git -C D:/Code/Portfolio add -A
git -C D:/Code/Portfolio commit -m "chore: delete obsolete 3D canvas, Loader, Tech.jsx, and custom display fonts"
```

---

### Task 4.4: Mobile + reduced-motion smoke test

**Files:** None modified — pure verification task.

- [ ] **Step 1: Browser DevTools mobile view**

Open DevTools, switch to mobile viewport (≤ 640px width). Expected:
- Navbar shows hamburger; tapping it opens full-screen menu
- Hero text scales down, CTAs stack
- About becomes single column
- Skills marquee still drifts, grid collapses to 2 cols
- Projects bento collapses to single column
- Experience rail still works, date pill moves below the title
- Contact stays centered, CTA still magnetic

- [ ] **Step 2: Reduced motion check**

In DevTools → Rendering panel → "Emulate CSS prefers-reduced-motion: reduce". Refresh. Expected:
- Aurora blobs and mouse orb stop animating (or animate at <0.01ms via the CSS rule)
- Hero reveal still happens (opacity-only)
- TextShimmer slows down

- [ ] **Step 3: Lighthouse spot check (optional)**

If you have time: run a Chrome Lighthouse on the desktop view. Performance score target ≥ 90.

- [ ] **Step 4: Commit any small fixes**

If any issue surfaced, fix inline (e.g. tweak Tailwind breakpoint usage). Otherwise skip the commit.

---

### Task 4.5: Final cleanup — unused assets

**Files:**
- Delete: `D:/Code/Portfolio/src/assets/backgrounds/`
- Delete: `D:/Code/Portfolio/src/assets/personal/shaq.png`
- Delete: legacy hover icons in `src/assets/icons/`

- [ ] **Step 1: Update `src/assets/index.js` to drop dead exports**

Replace `src/assets/index.js` with:

```js
import logo from './logo/logo-black.png';
import logo1 from './logo/aman.png';

import backend from './icons/backend.png';
import ux from './icons/ux.png';
import frontend from './icons/frontend.png';
import prototyping from './icons/prototyping.png';
import github from './icons/github.png';
import close from './icons/close.png';
import menu from './icons/menu.png';

import css from './tech/css.png';
import figma from './tech/figma.png';
import git from './tech/git.png';
import html from './tech/html.png';
import javascript from './tech/javascript.png';
import nodejs from './tech/nodejs.png';
import reactjs from './tech/reactjs.png';
import redux from './tech/redux.png';
import tailwind from './tech/tailwind.png';
import typescript from './tech/typescript.png';
import postgresql from './tech/postgresql.png';
import mongodb from './tech/mongodb.png';

import coverhunt from './company/coverhunt.png';
import kelhel from './company/kelhel.png';
import microverse from './company/microverse.png';

import cryptosky from './projects/cryptosky.png';
import leptonmaps from './projects/leptonmaps.png';
import pictureyard from './projects/pictureyard.png';
import soundboard from './projects/soundboard.png';
import todolist from './projects/todolist.png';
import mentorstudents from './projects/mentorstudents.png';

export {
  logo,
  logo1,
  backend,
  ux,
  frontend,
  prototyping,
  github,
  close,
  menu,
  css,
  figma,
  git,
  html,
  javascript,
  nodejs,
  postgresql,
  reactjs,
  redux,
  tailwind,
  typescript,
  mongodb,
  coverhunt,
  kelhel,
  microverse,
  cryptosky,
  leptonmaps,
  pictureyard,
  soundboard,
  todolist,
  mentorstudents,
};
```

- [ ] **Step 2: Delete unused image files**

```
Remove-Item D:/Code/Portfolio/src/assets/backgrounds -Recurse -Force
Remove-Item D:/Code/Portfolio/src/assets/personal -Recurse -Force
Remove-Item D:/Code/Portfolio/src/assets/icons/download.png -Force
Remove-Item D:/Code/Portfolio/src/assets/icons/downloadHover.png -Force
Remove-Item D:/Code/Portfolio/src/assets/icons/pineapple.png -Force
Remove-Item D:/Code/Portfolio/src/assets/icons/pineappleHover.png -Force
Remove-Item D:/Code/Portfolio/src/assets/icons/send.png -Force
Remove-Item D:/Code/Portfolio/src/assets/icons/sendHover.png -Force
Remove-Item D:/Code/Portfolio/src/assets/icons/resume.png -Force
```

- [ ] **Step 3: Verify dev server reloads with no errors**

Refresh `http://localhost:5173`. Expected: page renders correctly, no missing-asset errors.

- [ ] **Step 4: Commit**

```
git -C D:/Code/Portfolio add -A
git -C D:/Code/Portfolio commit -m "chore: drop unused assets (backgrounds, portrait, legacy hover icons)"
```

---

## Self-review summary

- Every spec section in `2026-05-18-portfolio-redesign-design.md` is covered:
  - Design system (palette, typography, motion, layout) → Tasks 0.2, 0.3, 0.5, 3.1
  - All 5 reusable wrappers → Tasks 1.1–1.5
  - 4 fx components → Tasks 2.1–2.4
  - Section redesigns → Tasks 3.4–3.11 (Nav, Hero, About, Skills, Projects, Experience, Contact, Footer)
  - Section transitions (`GradientHairline`) + `ScrollProgress` + Lenis → Tasks 1.6, 1.7, 4.1
  - Accessibility (semantic landmarks, reduced motion, focus, aria-labels) → covered inline in Navbar/Contact/Footer + global CSS reduced-motion rule (Task 0.3)
  - Dependency swap + cleanup → Tasks 0.1, 4.3, 4.5
  - Contact info (mailto, socials) → Task 3.3
- No "TBD"/"TODO"/"implement later" left in steps. Every code-step contains complete code.
- Cross-task type consistency:
  - `<Reveal variant="up|left|right|blur">` matches the variants exported from `utils/motion.js`
  - `<Magnetic>`, `<TiltCard>`, `<GlowOnHover>` props referenced by sections all match their definitions
  - `SOCIALS` array exported from `icons/Socials.jsx` is consumed identically by `Contact` and `Footer`
  - `cn()` helper used everywhere has the same `(...inputs) => twMerge(clsx(inputs))` signature
- 21st.dev MCP usage is explicit in Tasks 2.1 and 2.2 with a deterministic fallback so the plan never blocks if MCP returns nothing usable.
