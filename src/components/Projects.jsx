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
