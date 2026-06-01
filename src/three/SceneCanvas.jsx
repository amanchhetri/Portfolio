import { Canvas } from '@react-three/fiber';
import { usePerfTier, TIER_CONFIG } from './hooks/usePerfTier';
import { useReducedMotionPref } from '../lib/lenisContext';
import WorkspaceScene from './WorkspaceScene';
import ScrollCamera from './ScrollCamera';

export default function SceneCanvas() {
  const tier = usePerfTier();
  const config = TIER_CONFIG[tier];
  const reduced = useReducedMotionPref();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background: '#05060A' }}
    >
      <Canvas
        frameloop={reduced ? 'never' : 'demand'}
        dpr={[1, config.dprMax]}
        gl={{
          antialias: config.antialias === 'msaa4' || config.antialias === 'msaa2',
          alpha: false,
          powerPreference: 'high-performance',
        }}
        shadows={config.shadows ? 'soft' : false}
        camera={{ position: [0, 1.5, 4], fov: 35 }}
      >
        <color attach="background" args={['#05060A']} />
        {!reduced && <ScrollCamera />}
        <WorkspaceScene tier={tier} />
      </Canvas>
    </div>
  );
}
