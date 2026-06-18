import { motion } from 'framer-motion';
import { services } from '../constants';
import { styles } from '../styles';
import { fadeUp, stagger } from '../utils/motion';
import SectionWrapper from '../hoc/SectionWrapper';
import Reveal from './ui/Reveal';
import TiltCard from './ui/TiltCard';
import GlowOnHover from './ui/GlowOnHover';
import Kicker from './ui/Kicker';
import Ghost from './treasure/Ghost';

function ServiceCard({ title, icon, index }) {
  return (
    <motion.div variants={fadeUp(index * 0.06)}>
      <GlowOnHover className="rounded-2xl">
        <TiltCard className="glass relative h-full rounded-2xl p-6">
          <div className="relative z-10 flex h-full flex-col items-start gap-5">
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-white/[0.03] ring-1 ring-white/10 shadow-glow">
              <img
                src={icon}
                alt=""
                width="28"
                height="28"
                loading="lazy"
                decoding="async"
                className="h-7 w-7 object-contain"
              />
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
    <div className="relative grid grid-cols-1 gap-16 lg:grid-cols-5 lg:gap-12">
      <Ghost id="about" className="absolute -top-2 right-0 z-10" />
      <div className="lg:col-span-2">
        <Reveal>
          <Kicker number="02">About</Kicker>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className={`${styles.heading} mt-4`}>Overview.</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className={`${styles.body} mt-6 max-w-prose`}>
            As a front-end developer, I build visually striking, responsive web applications with JavaScript, React.js, Next.js, and Redux — using Tailwind CSS, Material UI, and Framer Motion to craft seamless, memorable user experiences.
          </p>
          <p className={`${styles.body} mt-4 max-w-prose`}>
            I work AI-first: leveraging modern AI tools to ship faster, cleaner, and more efficiently across the stack. Beyond using AI, I build with it — developing AI-powered products like video generation tools and other intelligent applications. I'm also experienced with interactive maps (Deck GL, Google Maps API) and REST APIs for rich, data-driven interfaces.
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
