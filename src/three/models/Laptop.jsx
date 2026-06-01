import { useCallback, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useKenneyModel } from './useKenneyModel';
import { makeScreenTexture, drawHeroScreen, attachScreenContent } from './screenTexture';

// Dim emissive so the screen reads as a glowing bezel behind the content plane.
const SCREEN = { material: 'metalDark', color: '#bcd4ff', emissiveIntensity: 0.45 };

export function Laptop(props) {
  const texture = useMemo(() => makeScreenTexture(drawHeroScreen), []);
  const onScreenMesh = useCallback(
    (mesh) => attachScreenContent(mesh, texture),
    [texture],
  );
  const model = useKenneyModel('/models/laptop.glb', { screen: SCREEN, onScreenMesh });

  return (
    <group {...props}>
      <primitive object={model} />
    </group>
  );
}

export default Laptop;

useGLTF.preload('/models/laptop.glb');
