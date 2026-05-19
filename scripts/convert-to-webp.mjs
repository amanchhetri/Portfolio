import sharp from 'sharp';
import { readdir, stat, unlink } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '../../src/assets');

const PHOTO_DIRS = new Set(['projects', 'logo']);
const SKIP_DIRS = new Set(['.git', 'node_modules']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    if (SKIP_DIRS.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (extname(e.name).toLowerCase() === '.png') out.push(p);
  }
  return out;
}

const files = await walk(ROOT);
let savedBefore = 0;
let savedAfter = 0;

for (const png of files) {
  const webp = png.replace(/\.png$/i, '.webp');
  const parentDir = png.split(/[\\/]/).slice(-2, -1)[0];
  const isPhoto = PHOTO_DIRS.has(parentDir);

  const beforeSize = (await stat(png)).size;
  await sharp(png)
    .webp(
      isPhoto
        ? { quality: 82, effort: 5 }
        : { lossless: true, effort: 5 },
    )
    .toFile(webp);
  const afterSize = (await stat(webp)).size;

  savedBefore += beforeSize;
  savedAfter += afterSize;
  console.log(
    `${png.replace(ROOT, '')}: ${(beforeSize / 1024).toFixed(1)}KB → ${(afterSize / 1024).toFixed(1)}KB (${Math.round(
      (1 - afterSize / beforeSize) * 100,
    )}% smaller)`,
  );
  await unlink(png);
}

console.log(
  `\nTotal: ${(savedBefore / 1024).toFixed(1)}KB → ${(savedAfter / 1024).toFixed(1)}KB (saved ${(
    (savedBefore - savedAfter) /
    1024
  ).toFixed(1)}KB, ${Math.round((1 - savedAfter / savedBefore) * 100)}% reduction)`,
);
