import { useGLTF } from '@react-three/drei';
import { useKenneyModel } from './useKenneyModel';

export function Laptop(props) {
  const model = useKenneyModel('/models/laptop.glb');
  return (
    <group {...props}>
      <primitive object={model} />
    </group>
  );
}

export default Laptop;

useGLTF.preload('/models/laptop.glb');
