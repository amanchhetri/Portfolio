import {
  DataTexture,
  RGBAFormat,
  SRGBColorSpace,
  LinearFilter,
  PlaneGeometry,
  Mesh,
  MeshBasicMaterial,
  Vector3,
  Matrix4,
  DoubleSide,
} from 'three';

// Draws the screen on a 2D canvas, then uploads it as a DataTexture (raw pixels
// via texImage2D from a typed array — reliable across GL backends, unlike a
// canvas-source texture). Rows are flipped so the image is upright with the
// default DataTexture flipY=false.
export function makeScreenTexture(draw, { w = 512, h = 320 } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  draw(ctx, w, h);

  const src = ctx.getImageData(0, 0, w, h).data;
  const flipped = new Uint8Array(src.length);
  const stride = w * 4;
  for (let y = 0; y < h; y++) {
    flipped.set(src.subarray((h - 1 - y) * stride, (h - y) * stride), y * stride);
  }

  const tex = new DataTexture(flipped, w, h, RGBAFormat);
  tex.colorSpace = SRGBColorSpace;
  tex.magFilter = LinearFilter;
  tex.minFilter = LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

// Kenney screen faces (a) have palette UVs that collapse any image to one color,
// and (b) are merged into the larger `metalDark` primitive (screen + dark trim).
// So we find the screen face by clustering the primitive's triangles by their
// geometric normal and taking the largest non-horizontal cluster (the display,
// not the base/top), then lay a correctly-sized/oriented plane with real UVs
// just in front of it. Parented to the screen mesh → inherits its transform.
export function attachScreenContent(mesh, texture, { inset = 0.92 } = {}) {
  const pos = mesh.geometry.attributes.position;
  const index = mesh.geometry.index;
  const count = index ? index.count : pos.count;
  const vAt = (i) => {
    const j = index ? index.getX(i) : i;
    return new Vector3(pos.getX(j), pos.getY(j), pos.getZ(j));
  };

  const clusters = new Map();
  const eA = new Vector3();
  const eB = new Vector3();
  const nrm = new Vector3();
  const cen = new Vector3();
  for (let i = 0; i < count; i += 3) {
    const a = vAt(i);
    const b = vAt(i + 1);
    const c = vAt(i + 2);
    nrm.crossVectors(eA.subVectors(b, a), eB.subVectors(c, a));
    const area = nrm.length() * 0.5;
    if (area === 0) continue;
    nrm.normalize();
    const key = `${Math.round(nrm.x * 4)},${Math.round(nrm.y * 4)},${Math.round(nrm.z * 4)}`;
    let cl = clusters.get(key);
    if (!cl) {
      cl = { area: 0, n: new Vector3(), c: new Vector3(), verts: [] };
      clusters.set(key, cl);
    }
    cl.area += area;
    cl.n.addScaledVector(nrm, area);
    cl.c.addScaledVector(cen.copy(a).add(b).add(c).multiplyScalar(1 / 3), area);
    cl.verts.push(a, b, c);
  }

  let best = null;
  for (const cl of clusters.values()) {
    if (Math.abs(cl.n.clone().normalize().y) >= 0.7) continue; // skip flat-lying faces
    if (!best || cl.area > best.area) best = cl;
  }
  if (!best) return null;

  // Screen faces AWAY from the camera in local space; flip so the content plane
  // sits on the visible side and faces out.
  const n = best.n.clone().normalize().negate();
  const center = best.c.multiplyScalar(1 / best.area);
  const up = Math.abs(n.y) < 0.9 ? new Vector3(0, 1, 0) : new Vector3(1, 0, 0);
  const t = new Vector3().crossVectors(up, n).normalize();
  const b = new Vector3().crossVectors(n, t).normalize();

  let minT = Infinity, maxT = -Infinity, minB = Infinity, maxB = -Infinity;
  const d = new Vector3();
  for (const vert of best.verts) {
    d.subVectors(vert, center);
    const dt = d.dot(t);
    const db = d.dot(b);
    minT = Math.min(minT, dt); maxT = Math.max(maxT, dt);
    minB = Math.min(minB, db); maxB = Math.max(maxB, db);
  }
  const width = (maxT - minT) * inset;
  const height = (maxB - minB) * inset;

  const plane = new Mesh(
    new PlaneGeometry(width, height),
    new MeshBasicMaterial({ map: texture, toneMapped: false, side: DoubleSide }),
  );
  plane.quaternion.setFromRotationMatrix(new Matrix4().makeBasis(t, b, n));
  plane.position.copy(center).addScaledVector(n, Math.max(width, height) * 0.12);
  plane.renderOrder = 2;
  mesh.add(plane);
  return plane;
}

// Laptop / hero screen — identity card on a lit gradient.
export function drawHeroScreen(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#2a2060');
  g.addColorStop(1, '#0e1230');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.textBaseline = 'middle';

  ctx.fillStyle = '#ffffff';
  ctx.font = `800 ${Math.round(h * 0.27)}px Arial, sans-serif`;
  ctx.fillText('AMAN', w * 0.09, h * 0.42);

  ctx.fillStyle = '#22D3EE';
  ctx.fillRect(w * 0.09, h * 0.6, w * 0.24, Math.max(5, h * 0.03));

  ctx.fillStyle = '#cdd8f7';
  ctx.font = `600 ${Math.round(h * 0.095)}px Arial, sans-serif`;
  ctx.fillText('FRONTEND DEVELOPER', w * 0.09, h * 0.76);
}

// Monitor screen — a stylized code-editor motif on a lit panel.
export function drawCodeScreen(ctx, w, h) {
  ctx.fillStyle = '#0e1628';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#18203a';
  ctx.fillRect(0, 0, w, h * 0.13);

  ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(24 + i * 24, h * 0.065, 7, 0, Math.PI * 2);
    ctx.fill();
  });

  const palette = ['#a78bff', '#22D3EE', '#d6def5', '#7a86a8'];
  const lines = [0.55, 0.72, 0.38, 0.64, 0.47, 0.58, 0.42, 0.5];
  let y = h * 0.26;
  lines.forEach((wd, i) => {
    ctx.fillStyle = palette[i % palette.length];
    const indent = (i % 3) * 28 + 28;
    ctx.fillRect(indent, y, (w - indent - 40) * wd, Math.max(7, h * 0.035));
    y += h * 0.092;
  });
}
