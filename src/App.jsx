import { useEffect } from 'react';
import Lenis from 'lenis';
import {
  Hero,
  Navbar,
  About,
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
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
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
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-bg text-text">
      <CustomCursor />
      <MouseOrb />
      <Noise />
      <Navbar />
      <ScrollProgress />

      <main>
        <Hero />
        <GradientHairline />
        <About />
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
