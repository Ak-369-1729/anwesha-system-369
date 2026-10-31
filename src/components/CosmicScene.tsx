'use client';

import { useEffect, useRef } from 'react';

type Props = { chapter: number; reducedMotion: boolean };
type Point = { x: number; y: number };
const TAU = Math.PI * 2;
const COUNT = 54;
const fraction = (n: number) => n - Math.floor(n);
const catalogue = Array.from({ length: 110 }, (_, i) => ({
  x: fraction((i + 1) * 0.61803398875),
  y: fraction((i + 1) * 0.41421356237),
  size: i % 17 === 0 ? 1.4 : i % 5 === 0 ? 0.9 : 0.5,
}));

/** A single persistent astronomical atlas changes geometry across the journey. */
export default function CosmicScene({ chapter, reducedMotion }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef(chapter);
  const motion = useRef(reducedMotion);
  const invalidate = useRef<(() => void) | null>(null);

  useEffect(() => {
    scene.current = chapter;
    invalidate.current?.();
  }, [chapter]);
  useEffect(() => {
    motion.current = reducedMotion;
    invalidate.current?.();
  }, [reducedMotion]);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const context = element.getContext('2d', { alpha: true });
    if (!context) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let frame = 0;
    let running = true;
    let time = 0;
    let previousTime = 0;
    let previousPaint = 0;
    let currentChapter = scene.current;
    let pointer: Point = { x: 0, y: 0 };
    const smoothed: Point = { x: 0, y: 0 };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, width < 640 ? 1.2 : 1.6);
      element.width = Math.round(width * ratio);
      element.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      requestDraw();
    };

    const sphere = (
      x: number,
      y: number,
      z: number,
      rotation: number,
      center: Point,
      radius: number,
    ) => {
      const rx = x * Math.cos(rotation) + z * Math.sin(rotation);
      const rz = -x * Math.sin(rotation) + z * Math.cos(rotation);
      const tilt = -0.28;
      const ry = y * Math.cos(tilt) - rz * Math.sin(tilt);
      const depth = y * Math.sin(tilt) + rz * Math.cos(tilt);
      const perspective = 3.8 / (3.8 - depth * 0.28);
      return {
        x: center.x + rx * radius * perspective,
        y: center.y + ry * radius * perspective,
        z: depth,
      };
    };

    const ring = (
      center: Point,
      radius: number,
      angle: number,
      squash: number,
      color: string,
      lineWidth = 0.7,
    ) => {
      context.save();
      context.translate(center.x, center.y);
      context.rotate(angle);
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.beginPath();
      context.ellipse(0, 0, radius, radius * squash, 0, 0, TAU);
      context.stroke();
      context.restore();
    };

    const drawArmillary = (center: Point, radius: number, opacity: number) => {
      context.save();
      context.globalAlpha = opacity;
      const rotation = time * 0.045;
      // Orthogonal meridians reveal an actual sphere rather than a decorative blob.
      for (let line = 0; line < 22; line++) {
        const longitude = (line / 22) * TAU;
        context.beginPath();
        for (let j = 0; j <= 72; j++) {
          const latitude = -Math.PI / 2 + (j / 72) * Math.PI;
          const p = sphere(
            Math.cos(latitude) * Math.cos(longitude),
            Math.sin(latitude),
            Math.cos(latitude) * Math.sin(longitude),
            rotation,
            center,
            radius,
          );
          if (j === 0) context.moveTo(p.x, p.y);
          else context.lineTo(p.x, p.y);
        }
        context.strokeStyle = line % 3 === 0 ? 'rgba(112,225,222,.32)' : 'rgba(112,225,222,.13)';
        context.lineWidth = 0.65;
        context.stroke();
      }
      for (let line = 1; line < 13; line++) {
        const latitude = -Math.PI / 2 + (line / 13) * Math.PI;
        context.beginPath();
        for (let j = 0; j <= 96; j++) {
          const longitude = (j / 96) * TAU;
          const p = sphere(
            Math.cos(latitude) * Math.cos(longitude),
            Math.sin(latitude),
            Math.cos(latitude) * Math.sin(longitude),
            rotation,
            center,
            radius,
          );
          if (j === 0) context.moveTo(p.x, p.y);
          else context.lineTo(p.x, p.y);
        }
        context.strokeStyle = 'rgba(112,225,222,.18)';
        context.stroke();
      }
      ring(center, radius * 1.31, -0.49, 0.29, 'rgba(143,233,223,.7)');
      ring(center, radius * 1.08, 0.74, 0.44, 'rgba(143,233,223,.34)');
      ring(center, radius * 1.45, 0, 1, 'rgba(143,233,223,.09)');
      const phase = time * 0.1 + 0.4;
      const ox = radius * 1.31 * Math.cos(phase);
      const oy = radius * 1.31 * 0.29 * Math.sin(phase);
      const cx = center.x + ox * Math.cos(-0.49) - oy * Math.sin(-0.49);
      const cy = center.y + ox * Math.sin(-0.49) + oy * Math.cos(-0.49);
      context.fillStyle = '#e3fff7';
      context.shadowBlur = 13;
      context.shadowColor = '#a1ffdf';
      context.beginPath();
      context.arc(cx, cy, 2.6, 0, TAU);
      context.fill();
      context.shadowBlur = 0;
      context.strokeStyle = 'rgba(137,223,211,.38)';
      context.beginPath();
      context.moveTo(center.x + radius * 0.65, center.y - radius * 0.8);
      context.lineTo(center.x + radius * 1.05, center.y - radius * 1.15);
      context.lineTo(center.x + radius * 1.48, center.y - radius * 1.15);
      context.stroke();
      context.font = '9px monospace';
      context.fillStyle = 'rgba(169,223,211,.7)';
      context.fillText('IDENTITY CORE / 369', center.x + radius * 1.05, center.y - radius * 1.21);
      context.fillStyle = 'rgba(169,223,211,.42)';
      context.fillText('36.900 / 17.290', center.x - radius * 0.4, center.y + radius * 1.55);
      context.restore();
    };

    const target = (i: number, index: number): Point => {
      const mobile = width < 700;
      const x0 = width * (mobile ? 0.88 : 0.73);
      const y0 = height * (mobile ? 0.39 : 0.49);
      const radius = Math.min(width * (mobile ? 0.27 : 0.18), height * 0.26);
      const a = i * 2.399963;
      if (index <= 1) {
        const latitude = Math.acos(1 - 2 * ((i + 0.5) / COUNT));
        const p = sphere(
          Math.sin(latitude) * Math.cos(a),
          Math.cos(latitude),
          Math.sin(latitude) * Math.sin(a),
          time * 0.045,
          { x: x0, y: y0 },
          radius,
        );
        return { x: p.x, y: p.y };
      }
      if (index === 2)
        return {
          x: width * (0.08 + fraction(i * 0.618) * 0.84),
          y: height * (0.2 + fraction(i * 0.382) * 0.6),
        };
      if (index === 3)
        return {
          x: width * (0.13 + (i % 9) * 0.092),
          y: height * (0.22 + Math.floor(i / 9) * 0.11),
        };
      if (index === 4)
        return {
          x: width * (0.08 + (i % 6) * 0.16),
          y: height * (0.14 + Math.floor(i / 6) * 0.085),
        };
      if (index === 5)
        return {
          x: width * 0.65 + Math.cos(a + time * 0.025) * radius * (1 + (i % 3) * 0.3),
          y: height * 0.5 + Math.sin(a + time * 0.025) * radius * 0.8,
        };
      if (index <= 8)
        return {
          x: width * (0.07 + (i / COUNT) * 0.86),
          y: height * (0.5 + Math.sin((i / COUNT) * TAU - 0.8) * 0.23),
        };
      if (index === 9) {
        const r = radius * (0.9 + (i / COUNT) * 1.2);
        return {
          x: width * 0.5 + Math.cos(a + time * 0.04) * r,
          y: height * 0.5 + Math.sin(a + time * 0.04) * r * 0.28,
        };
      }
      return { x: width * (0.1 + (i / COUNT) * 0.8), y: height * 0.78 + Math.sin(i * 0.2) * 2 };
    };

    const draw = (timestamp: number) => {
      frame = 0;
      if (!running || document.hidden) return;
      // High-refresh displays should not spend 120–240 frames on ambient art.
      const paintInterval = 1000 / 60;
      const elapsed = timestamp - previousPaint;
      if (!motion.current && previousPaint > 0 && elapsed < paintInterval - 0.8) {
        frame = window.requestAnimationFrame(draw);
        return;
      }
      previousPaint = timestamp - (elapsed % paintInterval);
      const dt = Math.min((timestamp - previousTime) / 1000 || 0.016, 0.05);
      previousTime = timestamp;
      if (!motion.current) time += dt;
      currentChapter = motion.current
        ? scene.current
        : currentChapter + (scene.current - currentChapter) * Math.min(1, dt * 3.5);
      smoothed.x += (pointer.x - smoothed.x) * 0.04;
      smoothed.y += (pointer.y - smoothed.y) * 0.04;
      context.clearRect(0, 0, width, height);
      const quiet = Math.max(0, Math.min(1, currentChapter - 9));
      context.save();
      context.globalAlpha = 1 - quiet * 0.83;
      for (let i = 0; i < catalogue.length; i++) {
        const star = catalogue[i];
        const x = star.x * width + (motion.current ? 0 : smoothed.x * ((i % 3) + 1));
        const y = star.y * height + (motion.current ? 0 : smoothed.y * ((i % 3) + 1));
        context.fillStyle = i % 17 === 0 ? 'rgba(210,235,221,.65)' : 'rgba(164,186,196,.3)';
        context.beginPath();
        context.arc(x, y, star.size, 0, TAU);
        context.fill();
        if (i % 37 === 0) {
          context.strokeStyle = 'rgba(164,186,196,.2)';
          context.beginPath();
          context.moveTo(x - 4, y);
          context.lineTo(x + 4, y);
          context.moveTo(x, y - 4);
          context.lineTo(x, y + 4);
          context.stroke();
        }
      }
      const lower = Math.floor(currentChapter);
      const blend = currentChapter - lower;
      const points = Array.from({ length: COUNT }, (_, i) => {
        const p = target(i, lower);
        const q = target(i, Math.ceil(currentChapter));
        return { x: p.x + (q.x - p.x) * blend, y: p.y + (q.y - p.y) * blend };
      });
      const geometricOpacity =
        currentChapter < 1.4 ? 0.2 : 0.2 + Math.min(1, (currentChapter - 1.4) * 2) * 0.65;
      context.globalAlpha *= geometricOpacity;
      context.lineWidth = 0.6;
      const sceneIndex = Math.round(currentChapter);
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const adjacent =
          sceneIndex === 4
            ? [i + 1, i + 6]
            : sceneIndex >= 6 && sceneIndex <= 8
              ? [i + 1]
              : [i + 1, i + 9];
        for (const j of adjacent) {
          if (!points[j]) continue;
          const q = points[j];
          if (
            Math.hypot(p.x - q.x, p.y - q.y) > width * 0.26 &&
            !(sceneIndex >= 6 && sceneIndex <= 8)
          )
            continue;
          context.strokeStyle =
            sceneIndex === 3 && i % 11 === 0 ? 'rgba(229,112,96,.22)' : 'rgba(111,186,178,.16)';
          context.beginPath();
          context.moveTo(p.x, p.y);
          if (sceneIndex === 4) context.lineTo(q.x, p.y);
          context.lineTo(q.x, q.y);
          context.stroke();
        }
        context.fillStyle =
          sceneIndex === 3 && i % 11 === 0 ? 'rgba(229,112,96,.6)' : 'rgba(144,221,204,.54)';
        context.beginPath();
        context.arc(p.x, p.y, i % 5 === 0 ? 2 : 1, 0, TAU);
        context.fill();
      }
      context.globalAlpha = 1;
      if (currentChapter < 2) {
        const radius = Math.min(width * (width < 700 ? 0.27 : 0.18), height * 0.26);
        drawArmillary(
          {
            x: width * (width < 700 ? 0.88 : 0.73) + (motion.current ? 0 : smoothed.x * 4),
            y: height * (width < 700 ? 0.39 : 0.49) + (motion.current ? 0 : smoothed.y * 4),
          },
          radius,
          Math.max(0, Math.min(1, 2 - currentChapter)),
        );
      }
      if (currentChapter > 8.5 && currentChapter < 10) {
        const opacity = Math.sin(Math.min(1, Math.max(0, (currentChapter - 8.5) / 1.5)) * Math.PI);
        context.globalAlpha = Math.max(0, opacity);
        const r = Math.min(width * 0.22, height * 0.23);
        const c = { x: width * 0.5, y: height * 0.5 };
        for (let i = 0; i < 8; i++)
          ring(
            c,
            r * (1 + i * 0.055),
            -0.12,
            0.29 + i * 0.012,
            `rgba(214,224,185,${0.28 - i * 0.03})`,
            1.6,
          );
        context.fillStyle = '#05090c';
        context.beginPath();
        context.arc(c.x, c.y, r * 0.57, 0, TAU);
        context.fill();
        ring(c, r * 0.58, 0, 1, 'rgba(211,227,192,.7)', 1.5);
      }
      context.restore();
      if (!motion.current) frame = window.requestAnimationFrame(draw);
    };

    function requestDraw() {
      if (!frame && running && !document.hidden) frame = window.requestAnimationFrame(draw);
    }
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      pointer = { x: event.clientX / width - 0.5, y: event.clientY / height - 0.5 };
    };
    const visibility = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      } else {
        previousTime = 0;
        previousPaint = 0;
        requestDraw();
      }
    };
    invalidate.current = requestDraw;
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    resize();
    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', visibility);
      invalidate.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      className="cosmic-canvas"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
