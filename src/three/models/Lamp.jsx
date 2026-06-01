import { useGLTF } from '@react-three/drei';
import { useKenneyModel } from './useKenneyModel';

export function Lamp(props) {
  const model = useKenneyModel('/models/lamp.glb');
  return (
    <group {...props}>
      <primitive object={model} />
    </group>
  );
}

export default Lamp;

useGLTF.preload('/models/lamp.glb');
