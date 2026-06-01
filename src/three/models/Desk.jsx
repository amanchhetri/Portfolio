import { useGLTF } from '@react-three/drei';
import { useKenneyModel } from './useKenneyModel';

// Top-anchored: its surface sits at y=0 so the bottom-anchored props rest on it.
export function Desk(props) {
  const model = useKenneyModel('/models/desk.glb', { anchor: 'top', roughness: 0.65 });
  return (
    <group {...props}>
      <primitive object={model} />
    </group>
  );
}

export default Desk;

useGLTF.preload('/models/desk.glb');
