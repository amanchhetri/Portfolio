export const EASE = [0.22, 1, 0.36, 1];

export const fadeUp = (delay = 0, duration = 0.7) => ({
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration, delay, ease: EASE },
  },
});

export const fadeIn = (delay = 0, duration = 0.7) => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration, delay, ease: EASE } },
});

export const slideInX = (direction = 'left', delay = 0, duration = 0.7) => ({
  hidden: { opacity: 0, x: direction === 'left' ? -40 : 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration, delay, ease: EASE },
  },
});

export const stagger = (staggerChildren = 0.06, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});

export const blurReveal = (delay = 0, duration = 0.9) => ({
  hidden: { opacity: 0, y: 16, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration, delay, ease: EASE },
  },
});
