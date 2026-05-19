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
