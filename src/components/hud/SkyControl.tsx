'use client';

import type { SkyTheme } from '@/hooks/useSky';

type Props = { theme: SkyTheme; onToggle: () => void };

export default function SkyControl({ theme, onToggle }: Props) {
  return (
    <button
      className={`sky-control sky-${theme}`}
      type="button"
      onClick={onToggle}
      aria-label={`Change sky — ${theme === 'dark' ? 'night to day' : 'day to night'}`}
      aria-pressed={theme === 'light'}
      title="Change sky"
    >
      <svg viewBox="0 0 64 38" width="64" height="38" aria-hidden="true" focusable="false">
        <ellipse
          className="sky-control-orbit"
          cx="32"
          cy="19"
          rx="25"
          ry="11"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.7"
          transform="rotate(-18 32 19)"
        />
        <g className="sky-control-sun" stroke="currentColor" fill="none" strokeWidth="1">
          <circle cx="20" cy="20" r="5" />
          <path d="M20 11v-2m0 24v-2m9-11h2M9 20h2m15.4-6.4 1.5-1.5M12.1 27.9l1.5-1.5m12.8 0 1.5 1.5M12.1 12.1l1.5 1.5" />
        </g>
        <path
          className="sky-control-moon"
          d="M47 11a7 7 0 1 0 5 12 7.8 7.8 0 0 1-5-12Z"
          fill="currentColor"
        />
        <circle className="sky-control-point" cx="35" cy="7" r="1" fill="currentColor" />
      </svg>
      <span className="sky-control-label">CHANGE SKY</span>
      <span className="sr-only">Current sky: {theme === 'dark' ? 'night' : 'day'}.</span>
    </button>
  );
}
