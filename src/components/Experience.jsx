import { motion } from 'framer-motion';
import { experiences } from '../constants';
import { styles } from '../styles';
import { fadeUp, stagger } from '../utils/motion';
import SectionWrapper from '../hoc/SectionWrapper';
import Reveal from './ui/Reveal';
import GlowOnHover from './ui/GlowOnHover';
import Kicker from './ui/Kicker';

function ExperienceItem({ experience }) {
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
        <p className={`${styles.body} mt-4 max-w-2xl`}>What I&apos;ve done so far.</p>
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
