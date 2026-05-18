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
