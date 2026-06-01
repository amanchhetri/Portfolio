import { useEffect } from 'react';
import { useFrame, useThree, invalidate } from '@react-three/fiber';
import * as THREE from 'three';
import { SCENE_KEYFRAMES } from './config/sceneKeyframes';
import { useLenisProgress } from '../lib/lenisContext';

const smoothstep = (t) => t * t * (3 - 2 * t);

const posA = new THREE.Vector3();
const posB = new THREE.Vector3();
const tgtA = new THREE.Vector3();
const tgtB = new THREE.Vector3();
const target = new THREE.Vector3();

// Camera rig: maps global scroll progress (0..1) across the keyframe array and
// eases between adjacent stops. Driven by Lenis, so it advances only while
// scrolling; frameloop="demand" keeps the GPU idle when still.
export default function ScrollCamera() {
  const { camera } = useThree();
  const progress = useLenisProgress();

  // Repaint on each scroll tick (nothing else requests frames in demand mode).
  useEffect(() => {
    invalidate();
  }, [progress]);

  useFrame(() => {
    const segments = SCENE_KEYFRAMES.length - 1;
    const x = Math.max(0, Math.min(1, progress)) * segments;
    const i = Math.min(Math.floor(x), segments - 1);
    const localT = smoothstep(x - i);

    const from = SCENE_KEYFRAMES[i];
    const to = SCENE_KEYFRAMES[i + 1];

    camera.position.lerpVectors(
      posA.fromArray(from.cameraPos),
      posB.fromArray(to.cameraPos),
      localT,
    );
    target
      .copy(tgtA.fromArray(from.cameraTarget))
      .lerp(tgtB.fromArray(to.cameraTarget), localT);
    camera.lookAt(target);
  });

  return null;
}
