import { storyChapters } from '@/story/chapters';
import { drawCharacter, type CharacterPose } from './Character';
import {
  band,
  clamp,
  ellipse,
  lerp,
  line,
  mixColor,
  polygon,
  seed,
  smooth,
  star,
  TAU,
  type Point,
} from './geometry';

export type WorldFrame = {
  width: number;
  height: number;
  progress: number;
  day: number;
  time: number;
  pointer: Point;
  walk: number;
  idle: number;
  artifacts: readonly string[];
  reaction?: { kind: 'inspect' | 'celebrate' | 'wave' | 'reach'; id: number; age: number };
};
type Palette = {
  sky: string;
  low: string;
  ink: string;
  rim: string;
  land: string;
  near: string;
  signal: string;
  metal: string;
};
const signalRoute = [
  [0.76, 0.3],
  [0.73, 0.67],
  [0.66, 0.53],
  [0.76, 0.49],
  [0.77, 0.53],
  [0.78, 0.5],
  [0.79, 0.36],
  [0.78, 0.35],
  [0.76, 0.22],
  [0.75, 0.35],
  [0.73, 0.45],
  [0.76, 0.48],
  [0.77, 0.56],
  [0.76, 0.49],
  [0.78, 0.48],
  [0.79, 0.4],
  [0.77, 0.27],
];

export function getStorySignal(progress: number, width: number, height: number): Point {
  const i = Math.floor(clamp(progress, 0, 16));
  const j = Math.min(16, i + 1);
  const t = smooth(0, 1, progress - i);
  return {
    x: lerp(signalRoute[i][0], signalRoute[j][0], t) * width,
    y: lerp(signalRoute[i][1], signalRoute[j][1], t) * height,
  };
}
function palette(day: number, space: number): Palette {
  return {
    sky: mixColor(
      mixColor('#071523', '#020b1b', space),
      mixColor('#e6eef0', '#dce7ed', space),
      day,
    ),
    low: mixColor(
      mixColor('#2c4757', '#0d2440', space),
      mixColor('#efdbc0', '#c6dbe7', space),
      day,
    ),
    ink: mixColor('#38536a', '#a9bbc1', day),
    rim: mixColor('#8baeb9', '#5e7b96', day),
    land: mixColor('#102e3a', '#a2b7ae', day),
    near: mixColor('#09202b', '#768e83', day),
    signal: mixColor('#f0d598', '#b87c33', day),
    metal: mixColor('#1e3d51', '#c7d4d7', day),
  };
}
function sky(ctx: CanvasRenderingContext2D, f: WorldFrame, c: Palette, space: number) {
  const { width: w, height: h, day, time, progress: p } = f;
  const gradient = ctx.createLinearGradient(0, 0, w * 0.12, h);
  gradient.addColorStop(0, c.sky);
  gradient.addColorStop(0.6, mixColor(c.sky, c.low, 0.45));
  gradient.addColorStop(1, c.low);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
  const halo = ctx.createRadialGradient(w * 0.76, h * 0.56, 0, w * 0.76, h * 0.56, w * 0.55);
  halo.addColorStop(0, day > 0.5 ? 'rgba(255,241,209,.32)' : 'rgba(73,119,132,.10)');
  halo.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, w, h);
  // Long, hand-drawn atmospheric bands place a quiet scale behind the small protagonist.
  ctx.save();
  ctx.globalAlpha = (1 - space) * (0.09 + day * 0.08);
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = day ? '#fff2dc' : '#86aebf';
    ctx.beginPath();
    ctx.moveTo(w * (0.05 + i * 0.02), h * (0.43 + i * 0.06));
    ctx.bezierCurveTo(
      w * 0.31,
      h * (0.24 + i * 0.07),
      w * 0.8,
      h * (0.47 + i * 0.09),
      w * 1.08,
      h * (0.31 + i * 0.08),
    );
    ctx.stroke();
  }
  ctx.restore();
  // One sky catalogue survives every location. Its faint day form is observatory-like rather than inverted neon.
  const starOpacity = (1 - day * 0.93) * (0.65 + space * 0.35);
  ctx.save();
  ctx.globalAlpha = starOpacity;
  const count = w < 650 ? 64 : 104;
  for (let i = 0; i < count; i++) {
    const x = seed(i + 2) * w + f.pointer.x * ((i % 3) + 1) * 2;
    const y = seed(i + 251) * h * 0.77;
    const radius = i % 13 === 0 ? 1.25 : 0.45 + seed(i + 332) * 0.45;
    const twinkle = 0.65 + Math.sin(time * 0.4 + i) * 0.18;
    ctx.globalAlpha = starOpacity * twinkle;
    if (i % 19 === 0) star(ctx, x, y, 3, c.signal, 0.2);
    else ellipse(ctx, x, y, radius, radius, i % 5 === 0 ? '#c7d9e1' : '#8aa6bb', 0, true);
  }
  ctx.restore();
  // The moon sets as the sun rises: two actual celestial paths, not a CSS inversion.
  const r = Math.min(w, h) * (w < 650 ? 0.062 : 0.061);
  for (let celestial = 0; celestial < 2; celestial++) {
    const sun = celestial === 1;
    const opacity = (sun ? day : 1 - day) * (1 - space * 0.8);
    if (opacity < 0.002) continue;
    const cx = w * (sun ? 0.69 : 0.78);
    const cy = h * (sun ? 0.91 - smooth(0, 1, day) * 0.55 : 0.22 + smooth(0, 1, day) * 0.65);
    ctx.save();
    ctx.globalAlpha = opacity;
    const glow = ctx.createRadialGradient(cx, cy, r * 0.7, cx, cy, r * 4.4);
    glow.addColorStop(0, sun ? 'rgba(246,216,153,.23)' : 'rgba(218,225,213,.06)');
    glow.addColorStop(1, 'rgba(230,220,190,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(cx - r * 5, cy - r * 5, r * 10, r * 10);
    ellipse(ctx, cx, cy, r, r, sun ? '#e5bd77' : '#d9dfcf', 0, true);
    if (!sun) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, TAU);
      ctx.clip();
      ctx.globalAlpha *= 0.12;
      ctx.lineWidth = 0.7;
      for (let i = 0; i < 9; i++)
        ellipse(
          ctx,
          cx + (seed(i + 7) - 0.5) * r * 1.4,
          cy + (seed(i + 67) - 0.5) * r * 1.5,
          r * (0.08 + seed(i + 32) * 0.22),
          r * 0.09,
          '#29465a',
          -0.4,
        );
      ctx.restore();
    }
    ctx.restore();
  }
  // Diffuse clouds enter with daylight and reappear during the same launch ascent.
  const cloudWeight = day * (1 - space) * 0.46 + band(7.8, 8.35, 8.8, 9.1, p) * 0.8;
  if (cloudWeight > 0.005) {
    ctx.save();
    ctx.globalAlpha = cloudWeight;
    for (let i = 0; i < 5; i++) {
      const x = w * (seed(i + 77) * 1.4 - 0.2) + ((time * 0.7) % (w * 0.2));
      const y = h * (0.23 + seed(i + 153) * 0.32) + smooth(7.8, 9, p) * h * 0.3;
      const spread = w * (0.12 + seed(i + 35) * 0.13);
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1, 0.18);
      const cloud = ctx.createRadialGradient(0, 0, 2, 0, 0, spread);
      cloud.addColorStop(0, 'rgba(255,249,231,.43)');
      cloud.addColorStop(1, 'rgba(255,249,231,0)');
      ctx.fillStyle = cloud;
      ctx.fillRect(-spread, -spread, spread * 2, spread * 2);
      ctx.restore();
    }
    ctx.restore();
  }
}
function terrain(
  ctx: CanvasRenderingContext2D,
  f: WorldFrame,
  c: Palette,
  ground: number,
  engineering: number,
) {
  const { width: w, height: h, day, time } = f;
  const horizon = h * (w < 650 ? 0.77 : 0.79);
  ctx.save();
  ctx.globalAlpha = ground;
  // Three continuous land planes become the workshop floor, service traces, and finally a quiet field again.
  for (let plane = 0; plane < 3; plane++) {
    const yy = horizon + (plane - 1) * h * 0.035;
    ctx.beginPath();
    ctx.moveTo(-w * 0.1, h * 1.03);
    ctx.lineTo(-w * 0.1, yy + h * 0.03);
    ctx.bezierCurveTo(w * 0.2, yy - h * 0.045, w * 0.38, yy + h * 0.08, w * 0.58, yy + h * 0.005);
    ctx.bezierCurveTo(w * 0.76, yy - h * 0.058, w * 0.88, yy - h * 0.015, w * 1.1, yy + h * 0.02);
    ctx.lineTo(w * 1.1, h * 1.05);
    ctx.closePath();
    ctx.fillStyle = mixColor(c.land, c.near, plane * 0.38);
    ctx.fill();
    ctx.strokeStyle = mixColor(c.ink, c.signal, 0.08);
    ctx.lineWidth = 0.7;
    ctx.globalAlpha = ground * (0.7 - plane * 0.13);
    ctx.stroke();
    ctx.globalAlpha = ground;
  }
  // A thin warm footpath is also the future trace / cable / launch trajectory.
  ctx.save();
  ctx.globalAlpha *= 0.4;
  ctx.strokeStyle = c.signal;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(w * 0.17, h * 1.04);
  ctx.bezierCurveTo(w * 0.36, h * 0.86, w * 0.65, h * 0.91, w * 0.75, h * 0.785);
  ctx.stroke();
  ctx.restore();
  const grassWeight = (1 - engineering) * ground;
  ctx.save();
  ctx.globalAlpha = grassWeight * (0.42 - day * 0.08);
  ctx.strokeStyle = mixColor('#658b88', '#c4cead', day);
  ctx.lineWidth = 0.8;
  for (let i = 0; i < (w < 650 ? 45 : 96); i++) {
    const x = seed(i + 19) * w;
    const y = h * (0.805 + seed(i + 52) * 0.2);
    const size = 6 + seed(i + 39) * 20;
    const sway = Math.sin(time * 0.65 + i) * 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x - 2, y - size * 0.5, x + sway - 4, y - size);
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 3, y - size * 0.3, x + sway + 7, y - size * 0.62);
    ctx.stroke();
  }
  ctx.restore();
  if (engineering > 0.002) {
    ctx.save();
    ctx.globalAlpha = ground * engineering * 0.32;
    ctx.strokeStyle = c.rim;
    ctx.lineWidth = 0.65;
    for (let i = 0; i < 15; i++) {
      const x = w * (i / 14);
      ctx.beginPath();
      ctx.moveTo(w * 0.68, horizon - h * 0.01);
      ctx.lineTo(x, h * 1.1);
      ctx.stroke();
    }
    for (let i = 0; i < 8; i++) {
      const yy = horizon + Math.pow(i / 7, 1.7) * h * 0.25;
      line(
        ctx,
        [
          { x: 0, y: yy },
          { x: w, y: yy },
        ],
        c.rim,
        0.6,
      );
    }
    ctx.restore();
  }
  ctx.restore();
  return horizon;
}

// All 24 roots remain the same objects. Their positions interpolate instead of introducing unrelated sets of scenery.
function anchorTarget(index: number, chapter: number, w: number, h: number): Point {
  const col = index % 6,
    row = Math.floor(index / 6);
  const spread = seed(index + 841);
  if (chapter <= 1)
    return { x: w * (0.36 + col * 0.11 + spread * 0.035), y: h * (0.79 + row * 0.033) };
  if (chapter === 2) return { x: w * (0.42 + col * 0.105), y: h * (0.63 + row * 0.062) };
  if (chapter === 3 || chapter === 4) {
    if (index % 3 === 0) {
      const object = index / 3;
      return { x: w * (0.54 + (object % 3) * 0.16), y: h * (0.5 + Math.floor(object / 3) * 0.13) };
    }
    return { x: w * (0.48 + col * 0.085), y: h * (0.55 + row * 0.08) };
  }
  if (chapter === 5) return { x: w * (0.47 + col * 0.085), y: h * (0.38 + row * 0.12) };
  if (chapter === 6) return { x: w * (0.47 + col * 0.092), y: h * (0.72 + row * 0.035) };
  if (chapter === 7 || chapter === 8) {
    if (index < 12)
      return {
        x: w * 0.78 + (index % 2 ? 1 : -1) * w * 0.016,
        y: h * (0.39 + Math.floor(index / 2) * 0.063),
      };
    return {
      x: w * (0.64 + (index % 4) * 0.08),
      y: h * (0.79 + Math.floor((index - 12) / 4) * 0.025),
    };
  }
  if (chapter === 9 || chapter === 10) {
    const a = index * 0.733;
    const r = 0.14 + Math.floor(index / 8) * 0.052;
    return { x: w * (0.74 + Math.cos(a) * r), y: h * (0.48 + Math.sin(a) * r * 0.8) };
  }
  if (chapter === 11) return { x: w * (0.51 + col * 0.084), y: h * (0.38 + row * 0.105) };
  if (chapter === 12)
    return { x: w * (0.65 + (index % 2) * 0.24), y: h * (0.3 + Math.floor(index / 2) * 0.042) };
  if (chapter === 13) return { x: w * (0.47 + col * 0.093), y: h * (0.39 + row * 0.105) };
  if (chapter === 14 || chapter === 15)
    return { x: w * (0.65 + (index % 2) * 0.26), y: h * (0.29 + Math.floor(index / 2) * 0.041) };
  return { x: w * (0.35 + col * 0.115), y: h * (0.79 + row * 0.03) };
}
function drawTree(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  height: number,
  c: Palette,
  alpha: number,
  time: number,
  index: number,
) {
  if (alpha < 0.005) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  const sway = Math.sin(time * 0.35 + index) * 2;
  const branches = 3;
  line(
    ctx,
    [
      { x, y },
      { x: x + sway, y: y - height },
    ],
    c.rim,
    0.9,
  );
  for (let j = 0; j < branches; j++) {
    const yy = y - height * (0.37 + j * 0.22);
    const reach = height * (0.26 - j * 0.025);
    line(
      ctx,
      [
        { x, y: yy + height * 0.1 },
        { x: x - reach, y: yy - reach * 0.5 },
        { x: x - reach * 1.1, y: yy - reach * 0.75 },
      ],
      c.rim,
      0.8,
    );
    line(
      ctx,
      [
        { x, y: yy },
        { x: x + reach, y: yy - reach * 0.6 },
        { x: x + reach * 1.15, y: yy - reach * 0.9 },
      ],
      c.rim,
      0.8,
    );
    ellipse(ctx, x - reach * 1.1, yy - reach * 0.75, 2.3, 2.3, c.signal, 0, true);
    ellipse(ctx, x + reach * 1.15, yy - reach * 0.9, 1.7, 1.7, c.rim, 0, true);
  }
  if (index % 4 === 0) {
    ctx.font = '10px monospace';
    ctx.fillStyle = c.signal;
    ctx.fillText(index % 2 ? '[]' : '{}', x + 5, y - height * 0.72);
  }
  ctx.restore();
}
function machine(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  index: number,
  c: Palette,
  alpha: number,
  time: number,
) {
  if (alpha < 0.005) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.lineWidth = 0.85;
  const type = index % 8;
  // Specific little machines: a relay, intelligence lens, authorization lock, map, beacon, logic fork, console, ledger.
  ellipse(ctx, x, y + size * 0.4, size * 0.72, size * 0.16, c.ink, 0, true);
  line(
    ctx,
    [
      { x: x - size * 0.4, y: y + size * 0.35 },
      { x: x - size * 0.4, y: y - size * 0.32 },
      { x: x + size * 0.4, y: y - size * 0.32 },
      { x: x + size * 0.4, y: y + size * 0.35 },
    ],
    c.rim,
    0.9,
  );
  if (type === 0) {
    for (let j = 0; j < 3; j++) {
      ellipse(ctx, x, y - size * 0.12 + j * size * 0.16, size * 0.36, size * 0.1, c.rim);
      ellipse(ctx, x + size * 0.2, y - size * 0.13 + j * size * 0.16, 1.1, 1.1, c.signal, 0, true);
    }
    line(
      ctx,
      [
        { x, y: y - size * 0.3 },
        { x, y: y - size * 0.65 },
      ],
      c.rim,
    );
  }
  if (type === 1) {
    ellipse(ctx, x, y - size * 0.16, size * 0.28, size * 0.28, c.rim);
    ellipse(ctx, x, y - size * 0.16, size * 0.39, size * 0.13, c.signal, -0.4);
    star(ctx, x, y - size * 0.16, 3, c.signal, time * 0.1);
  }
  if (type === 2) {
    ctx.strokeStyle = c.rim;
    ctx.strokeRect(x - size * 0.2, y - size * 0.2, size * 0.4, size * 0.34);
    ctx.beginPath();
    ctx.arc(x, y - size * 0.24, size * 0.16, Math.PI, TAU);
    ctx.stroke();
    ellipse(ctx, x, y - size * 0.04, 1.7, 1.7, c.signal, 0, true);
  }
  if (type === 3) {
    polygon(
      ctx,
      [
        { x: x - size * 0.45, y: y - size * 0.18 },
        { x: x + size * 0.2, y: y - size * 0.36 },
        { x: x + size * 0.48, y: y - size * 0.05 },
        { x: x - size * 0.2, y: y + size * 0.09 },
      ],
      c.metal,
      c.rim,
    );
    for (let j = 0; j < 3; j++)
      line(
        ctx,
        [
          { x: x - size * 0.3 + j * size * 0.21, y: y - size * 0.13 },
          { x: x - size * 0.2 + j * size * 0.21, y: y - size * 0.25 },
        ],
        c.signal,
        0.5,
      );
  }
  if (type === 4) {
    line(
      ctx,
      [
        { x, y: y + size * 0.2 },
        { x, y: y - size * 0.5 },
      ],
      c.rim,
      1.2,
    );
    for (let j = 1; j < 4; j++) {
      ctx.beginPath();
      ctx.arc(x, y - size * 0.4, j * size * 0.15, -Math.PI * 0.85, -Math.PI * 0.15);
      ctx.strokeStyle = c.rim;
      ctx.stroke();
    }
    ellipse(ctx, x, y - size * 0.4, 2, 2, c.signal, 0, true);
  }
  if (type === 5) {
    line(
      ctx,
      [
        { x, y: y + size * 0.15 },
        { x, y: y - size * 0.1 },
        { x: x - size * 0.2, y: y - size * 0.35 },
      ],
      c.rim,
    );
    line(
      ctx,
      [
        { x, y: y - size * 0.1 },
        { x: x + size * 0.23, y: y - size * 0.33 },
      ],
      c.rim,
    );
    [-1, 1].forEach((d) =>
      ellipse(ctx, x + d * size * 0.22, y - size * 0.34, 3, 3, c.signal, 0, true),
    );
  }
  if (type === 6) {
    polygon(
      ctx,
      [
        { x: x - size * 0.3, y: y - size * 0.3 },
        { x: x + size * 0.3, y: y - size * 0.3 },
        { x: x + size * 0.35, y: y + size * 0.03 },
        { x: x - size * 0.35, y: y + size * 0.03 },
      ],
      c.metal,
      c.rim,
    );
    line(
      ctx,
      [
        { x: x - size * 0.12, y: y - size * 0.16 },
        { x, y: y - size * 0.07 },
        { x: x + size * 0.12, y: y - size * 0.16 },
      ],
      c.signal,
    );
  }
  if (type === 7) {
    for (let j = 0; j < 3; j++) {
      ctx.strokeStyle = c.rim;
      ctx.strokeRect(x - size * 0.25, y - size * 0.35 + j * size * 0.13, size * 0.5, size * 0.12);
    }
    line(
      ctx,
      [
        { x: x - size * 0.13, y: y - size * 0.29 },
        { x: x + size * 0.07, y: y - size * 0.29 },
      ],
      c.signal,
    );
  }
  ctx.restore();
}
function architecture(ctx: CanvasRenderingContext2D, f: WorldFrame, c: Palette) {
  const { width: w, height: h, progress: p, time } = f;
  const lower = Math.floor(p),
    blend = smooth(0, 1, p - lower);
  const forest = band(1.4, 2.05, 2.7, 3.45, p);
  const workshop = band(2.5, 3.0, 4.35, 5.1, p);
  const network = band(3.7, 4.9, 5.55, 6.5, p);
  const city = band(5.65, 6.3, 6.9, 7.55, p);
  const orbit = band(8.6, 9.2, 10.35, 11.1, p);
  const lab = band(10.4, 11, 11.55, 12.3, p);
  const memory = band(12.65, 13.1, 13.5, 14.15, p);
  const codeSolved = f.artifacts.includes('code');
  const protectedNetwork = f.artifacts.includes('shield');
  const points = Array.from({ length: 24 }, (_, i) => {
    const a = anchorTarget(i, lower, w, h),
      b = anchorTarget(i, Math.min(16, lower + 1), w, h);
    const x = lerp(a.x, b.x, blend),
      y = lerp(a.y, b.y, blend);
    const organize = codeSolved ? forest * 0.32 : 0;
    return {
      x: lerp(x, w * (0.52 + (i % 6) * 0.075), organize),
      y: lerp(y, h * (0.41 + Math.floor(i / 6) * 0.1), organize),
    };
  });
  // Branches become conductive edges; the packet is the same warm light first seen in the field.
  const edgeAlpha =
    network * 0.56 +
    city * 0.26 +
    orbit * 0.35 +
    lab * 0.25 +
    memory * 0.1 +
    (codeSolved ? forest * 0.65 : 0);
  if (edgeAlpha > 0.002) {
    ctx.save();
    ctx.globalAlpha = edgeAlpha;
    ctx.setLineDash(network > 0.4 ? [3, 8] : []);
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i],
        b = points[i + 1];
      if (Math.hypot(b.x - a.x, b.y - a.y) > w * 0.4) continue;
      const corrupted = network > 0.3 && i === 14 && !protectedNetwork;
      line(ctx, [a, { x: b.x, y: a.y }, b], corrupted ? '#d3a095' : c.rim, 0.75);
      const travel = (time * 0.15 + i * 0.13) % 1;
      ellipse(
        ctx,
        lerp(a.x, b.x, travel),
        lerp(a.y, b.y, travel),
        corrupted ? 2.3 : 1.4,
        corrupted ? 2.3 : 1.4,
        corrupted ? '#d4a090' : c.signal,
        0,
        true,
      );
    }
    ctx.setLineDash([]);
    ctx.restore();
  }
  points.forEach((point, i) => {
    const depth = 0.55 + (i % 4) * 0.15;
    const size = Math.min(w * 0.038, 36) * depth;
    drawTree(
      ctx,
      point.x,
      point.y,
      h * (0.13 + seed(i + 77) * 0.07) * depth,
      c,
      forest * (0.4 + depth * 0.5),
      time,
      i,
    );
    if (workshop > 0.002 && i % 3 === 0)
      machine(ctx, point.x, point.y, size * 1.6, i / 3, c, workshop, time);
    if (network > 0.002) {
      ctx.save();
      ctx.globalAlpha = network * 0.8;
      const bad = i === 15 && !protectedNetwork;
      ctx.lineWidth = 0.8;
      ellipse(ctx, point.x, point.y, size * 0.23, size * 0.23, bad ? '#dba294' : c.rim, 0, true);
      ellipse(ctx, point.x, point.y, size * 0.35, size * 0.35, bad ? '#dba294' : c.rim);
      ctx.restore();
    }
    if (city > 0.002) {
      ctx.save();
      ctx.globalAlpha = city * 0.8;
      const towerH = h * (0.08 + seed(i + 155) * 0.16);
      const towerW = size * 0.6;
      polygon(
        ctx,
        [
          { x: point.x - towerW, y: point.y },
          { x: point.x - towerW, y: point.y - towerH },
          { x: point.x, y: point.y - towerH - towerW * 0.4 },
          { x: point.x + towerW, y: point.y - towerH },
          { x: point.x + towerW, y: point.y },
        ],
        c.metal,
        c.rim,
      );
      for (let j = 0; j < 4; j++)
        line(
          ctx,
          [
            { x: point.x - towerW * 0.5, y: point.y - towerH * 0.7 + j * 8 },
            { x: point.x + towerW * 0.5, y: point.y - towerH * 0.7 + j * 8 },
          ],
          j === 1 ? c.signal : c.rim,
          0.7,
        );
      ctx.restore();
    }
    if (orbit > 0.002) {
      ctx.save();
      ctx.globalAlpha = orbit * (0.3 + depth * 0.5);
      ellipse(ctx, point.x, point.y, size * 0.45, size * 0.14, c.rim, -0.4);
      star(ctx, point.x, point.y, size * 0.13, c.signal);
      if (i % 6 === 0) {
        line(
          ctx,
          [
            { x: point.x - size * 0.5, y: point.y },
            { x: point.x + size * 0.5, y: point.y },
          ],
          c.rim,
          0.8,
        );
        ctx.strokeStyle = c.rim;
        ctx.strokeRect(point.x - size * 0.6, point.y - size * 0.15, size * 0.3, size * 0.3);
        ctx.strokeRect(point.x + size * 0.3, point.y - size * 0.15, size * 0.3, size * 0.3);
      }
      ctx.restore();
    }
    if (lab > 0.002 && i % 3 === 0) {
      ctx.save();
      ctx.globalAlpha = lab * 0.7;
      ellipse(ctx, point.x, point.y - size * 0.2, size * 0.55, size * 0.7, c.rim);
      ellipse(ctx, point.x, point.y - size * 0.2, size * 0.25, size * 0.35, c.signal, -0.2);
      line(
        ctx,
        [
          { x: point.x - size * 0.5, y: point.y + size * 0.4 },
          { x: point.x + size * 0.5, y: point.y + size * 0.4 },
        ],
        c.rim,
        2,
      );
      ctx.restore();
    }
    if (memory > 0.002 && i % 3 === 0) {
      ctx.save();
      ctx.globalAlpha = memory * 0.65;
      ctx.strokeStyle = c.rim;
      ctx.lineWidth = 0.8;
      const rw = Math.min(w * 0.065, 76),
        rh = rw * 0.67;
      ctx.strokeRect(point.x - rw * 0.5, point.y - rh, rw, rh);
      ctx.beginPath();
      ctx.moveTo(point.x - rw * 0.35, point.y - rh * 0.28);
      ctx.lineTo(point.x + rw * 0.3, point.y - rh * 0.28);
      ctx.stroke();
      star(ctx, point.x, point.y - rh * 0.67, 4, c.signal);
      ctx.restore();
    }
  });
  // The large observatory sweep provides architecture, perspective, and a place for the girl in orbit.
  const station = band(8.7, 9.4, 11.6, 12.4, p);
  if (station > 0.002) {
    ctx.save();
    ctx.globalAlpha = station * 0.38;
    ctx.lineWidth = 0.8;
    ellipse(ctx, w * 0.74, h * 0.58, w * 0.33, h * 0.36, c.rim, -0.04);
    ellipse(ctx, w * 0.74, h * 0.58, w * 0.35, h * 0.38, c.rim, -0.04);
    line(
      ctx,
      [
        { x: w * 0.45, y: h * 0.79 },
        { x: w * 0.99, y: h * 0.79 },
      ],
      c.rim,
      1,
    );
    ctx.restore();
  }
}

function rocket(ctx: CanvasRenderingContext2D, f: WorldFrame, c: Palette) {
  const { width: w, height: h, progress: p, time } = f;
  const visible = band(6.45, 7.05, 8.75, 9.15, p);
  if (visible < 0.002) return;
  const assemble = smooth(6.45, 7.45, p);
  const launch = smooth(7.95, 8.9, p);
  const base = h * 0.79 - launch * h * 0.9;
  const x = w * 0.78;
  const rocketH = Math.min(h * 0.39, w * 0.41);
  const rw = rocketH * 0.115;
  ctx.save();
  ctx.globalAlpha = visible;
  ctx.lineWidth = 0.9;
  // The city's service layers converge into the modules of one machine.
  for (let side = -1; side <= 1; side += 2) {
    ctx.save();
    ctx.globalAlpha *= 1 - launch;
    line(
      ctx,
      [
        { x: x + side * rw * 2.8, y: h * 0.81 },
        { x: x + side * rw * 2.8, y: h * 0.45 },
        { x: x + side * rw * 1.25, y: h * 0.45 },
      ],
      c.rim,
      1,
    );
    for (let j = 0; j < 6; j++)
      line(
        ctx,
        [
          { x: x + side * rw * 2.8, y: h * (0.48 + j * 0.05) },
          { x: x + side * rw * 3.5, y: h * (0.48 + j * 0.05) + rw * 0.7 },
        ],
        c.ink,
        0.7,
      );
    ctx.restore();
  }
  for (let i = 0; i < 6; i++) {
    const offset = (1 - assemble) * (i % 2 ? 1 : -1) * w * (0.1 + i * 0.009);
    const yy = base - rocketH * (0.11 + i * 0.125);
    const fill = ctx.createLinearGradient(x - rw + offset, 0, x + rw + offset, 0);
    fill.addColorStop(0, c.ink);
    fill.addColorStop(0.38, mixColor('#c2cecb', '#f4f0df', f.day));
    fill.addColorStop(1, c.metal);
    polygon(
      ctx,
      [
        { x: x - rw + offset, y: yy },
        { x: x - rw + offset, y: yy - rocketH * 0.13 },
        { x: x + rw + offset, y: yy - rocketH * 0.13 },
        { x: x + rw + offset, y: yy },
      ],
      fill,
      c.rim,
    );
    line(
      ctx,
      [
        { x: x - rw * 0.7 + offset, y: yy - rocketH * 0.1 },
        { x: x + rw * 0.7 + offset, y: yy - rocketH * 0.1 },
      ],
      i === 3 ? c.signal : c.ink,
      0.7,
    );
  }
  const nose = base - rocketH * 0.86;
  ctx.beginPath();
  ctx.moveTo(x - rw, nose);
  ctx.bezierCurveTo(
    x - rw * 0.9,
    nose - rocketH * 0.13,
    x - rw * 0.2,
    nose - rocketH * 0.21,
    x,
    nose - rocketH * 0.24,
  );
  ctx.bezierCurveTo(
    x + rw * 0.25,
    nose - rocketH * 0.2,
    x + rw * 0.95,
    nose - rocketH * 0.1,
    x + rw,
    nose,
  );
  ctx.closePath();
  ctx.fillStyle = mixColor('#c5cecb', '#ede9d9', f.day);
  ctx.fill();
  ctx.strokeStyle = c.rim;
  ctx.stroke();
  polygon(
    ctx,
    [
      { x: x - rw, y: base - rocketH * 0.26 },
      { x: x - rw * 2.1, y: base - rocketH * 0.05 },
      { x: x - rw * 1.7, y: base + rocketH * 0.015 },
      { x: x - rw * 0.7, y: base - rocketH * 0.045 },
    ],
    c.metal,
    c.rim,
  );
  polygon(
    ctx,
    [
      { x: x + rw, y: base - rocketH * 0.26 },
      { x: x + rw * 2.1, y: base - rocketH * 0.05 },
      { x: x + rw * 1.7, y: base + rocketH * 0.015 },
      { x: x + rw * 0.7, y: base - rocketH * 0.045 },
    ],
    c.metal,
    c.rim,
  );
  ellipse(ctx, x, base - rocketH * 0.57, rw * 0.44, rw * 0.57, '#25495d', 0, true);
  ellipse(ctx, x, base - rocketH * 0.57, rw * 0.5, rw * 0.64, c.signal);
  const ignition = smooth(7.9, 8.23, p);
  if (ignition > 0.002) {
    ctx.save();
    ctx.globalAlpha = ignition;
    const flameH = rocketH * (0.25 + launch * 0.65);
    const flame = ctx.createLinearGradient(x, base, x, base + flameH);
    flame.addColorStop(0, '#fff3ca');
    flame.addColorStop(0.2, '#f0ce8a');
    flame.addColorStop(1, 'rgba(236,179,100,0)');
    ctx.beginPath();
    ctx.moveTo(x - rw * 0.7, base - rocketH * 0.055);
    ctx.bezierCurveTo(
      x - rw,
      base + flameH * 0.35,
      x + Math.sin(time * 7) * rw * 0.3,
      base + flameH * 0.8,
      x,
      base + flameH,
    );
    ctx.bezierCurveTo(
      x + rw * 0.4,
      base + flameH * 0.6,
      x + rw,
      base + flameH * 0.2,
      x + rw * 0.7,
      base - rocketH * 0.055,
    );
    ctx.closePath();
    ctx.fillStyle = flame;
    ctx.fill();
    ctx.restore();
  }
  // Scroll ascent moves the ground and clouds under the same hull. No scene cut or navigation jump.
  if (launch > 0.01) {
    ctx.save();
    ctx.globalAlpha = launch * (1 - launch * 0.55);
    for (let i = 0; i < 6; i++) {
      const xx = x + (seed(i + 55) - 0.5) * rocketH * 2;
      const yy = h * 0.78 + launch * h * 0.45 + seed(i + 76) * h * 0.1;
      ellipse(
        ctx,
        xx,
        yy,
        rocketH * (0.16 + seed(i + 92) * 0.13),
        rocketH * 0.05,
        mixColor('#9ab6bc', '#fff3da', f.day),
        0,
        true,
      );
    }
    ctx.restore();
  }
  ctx.restore();
}

function doorAndMirror(ctx: CanvasRenderingContext2D, f: WorldFrame, c: Palette) {
  const { width: w, height: h, progress: p, day, time } = f;
  const door = band(11.5, 12.0, 12.7, 13.15, p);
  const mirror = band(13.5, 14.0, 15.55, 16, p);
  const alpha = Math.max(door, mirror);
  if (alpha < 0.002) return;
  const x = w * 0.78;
  const yy = h * 0.28;
  const frameH = h * 0.49;
  const frameW = Math.min(w * 0.19, h * 0.27);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.lineWidth = 0.9;
  ctx.strokeStyle = c.rim;
  ctx.strokeRect(x - frameW * 0.5, yy, frameW, frameH);
  ctx.strokeRect(x - frameW * 0.5 - 5, yy - 5, frameW + 10, frameH + 10);
  const glass = ctx.createLinearGradient(x - frameW * 0.5, yy, x + frameW * 0.5, yy + frameH);
  glass.addColorStop(0, mixColor('#1e435b', '#f1ede1', day));
  glass.addColorStop(0.5, mixColor('#102a43', '#d4e1e5', day));
  glass.addColorStop(1, mixColor('#2b5365', '#faf2db', day));
  ctx.fillStyle = glass;
  ctx.globalAlpha = alpha * 0.55;
  ctx.fillRect(x - frameW * 0.5, yy, frameW, frameH);
  ctx.globalAlpha = alpha;
  if (door > 0.01) {
    const opened = Math.max(smooth(12.25, 12.85, p), f.artifacts.includes('why') ? 1 : 0);
    ctx.save();
    ctx.globalAlpha = door * (1 - opened * 0.6);
    polygon(
      ctx,
      [
        { x: x - frameW * 0.5, y: yy },
        { x: x - opened * frameW * 0.44, y: yy + opened * frameH * 0.04 },
        { x: x - opened * frameW * 0.44, y: yy + frameH - opened * frameH * 0.04 },
        { x: x - frameW * 0.5, y: yy + frameH },
      ],
      c.metal,
      c.rim,
    );
    polygon(
      ctx,
      [
        { x: x + frameW * 0.5, y: yy },
        { x: x + opened * frameW * 0.44, y: yy + opened * frameH * 0.04 },
        { x: x + opened * frameW * 0.44, y: yy + frameH - opened * frameH * 0.04 },
        { x: x + frameW * 0.5, y: yy + frameH },
      ],
      c.metal,
      c.rim,
    );
    ctx.font = `${w < 650 ? 10 : 14}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillStyle = c.signal;
    ctx.fillText('WHY?', x, yy + frameH * 0.57);
    ctx.restore();
  }
  if (mirror > 0.01) {
    ctx.save();
    ctx.globalAlpha = mirror * 0.9;
    const age = smooth(14.0, 14.9, p);
    const adultH = Math.min(h * 0.19, w * 0.27);
    drawCharacter(ctx, {
      x: x + frameW * 0.02,
      y: yy + frameH * 0.96,
      height: adultH,
      day,
      time,
      pose: 'reach',
      walk: 0,
      gaze: { x: -0.1, y: -0.2 },
      shield: true,
      collected: 4,
      adult: age,
      reflected: true,
      opacity: 0.85,
    });
    ctx.restore();
  }
  // Fine diagonal sheen makes this a reflective surface instead of a framed avatar.
  ctx.save();
  ctx.beginPath();
  ctx.rect(x - frameW * 0.5, yy, frameW, frameH);
  ctx.clip();
  ctx.globalAlpha = alpha * 0.16;
  line(
    ctx,
    [
      { x: x - frameW, y: yy + frameH * 0.72 },
      { x: x + frameW, y: yy - frameH * 0.1 },
    ],
    c.rim,
    12,
  );
  line(
    ctx,
    [
      { x: x - frameW, y: yy + frameH * 0.82 },
      { x: x + frameW, y: yy },
    ],
    c.rim,
    2,
  );
  ctx.restore();
  ctx.restore();
}

function signal(ctx: CanvasRenderingContext2D, f: WorldFrame, c: Palette) {
  const { width: w, height: h, progress: p, time, day } = f;
  const target = getStorySignal(p, w, h);
  const delta = p < 1 ? { x: f.pointer.x * 9, y: f.pointer.y * 6 } : { x: 0, y: 0 };
  const x = target.x + delta.x,
    y = target.y + delta.y;
  const r = (w < 650 ? 6 : 7) * (1 + band(0.5, 1, 1.45, 2, p) * 0.3);
  ctx.save();
  ctx.shadowBlur = day > 0.5 ? 12 : 26;
  ctx.shadowColor = c.signal;
  star(ctx, x, y, r, c.signal, 0.08 + Math.sin(time * 0.2) * 0.08);
  ctx.shadowBlur = 0;
  ellipse(ctx, x, y, r * 2.6, r * 2.6, mixColor('#8baab6', '#b5a689', day));
  ctx.globalAlpha = 0.2;
  ellipse(ctx, x, y, r * 4.2, r * 4.2, c.signal);
  ctx.globalAlpha = 1;
  // An orbiting syntax fragment grows out of the first signal, not a new decorative particle layer.
  const syntax = band(0.9, 1.4, 2.55, 3.2, p);
  if (syntax > 0.002) {
    ctx.globalAlpha = syntax * 0.75;
    ctx.font = `${w < 650 ? 10 : 13}px monospace`;
    ctx.textAlign = 'center';
    ['{}', '[]', '01', '<>', '∞', '?'].forEach((symbol, i) => {
      const a = (i / 6) * TAU + time * 0.12;
      const radius = r * (4.7 + Math.sin(time * 0.3 + i) * 0.2);
      ctx.fillStyle = i % 2 ? c.rim : c.signal;
      ctx.fillText(symbol, x + Math.cos(a) * radius, y + Math.sin(a) * radius * 0.7);
    });
  }
  ctx.restore();
}

export function renderWorld(ctx: CanvasRenderingContext2D, f: WorldFrame) {
  const { width: w, height: h, progress: p, day, time } = f;
  const space = band(7.75, 9.0, 11.6, 12.75, p);
  const ground = 1 - band(7.85, 8.85, 12.2, 13, p);
  const engineering = band(1.45, 3.0, 12.1, 13.3, p);
  const c = palette(day, space);
  sky(ctx, f, c, space);
  const lower = Math.floor(clamp(p, 0, 16));
  const next = Math.min(16, lower + 1);
  const fraction = smooth(0, 1, p - lower);
  const chapter = storyChapters[lower];
  const following = storyChapters[next] ?? chapter;
  const cam = chapter?.camera;
  const camNext = following?.camera;
  ctx.save();
  const zoom = lerp(cam?.zoom ?? 1, camNext?.zoom ?? 1, fraction);
  const camX = lerp(cam?.x ?? 0, camNext?.x ?? 0, fraction) * w;
  const camY = lerp(cam?.y ?? 0, camNext?.y ?? 0, fraction) * h;
  // Parallax lives in the environment rather than moving the visitor's cursor or DOM controls.
  ctx.translate(w * 0.69 + camX + f.pointer.x * 3, h * 0.76 + camY + f.pointer.y * 2);
  ctx.scale(zoom, zoom);
  ctx.translate(-w * 0.69, -h * 0.76);
  const floor = terrain(ctx, f, c, ground, engineering);
  architecture(ctx, f, c);
  rocket(ctx, f, c);
  doorAndMirror(ctx, f, c);

  const mirrorApproach = band(13.5, 14.2, 15.4, 16, p);
  const girlX = w * (w < 650 ? lerp(0.72, 0.55, mirrorApproach) : lerp(0.72, 0.6, mirrorApproach));
  const girlY = lerp(floor - h * 0.006, h * 0.79, space);
  const characterHeight = w < 650 ? Math.min(92, h * 0.11) : Math.min(104, h * 0.104);
  let pose = (chapter?.character?.pose ?? 'look-up') as CharacterPose;
  if (f.walk > 0.15 && pose !== 'react' && pose !== 'reach' && pose !== 'point') pose = 'walk';
  if (f.idle > 16 && (p < 0.8 || p > 15.7)) pose = 'sit';
  if (f.reaction && f.reaction.age < 2.2) {
    const reactions: Record<string, CharacterPose> = {
      inspect: 'inspect',
      celebrate: 'react',
      wave: 'turn',
      reach: 'reach',
    };
    pose = reactions[f.reaction.kind];
  }
  const shield = f.artifacts.some((artifact) => artifact.toLowerCase().includes('shield'));
  // The protected observation deck travels with her after launch.
  if (space > 0.02) {
    ctx.save();
    ctx.globalAlpha = space * 0.62;
    ellipse(ctx, girlX, girlY + 6, characterHeight * 0.8, characterHeight * 0.12, c.metal, 0, true);
    line(
      ctx,
      [
        { x: girlX - characterHeight * 0.85, y: girlY + 5 },
        { x: girlX + characterHeight * 0.85, y: girlY + 5 },
      ],
      c.rim,
      1,
    );
    ctx.restore();
  }
  const signalPosition = getStorySignal(p, w, h);
  drawCharacter(ctx, {
    x: girlX,
    y: girlY,
    height: characterHeight,
    day,
    time,
    pose,
    walk: f.walk,
    gaze: f.pointer,
    shield,
    collected: f.artifacts.length,
    helmet: space * 0.8,
    direction: signalPosition.x < girlX ? -1 : 1,
  });
  const together = smooth(15.3, 16, p);
  if (together > 0.002)
    drawCharacter(ctx, {
      x: girlX + characterHeight * 0.79,
      y: girlY - 3,
      height: characterHeight * 1.36,
      day,
      time,
      pose: 'point',
      walk: 0,
      gaze: f.pointer,
      shield: true,
      collected: 4,
      adult: 1,
      opacity: together,
    });
  signal(ctx, f, c);
  ctx.restore();
  // A restrained photographic falloff keeps the drawn world legible under editorial type.
  const vignette = ctx.createLinearGradient(0, 0, w, 0);
  vignette.addColorStop(0, day > 0.5 ? 'rgba(247,242,229,.13)' : 'rgba(2,11,21,.18)');
  vignette.addColorStop(0.47, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, day > 0.5 ? 'rgba(117,144,160,.04)' : 'rgba(0,8,20,.04)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
}
