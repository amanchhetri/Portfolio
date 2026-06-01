import { useGLTF } from '@react-three/drei';
import { useKenneyModel } from './useKenneyModel';

export function Plant(props) {
  const model = useKenneyModel('/models/plant.glb', { roughness: 0.8, metalness: 0 });
  return (
    <group {...props}>
      <primitive object={model} />
    </group>
  );
}

export default Plant;

useGLTF.preload('/models/plant.glb');
