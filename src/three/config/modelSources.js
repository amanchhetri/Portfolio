// modelSources.js — registry of every .glb in /public/models with credits.
// Kenney Furniture Kit is CC0 (attribution optional, included as good practice).
// Updated as later phases add monitor / lamp / plant.

export const MODEL_SOURCES = [
  {
    key: 'desk',
    path: '/models/desk.glb',
    title: 'Furniture Kit — Desk',
    author: 'Kenney',
    license: 'CC0-1.0',
    sourceUrl: 'https://kenney.nl/assets/furniture-kit',
  },
  {
    key: 'laptop',
    path: '/models/laptop.glb',
    title: 'Furniture Kit — Laptop',
    author: 'Kenney',
    license: 'CC0-1.0',
    sourceUrl: 'https://kenney.nl/assets/furniture-kit',
  },
  {
    key: 'monitor',
    path: '/models/monitor.glb',
    title: 'Furniture Kit — Computer Screen',
    author: 'Kenney',
    license: 'CC0-1.0',
    sourceUrl: 'https://kenney.nl/assets/furniture-kit',
  },
  {
    key: 'lamp',
    path: '/models/lamp.glb',
    title: 'Furniture Kit — Round Table Lamp',
    author: 'Kenney',
    license: 'CC0-1.0',
    sourceUrl: 'https://kenney.nl/assets/furniture-kit',
  },
  {
    key: 'plant',
    path: '/models/plant.glb',
    title: 'Furniture Kit — Potted Plant',
    author: 'Kenney',
    license: 'CC0-1.0',
    sourceUrl: 'https://kenney.nl/assets/furniture-kit',
  },
];

export const getCreditsList = () => MODEL_SOURCES;
