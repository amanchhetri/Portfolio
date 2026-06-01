import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Box3, Vector3, MeshStandardMaterial, Color } from 'three';

// Shared loader for Kenney Furniture Kit props. Each model ships with
// KHR_materials_unlit (flat, lighting-agnostic) and is corner-anchored. We:
//  1. clone so multiple instances are safe,
//  2. swap unlit → MeshStandardMaterial (keeping the palette color) so the
//     scene light rig shapes it,
//  3. recenter on X/Z and drop the bottom onto y=0 so callers can place props
//     on a common floor plane via position alone.
// anchor: 'bottom' (default) drops the model's base onto y=0 so it rests on a
// floor/surface; 'top' aligns its top to y=0 so it acts AS a surface other
// bottom-anchored props can sit on (used for the desk).
export function useKenneyModel(path, { roughness = 0.5, metalness = 0.15, anchor = 'bottom' } = {}) {
  const { scene } = useGLTF(path);

  return useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((o) => {
      if (!o.isMesh) return;
      const src = o.material;
      o.material = new MeshStandardMaterial({
        color: src?.color ? src.color.clone() : new Color('#bfc4cc'),
        roughness,
        metalness,
        vertexColors: !!src?.vertexColors,
      });
      o.castShadow = true;
      o.receiveShadow = true;
    });
    const box = new Box3().setFromObject(clone);
    const center = box.getCenter(new Vector3());
    const y = anchor === 'top' ? -box.max.y : -box.min.y;
    clone.position.set(-center.x, y, -center.z);
    return clone;
  }, [scene, roughness, metalness, anchor]);
}
