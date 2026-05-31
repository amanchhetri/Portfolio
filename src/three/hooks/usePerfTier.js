import { useEffect, useState } from 'react';

export function usePerfTier() {
  const [tier, setTier] = useState('high');

  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 8;
    const deviceMemory = navigator.deviceMemory ?? 8;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const isNarrow = window.matchMedia('(max-width: 1024px)').matches;

    let next = 'high';
    if (cores < 4 || deviceMemory < 4) next = 'low';
    else if (isCoarsePointer || isNarrow) next = 'mid';

    setTier(next);
  }, []);

  return tier;
}

// NOTE: `antialias` (fxaa/msaa2/msaa4) maps to a boolean gl context flag set at
// Canvas mount only — WebGL's antialias flag is immutable after context creation,
// so changing tier at runtime does not change MSAA. dpr/shadows ARE applied live.
export const TIER_CONFIG = {
  low: {
    dprMax: 1,
    shadows: false,
    shadowMapSize: 0,
    postProcessing: false,
    antialias: 'fxaa',
    environmentResolution: 256,
    showPlant: false,
    showLamp: false,
    contactShadows: false,
    idleJitter: false,
  },
  mid: {
    dprMax: 1.5,
    shadows: true,
    shadowMapSize: 512,
    postProcessing: false,
    antialias: 'msaa2',
    environmentResolution: 512,
    showPlant: true,
    showLamp: true,
    contactShadows: true,
    idleJitter: true,
  },
  high: {
    dprMax: 2,
    shadows: true,
    shadowMapSize: 1024,
    postProcessing: true,
    antialias: 'msaa4',
    environmentResolution: 1024,
    showPlant: true,
    showLamp: true,
    contactShadows: true,
    idleJitter: true,
  },
};
