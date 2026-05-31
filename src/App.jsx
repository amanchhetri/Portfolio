import { Suspense, lazy } from 'react';
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
import { HuntProvider } from './components/treasure/HuntProvider';
import HuntBadge from './components/treasure/HuntBadge';
import HuntCelebration from './components/treasure/HuntCelebration';
import PlayModal from './components/treasure/PlayModal';
import { LenisProvider, useEnhanced } from './lib/lenisContext';
import StaticHeroBackdrop from './three/StaticHeroBackdrop';

const SceneCanvas = lazy(() => import('./three/SceneCanvas'));

function AppShell() {
  const enhanced = useEnhanced();

  return (
    <HuntProvider>
      <div className="relative min-h-screen bg-bg text-text">
        <CustomCursor />
        <Suspense fallback={<StaticHeroBackdrop />}>
          <SceneCanvas />
        </Suspense>
        {enhanced && <MouseOrb />}
        {enhanced && <Noise />}
        <Navbar />
        <ScrollProgress />
        <HuntBadge />

        <main className="relative z-10">
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
        <HuntCelebration />
        <PlayModal />
      </div>
    </HuntProvider>
  );
}

export default function App() {
  return (
    <LenisProvider>
      <AppShell />
    </LenisProvider>
  );
}
