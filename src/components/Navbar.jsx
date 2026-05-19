import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks } from '../constants';
import { cn } from '../lib/cn';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-colors duration-500',
        scrolled
          ? 'border-b border-white/5 bg-bg/90 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}>
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-10 lg:px-12">
        <a
          href="#top"
          className="font-mono text-sm tracking-[0.3em] text-text transition-colors hover:text-transparent hover:bg-clip-text hover:bg-accent-gradient">
          AC
        </a>

        <ul className="hidden items-center gap-10 sm:flex">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className="group relative font-mono text-xs uppercase tracking-[0.25em] text-muted transition-colors hover:text-text">
                {link.title}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent-gradient transition-transform duration-500 ease-out group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="sm:hidden">
          <div className="flex flex-col gap-1.5">
            <span
              className={cn(
                'block h-px w-6 bg-text transition-transform duration-300',
                open && 'translate-y-[6px] rotate-45',
              )}
            />
            <span
              className={cn(
                'block h-px w-6 bg-text transition-opacity duration-300',
                open && 'opacity-0',
              )}
            />
            <span
              className={cn(
                'block h-px w-6 bg-text transition-transform duration-300',
                open && '-translate-y-[6px] -rotate-45',
              )}
            />
          </div>
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-16 z-30 bg-bg/95 backdrop-blur-xl sm:hidden">
            <ul className="flex h-full flex-col items-start justify-center gap-8 px-10">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1, duration: 0.4 }}>
                  <a
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    className="font-display text-5xl font-semibold tracking-tight text-text">
                    {link.title}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
