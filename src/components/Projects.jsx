import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { projects } from '../constants';
import { github as githubIcon } from '../assets';
import { styles } from '../styles';
import { fadeUp, stagger } from '../utils/motion';
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

function ProjectPanel({ project, index, total }) {
  return (
    <article className="relative h-[70vh] w-[80vw] max-w-[1100px] shrink-0 overflow-hidden rounded-3xl border border-white/10">
      <img
        src={project.image}
        alt={project.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0 hover:scale-[1.02]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />

      <div className="absolute right-6 top-6 z-10 font-mono text-xs uppercase tracking-[0.3em] text-muted">
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>

      <div className="relative z-10 flex h-full flex-col justify-end p-8 sm:p-10 lg:p-14">
        <div className="flex items-center justify-between gap-4">
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
            aria-label={`${project.name} source code`}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-bg/60 backdrop-blur transition-colors hover:bg-white/10">
            <img src={githubIcon} alt="" className="h-4 w-4" />
          </a>
        </div>

        <h3 className="mt-6 font-display text-3xl font-semibold text-text sm:text-5xl">
          {project.name}
        </h3>
        <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-muted sm:text-base">
          {project.description}
        </p>
        <a
          href={project.demo}
          target="_blank"
          rel="noreferrer"
          className="group mt-6 inline-flex items-center gap-3 self-start rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-text backdrop-blur transition-all hover:border-accent-from/60 hover:bg-white/[0.06]">
          Live Demo
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>
    </article>
  );
}

const PANEL_VW = 80;
const GAP_VW = 4;
const LEFT_PAD_VW = 10;
const RIGHT_PAD_VW = 10;

function ProjectsHorizontal() {
  const wrapperRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  const panelCount = projects.length;
  const totalContentVW =
    LEFT_PAD_VW + panelCount * PANEL_VW + (panelCount - 1) * GAP_VW;
  const maxTranslateVW = Math.max(
    0,
    totalContentVW - 100 + RIGHT_PAD_VW,
  );

  const x = useTransform(
    scrollYProgress,
    [0.04, 0.96],
    ['0vw', `-${maxTranslateVW}vw`],
  );

  const wrapperHeight = `${Math.max(300, maxTranslateVW + 100)}vh`;

  return (
    <section
      ref={wrapperRef}
      id="projects"
      className="relative w-full"
      style={{ height: wrapperHeight }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-10 w-full max-w-6xl px-6 sm:px-10 lg:px-12">
          <Reveal>
            <Kicker number="04">Projects</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className={`${styles.heading} mt-4`}>Projects.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={`${styles.body} mt-4 max-w-2xl`}>
              Scroll to glide through the work.
            </p>
          </Reveal>
        </div>

        <motion.div
          style={{ x }}
          className="flex w-max gap-[4vw] pl-[10vw] will-change-transform">
          {projects.map((project, i) => (
            <ProjectPanel
              key={project.id}
              project={project}
              index={i}
              total={projects.length}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ProjectsClassic() {
  return (
    <section id="projects" className="px-6 py-32 sm:px-10 sm:py-40 lg:px-12">
      <div className="mx-auto max-w-6xl">
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
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <motion.article
              key={project.id}
              variants={fadeUp(i * 0.06)}
              className="h-[280px]">
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
                  <div className="relative z-10 flex h-full flex-col justify-end p-6">
                    <h3 className="font-display text-2xl font-semibold text-text">
                      {project.name}
                    </h3>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-muted line-clamp-2">
                      {project.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-xs uppercase tracking-[0.25em] text-text hover:text-accent-from">
                        Live Demo →
                      </a>
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${project.name} source code`}
                        className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-bg/60 backdrop-blur transition-colors hover:bg-white/10">
                        <img src={githubIcon} alt="" className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </TiltCard>
              </GlowOnHover>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default function Projects() {
  const reduced = useReducedMotion();
  if (reduced) return <ProjectsClassic />;
  return <ProjectsHorizontal />;
}
