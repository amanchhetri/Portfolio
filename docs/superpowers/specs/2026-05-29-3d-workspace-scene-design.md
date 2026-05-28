# 3D Workspace Scene — Design Spec

**Date:** 2026-05-29
**Owner:** Aman Chhetri
**Scope:** Add a persistent, scroll-driven 3D workspace scene as the new background for the entire portfolio, replacing existing 2D FX layers.
**Branch:** `feat/3d-workspace-scene`

---

## 1. Goal

Layer a single Three.js canvas behind the existing portfolio. The canvas hosts a workspace desk scene (laptop, monitor, lamp, plant) that a virtual camera glides around as the user scrolls. Each section gets a distinct camera framing + lighting + screen content, turning the page into a cinematic single-take film of a workspace rather than seven separate sections.

The 3D scene **replaces** the current `AuroraBeams` / `BeamsBackground` / `AnimatedGrid` FX as the portfolio's visual identity.

**Non-goals:**
- Rewriting any existing section content or copy.
- Adding new sections.
- Bruno-Simon-style playful / game-like 3D — the scene serves the "Quiet Cinematic" theme, not a separate vibe.
- Replacing all motion: existing Framer Motion DOM animations, `MouseOrb`, `Noise`, `CustomCursor` stay.
- Interactive 3D (click-to-rotate, drag controls) — the scene is scroll-driven only.

---

## 2. Constraints & decisions (locked)

| Decision | Choice |
| --- | --- |
| 3D placement | Persistent fixed canvas, scene-per-section via camera keyframes |
| Subject | Workspace desk (laptop + monitor + lamp + plant), assembled from free CC models |
| Tech stack | `@react-three/fiber` + `@react-three/drei` + `framer-motion-3d` |
| Mobile strategy | Simplified 3D (lower poly, capped DPR, no post, no shadows on low tier) |
| Model sources | Sketchfab CC priority → Quaternius/Poly Pizza fallback |
| Bailout if models fail QA | Abstract/shader-driven scene (glass cube + floating gradient orbs + particles) |
| Existing FX | Removed from section usage; component files retained for revertability |
| Reduced motion | Static render, single Hero-keyframe pose, no scroll updates |
| Render strategy | `frameloop="demand"`, re-render only on scroll / texture change |
| Lazy load | Entire `src/three/` chunk dynamically imported; 0 KB added to initial paint |

---

## 3. Architecture

A single `<Canvas>` mounts once at app root as a fixed full-viewport layer behind the page content:

```
fixed; inset: 0; z-index: 0; pointer-events: none
```

Existing `<main>` and sections sit on top with `z-index: 1`. Section backgrounds are made transparent (or near-transparent with a slight tint) so the 3D shows through.

### 3.1 Data flow

```
Lenis  →  LenisProvider (broadcasts progress 0→1)  →  useLenisProgress() hook
                                                         ↓
                                                  ScrollCamera.jsx
                                                         ↓
                                       interpolates keyframes per frame
                                                         ↓
                                                  WorkspaceScene.jsx
                                                  (camera + objects)
```

### 3.2 Scroll-position anchoring

Keyframes anchor to actual section DOM positions via `IntersectionObserver`, **not** raw scroll percentage. This makes the scene robust if section heights change later (e.g., adding/removing a project card). A section's `entry.intersectionRatio` + bounding-rect top contributes to a normalized 0→1 progress segment per section.

### 3.3 Why a single persistent canvas

- One scene graph, mounted once → no per-section rebuild cost.
- Single render loop → easy global perf control.
- Camera movement is just `lerp` between keyframes — cheap, predictable, debuggable without an animation library.

---

## 4. File structure

All new code lives under `src/three/`. No existing component is moved; only `App.jsx`, `src/lib/`, and section background classes are touched.

```
src/
├── components/                  (unchanged structurally)
├── three/                       (NEW)
│   ├── SceneCanvas.jsx          Fixed-position <Canvas> wrapper, Suspense boundary, tier-aware gl config
│   ├── WorkspaceScene.jsx       Scene graph: desk + props + lights + Environment
│   ├── ScrollCamera.jsx         Camera rig; reads scroll progress, interpolates keyframes
│   ├── StaticHeroBackdrop.jsx   CSS-gradient fallback shown during Suspense / on reduced-motion / on bailout
│   ├── models/
│   │   ├── Laptop.jsx           gltfjsx output for /models/laptop.glb
│   │   ├── Monitor.jsx
│   │   ├── Lamp.jsx
│   │   └── Plant.jsx
│   ├── hooks/
│   │   └── usePerfTier.js       'low' | 'mid' | 'high' — single source of truth for quality
│   └── config/
│       ├── sceneKeyframes.js    Camera + lighting + screen-content per section
│       └── modelSources.js      .glb paths, author, license, source URL (for credits page)
├── lib/
│   ├── cn.js                    (unchanged)
│   └── lenisContext.jsx         (NEW or extracted from App.jsx) — owns Lenis, broadcasts progress, owns `enhanced`/perf gating
└── public/
    └── models/                  (NEW) optimized .glb files
        ├── laptop.glb
        ├── monitor.glb
        ├── lamp.glb
        └── plant.glb
```

**Component responsibility boundaries:**
- `SceneCanvas` knows only about mounting, suspense, and perf-tier config. Doesn't know what's in the scene.
- `WorkspaceScene` knows the scene graph + lights. Doesn't know about scroll.
- `ScrollCamera` knows scroll → camera math. Doesn't know what objects look like.
- `usePerfTier` is the only place "is mobile / is low-end" logic lives. Every quality knob keys off it.

---

## 5. Model sourcing strategy

### 5.1 Source priority

1. **Sketchfab** — filter by `Downloadable` + license CC0 or CC-BY, sorted by "Editor's Choice." Top quality bar.
2. **Quaternius** (CC0) — clean low-poly, good fallback for plant/lamp.
3. **Poly Pizza** (CC0 aggregator) — second fallback.
4. **Kenney / KitBash** — last resort, mostly game-asset style; likely too stylized.

### 5.2 Acceptance bar per model

A candidate model is rejected unless it passes all:

- < 50,000 triangles before optimization
- Clean topology, no holes, no inverted normals
- PBR textures (metalness + roughness maps present) — flat shading reads as cheap under our lighting
- Neutral / desaturated base colour palette
- License: CC0 or CC-BY only (attribution captured if CC-BY)

### 5.3 Optimization pipeline (per model, manual once)

1. Inspect in `gltf.report` web tool → strip unused animations, morph targets, extra UV sets.
2. CLI:
   ```
   gltf-transform optimize input.glb output.glb \
     --texture-compress webp \
     --simplify 0.75
   ```
   Typical reduction: 60–80% file size.
3. Generate React component:
   ```
   npx gltfjsx output.glb --transform
   ```
   Output committed to `src/three/models/<Name>.jsx` with named mesh refs.
4. Verify final `.glb` < 500 KB; full scene < 2 MB gzipped.

### 5.4 Lighting carries the look

The "cinematic" quality comes from lighting, **not** model fidelity. Configuration:

- `Environment preset="studio"` (drei) at low intensity for IBL — fills shadow detail.
- Key light: directional, warm (`#FFEACC`), low intensity (~0.6).
- Rim light: directional, cool (`#B9CFFF`), behind subject (~0.4).
- Ambient: very low (~0.15) — preserves contrast.
- Optional `ContactShadows` (drei) under desk for grounding (off on low tier).

This is what visually distinguishes a mid-quality free model from a "premium" feel. A great model under bad lighting looks worse than a mid model under tuned lighting.

### 5.5 Bailout path

If after Phase 2 the laptop model — under tuned lighting — still reads as amateurish, abandon the GLTF approach and switch `WorkspaceScene.jsx` to a procedural scene:

- Glass refractive cube (THREE `MeshPhysicalMaterial` with high `transmission`)
- 3–5 floating gradient spheres (`MeshBasicMaterial` with gradient `<RenderTexture>`)
- Particle field (`<Points>` with sprite or shader)
- Same camera keyframes, same scroll choreography — only the contents of `WorkspaceScene` change.

The architecture, file structure, scroll system, and perf tiers do not change between paths.

### 5.6 Attribution

`modelSources.js` records `{path, author, license, sourceUrl}` per model. A `/credits` route (new) or footer link renders this list. CC-BY models require attribution; CC0 included anyway as good practice.

---

## 6. Scroll choreography

### 6.1 Section order and keyframes

The portfolio's section order is **Hero → About → Stats → Skills → Projects → Experience → Contact**. Each section gets one keyframe; the camera interpolates between adjacent keyframes as the section progresses through the viewport.

| Section | Camera | Focus | Scene state |
| --- | --- | --- | --- |
| **Hero** | Medium-wide, slightly above, ~30° angle | Full desk in frame | Laptop open, screen glows with name/headline. Lamp on (warm). Plant in view. |
| **About** | Push in, eye-level | Plant + laptop foreground, desk blurred behind | Lamp dims slightly. Warm key dominant. |
| **Stats** | Pull back, tilt down to near-overhead | Desk from above | Lamp off, laptop glow only. Stat numbers (`drei <Html>`) overlay desk surface. |
| **Skills** | Slight pull-back, 3/4 angle | Monitor + laptop both visible | Both screens cycle tech logos (`<RenderTexture>` grid or texture array). |
| **Projects** | Tight push-in on laptop screen | Laptop screen ~60% of frame | Laptop screen shows current project content via `<RenderTexture>` mirroring viewport project card. |
| **Experience** | Side-angle, low | Monitor center-frame | Monitor cycles company logos via texture array indexed to active timeline item. |
| **Contact** | Pull way back, dim everything | Desk small, dark negative space | Lamp off, laptop glow only. Final-shot stillness. |

### 6.2 Interpolation primitives

`sceneKeyframes.js` exports an array of objects:

```js
{
  section: 'hero',
  cameraPos: [x, y, z],
  cameraTarget: [x, y, z],
  lampIntensity: 0.8,
  keyLightIntensity: 0.6,
  screenContent: 'name-headline',
}
```

Per frame, `ScrollCamera`:
1. Reads scroll progress (from `useLenisProgress`).
2. Finds the two keyframes the current progress sits between.
3. Computes local `t` (0→1) within that segment.
4. `Vector3.lerpVectors` for positions, `MathUtils.lerp` for scalars, slerp not needed (no quaternion easing required at our motion scale).

### 6.3 Easing

Each segment eases via a smoothstep (`t * t * (3 - 2 * t)`) — gentler than linear, no overshoot. Aggressive easing curves would feel theme-park-y and clash with "Quiet Cinematic."

### 6.4 Idle micro-motion

When scroll is still, the camera gets a `Math.sin(t * 0.3) * 0.05` Y-axis jitter to feel handheld. On low/mid tiers this is disabled to keep `frameloop="demand"` from waking up.

### 6.5 Screen content technique

- **Laptop screen mesh** identified by name via `gltfjsx`-generated refs. Its material's `map` is swapped per section.
- **Projects section:** `<RenderTexture>` renders a live React tree containing the active project card. Synced to "which project is in the viewport" using `IntersectionObserver` on the existing project DOM cards.
- **Skills / Experience:** texture array (pre-loaded), index lerps with scroll.

### 6.6 Risk and mitigation

If section heights drift significantly during future content edits, keyframes need re-tuning. Mitigation: `IntersectionObserver` anchoring (Section 3.2) makes per-section progress robust; only **between-section transitions** are sensitive to total page height. Documented behavior, not a bug.

---

## 7. Performance & mobile

### 7.1 Perf tiers

`usePerfTier()` returns one of `'low' | 'mid' | 'high'`:

```
- navigator.hardwareConcurrency < 4         → low
- window.matchMedia('(pointer: coarse)')    → at most mid (touch)
- navigator.deviceMemory < 4 (where exposed)→ low
- prefers-reduced-motion: reduce            → forces 'low' + static render mode
- otherwise                                 → high
```

Every quality knob reads from this single value.

### 7.2 Quality knob matrix

| Knob | Low | Mid | High |
| --- | --- | --- | --- |
| `gl.setPixelRatio` cap | 1 | 1.5 | min(devicePixelRatio, 2) |
| Shadows | Off | `PCFSoftShadowMap`, 512 | `PCFSoftShadowMap`, 1024 |
| Post-processing (`@react-three/postprocessing`, bloom + vignette) | Off | Off | On |
| Antialias | FXAA shader pass | MSAA 2× | MSAA 4× |
| `Environment` resolution | 256 | 512 | 1024 |
| `frameloop` | `demand` | `demand` | `demand` |
| Idle camera jitter | Off | On | On |
| Plant + Lamp models | Hidden | Shown | Shown |
| `ContactShadows` | Off | On | On |

### 7.3 `frameloop="demand"` strategy

- Default: scene re-renders only when an R3F prop changes.
- During scroll: Lenis frame callback calls `invalidate()` (R3F) → re-render that frame only.
- When scroll stops: re-renders stop. GPU idle.
- **Exception:** Projects section forces continuous render while in viewport (because `<RenderTexture>` needs to animate). Stops the moment Projects exits the viewport.

### 7.4 Lazy loading

```js
const SceneCanvas = lazy(() => import('./three/SceneCanvas'));
```

Wrapped in `<Suspense fallback={<StaticHeroBackdrop />}>`. Until the chunk loads (~500 ms on 4G), users see a CSS-gradient backdrop tuned to approximate the scene's lighting palette. No layout shift, no flash.

`useGLTF.preload('/models/laptop.glb')` is called immediately after R3F mounts so by the time the user scrolls past Hero, the laptop is in cache. Other models stream in.

### 7.5 Bundle budget

| Asset | Size (gzip) |
| --- | --- |
| Initial JS (no 3D) | unchanged from current |
| Lazy 3D chunk | three + R3F + drei + framer-motion-3d ≈ 280 KB |
| Models | < 2 MB total (Section 5.3 budget) |
| **First paint cost** | **0 KB** (everything lazy) |
| Post-scroll cost | ~2.3 MB transferred, cached after first visit |

### 7.6 Acceptance thresholds

- Lighthouse Performance ≥ 95 desktop, ≥ 85 mobile (post-3D).
- First Contentful Paint unchanged from `master`.
- Idle desktop GPU usage < 5% (verified via Chrome perf monitor + `chrome://gpu`).

---

## 8. Integration with existing code

### 8.1 Lenis extracted to provider

Current `App.jsx` instantiates Lenis inside `useEffect`. The 3D scene plus existing consumers (`ScrollProgress`, `MouseOrb`) all need scroll progress, and currently there's no shared accessor.

**New file:** `src/lib/lenisContext.jsx`
- Owns the Lenis instance **and its `requestAnimationFrame` loop** (relocated from `App.jsx`'s current `useEffect`). On unmount, cancels the raf and calls `lenis.destroy()` exactly as today.
- Exposes `useLenisProgress()` (0→1 across full page, updated each Lenis frame via a `useSyncExternalStore` subscription so consumers re-render only when progress actually changes) and `useLenisRaw()` (instance reference for advanced cases such as `lenis.scrollTo`).
- Hosts the existing `enhanced` gating logic (viewport ≥ 1024, hover-capable pointer, cores ≥ 4, not `prefers-reduced-motion`). Exposed via `useEnhanced()`.
- When `prefers-reduced-motion: reduce` is set, the provider **does not instantiate Lenis at all** (matching today's behavior), and `useLenisProgress()` returns a static 0. `SceneCanvas` reads this to know it should render once and freeze.

`App.jsx` becomes:

```jsx
<LenisProvider>
  <HuntProvider>
    <div className="relative min-h-screen bg-bg text-text">
      <CustomCursor />
      <SceneCanvas />          {/* NEW — fixed, z-0, behind everything */}
      <Suspense ...>...</Suspense>
      {/* MouseOrb / Noise gated via useEnhanced() instead of local state */}
      <Navbar />
      <ScrollProgress />
      <HuntBadge />
      <main>...sections unchanged...</main>
      <Footer />
      <HuntCelebration />
      <PlayModal />
    </div>
  </HuntProvider>
</LenisProvider>
```

### 8.2 Section background adjustments

Every section currently with an opaque dark background gets its background made transparent (or near-transparent with a slight `bg-black/40` tint where text contrast over the 3D needs help). Specific class changes deferred to the implementation plan (need to inspect each section's current background utility).

### 8.3 Existing FX retirement

Section-level usage of `AuroraBeams`, `BeamsBackground`, `AnimatedGrid` is **removed**. The component files in `src/components/fx/` remain in the repo so the branch can be reverted by re-importing them; nothing is deleted.

`MouseOrb` and `Noise` are retained — they overlay the whole page cheaply and complement the 3D layer (subtle grain over the scene reads cinematic, not noisy).

### 8.4 Reduced-motion handling

When `prefers-reduced-motion: reduce`:
- `SceneCanvas` mounts but renders **once** with the Hero keyframe, then never updates.
- Idle jitter disabled.
- All Framer Motion DOM animation already honors this through existing patterns — unchanged.

This is cheaper than skipping 3D entirely and gives reduced-motion users the same visual context, just frozen.

### 8.5 Model component workflow

For each `.glb` added:
1. Place optimized file at `public/models/<name>.glb`.
2. Run `npx gltfjsx public/models/<name>.glb --transform` once.
3. Commit generated component to `src/three/models/<Name>.jsx`.
4. Import into `WorkspaceScene.jsx`, attach refs to per-mesh material adjustments (screen mesh especially).

---

## 9. Rollout phases

Each phase is independently shippable — branch can be merged at any phase boundary and the site still works.

### Phase 1 — Plumbing (no visible 3D) — ~0.5 day
- Install `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion-3d`, `@react-three/postprocessing`.
- Add `@react-three/eslint-plugin` to ESLint config.
- Extract `LenisProvider`, `useLenisProgress`, `useEnhanced`, build `usePerfTier`.
- Lazy `<SceneCanvas>` mounting an empty `<Canvas>` rendering a dark background colour only.
- Verify gating, lazy chunk, Suspense fallback, perf-tier detection.
- **Ship gate:** Lighthouse + CWV unchanged from `master`. No visual change.

### Phase 2 — Single model, hero only — ~1 day
- Source 1 laptop `.glb` (Sketchfab CC). Optimize. Run `gltfjsx`.
- Mount in `WorkspaceScene.jsx`. Basic lighting (key + fill). Static camera at Hero keyframe.
- Scroll choreography off; laptop sits still.
- **Ship gate:** Hero feels intentional and cinematic. **Bailout decision point** — if laptop reads as amateurish under tuned lighting, switch `WorkspaceScene` to procedural (Section 5.5) before continuing.

### Phase 3 — Full scene + scroll choreography — ~1.5 days
- Add monitor, lamp, plant models.
- Build `sceneKeyframes.js` with 7 keyframes.
- Implement `ScrollCamera` interpolation. Wire to `useLenisProgress` and `IntersectionObserver` per-section anchoring.
- `Environment preset="studio"` + lighting per tier.
- **Ship gate:** Scrolling through the page feels like one continuous cinematic shot at 1440p desktop.

### Phase 4 — Screen content — ~1 day
- Laptop screen `<RenderTexture>` showing live project card during Projects section.
- Monitor texture array of company logos (Experience) + tech logos (Skills).
- Section-aware sync via `IntersectionObserver`.
- **Ship gate:** Laptop/monitor screens contribute to narrative, don't feel like static stickers.

### Phase 5 — Mobile + low-tier polish — ~0.5 day
- Test on real low-end Android (or Chrome DevTools "Low-end mobile" profile + 4× CPU throttle).
- Verify low-tier (no plant/lamp, DPR 1, no shadows) feels intentional.
- Tune `StaticHeroBackdrop` to match scene's first-frame lighting.
- **Ship gate:** Mobile Lighthouse Performance ≥ 85; mid-tier Android shows scene without obvious lag.

### Phase 6 — FX retirement + credits — ~0.5 day
- Remove `AuroraBeams` / `BeamsBackground` / `AnimatedGrid` imports from sections (files remain).
- Add `/credits` route or footer link enumerating models + authors + licenses from `modelSources.js`.
- Final cross-browser QA.

**Total estimate: ~5 working days for a polished result.** Half if rough edges accepted.

---

## 10. Testing

No automated 3D tests — not worth the maintenance for a portfolio. Manual QA gates each phase:

- **Browser matrix:** Desktop Chrome / Firefox / Safari at 1440p, 1280px, 1024px. iPhone Safari (mid-tier). Pixel Chrome (low-tier).
- **Lighthouse:** Mobile + desktop, end of each phase. Performance ≥ 85 mobile, ≥ 95 desktop.
- **Reduced-motion check:** Chrome DevTools "Emulate CSS prefers-reduced-motion: reduce." Scene must render once and freeze.
- **GPU idle check:** Chrome `chrome://gpu` + Performance monitor on a still page. `frameloop="demand"` working means GPU usage drops to near-zero after scroll stops.
- **3D-specific lint:** `@react-three/eslint-plugin` catches common R3F mistakes (intrinsic capitalization, hook misuse).
- **Bailout simulation:** Manually swap `WorkspaceScene` to procedural variant once to verify the bailout path actually works.

---

## 11. Success criteria

1. Lighthouse Performance ≥ 95 desktop, ≥ 85 mobile after 3D shipped.
2. First Contentful Paint unchanged from `master` (3D fully lazy).
3. Idle desktop GPU usage < 5% on a still page.
4. Subjective: scene reads as "Quiet Cinematic" rather than "look at my 3D" on first review by owner.
5. Site remains fully usable and visually coherent with 3D entirely disabled (Suspense fallback / bailout backdrop covers it).
6. Credits page lists every model used with author and license.

---

## 12. Open implementation-time decisions

These are intentionally deferred to implementation rather than over-specified now:

- Exact section background-class swaps in `src/components/<Section>.jsx` (need per-section inspection).
- Whether `MouseOrb` opacity needs reduction once 3D is the new backdrop (visual call once scene is live).
- Whether idle camera jitter should run at 30 fps (compromise between `demand` and continuous) or stay off on mid-tier (perception call once scene is live).
- Which specific Sketchfab models pass the Section 5.2 acceptance bar (research task in Phase 2).
