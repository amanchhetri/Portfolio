import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import {
  Hero,
  Navbar,
  About,
  Stats,
  Skills,
  Experience,
  Projects,
  Contact,
  Footer,
} from './components';
import ScrollProgress from './components/ui/ScrollProgress';
import GradientHairline from './components/ui/GradientHairline';
import CustomCursor from './components/ui/CustomCursor';
import MouseOrb from './components/fx/MouseOrb';
import Noise from './components/fx/Noise';

export default function App() {
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const mq = window.matchMedia('(min-width: 1024px) and (hover: hover)');
    const cores = navigator.hardwareConcurrency || 8;
    const setFromMq = (matches) => setEnhanced(!reduced && matches && cores >= 4);
    setFromMq(mq.matches);
    const handler = (e) => setFromMq(e.matches);
    mq.addEventListener('change', handler);

    if (reduced) {
      return () => mq.removeEventListener('change', handler);
    }
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
    });
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      mq.removeEventListener('change', handler);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-bg text-text">
      <CustomCursor />
      {enhanced && <MouseOrb />}
      {enhanced && <Noise />}
      <Navbar />
      <ScrollProgress />

      <main>
        <Hero />
        <GradientHairline />
        <About />
        <GradientHairline />
        <Stats />
        <GradientHairline />
        <Skills />
        <GradientHairline />
        <Projects />
        <GradientHairline />
        <Experience />
        <GradientHairline />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
