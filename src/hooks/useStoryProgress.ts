'use client';

import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { LAST_STORY_CHAPTER, storyChapters, storyIndex } from '@/story/chapters';

const POSITION_KEY = 'system369.story.position.v2';
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function savedProgress() {
  try {
    const value = Number(sessionStorage.getItem(POSITION_KEY));
    return Number.isFinite(value) ? clamp(value, 0, LAST_STORY_CHAPTER) : 0;
  } catch {
    return 0;
  }
}

/** One native scroll track drives the continuous world; React only gets 5% buckets. */
export function useStoryProgress(
  trackRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  reducedMotion: boolean,
) {
  const progressRef = useRef(0);
  const pendingTarget = useRef<number | null>(null);
  const active = useRef(false);
  const [snapshot, setSnapshot] = useState({ chapter: 0, localProgress: 0 });

  const scrollToProgress = useCallback(
    (progress: number, behavior: ScrollBehavior) => {
      const track = trackRef.current;
      if (!track) return;
      const top = track.getBoundingClientRect().top + window.scrollY;
      const travel = Math.max(1, track.offsetHeight - window.innerHeight);
      window.scrollTo({ top: top + (progress / LAST_STORY_CHAPTER) * travel, behavior });
    },
    [trackRef],
  );

  const goTo = useCallback(
    (index: number) => {
      const destination = clamp(Number.isFinite(index) ? index : 0, 0, LAST_STORY_CHAPTER);
      pendingTarget.current = destination;
      scrollToProgress(destination, reducedMotion ? 'instant' : 'smooth');
      if (active.current) pendingTarget.current = null;
    },
    [reducedMotion, scrollToProgress],
  );

  useEffect(() => {
    if (!enabled) return;
    // The virtual story owns restoration; browser restoration can otherwise race the first frame.
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    let frame = 0;
    let currentChapter = -1;
    const save = () => {
      try {
        sessionStorage.setItem(POSITION_KEY, String(progressRef.current));
      } catch {
        /* The narrative also works with storage blocked. */
      }
    };
    const update = () => {
      frame = 0;
      const track = trackRef.current;
      if (!track) return;
      const top = track.getBoundingClientRect().top + window.scrollY;
      const travel = Math.max(1, track.offsetHeight - window.innerHeight);
      const progress = clamp(
        ((window.scrollY - top) / travel) * LAST_STORY_CHAPTER,
        0,
        LAST_STORY_CHAPTER,
      );
      progressRef.current = progress;
      const chapter = Math.round(progress);
      const start = Math.max(0, chapter - 0.5);
      const end = Math.min(LAST_STORY_CHAPTER, chapter + 0.5);
      const localProgress = Math.round(clamp((progress - start) / (end - start), 0, 1) * 20) / 20;
      setSnapshot((previous) =>
        previous.chapter === chapter && previous.localProgress === localProgress
          ? previous
          : { chapter, localProgress },
      );
      if (chapter !== currentChapter) {
        currentChapter = chapter;
        // Replace rather than append so Back returns to a mission's original world.
        const hash = `#${storyChapters[chapter].id}`;
        if (window.location.hash !== hash)
          window.history.replaceState(window.history.state, '', hash);
        save();
      }
    };
    const schedule = () => {
      if (!active.current) return;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = () => {
      scrollToProgress(progressRef.current, 'instant');
      schedule();
    };
    const hashChanged = () => {
      const index = storyIndex(window.location.hash);
      if (index >= 0) scrollToProgress(index, 'instant');
      schedule();
    };

    // Wait for the scroll track's layout. Explicit parent navigation wins over restoration.
    frame = requestAnimationFrame(() => {
      frame = 0;
      const hashIndex = storyIndex(window.location.hash);
      const destination = pendingTarget.current ?? (hashIndex >= 0 ? hashIndex : savedProgress());
      pendingTarget.current = null;
      scrollToProgress(destination, 'instant');
      active.current = true;
      update();
    });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('hashchange', hashChanged);
    window.addEventListener('pagehide', save);
    return () => {
      save();
      window.history.scrollRestoration = previousRestoration;
      active.current = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
      window.removeEventListener('hashchange', hashChanged);
      window.removeEventListener('pagehide', save);
    };
  }, [enabled, scrollToProgress, trackRef]);

  return { progressRef, chapter: snapshot.chapter, localProgress: snapshot.localProgress, goTo };
}
