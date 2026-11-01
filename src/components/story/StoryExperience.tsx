'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useExperience } from '@/hooks/useExperience';
import { useSky } from '@/hooks/useSky';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { storyChapters, worldChapters, worldSceneIndex } from '@/story/chapters';
import { profile, projects } from '@/data/portfolio';
import SkyControl from '@/components/hud/SkyControl';
import StoryWorld from '@/components/world/StoryWorld';
import OrbitalStage from '@/components/world/OrbitalStage';
const StoryPanels = dynamic(() => import('./StoryPanels'));

const QuickPortfolio = dynamic(() => import('@/components/quick-mode/QuickPortfolio'));
const Terminal = dynamic(() => import('@/components/Terminal'));
const CommandPalette = dynamic(() => import('@/components/CommandPalette'));

const aliases: Record<string, number> = Object.fromEntries(
  storyChapters.map((chapter, i) => [chapter.id, i]),
);
Object.assign(aliases, {
  origin: aliases.signal,
  now: aliases.space,
  anomaly: aliases.door,
  vault: aliases['flight-path'],
});
const constellation = [
  [25, 5],
  [20, 12],
  [14, 20],
  [8, 26],
  [15, 33],
  [20, 41],
  [26, 47],
  [64, 4],
  [60, 15],
  [56, 26],
  [51, 38],
  [47, 49],
  [89, 5],
  [96, 14],
  [103, 24],
  [98, 34],
  [91, 44],
];
type Reaction = { kind: 'inspect' | 'celebrate' | 'wave' | 'reach'; id: number };

export default function StoryExperience() {
  const experience = useExperience();
  const { theme, toggleSky } = useSky();
  const storyMode = experience.mode === 'explorer';
  const track = useRef<HTMLDivElement>(null);
  const { progressRef, chapter, localProgress, goTo } = useStoryProgress(
    track,
    storyMode && experience.ready,
    experience.reducedMotion,
  );
  const [skillIndex, setSkillIndex] = useState(0);
  const [inspection, setInspection] = useState(-1);
  const inspectionButton = useRef<HTMLButtonElement>(null);
  const inspectionBody = useRef<HTMLElement>(null);
  const inspecting = inspection === chapter;
  const [palette, setPalette] = useState(false);
  const [terminal, setTerminal] = useState(false);
  const [navigation, setNavigation] = useState(false);
  const [status, setStatus] = useState('');
  const [reaction, setReaction] = useState<Reaction | undefined>();
  const [cursorLabel, setCursorLabel] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const terminalDialog = useRef<HTMLDialogElement>(null);
  const navigationDialog = useRef<HTMLDialogElement>(null);
  const focusDestination = useRef<number | null>(null);
  const current = storyChapters[chapter] || storyChapters[0];
  const award = experience.award;
  const inspect = useCallback(() => setInspection(chapter), [chapter]);
  const closeInspection = useCallback(() => {
    setInspection(-1);
    requestAnimationFrame(() => inspectionButton.current?.focus({ preventScroll: true }));
  }, []);
  useEffect(() => {
    if (!inspecting) return;
    const frame = requestAnimationFrame(() =>
      inspectionBody.current?.focus({ preventScroll: true }),
    );
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeInspection();
    };
    window.addEventListener('keydown', escape);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('keydown', escape);
    };
  }, [inspecting, closeInspection]);
  const react = useCallback(
    (kind: Reaction['kind']) => setReaction((old) => ({ kind, id: (old?.id ?? 0) + 1 })),
    [],
  );
  const artifacts = useMemo(() => {
    const found: string[] = [];
    for (const name of ['question', 'code', 'system', 'orbit', 'knowledge', 'why']) {
      if (experience.unlocked.includes(`artifact-${name}`)) found.push(name);
    }
    if (experience.unlocked.includes('cyber-threat')) found.push('shield');
    if (experience.unlocked.includes('artifact-unknown')) found.push('unknown');
    return found;
  }, [experience.unlocked]);

  const travel = useCallback(
    (index: number) => {
      focusDestination.current = index;
      goTo(index);
      if (chapter === index)
        requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
    },
    [goTo, chapter],
  );
  const navigate = useCallback(
    (id: string) => {
      if (storyMode) {
        travel(aliases[id] ?? 0);
        return;
      }
      const target = document.getElementById(id === 'signal' ? 'quick-profile' : id);
      target?.scrollIntoView({ behavior: 'instant', block: 'start' });
      if (target) {
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
      }
    },
    [storyMode, travel],
  );
  const action = useCallback(
    (key: string) => {
      if (key === 'explorer' || key === 'recruiter') {
        react('wave');
        experience.setMode(key);
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (key === 'sky') toggleSky();
      else if (key === 'motion') experience.toggleMotion();
      else if (key === 'sound') experience.toggleSound();
      else if (key === 'terminal') setTerminal(true);
      else if (key === 'launch') {
        if (storyMode) {
          award('artifact-system', 20);
          travel(aliases.launch);
        } else setStatus('The launch lives in Story Mode. Follow the girl to the launchpad.');
      } else if (key === 'resume') {
        const link = document.createElement('a');
        link.href = profile.resume;
        link.download = 'Anwesha-Kar-Resume.html';
        link.click();
      } else if (key === 'github' || key === 'linkedin') {
        const url = profile[key];
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
      } else if (key === 'contact') navigate('contact');
    },
    [experience, react, toggleSky, storyMode, award, travel, navigate],
  );

  useEffect(() => {
    document.documentElement.dataset.motion = experience.reducedMotion ? 'reduced' : 'full';
    document.documentElement.dataset.experience = storyMode ? 'story' : 'quick';
  }, [experience.reducedMotion, storyMode]);
  useEffect(() => {
    if (!storyMode || !experience.ready) return;
    award(`story:${current.id}`, 3);
    if (focusDestination.current === chapter) {
      heading.current?.focus({ preventScroll: true });
      focusDestination.current = null;
    }
  }, [award, current.id, chapter, storyMode, experience.ready]);
  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(''), 5000);
    return () => clearTimeout(timer);
  }, [status]);
  useEffect(() => {
    const sequence = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ];
    let matched = 0;
    const keydown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPalette((v) => !v);
        return;
      }
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLButtonElement ||
        target instanceof HTMLAnchorElement
      )
        return;
      if (event.key === sequence[matched]) matched++;
      else matched = event.key === sequence[0] ? 1 : 0;
      if (matched === sequence.length) {
        award('artifact-unknown', 50);
        setStatus('369.1729 / A question hidden inside another question.');
        react('celebrate');
        matched = 0;
      }
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [award, react]);
  useEffect(() => {
    if (!terminal) return;
    const dialog = terminalDialog.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog?.showModal();
    const frame = requestAnimationFrame(() => dialog?.querySelector('input')?.focus());
    return () => {
      cancelAnimationFrame(frame);
      dialog?.close();
      previous?.focus();
    };
  }, [terminal]);
  useEffect(() => {
    if (!navigation) return;
    const dialog = navigationDialog.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog?.showModal();
    return () => {
      dialog?.close();
      previous?.focus();
    };
  }, [navigation]);
  useEffect(() => {
    if (experience.reducedMotion || !matchMedia('(pointer:fine)').matches) return;
    const move = (event: PointerEvent) => {
      if (cursor.current)
        cursor.current.style.transform = `translate3d(${event.clientX + 17}px,${event.clientY + 17}px,0)`;
    };
    const over = (event: PointerEvent) => {
      const element = event.target instanceof Element ? event.target : null;
      const cue = element?.closest('[data-cursor]')?.getAttribute('data-cursor');
      const interactive = element?.closest('a,button,input,summary');
      setCursorLabel(cue || (interactive ? 'OPEN' : ''));
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
    };
  }, [experience.reducedMotion]);

  return (
    <div
      className={`story-experience ${storyMode ? 'is-story' : 'is-quick'}`}
      data-scene={current.id}
    >
      <a
        className="skip-link"
        href="#story-content"
        onClick={(event) => {
          event.preventDefault();
          action('recruiter');
          requestAnimationFrame(() =>
            document.getElementById('story-content')?.focus({ preventScroll: true }),
          );
        }}
      >
        Skip story and open Quick Mode
      </a>
      {storyMode && (
        <StoryWorld
          progressRef={progressRef}
          theme={theme}
          reducedMotion={experience.reducedMotion}
          artifacts={artifacts}
          reaction={reaction}
        />
      )}
      <header className="field-header">
        <button
          className="field-mark"
          onClick={() => (storyMode ? travel(0) : navigate('signal'))}
          aria-label="FIELD NOTES 369 — return to the first question"
        >
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="16" />
            <path d="M20 0v40M0 20h40M9 9l22 22M31 9 9 31" />
            <circle cx="20" cy="20" r="4" />
          </svg>
          <span>
            FIELD NOTES <b>369</b>
          </span>
        </button>
        <span className="field-edition">
          CURIOSITY IS A PRACTICE. <span>VOL. 369</span>
        </span>
        <div className="field-controls">
          <div className="experience-switch" role="group" aria-label="Experience mode">
            <button aria-pressed={storyMode} onClick={() => action('explorer')}>
              STORY
            </button>
            <span>/</span>
            <button aria-pressed={!storyMode} onClick={() => action('recruiter')}>
              QUICK
            </button>
          </div>
          <SkyControl theme={theme} onToggle={toggleSky} />
          <button
            className="field-command"
            onClick={() => setPalette(true)}
            aria-label="⌘ K — Open command palette"
          >
            <span aria-hidden="true">⌘ K</span>
          </button>
        </div>
      </header>
      <main id="story-content" tabIndex={-1} className="story-main">
        <div
          ref={track}
          className="story-track"
          hidden={!storyMode}
          aria-label="How a question became an engineer"
        >
          <div className={`story-stage chapter-${current.id} ${inspecting ? 'is-inspecting' : ''}`}>
            {storyMode && (
              <OrbitalStage
                progressRef={progressRef}
                sceneId={current.id}
                theme={theme}
                reducedMotion={experience.reducedMotion}
                onInspect={inspect}
                onProject={(id) => award(`project:${id}`, 20)}
                onSkill={(index) => {
                  setSkillIndex(index);
                  inspect();
                }}
                onDiscover={() => {
                  award('artifact-unknown', 50);
                  setStatus('A different perspective. A hidden question found.');
                  react('celebrate');
                }}
              />
            )}
            <div className="scene-watermark" aria-hidden="true">
              {String(chapter + 1).padStart(2, '0')}
            </div>
            <div className="scene-coordinates" aria-hidden="true">
              <span>
                0{Math.floor(chapter / 6) + 1} /{' '}
                {chapter < 7 ? 'EARTH' : chapter < 14 ? 'BEYOND' : 'WITHIN'}
              </span>
              <span>36.9 / 17.29</span>
            </div>
            <div className={`scene-composition ${chapter === 0 ? 'is-prologue' : ''}`}>
              <div className="story-copy" key={current.id}>
                <div className="story-kicker">
                  <span className="chapter-number">{String(chapter + 1).padStart(2, '0')}</span>
                  <span className="kicker-line" />
                  {current.kicker.replace(/^\d+\s*\/\s*/, '')}
                </div>
                <h1 ref={heading} tabIndex={-1} className={chapter === 15 ? 'identity-reveal' : ''}>
                  {chapter === 0 ? (
                    <>
                      <span className="hero-prelude">
                        Some people looked at the stars and saw light.
                      </span>
                      <span className="hero-word">She saw </span>
                      <span className="hero-word hero-question">
                        questions<span className="hero-period">.</span>
                      </span>
                    </>
                  ) : chapter === 15 ? (
                    <>
                      ANWESHA
                      <br />
                      KAR<span className="identity-point">.</span>
                    </>
                  ) : (
                    current.headline.map((line, i) => (
                      <span
                        className={i === current.headline.length - 1 ? 'story-emphasis' : ''}
                        key={line}
                      >
                        {line}
                      </span>
                    ))
                  )}
                </h1>
                {chapter !== 0 && chapter !== 15 && (
                  <p className="scene-narrative">{current.copy.join(' ')}</p>
                )}
                {chapter === 0 && (
                  <div className="opening-note">
                    <span className="opening-spark" /> A GIRL. A SIGNAL. AN UNFINISHED STORY.
                  </div>
                )}
              </div>
              {chapter > 0 && (
                <section
                  ref={inspectionBody}
                  tabIndex={-1}
                  className="scene-instrument"
                  hidden={!inspecting}
                  aria-label={`${current.name} — field instrument`}
                >
                  <div className="instrument-heading">
                    <span>
                      {String(chapter + 1).padStart(2, '0')} / {current.name}
                    </span>
                    <button onClick={closeInspection} aria-label="Close field instrument">
                      CLOSE <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  <StoryPanels
                    key={`${current.id}:${skillIndex}`}
                    initialSkill={skillIndex}
                    chapter={worldSceneIndex(current.id)}
                    localProgress={localProgress}
                    unlocked={experience.unlocked}
                    onAward={award}
                    onGoTo={(index) => travel(aliases[worldChapters[index].id])}
                    onAction={action}
                    onReact={react}
                    onStatus={setStatus}
                  />
                </section>
              )}
            </div>
            {chapter > 0 && !inspecting && (
              <button
                ref={inspectionButton}
                className="scene-beacon"
                onClick={inspect}
                aria-label={`Inspect scene — ${current.name}`}
                aria-expanded={inspecting}
                data-cursor="INSPECT"
              >
                <span className="beacon-mark" aria-hidden="true">
                  +
                </span>
                <span>
                  EXPLORE {current.name.replace(/^The /, '').toUpperCase()}
                  <small>
                    {['workshop', 'universe'].includes(current.id)
                      ? 'SELECT A SATELLITE OR OPEN THE PROJECT INDEX'
                      : 'A CLOSER LOOK'}{' '}
                    ↗
                  </small>
                </span>
              </button>
            )}
            <div className="scene-alt sr-only" aria-live="polite">
              Scene {chapter + 1} of {storyChapters.length}. {current.name}. {current.description}
            </div>
            <div className="chapter-progress" aria-hidden="true">
              <span style={{ width: `${((chapter + 1) / storyChapters.length) * 100}%` }} />
            </div>
            <footer className="story-navigation">
              <button className="story-index-button" onClick={() => setNavigation(true)}>
                <span className="sr-only">Open story chapters. </span>
                <svg viewBox="0 0 115 54" aria-hidden="true">
                  <polyline
                    points={constellation
                      .slice(0, 7)
                      .map((p) => p.join(','))
                      .join(' ')}
                  />
                  <polyline
                    points={constellation
                      .slice(7, 12)
                      .map((p) => p.join(','))
                      .join(' ')}
                  />
                  <polyline
                    points={constellation
                      .slice(12)
                      .map((p) => p.join(','))
                      .join(' ')}
                  />
                  {constellation.map(([x, y], i) => (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r={i === chapter ? 2.7 : 1.7}
                      className={i <= chapter ? 'discovered' : ''}
                    />
                  ))}
                </svg>
                <span>
                  {String(chapter + 1).padStart(2, '0')} / 17 <b>{current.name}</b>
                </span>
              </button>
              <span className="scroll-direction">
                <i />{' '}
                {chapter === 0
                  ? 'SCROLL TO FOLLOW HER CURIOSITY'
                  : 'THE SAME QUESTION. A DIFFERENT HORIZON.'}
              </span>
              <div className="chapter-travel">
                <button
                  onClick={() => travel(Math.max(0, chapter - 1))}
                  disabled={chapter === 0}
                  aria-label="Previous scene"
                >
                  ←
                </button>
                <button
                  className="next-scene"
                  onClick={() => {
                    if (chapter === 0) experience.boot();
                    travel(chapter === 16 ? 0 : chapter + 1);
                  }}
                >
                  {chapter === 0
                    ? 'FOLLOW THE SIGNAL'
                    : chapter === 16
                      ? 'BACK TO THE FIRST QUESTION'
                      : 'CONTINUE'}{' '}
                  <span>↗</span>
                </button>
              </div>
            </footer>
          </div>
        </div>
        {!storyMode && <QuickPortfolio onAction={action} onAward={award} onNavigate={navigate} />}
        <div className="sr-only story-description">
          <h2>The journey</h2>
          <ol>
            {storyChapters.map((c) => (
              <li key={c.id}>
                {c.name}: {c.description}
              </li>
            ))}
          </ol>
          <p>
            Use Quick Mode for all projects, technical skills, experience, research, achievements,
            résumé and contact information. Every interaction can be skipped with Continue.
          </p>
        </div>
        <noscript>
          <div className="story-nojs">
            <h1>{profile.name}</h1>
            <p>
              {profile.title}. {profile.introduction}
            </p>
            <h2>Mission records</h2>
            <ul>
              {projects.map((p) => (
                <li key={p.id}>
                  <a href={`/missions/${p.id}/`}>
                    {p.title} — {p.description}
                  </a>
                </li>
              ))}
            </ul>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={profile.resume}>Download résumé</a>
          </div>
          <style>{'.story-track,.field-header,.field-footer{display:none!important}'}</style>
        </noscript>
      </main>
      <div className="field-footer">
        <div>
          <button onClick={() => setTerminal(true)} aria-label="Open terminal">
            <span aria-hidden="true">&gt;_</span>
          </button>
          <button onClick={experience.toggleSound} aria-pressed={experience.sound}>
            SOUND {experience.sound ? 'ON' : 'OFF'}
          </button>
          <button onClick={experience.toggleMotion} aria-pressed={experience.reducedMotion}>
            {experience.reducedMotion ? 'REDUCED MOTION' : 'FULL MOTION'}
          </button>
        </div>
        <span
          className="collected-artifacts"
          aria-label={`${artifacts.length} artifacts collected`}
        >
          {artifacts.map((a) => (
            <span key={a} title={a}>
              {a === 'shield'
                ? '♧'
                : a === 'code'
                  ? '{}'
                  : a === 'orbit'
                    ? '◎'
                    : a === 'knowledge'
                      ? '✧'
                      : a === 'system'
                        ? '⌘'
                        : '?'}
            </span>
          ))}
          <span>{String(artifacts.length).padStart(2, '0')} / 08 DISCOVERIES</span>
        </span>
        <span className="field-footer-note">
          {storyMode ? 'A FIELD GUIDE TO CURIOSITY' : 'ANWESHA KAR / TECHNICAL BRIEFING'}
        </span>
      </div>
      {!experience.reducedMotion && (
        <div ref={cursor} className="orbital-cursor" aria-hidden="true">
          <span />
          {cursorLabel}
        </div>
      )}
      <div className={`status-toast ${status ? 'visible' : ''}`} role="status">
        {status}
      </div>
      <CommandPalette
        open={palette}
        onClose={() => setPalette(false)}
        onNavigate={navigate}
        onAction={action}
      />
      {terminal && (
        <dialog
          ref={terminalDialog}
          className="terminal-dialog"
          aria-label="System 369 interactive terminal"
          onCancel={(event) => {
            event.preventDefault();
            setTerminal(false);
          }}
        >
          <Terminal
            onAward={award}
            onAction={action}
            onClose={() => setTerminal(false)}
            onNavigate={(id) => {
              setTerminal(false);
              requestAnimationFrame(() => navigate(id));
            }}
          />
        </dialog>
      )}
      {navigation && (
        <dialog
          ref={navigationDialog}
          className="story-index-dialog"
          aria-label="Story chapters"
          onCancel={(event) => {
            event.preventDefault();
            setNavigation(false);
          }}
        >
          <div className="story-index-header">
            <span>THE FIELD GUIDE / 17 SCENES</span>
            <button onClick={() => setNavigation(false)} aria-label="Close story chapters">
              ×
            </button>
          </div>
          <ol>
            {storyChapters.map((c, i) => (
              <li key={c.id}>
                <button
                  aria-current={i === chapter ? 'step' : undefined}
                  onClick={() => {
                    setNavigation(false);
                    requestAnimationFrame(() => travel(i));
                  }}
                >
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <strong>{c.name}</strong>
                  <span>↗</span>
                </button>
              </li>
            ))}
          </ol>
          <button
            className="story-index-shortcut"
            onClick={() => {
              setNavigation(false);
              action('recruiter');
            }}
          >
            TAKE THE SHORTCUT / QUICK MODE ↗
          </button>
        </dialog>
      )}
    </div>
  );
}
