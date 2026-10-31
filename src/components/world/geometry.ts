export type Point = { x: number; y: number };
export const TAU = Math.PI * 2;
export const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (a: number, b: number, value: number) => {
  const t = clamp((value - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const band = (a: number, b: number, c: number, d: number, p: number) =>
  smooth(a, b, p) * (1 - smooth(c, d, p));
export const seed = (value: number) => {
  const number = Math.sin(value * 127.1 + 311.7) * 43758.5453123;
  return number - Math.floor(number);
};
export function mixColor(a: string, b: string, t: number) {
  const parse = (color: string) => {
    if (color.startsWith('#')) return parseInt(color.slice(1), 16);
    const channels = color.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
    return (channels[0] << 16) | (channels[1] << 8) | channels[2];
  };
  const ca = parse(a);
  const cb = parse(b);
  const r = Math.round(lerp((ca >> 16) & 255, (cb >> 16) & 255, t));
  const g = Math.round(lerp((ca >> 8) & 255, (cb >> 8) & 255, t));
  const blue = Math.round(lerp(ca & 255, cb & 255, t));
  return `rgb(${r},${g},${blue})`;
}
export function line(ctx: CanvasRenderingContext2D, points: Point[], color: string, width = 1) {
  if (!points.length) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
  ctx.stroke();
}
export function polygon(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  fill: string | CanvasGradient | CanvasPattern,
  stroke?: string,
) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}
export function ellipse(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
  color: string,
  rotation = 0,
  fill = false,
) {
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(0.01, rx), Math.max(0.01, ry), rotation, 0, TAU);
  if (fill) {
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.strokeStyle = color;
    ctx.stroke();
  }
}
export function star(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  rotation = 0,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.quadraticCurveTo(size * 0.12, -size * 0.12, size, 0);
  ctx.quadraticCurveTo(size * 0.12, size * 0.12, 0, size);
  ctx.quadraticCurveTo(-size * 0.12, size * 0.12, -size, 0);
  ctx.quadraticCurveTo(-size * 0.12, -size * 0.12, 0, -size);
  ctx.fill();
  ctx.restore();
}
