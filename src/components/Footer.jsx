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
