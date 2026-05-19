import { motion } from 'framer-motion';
import { technologies } from '../constants';
import { styles } from '../styles';
import { fadeUp, stagger } from '../utils/motion';
import SectionWrapper from '../hoc/SectionWrapper';
import Reveal from './ui/Reveal';
import GlowOnHover from './ui/GlowOnHover';
import Kicker from './ui/Kicker';
import Ghost from './treasure/Ghost';

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
            <img
              src={tech.icon}
              alt=""
              width="36"
              height="36"
              loading="lazy"
              decoding="async"
              className="h-9 w-9 object-contain opacity-80"
            />
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
            <img
              src={tech.icon}
              alt=""
              width="24"
              height="24"
              loading="lazy"
              decoding="async"
              className="h-6 w-6 object-contain"
            />
          </div>
          <span className="font-sans text-sm text-text">{tech.name}</span>
        </div>
      </GlowOnHover>
    </motion.div>
  );
}

function Skills() {
  return (
    <div className="relative">
      <Ghost id="skills" className="absolute bottom-2 right-2 z-10" />
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
