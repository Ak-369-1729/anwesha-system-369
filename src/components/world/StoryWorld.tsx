'use client';

import { useEffect, useRef } from 'react';
import { clamp, lerp, type Point } from './geometry';
import { renderWorld } from './renderWorld';

export { getStorySignal } from './renderWorld';
export type StoryWorldProps = {
  progressRef: { current: number };
  theme: 'dark' | 'light';
  reducedMotion: boolean;
  artifacts: readonly string[];
  reaction?: { kind: 'inspect' | 'celebrate' | 'wave' | 'reach'; id: number };
};

/**
 * One persistent illustrated stage. Scroll changes the camera, anchors, and
 * protagonist together; no content is hidden in this decorative canvas.
 */
export default function StoryWorld({
  progressRef,
  theme,
  reducedMotion,
  artifacts,
  reaction,
}: StoryWorldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useRef({ theme, reducedMotion, artifacts, reaction, reactionAt: 0 });
  const invalidate = useRef<(() => void) | null>(null);

  useEffect(() => {
    const changed = controls.current.reaction?.id !== reaction?.id;
    controls.current = {
      theme,
      reducedMotion,
      artifacts,
      reaction,
      reactionAt: changed ? performance.now() : controls.current.reactionAt,
    };
    invalidate.current?.();
  }, [theme, reducedMotion, artifacts, reaction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let frame = 0;
    let active = true;
    let time = 0;
    let previousTime = 0;
    let previousPaint = 0;
    let progress = clamp(progressRef.current, 0, 16);
    let lastTarget = progress;
    let lastMovement = performance.now();
    let day = controls.current.theme === 'light' ? 1 : 0;
    let speed = 0;
    let pointer: Point = { x: 0, y: 0 };
    const smoothed: Point = { x: 0, y: 0 };

    function schedule() {
      if (!frame && active && !document.hidden) frame = requestAnimationFrame(draw);
    }
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, width < 650 ? 1.25 : 1.6);
      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(height * ratio);
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
      schedule();
    }
    function draw(timestamp: number) {
      frame = 0;
      if (!active || document.hidden) return;
      const settings = controls.current;
      const target = clamp(progressRef.current, 0, 16);
      const moving = Math.abs(target - progress) > 0.002;
      const interval = 1000 / (moving ? 60 : 30);
      const elapsed = timestamp - previousPaint;
      if (!settings.reducedMotion && previousPaint && elapsed < interval - 0.6) {
        schedule();
        return;
      }
      previousPaint = timestamp - (elapsed % interval);
      const dt = Math.min((timestamp - previousTime) / 1000 || 0.016, 0.06);
      previousTime = timestamp;
      if (Math.abs(target - lastTarget) > 0.0003) lastMovement = timestamp;
      lastTarget = target;
      const distance = Math.abs(target - progress);
      progress = settings.reducedMotion ? target : lerp(progress, target, Math.min(1, dt * 7));
      speed = lerp(speed, Math.min(1, distance * 7), Math.min(1, dt * 8));
      const targetDay = settings.theme === 'light' ? 1 : 0;
      // Complete the material, atmosphere, and light transition in approximately 1.2 seconds.
      day = settings.reducedMotion
        ? targetDay
        : day + Math.sign(targetDay - day) * Math.min(Math.abs(targetDay - day), dt / 1.2);
      if (!settings.reducedMotion) time += dt;
      smoothed.x = lerp(smoothed.x, pointer.x, Math.min(1, dt * 4));
      smoothed.y = lerp(smoothed.y, pointer.y, Math.min(1, dt * 4));
      renderWorld(ctx!, {
        width,
        height,
        progress,
        day,
        time,
        pointer: settings.reducedMotion ? { x: 0, y: 0 } : smoothed,
        walk: settings.reducedMotion ? 0 : speed,
        idle: (timestamp - lastMovement) / 1000,
        artifacts: settings.artifacts,
        reaction: settings.reaction
          ? { ...settings.reaction, age: (timestamp - settings.reactionAt) / 1000 }
          : undefined,
      });
      if (!settings.reducedMotion) schedule();
    }
    function onPointer(event: PointerEvent) {
      if (event.pointerType !== 'mouse' || controls.current.reducedMotion) return;
      pointer = { x: event.clientX / width - 0.5, y: event.clientY / height - 0.5 };
      schedule();
    }
    function onScroll() {
      lastMovement = performance.now();
      schedule();
    }
    function visibility() {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else {
        previousTime = 0;
        previousPaint = 0;
        schedule();
      }
    }
    invalidate.current = schedule;
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    resize();
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      invalidate.current = null;
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [progressRef]);

  return (
    <canvas
      ref={canvasRef}
      className="story-world"
      aria-hidden="true"
      data-world="illustrated-journey"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100svh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
