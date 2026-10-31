'use client';

import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from 'react';

export type ExperienceMode = 'explorer' | 'recruiter';
type Preferences = {
  awards: Record<string, number>;
  booted: boolean;
  sound: boolean;
  mode: ExperienceMode;
  motion: boolean | null;
};

const STORAGE_KEY = 'system369.experience.v1';
const initial: Preferences = {
  awards: {},
  booted: false,
  sound: false,
  mode: 'explorer',
  motion: null,
};

// A small external store lets React use a stable server snapshot during hydration.
// Browser preferences then appear without an effect-driven state update or a flash
// of mismatched server HTML. All storage access is confined to the client.
let cached: Preferences | undefined;
const listeners = new Set<() => void>();

function readStored(): Preferences {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && typeof saved === 'object') {
      const awards: Record<string, number> = {};
      if (saved.awards && typeof saved.awards === 'object') {
        for (const [key, value] of Object.entries(saved.awards)) {
          if (typeof value === 'number' && Number.isFinite(value) && value > 0 && value <= 1000)
            awards[key] = value;
        }
      }
      return {
        awards,
        booted: saved.booted === true,
        sound: saved.sound === true,
        mode: saved.mode === 'recruiter' ? 'recruiter' : 'explorer',
        motion: typeof saved.motion === 'boolean' ? saved.motion : null,
      };
    }
  } catch {
    /* Storage may be disabled, full, or contain an older format. */
  }
  return initial;
}

function getSnapshot() {
  return (cached ??= readStored());
}
function getServerSnapshot() {
  return initial;
}
function storageChanged(event: StorageEvent) {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  cached = readStored();
  listeners.forEach((listener) => listener());
}
function subscribe(listener: () => void) {
  if (!listeners.size) window.addEventListener('storage', storageChanged);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) window.removeEventListener('storage', storageChanged);
  };
}
function updatePreferences(update: (previous: Preferences) => Preferences) {
  const previous = getSnapshot();
  const next = update(previous);
  if (next === previous) return;
  cached = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* Browsing and scoring also work without persistent storage. */
  }
  listeners.forEach((listener) => listener());
}
function subscribeMotion(listener: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', listener);
  return () => query.removeEventListener('change', listener);
}
const getMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const getFalse = () => false;
const getTrue = () => true;
const subscribeHydration = () => () => undefined;

/** Only stores local exploration preferences. No account, tracking, or network. */
export function useExperience() {
  const preferences = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const systemReducedMotion = useSyncExternalStore(subscribeMotion, getMotion, getFalse);
  const ready = useSyncExternalStore(subscribeHydration, getTrue, getFalse);
  const audio = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      void audio.current?.close().catch(() => undefined);
      audio.current = null;
    };
  }, []);

  const ping = useCallback(() => {
    try {
      if (!window.AudioContext) return;
      const context = audio.current ?? new AudioContext();
      audio.current = context;
      void context
        .resume()
        .then(() => {
          if (context.state === 'closed') return;
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(620, context.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(310, context.currentTime + 0.09);
          gain.gain.setValueAtTime(0.025, context.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.1);
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.start();
          oscillator.stop(context.currentTime + 0.11);
          oscillator.onended = () => {
            oscillator.disconnect();
            gain.disconnect();
          };
        })
        .catch(() => undefined);
    } catch {
      /* Browsers without Web Audio remain silent. */
    }
  }, []);

  const award = useCallback((id: string, points: number) => {
    if (!id || !Number.isFinite(points) || points <= 0) return;
    updatePreferences((previous) => {
      if (Object.hasOwn(previous.awards, id)) return previous;
      return { ...previous, awards: { ...previous.awards, [id]: Math.min(points, 1000) } };
    });
  }, []);

  const boot = useCallback(() => {
    updatePreferences((previous) => ({
      ...previous,
      booted: true,
      awards: { ...previous.awards, boot: 10 },
    }));
    if (preferences.sound) ping();
  }, [ping, preferences.sound]);

  const toggleSound = useCallback(() => {
    if (!preferences.sound) ping();
    updatePreferences((previous) => ({ ...previous, sound: !previous.sound }));
  }, [ping, preferences.sound]);

  const reducedMotion = preferences.motion ?? systemReducedMotion;
  const toggleMotion = useCallback(() => {
    updatePreferences((previous) => ({
      ...previous,
      motion: !(previous.motion ?? systemReducedMotion),
    }));
  }, [systemReducedMotion]);

  const setMode = useCallback((mode: ExperienceMode) => {
    updatePreferences((previous) => ({ ...previous, mode, booted: true }));
  }, []);

  const score = useMemo(
    () => Object.values(preferences.awards).reduce((sum, value) => sum + value, 0),
    [preferences.awards],
  );
  const level =
    score >= 200 ? 'ARCHITECT' : score >= 120 ? 'ENGINEER' : score >= 40 ? 'EXPLORER' : 'OBSERVER';

  return {
    score,
    level,
    award,
    unlocked: Object.keys(preferences.awards),
    sound: preferences.sound,
    toggleSound,
    reducedMotion,
    toggleMotion,
    mode: preferences.mode,
    setMode,
    booted: preferences.booted,
    boot,
    ready,
  };
}
