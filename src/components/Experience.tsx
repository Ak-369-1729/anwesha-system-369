'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import CosmicScene from './CosmicScene';
import ProjectAtlas from './ProjectAtlas';
import { useExperience } from '@/hooks/useExperience';
import {
  achievements,
  currentMission,
  milestones,
  profile,
  projects,
  research,
  skills,
} from '@/data/portfolio';
const SecurityLab = dynamic(() => import('./SecurityLab'), {
  loading: () => <p className="eyebrow">CONNECTING TO ISOLATED NETWORK…</p>,
});
const Terminal = dynamic(() => import('./Terminal'));
const CommandPalette = dynamic(() => import('./CommandPalette'));

const chapters = [
  ['signal', 'SIGNAL'],
  ['origin', 'ORIGIN'],
  ['universe', 'UNIVERSE'],
  ['cyberspace', 'CYBERSPACE'],
  ['engine', 'ENGINE ROOM'],
  ['lab', 'RESEARCH LAB'],
  ['flight-path', 'FLIGHT PATH'],
  ['vault', 'VAULT'],
  ['now', 'TRANSMISSION'],
  ['anomaly', 'ANOMALY'],
  ['human', 'HUMAN'],
  ['contact', 'CONNECTION'],
];
function ChapterLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <div className="chapter-label">
      <span>{number}</span>
      <span className="label-line" />
      {children}
      <span className="chapter-cross">+</span>
    </div>
  );
}

export default function Experience() {
  const exp = useExperience();
  const awardSignal = exp.award;
  const [chapter, setChapter] = useState(0);
  const [palette, setPalette] = useState(false);
  const [terminal, setTerminal] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [vaultOpen, setVaultOpen] = useState(false);
  const [activeTech, setActiveTech] = useState(0);
  const [status, setStatus] = useState('');
  const [cursor, setCursor] = useState('');
  const cursorRef = useRef<HTMLDivElement>(null);
  const terminalDialog = useRef<HTMLDialogElement>(null);
  const navigate = useCallback(
    (id: string) => {
      setNavOpen(false);
      const resolved = exp.mode === 'recruiter' && id === 'signal' ? 'recruiter-briefing' : id;
      const target = document.getElementById(resolved);
      target?.scrollIntoView({
        behavior: exp.reducedMotion || exp.mode === 'recruiter' ? 'instant' : 'smooth',
      });
      if (target) {
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
      }
    },
    [exp.reducedMotion, exp.mode],
  );
  const notify = useCallback((text: string) => {
    setStatus(text);
  }, []);
  const action = useCallback(
    (key: string) => {
      if (key === 'terminal') setTerminal(true);
      if (key === 'sound') exp.toggleSound();
      if (key === 'motion') exp.toggleMotion();
      if (key === 'explorer' || key === 'recruiter') {
        exp.setMode(key);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
      if (key === 'contact') navigate('contact');
      if (key === 'resume') {
        const a = document.createElement('a');
        a.href = profile.resume;
        a.download = 'Anwesha-Kar-Profile.html';
        a.click();
      }
      if (key === 'github' || key === 'linkedin') {
        const url = profile[key];
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    [exp, navigate],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            const n = chapters.findIndex((c) => c[0] === entry.target.id);
            if (n >= 0) setChapter(n);
          }
      },
      { rootMargin: '-20% 0px -52% 0px', threshold: 0 },
    );
    document.querySelectorAll('section[data-chapter]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [exp.mode]);
  useEffect(() => {
    document.documentElement.dataset.motion = exp.reducedMotion ? 'reduced' : 'full';
  }, [exp.reducedMotion]);
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
    let progress = 0;
    const keydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPalette((v) => !v);
        return;
      }
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === sequence[progress]) progress++;
      else progress = e.key === sequence[0] ? 1 : 0;
      if (progress === sequence.length) {
        awardSignal('dev-mode', 50);
        notify('SECRET DEV MODE // 369.1729 // +50 SIGNAL');
        document.body.classList.toggle('dev-mode');
        progress = 0;
      }
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [awardSignal, notify]);
  useEffect(() => {
    if (!terminal) return;
    const d = terminalDialog.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    d?.showModal();
    const frame = requestAnimationFrame(() => d?.querySelector('input')?.focus());
    return () => {
      cancelAnimationFrame(frame);
      d?.close();
      previous?.focus();
    };
  }, [terminal]);
  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(() => setStatus(''), 5000);
    return () => clearTimeout(timer);
  }, [status]);
  useEffect(() => {
    if (exp.reducedMotion || !matchMedia('(pointer:fine)').matches) return;
    const move = (e: PointerEvent) => {
      if (cursorRef.current)
        cursorRef.current.style.transform = `translate3d(${e.clientX + 16}px,${e.clientY + 16}px,0)`;
    };
    const over = (e: PointerEvent) => {
      const el = e.target instanceof Element ? e.target.closest('[data-cursor],a,button') : null;
      setCursor(el?.getAttribute('data-cursor') || (el ? 'OPEN' : ''));
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
    };
  }, [exp.reducedMotion]);
  const enter = () => {
    exp.boot();
    notify('ACCESS GRANTED // +10 SIGNAL');
    navigate('origin');
  };
  const modeToggle = () => action(exp.mode === 'explorer' ? 'recruiter' : 'explorer');
  return (
    <div className={`experience ${exp.mode}`}>
      <a className="skip-link" href="#universe">
        Jump to projects
      </a>
      <CosmicScene
        chapter={exp.mode === 'recruiter' ? 2 : chapter}
        reducedMotion={exp.reducedMotion || exp.mode === 'recruiter'}
      />
      <div className="atlas-grid" aria-hidden="true" />
      <header className="mission-hud">
        <a
          href="#signal"
          className="brand"
          onClick={(e) => {
            e.preventDefault();
            navigate('signal');
          }}
        >
          <span className="brand-orbit" aria-hidden="true">
            ◎
          </span>
          <span>
            ANWESHA<span className="brand-sub">SYSTEM / 369</span>
          </span>
        </a>
        <button
          className="mode-switch"
          onClick={modeToggle}
          aria-label={`${exp.mode.toUpperCase()} MODE — Switch to ${exp.mode === 'explorer' ? 'recruiter' : 'explorer'} mode`}
        >
          <span className="mode-dot" />
          {exp.mode.toUpperCase()} MODE<span className="switch-arrow">⇄</span>
        </button>
        <div className="hud-right">
          <span className="system-status">
            <i />
            ALL SYSTEMS NOMINAL
          </span>
          <button
            className="command-toggle"
            onClick={() => setPalette(true)}
            aria-label="⌘ K — Open command palette"
          >
            ⌘ <span>K</span>
          </button>
          <button
            className="menu-toggle"
            onClick={() => setNavOpen(!navOpen)}
            aria-expanded={navOpen}
            aria-controls="chapter-nav"
            aria-label="Mission navigation"
          >
            ☰
          </button>
        </div>
      </header>
      <nav
        id="chapter-nav"
        className={`chapter-nav ${navOpen ? 'is-open' : ''}`}
        aria-label="Mission chapters"
      >
        <span className="nav-caption">FLIGHT INDEX</span>
        {chapters.map(([id, label], i) =>
          exp.mode === 'recruiter' &&
          ['signal', 'origin', 'anomaly', 'human'].includes(id) ? null : (
            <a
              key={id}
              href={`#${id}`}
              className={chapter === i ? 'active' : ''}
              aria-current={chapter === i ? 'location' : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigate(id);
              }}
            >
              <span>{String(i).padStart(2, '0')}</span>
              <span className="nav-tick" />
              <span className="nav-title">{label}</span>
            </a>
          ),
        )}
        <span className="nav-bottom">
          36.9° N<br />
          17.29° E
        </span>
      </nav>
      <div className="score-hud">
        <span className="signal-bars" aria-hidden="true">
          ▁▂▃▅
        </span>
        <span>
          SIGNAL <strong>{String(exp.score).padStart(3, '0')}</strong>
        </span>
        <span className="score-level">{exp.level}</span>
      </div>
      <main>
        <section id="signal" data-chapter className="signal-section" aria-labelledby="signal-title">
          <div className="signal-topline">
            <span>
              <i className="live-dot" /> SIGNAL DETECTED / SOURCE IDENTIFIED
            </span>
            <button
              onClick={() => {
                exp.boot();
                navigate('universe');
              }}
            >
              SKIP INTRO ↗
            </button>
          </div>
          <div className="signal-content">
            <div className="hero-copy">
              <div className="eyebrow hero-eyebrow">
                <span className="tiny-cross">+</span> A CURIOUS MIND. AN OPEN SYSTEM.
              </div>
              <h1 id="signal-title">
                ANWESHA
                <br />
                <span>KAR</span>
                <span className="name-period">.</span>
              </h1>
              <div className="identity-caption">
                SOFTWARE ENGINEER <span>/</span> RESEARCHER <span>/</span> BUILDER
              </div>
              <p className="hero-description">
                Building systems that move between
                <br />
                <span>code, intelligence, security</span> and the unknown.
              </p>
              <div className="hero-actions">
                <button className="button primary" onClick={enter}>
                  INITIALIZE EXPLORATION <span>↗</span>
                </button>
                <button className="text-button" onClick={() => action('resume')}>
                  ↓ DOWNLOAD RÉSUMÉ
                </button>
              </div>
              <div className="boot-trace">
                <span>&gt; identity.signature()</span>
                <span>
                  curiosity: <em>UNBOUNDED</em>
                  <b className="terminal-caret">_</b>
                </span>
              </div>
            </div>
            <div className="core-annotation" aria-hidden="true">
              <span className="core-index">[ IDENTITY CORE — 001 ]</span>
              <span className="core-cross">+</span>
              <div className="core-readout">
                <span className="core-ring-dot" /> SYSTEM BOUNDARIES: EXPANDING
                <span>RADIUS ∞ &nbsp; / &nbsp; ORIGIN 369</span>
              </div>
            </div>
          </div>
          <div className="signal-bottom">
            <button onClick={() => navigate('origin')} className="scroll-cue">
              <span>↓</span> SCROLL TO GO DEEPER
            </button>
            <span className="hero-disciplines">
              ENGINEERING <i>×</i> SPACE <i>×</i> SECURITY <i>×</i> CURIOSITY
            </span>
            <span className="version-code">V.03.69 / ONLINE</span>
          </div>
        </section>
        <aside
          id="recruiter-briefing"
          className="recruiter-summary"
          aria-label="Recruiter briefing"
        >
          <span className="eyebrow">RECRUITER BRIEFING / ONE MINUTE TO ORBIT</span>
          <h2>
            Engineering.
            <br />
            With curiosity built in.
          </h2>
          <p>{profile.introduction}</p>
          <div className="briefing-actions">
            <a href={`mailto:${profile.email}`} className="button primary">
              EMAIL ANWESHA ↗
            </a>
            <button onClick={() => action('resume')} className="button outline">
              DOWNLOAD RÉSUMÉ ↓
            </button>
          </div>
          <p className="editorial-note">
            Explore project records, technology connections, research directions, and career
            milestones below. Source-backed work and proposed designs are labeled separately.
          </p>
        </aside>
        <div className="journey">
          <section
            id="origin"
            data-chapter
            className="chapter origin-section"
            aria-labelledby="origin-title"
          >
            <ChapterLabel number="01">ORIGIN / THE PERSON IN THE SYSTEM</ChapterLabel>
            <div className="origin-layout">
              <div>
                <span className="eyebrow">NOT JUST THE INTERFACE.</span>
                <h2 id="origin-title">
                  The interesting part
                  <br />
                  is <em>underneath.</em>
                </h2>
              </div>
              <div className="origin-copy">
                <p>{profile.introduction}</p>
                <p>I build where these worlds collide.</p>
                <div className="identity-fragments">
                  {profile.roles.map((role, i) => (
                    <span key={role}>
                      <small>0{i + 1}</small>
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="section-bridge">
              <span />
              IDENTITY RESOLVED <b>→</b> MAPPING POSSIBILITIES
              <span />
            </div>
          </section>
          <section
            id="universe"
            data-chapter
            className="chapter universe-section"
            aria-labelledby="universe-title"
          >
            <ChapterLabel number="02">THE UNIVERSE / PROJECT CONSTELLATION</ChapterLabel>
            <div className="section-heading">
              <div>
                <h2 id="universe-title">
                  Different worlds.
                  <br />
                  <em>Connected by curiosity.</em>
                </h2>
                <p>
                  Different questions. Connected systems. Choose a signal to inspect its mission
                  file.
                </p>
              </div>
              <span className="section-index">
                17 OBJECTS
                <br />
                06 CONSTELLATIONS
              </span>
            </div>
            <ProjectAtlas
              key={exp.mode}
              compact={exp.mode === 'recruiter'}
              onDiscover={(id) => exp.award(`project:${id}`, 20)}
            />
            <p className="editorial-note">
              Mission files link to original work where available. Proposed designs and evidence
              limits are clearly labeled.
            </p>
          </section>
          <section
            id="cyberspace"
            data-chapter
            className="chapter security-section"
            aria-labelledby="security-title"
          >
            <ChapterLabel number="03">CYBERSPACE / CROSSING THE TRUST BOUNDARY</ChapterLabel>
            <div className="section-heading">
              <div>
                <span className="eyebrow alert-text">CONTROLLED ENVIRONMENT / NO LIVE SYSTEMS</span>
                <h2 id="security-title">
                  Trust is a system.
                  <br />
                  <em>Test its edges.</em>
                </h2>
                <p>Inspect the topology. Find the anomalous egress. Contain the affected node.</p>
              </div>
              <span className="section-index">
                INTERACTIVE
                <br />
                THREAT SIMULATION
              </span>
            </div>
            <SecurityLab onAward={exp.award} />
            <div className="section-bridge">
              <span />
              BOUNDARY SECURED <b>→</b> DESCENDING TO THE ENGINE
              <span />
            </div>
          </section>
          <section
            id="engine"
            data-chapter
            className="chapter engine-section"
            aria-labelledby="engine-title"
          >
            <ChapterLabel number="04">ENGINE ROOM / THE SYSTEM UNDERNEATH</ChapterLabel>
            <div className="section-heading">
              <h2 id="engine-title">
                Every system
                <br />
                has a <em>power source.</em>
              </h2>
              <p>
                No percentages. Follow a technology
                <br />
                to the problems it could help solve.
              </p>
            </div>
            <div className="engine-layout">
              <div className="engine-stack" role="group" aria-label="Technology systems">
                {skills.map((skill, i) => (
                  <button
                    key={skill.id}
                    className={activeTech === i ? 'selected' : ''}
                    aria-pressed={activeTech === i}
                    onClick={() => setActiveTech(i)}
                  >
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    <strong>{skill.name}</strong>
                    <span>{skill.system}</span>
                    <b>↗</b>
                  </button>
                ))}
              </div>
              <div className="engine-readout" aria-live="polite">
                <span className="eyebrow">MODULE / {skills[activeTech].system}</span>
                <div className="engine-glyph" aria-hidden="true">
                  ⌘
                </div>
                <h3>{skills[activeTech].name}</h3>
                <p>{skills[activeTech].description}</p>
                <span className="eyebrow">CONNECTED MISSION RECORDS</span>
                {skills[activeTech].projects.map((id) => {
                  const p = projects.find((x) => x.id === id);
                  return p ? (
                    <Link href={`/missions/${id}/`} key={id}>
                      {p.title}
                      <span>↗</span>
                    </Link>
                  ) : null;
                })}
              </div>
            </div>
          </section>
          <section
            id="lab"
            data-chapter
            className="chapter lab-section"
            aria-labelledby="lab-title"
          >
            <ChapterLabel number="05">ORBITAL LAB / QUESTIONS STILL OPEN</ChapterLabel>
            <div className="section-heading">
              <div>
                <h2 id="lab-title">
                  Good questions
                  <br />
                  deserve <em>an experiment.</em>
                </h2>
                <p>
                  Research directions, testable hypotheses, and a healthy respect for what isn’t
                  known yet.
                </p>
              </div>
              <span className="section-index">
                OBSERVE
                <br />
                HYPOTHESIZE
                <br />
                REPEAT
              </span>
            </div>
            <div className="research-list">
              {research.map((log, i) => (
                <details
                  key={log.id}
                  onToggle={(e) => {
                    if (e.currentTarget.open) exp.award(`research:${log.id}`, 30);
                  }}
                >
                  <summary>
                    <span className="research-number">R.{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <span className="eyebrow">{log.area}</span>
                      <h3>{log.title}</h3>
                    </div>
                    <span className="research-status">{log.status}</span>
                    <span className="expand-mark">+</span>
                  </summary>
                  <div className="research-body">
                    {[
                      ['Hypothesis', log.hypothesis],
                      ['Problem', log.problem],
                      ['Proposed system', log.proposedSystem],
                      ['Experiment', log.experiment],
                    ].map(([title, text]) => (
                      <div key={title}>
                        <h4>{title}</h4>
                        <p>{text}</p>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </section>
          <section
            id="flight-path"
            data-chapter
            className="chapter flight-section"
            aria-labelledby="flight-title"
          >
            <ChapterLabel number="06">FLIGHT PATH / AN ENGINEERING TRAJECTORY</ChapterLabel>
            <h2 id="flight-title">
              Not a straight line.
              <br />
              <em>A direction.</em>
            </h2>
            <p className="section-intro">
              A flight path through building, research, and service. Records are drawn from my
              existing portfolio.
            </p>
            <div className="flight-path">
              {milestones.map((m) => (
                <article key={m.id}>
                  <div className="flight-marker">
                    <span>{m.phase}</span>
                  </div>
                  <div>
                    <span className="eyebrow">{m.category}</span>
                    <h3>{m.title}</h3>
                    <p>{m.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section
            id="vault"
            data-chapter
            className="chapter vault-section"
            aria-labelledby="vault-title"
          >
            <ChapterLabel number="07">ACHIEVEMENT VAULT / EVIDENCE MATTERS</ChapterLabel>
            <div className="vault-layout">
              <div className={`vault-art ${vaultOpen ? 'unlocked' : ''}`} aria-hidden="true">
                <div />
                <span>{vaultOpen ? '⌑' : '⌾'}</span>
                <div />
              </div>
              <div>
                <span className="eyebrow">{vaultOpen ? 'ARCHIVE OPEN' : 'ARCHIVE ENCRYPTED'}</span>
                <h2 id="vault-title">
                  Every milestone
                  <br />
                  has <em>a story.</em>
                </h2>
                <p>
                  Open the archive to explore milestones documented in my existing portfolio, with
                  the source of each record kept explicit.
                </p>
                <button
                  className="button outline"
                  aria-expanded={vaultOpen}
                  aria-controls="vault-records"
                  onClick={() => {
                    setVaultOpen(!vaultOpen);
                    if (!vaultOpen) exp.award('vault', 30);
                  }}
                >
                  {vaultOpen ? 'CLOSE ARCHIVE −' : 'DECRYPT ARCHIVE ↗'}
                </button>
              </div>
            </div>
            <div
              id="vault-records"
              hidden={!vaultOpen && exp.mode !== 'recruiter'}
              className="vault-records"
            >
              {achievements.map((a) => (
                <article key={a.id}>
                  <span className="eyebrow">{a.status}</span>
                  <h3>{a.title}</h3>
                  <p>{a.description}</p>
                </article>
              ))}
            </div>
          </section>
          <section
            id="now"
            data-chapter
            className="chapter now-section"
            aria-labelledby="now-title"
          >
            <ChapterLabel number="08">CURRENT TRANSMISSION / AN OPEN FREQUENCY</ChapterLabel>
            <div className="now-layout">
              <div>
                <span className="eyebrow">
                  <i className="live-dot" /> EDITORIAL MISSION FEED
                </span>
                <h2 id="now-title">{currentMission.mission}</h2>
                <p>{currentMission.status}</p>
              </div>
              <dl>
                {[
                  ['BUILDING', currentMission.building],
                  ['EXPLORING', currentMission.exploring],
                  ['RESEARCH', currentMission.research],
                  ['NEXT', currentMission.next],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
          <section
            id="anomaly"
            data-chapter
            className="chapter anomaly-section"
            aria-labelledby="anomaly-title"
            data-cursor="???"
          >
            <ChapterLabel number="09">ANOMALY / THE EDGE OF WHAT WE KNOW</ChapterLabel>
            <span className="eyebrow anomaly-coordinates">COORDINATES UNRESOLVED // 369.1729</span>
            <div className="black-hole" aria-hidden="true">
              <div className="accretion-disc" />
              <div className="event-horizon" />
              <div className="photon-ring" />
            </div>
            <div className="anomaly-message">
              <span className="eyebrow">BEYOND THE EVENT HORIZON</span>
              <h2 id="anomaly-title">
                The unknown is
                <br />
                an invitation <em>to build.</em>
              </h2>
              <button
                className="text-button"
                onClick={() => {
                  exp.award('artifact-369', 50);
                  notify('HIDDEN ARTIFACT RECOVERED // +50 SIGNAL');
                  navigate('human');
                }}
              >
                FOLLOW THE SIGNAL ↓
              </button>
            </div>
          </section>
          <section
            id="human"
            data-chapter
            className="chapter human-section"
            aria-labelledby="human-title"
          >
            <ChapterLabel number="10">HUMAN MODE / NO INTERFACE REQUIRED</ChapterLabel>
            <div className="human-layout">
              <h2 id="human-title">
                Behind every system,
                <br />
                someone still asks:
                <br />
                <em>“What if?”</em>
              </h2>
              <div>
                <p>{profile.human[1]}</p>
                <p>{profile.human[2]}</p>
                <span className="human-signature">Anwesha.</span>
              </div>
            </div>
          </section>
          <section
            id="contact"
            data-chapter
            className="chapter contact-section"
            aria-labelledby="contact-title"
          >
            <ChapterLabel number="11">ESTABLISH CONNECTION / SIGNAL OPEN</ChapterLabel>
            <div className="contact-layout">
              <div>
                <span className="eyebrow">
                  <i className="live-dot" /> RECEIVING ON ALL FREQUENCIES
                </span>
                <h2 id="contact-title">
                  Let’s build something
                  <br />
                  <em>worth discovering.</em>
                </h2>
                <a className="contact-email" href={`mailto:${profile.email}`}>
                  {profile.email}
                  <span>↗</span>
                </a>
                <div className="contact-links">
                  <a href={profile.github!} target="_blank" rel="noopener noreferrer">
                    GITHUB ↗
                  </a>
                  <a href={profile.linkedin!} target="_blank" rel="noopener noreferrer">
                    LINKEDIN ↗
                  </a>
                  <button onClick={() => action('resume')}>RÉSUMÉ ↓</button>
                </div>
                <p className="editorial-note">
                  Résumé download is a printable profile overview based on the supplied information.
                </p>
              </div>
              <form
                className="transmission-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const data = new FormData(e.currentTarget);
                  const subject = String(data.get('subject'));
                  const body = String(data.get('message'));
                  window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  notify('EMAIL DRAFT PREPARED // SEND IT FROM YOUR EMAIL APP');
                }}
              >
                <span className="eyebrow">OPEN A TRANSMISSION</span>
                <label htmlFor="subject">SUBJECT</label>
                <input
                  id="subject"
                  name="subject"
                  required
                  maxLength={180}
                  placeholder="A question. An idea. A new mission."
                />
                <label htmlFor="message">YOUR MESSAGE</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  minLength={5}
                  maxLength={4000}
                  rows={4}
                  placeholder="What are you thinking about building?"
                />
                <button className="button primary" type="submit">
                  PREPARE TRANSMISSION <span>↗</span>
                </button>
                <span className="form-note">
                  Opens your email app. No message is sent by this website.
                </span>
              </form>
            </div>
            <footer className="mission-footer">
              <span>ANWESHA KAR © {new Date().getFullYear()}</span>
              <span className="next-mission">↗ &nbsp;NEXT MISSION: UNKNOWN.</span>
              <button onClick={() => navigate('signal')}>BACK TO ORIGIN ↑</button>
            </footer>
          </section>
        </div>
      </main>
      <div className="bottom-hud">
        <div>
          <button onClick={() => setTerminal(true)} aria-label="Open terminal">
            &gt;_ TERMINAL
          </button>
          <span className="hud-separator" />
          <button onClick={exp.toggleSound} aria-pressed={exp.sound}>
            SOUND {exp.sound ? 'ON' : 'OFF'}
          </button>
          <button onClick={exp.toggleMotion} aria-pressed={exp.reducedMotion}>
            MOTION {exp.reducedMotion ? 'REDUCED' : 'FULL'}
          </button>
        </div>
        <span className="chapter-position">
          {String(chapter).padStart(2, '0')} / 11 <span>— {chapters[chapter][1]}</span>
        </span>
      </div>
      {!exp.reducedMotion && (
        <div ref={cursorRef} className="orbital-cursor" aria-hidden="true">
          <span />
          {cursor}
        </div>
      )}
      <div className={`status-toast ${status ? 'visible' : ''}`} role="status" aria-live="polite">
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
          onCancel={(e) => {
            e.preventDefault();
            setTerminal(false);
          }}
        >
          <Terminal
            onNavigate={(id) => {
              setTerminal(false);
              requestAnimationFrame(() => navigate(id));
            }}
            onAward={exp.award}
            onAction={action}
            onClose={() => setTerminal(false)}
          />
        </dialog>
      )}
    </div>
  );
}
