// sceneKeyframes.js — per-section camera stops, sampled evenly across global
// Lenis scroll progress (0..1) by ScrollCamera. Order matches App.jsx section
// order (Hero → About → Stats → Skills → Projects → Experience → Contact).
// These are starting estimates tuned against the Kenney desk layout in
// WorkspaceScene; expect iterative visual tuning.

export const SCENE_KEYFRAMES = [
  // Hero — medium-wide, slightly above, full desk in frame.
  { section: 'hero', cameraPos: [0, 2.3, 7.4], cameraTarget: [0, 0.6, 0] },
  // About — push in toward laptop/plant, eye-level.
  { section: 'about', cameraPos: [-2.5, 1.8, 5.6], cameraTarget: [-0.4, 0.6, 0] },
  // Stats — pull up to a near-overhead read of the desk.
  { section: 'stats', cameraPos: [0, 6.4, 4.0], cameraTarget: [0, 0.1, -0.2] },
  // Skills — 3/4 from the right, monitor + laptop both visible.
  { section: 'skills', cameraPos: [3.1, 2.6, 5.2], cameraTarget: [0.3, 0.7, -0.2] },
  // Projects — tighter push-in on the laptop (still the closest stop).
  { section: 'projects', cameraPos: [0, 1.6, 3.6], cameraTarget: [0, 0.8, 0.2] },
  // Experience — low side angle, monitor centered.
  { section: 'experience', cameraPos: [3.9, 1.9, 4.6], cameraTarget: [0.5, 0.8, -0.4] },
  // Contact — pull way back, desk small in dark negative space.
  { section: 'contact', cameraPos: [0, 2.7, 11], cameraTarget: [0, 0.4, 0] },
];
