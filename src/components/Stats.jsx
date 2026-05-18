import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion';
import SectionWrapper from '../hoc/SectionWrapper';
import Reveal from './ui/Reveal';
import Kicker from './ui/Kicker';
import { styles } from '../styles';

const STATS = [
  { value: 5, suffix: '+', label: 'Years experience' },
  { value: 5, suffix: '+', label: 'Projects shipped' },
  { value: 12, suffix: '+', label: 'Technologies' },
  { value: 4, suffix: '', label: 'Companies' },
];

function Stat({ value, suffix, label, progress, start, end }) {
  const v = useTransform(progress, [start, end], [0, value]);
  const [display, setDisplay] = useState(0);
  useMotionValueEvent(v, 'change', (latest) => {
    setDisplay(Math.max(0, Math.min(value, Math.floor(latest))));
  });

  return (
    <div className="flex flex-col gap-3">
      <span className="font-display text-5xl font-bold text-gradient sm:text-6xl">
        {display}
        {suffix}
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
        {label}
      </span>
    </div>
  );
}

function Stats() {
  const wrapperRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start end', 'end center'],
  });

  return (
    <div ref={wrapperRef}>
      <Reveal>
        <Kicker>By the numbers</Kicker>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className={`${styles.heading} mt-4 sr-only`}>Stats</h2>
      </Reveal>

      <div className="mt-12 grid grid-cols-2 gap-10 sm:grid-cols-4">
        {STATS.map((stat, i) => (
          <Stat
            key={stat.label}
            {...stat}
            progress={scrollYProgress}
            start={0.15 + i * 0.05}
            end={0.55 + i * 0.05}
          />
        ))}
      </div>
    </div>
  );
}

export default SectionWrapper(Stats, 'stats');
