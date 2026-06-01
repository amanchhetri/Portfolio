// sceneKeyframes.js — per-section camera stops, sampled evenly across global
// Lenis scroll progress (0..1) by ScrollCamera. Order matches App.jsx section
// order (Hero → About → Stats → Skills → Projects → Experience → Contact).
// These are starting estimates tuned against the Kenney desk layout in
// WorkspaceScene; expect iterative visual tuning.

export const SCENE_KEYFRAMES = [
  // Hero — medium-wide, slightly above, full desk in frame.
  { section: 'hero', cameraPos: [0, 1.6, 4.6], cameraTarget: [0, 0.7, 0] },
  // About — push in toward laptop/plant, eye-level.
  { section: 'about', cameraPos: [-1.6, 1.2, 3.4], cameraTarget: [-0.4, 0.7, 0] },
  // Stats — pull up to a near-overhead read of the desk.
  { section: 'stats', cameraPos: [0, 4.2, 2.4], cameraTarget: [0, 0.2, -0.2] },
  // Skills — 3/4 from the right, monitor + laptop both visible.
  { section: 'skills', cameraPos: [2.0, 1.7, 3.2], cameraTarget: [0.3, 0.8, -0.2] },
  // Projects — tight push-in on the laptop.
  { section: 'projects', cameraPos: [0, 1.05, 2.1], cameraTarget: [0, 0.85, 0.2] },
  // Experience — low side angle, monitor centered.
  { section: 'experience', cameraPos: [2.6, 1.2, 2.8], cameraTarget: [0.5, 0.85, -0.4] },
  // Contact — pull way back, desk small in dark negative space.
  { section: 'contact', cameraPos: [0, 1.9, 7.2], cameraTarget: [0, 0.5, 0] },
];
