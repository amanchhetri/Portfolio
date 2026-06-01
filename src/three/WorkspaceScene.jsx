import { Suspense } from 'react';
import { ContactShadows } from '@react-three/drei';
import Laptop from './models/Laptop';
import Monitor from './models/Monitor';
import Lamp from './models/Lamp';
import Plant from './models/Plant';
import { TIER_CONFIG } from './hooks/usePerfTier';

// Full desk composition. Props rest on a common floor plane (y=0, handled by the
// loader) and share one scale so Kenney's real-world proportions read true. The
// scene itself is static — ScrollCamera supplies all motion. Lamp + plant drop
// out on the low tier (TIER_CONFIG).
const SCALE = 7;
const PLANT_SCALE = 5; // the potted plant is naturally tall; shrink so it reads as a desk plant

export default function WorkspaceScene({ tier }) {
  const config = TIER_CONFIG[tier];

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[3, 5, 2]}
        intensity={1.1}
        color="#FFEACC"
        castShadow={config.shadows}
        shadow-mapSize={[config.shadowMapSize, config.shadowMapSize]}
      />
      <directionalLight position={[-3, 3, -2]} intensity={0.5} color="#B9CFFF" />
      <pointLight position={[-2.5, 1.4, 2]} intensity={2.5} distance={9} decay={2} color="#7C5CFF" />
      <pointLight position={[2.6, 0.6, 1.4]} intensity={1.8} distance={9} decay={2} color="#22D3EE" />

      <Suspense fallback={null}>
        <Laptop scale={SCALE} position={[0, 0, 0.7]} rotation={[0, -0.5, 0]} />
        <Monitor scale={SCALE} position={[0.2, 0, -0.9]} rotation={[0, -0.25, 0]} />

        {config.showLamp && (
          <>
            <Lamp scale={SCALE} position={[2.2, 0, -0.5]} rotation={[0, -0.6, 0]} />
            <pointLight
              position={[2.0, 2.0, -0.2]}
              intensity={config.shadows ? 1.6 : 1.0}
              color="#FFC68A"
              distance={4.5}
              decay={2}
            />
          </>
        )}

        {config.showPlant && (
          <Plant scale={PLANT_SCALE} position={[-2.4, 0, -0.3]} />
        )}
      </Suspense>

      {config.contactShadows && (
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.4}
          scale={9}
          blur={2.6}
          far={3}
        />
      )}
    </>
  );
}
