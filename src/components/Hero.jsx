import { motion } from 'framer-motion';
import { styles } from '../styles';
import { fadeUp, blurReveal, stagger, EASE } from '../utils/motion';
import AnimatedGrid from './fx/AnimatedGrid';
import BeamsBackground from './fx/BeamsBackground';
import Magnetic from './ui/Magnetic';
import TextShimmer from './ui/TextShimmer';
import Kicker from './ui/Kicker';

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden px-6 pt-24 sm:px-10 lg:px-12">
      <AnimatedGrid />
      <BeamsBackground />

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
          Hi, I&apos;m{' '}
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
