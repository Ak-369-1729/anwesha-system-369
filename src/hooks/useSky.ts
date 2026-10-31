'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';

export type SkyTheme = 'dark' | 'light';
export const SKY_STORAGE_KEY = 'system369.sky.v2';
const listeners = new Set<() => void>();
let preference: SkyTheme | null | undefined;
let cached: SkyTheme | undefined;
let systemQuery: MediaQueryList | null = null;

function systemSky(): SkyTheme {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}
function getSnapshot(): SkyTheme {
  if (preference === undefined) {
    try {
      const stored = localStorage.getItem(SKY_STORAGE_KEY);
      preference = stored === 'dark' || stored === 'light' ? stored : null;
    } catch {
      preference = null;
    }
  }
  return (cached ??= preference ?? systemSky());
}
function applySky(theme: SkyTheme) {
  document.documentElement.dataset.sky = theme;
  document.documentElement.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#081622' : '#f1ebdc');
}
function emit() {
  const theme = getSnapshot();
  applySky(theme);
  listeners.forEach((listener) => listener());
}
function onSystemChange() {
  if (preference !== null) return;
  cached = systemSky();
  emit();
}
function onStorage(event: StorageEvent) {
  if (event.key !== SKY_STORAGE_KEY && event.key !== null) return;
  preference = undefined;
  cached = undefined;
  emit();
}
function subscribe(listener: () => void) {
  if (!listeners.size) {
    systemQuery = window.matchMedia('(prefers-color-scheme: light)');
    systemQuery.addEventListener('change', onSystemChange);
    window.addEventListener('storage', onStorage);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      systemQuery?.removeEventListener('change', onSystemChange);
      systemQuery = null;
      window.removeEventListener('storage', onStorage);
    }
  };
}
const serverSky = (): SkyTheme => 'dark';
const hydrationSubscribe = () => () => undefined;
const serverReady = () => false;
const clientReady = () => true;

/** The preference changes the world's lighting as well as the interface tokens. */
export function useSky() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, serverSky);
  const ready = useSyncExternalStore(hydrationSubscribe, clientReady, serverReady);
  useEffect(() => {
    if (ready) applySky(theme);
  }, [ready, theme]);
  const setSky = useCallback((next: SkyTheme) => {
    preference = next;
    cached = next;
    try {
      localStorage.setItem(SKY_STORAGE_KEY, next);
    } catch {
      /* Keep the selected sky for this visit when persistence is unavailable. */
    }
    emit();
  }, []);
  const toggleSky = useCallback(
    () => setSky(getSnapshot() === 'dark' ? 'light' : 'dark'),
    [setSky],
  );
  return { theme, toggleSky, setSky, ready };
}
