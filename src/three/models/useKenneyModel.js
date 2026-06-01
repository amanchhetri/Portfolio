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
//
// screen: optional { material, color, emissiveIntensity }. Any primitive whose
// source material name matches `screen.material` (e.g. 'metalDark' on the Kenney
// laptop/monitor) becomes an emissive "powered-on" display instead of a normal
// lit surface. onScreenMesh(mesh) is called with the matched mesh so callers can
// attach content (RenderTexture) to it.
export function useKenneyModel(
  path,
  { roughness = 0.5, metalness = 0.15, anchor = 'bottom', screen = null, onScreenMesh = null } = {},
) {
  const { scene } = useGLTF(path);

  return useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((o) => {
      if (!o.isMesh) return;
      const src = o.material;
      if (screen && src?.name === screen.material) {
        o.material = new MeshStandardMaterial({
          color: new Color('#0b0d14'),
          emissive: new Color(screen.color ?? '#cfe0ff'),
          emissiveIntensity: screen.emissiveIntensity ?? 1.3,
          roughness: 0.25,
          metalness: 0,
          toneMapped: false,
        });
        o.castShadow = false;
        o.receiveShadow = false;
        if (onScreenMesh) onScreenMesh(o);
      } else {
        o.material = new MeshStandardMaterial({
          color: src?.color ? src.color.clone() : new Color('#bfc4cc'),
          roughness,
          metalness,
          vertexColors: !!src?.vertexColors,
        });
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    const box = new Box3().setFromObject(clone);
    const center = box.getCenter(new Vector3());
    const y = anchor === 'top' ? -box.max.y : -box.min.y;
    clone.position.set(-center.x, y, -center.z);
    return clone;
  }, [scene, roughness, metalness, anchor, screen, onScreenMesh]);
}
