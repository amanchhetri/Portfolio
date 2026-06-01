import { useGLTF } from '@react-three/drei';
import { useKenneyModel } from './useKenneyModel';

export function Monitor(props) {
  const model = useKenneyModel('/models/monitor.glb');
  return (
    <group {...props}>
      <primitive object={model} />
    </group>
  );
}

export default Monitor;

useGLTF.preload('/models/monitor.glb');
