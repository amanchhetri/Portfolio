import { useCallback, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useKenneyModel } from './useKenneyModel';
import { makeScreenTexture, drawCodeScreen, attachScreenContent } from './screenTexture';

// Dim emissive so the screen reads as a glowing bezel behind the content plane.
const SCREEN = { material: 'metalDark', color: '#9fd0ff', emissiveIntensity: 0.45 };

export function Monitor(props) {
  const texture = useMemo(() => makeScreenTexture(drawCodeScreen), []);
  const onScreenMesh = useCallback(
    (mesh) => attachScreenContent(mesh, texture),
    [texture],
  );
  const model = useKenneyModel('/models/monitor.glb', { screen: SCREEN, onScreenMesh });

  return (
    <group {...props}>
      <primitive object={model} />
    </group>
  );
}

export default Monitor;

useGLTF.preload('/models/monitor.glb');
