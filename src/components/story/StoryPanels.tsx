'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import ProjectAtlas from '@/components/ProjectAtlas';
import { achievements, milestones, profile, projects, research, skills } from '@/data/portfolio';

const SecurityLab = dynamic(() => import('@/components/SecurityLab'), {
  loading: () => <p className="eyebrow">Tracing the network…</p>,
});
type Props = {
  initialSkill?: number;
  chapter: number;
  localProgress: number;
  unlocked: string[];
  onAward: (id: string, points: number) => void;
  onGoTo: (chapter: number) => void;
  onAction: (action: string) => void;
  onReact: (kind: 'inspect' | 'celebrate' | 'wave' | 'reach') => void;
  onStatus: (message: string) => void;
};

const machines = [
  'eventmesh',
  'prepai',
  'boundarylens',
  'chronoheritage',
  'rescuers',
  'algoforge',
  'careeros',
  'prooftrail',
];
const machineNames: Record<string, string> = {
  eventmesh: 'SIGNAL MACHINE',
  prepai: 'INTELLIGENCE CORE',
  boundarylens: 'TRUST VAULT',
  chronoheritage: 'MEMORY TABLE',
  rescuers: 'COMMUNICATION BEACON',
  algoforge: 'ALGORITHM ENGINE',
  careeros: 'NAVIGATION CONSOLE',
  prooftrail: 'VERIFICATION LEDGER',
};

export default function StoryPanels(props: Props) {
  const { chapter, localProgress, onAward, onGoTo, onReact, onStatus, onAction, unlocked } = props;
  const [connections, setConnections] = useState(0);
  const [tech, setTech] = useState(props.initialSkill ?? 0);
  const [experiment, setExperiment] = useState(0);
  const [memory, setMemory] = useState(0);
  const [alignment, setAlignment] = useState(20);
  const [contactOpen, setContactOpen] = useState(false);
  const codeCollected = unlocked.includes('artifact-code');
  const logs = [
    ...milestones.map((m) => ({ ...m, label: m.category })),
    ...achievements.map((a) => ({ ...a, label: a.status })),
  ];

  if (chapter === 1)
    return (
      <div className="story-signal-action">
        <button
          className="signal-artifact"

          onClick={() => {
            onAward('artifact-question', 10);
            onReact('reach');
            onStatus('QUESTION FOUND / curiosity has a direction.');
          }}
        >
          <span className="sr-only">Catch the strange signal. </span>
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="38" />
            <path d="M50 16v68M16 50h68M26 26l48 48M74 26 26 74" />
            <circle cx="50" cy="50" r="8" />
          </svg>
          <span>
            {unlocked.includes('artifact-question') ? 'QUESTION COLLECTED' : 'REACH FOR THE SIGNAL'}
          </span>
        </button>
        <code>
          if (curious) {'{'} keepGoing(); {'}'}
        </code>
      </div>
    );

  if (chapter === 2)
    return (
      <div className="story-interaction connect-interaction">
        <span className="eyebrow">A SMALL EXPERIMENT / CONNECT THE NODES</span>
        <div className="syntax-puzzle" aria-label="Connect input, logic and possibility in order">
          {['INPUT', 'LOGIC', 'POSSIBILITY'].map((name, i) => (
            <button
              key={name}
              className={codeCollected || connections > i ? 'connected' : ''}
              aria-label={`Connect ${name.toLowerCase()} node — ${i === 0 ? '{ }' : i === 1 ? 'λ' : '∞'}${name}`}
              aria-pressed={codeCollected || connections > i}
              onClick={() => {
                onReact('reach');
                if (codeCollected) return;
                if (i === connections) {
                  setConnections(i + 1);
                  if (i === 2) {
                    onAward('artifact-code', 20);
                    onReact('celebrate');
                    onStatus('CODE FOUND / three instructions, a different world.');
                  }
                } else {
                  setConnections(0);
                  onStatus('Start with input. Then give it a rule.');
                }
              }}
            >
              <span aria-hidden="true">{i === 0 ? '{ }' : i === 1 ? 'λ' : '∞'}</span>
              <small>{name}</small>
            </button>
          ))}
        </div>
        <p>
          {codeCollected
            ? 'A few symbols. A new possibility.'
            : 'Begin with input. Give it logic. See what follows.'}
        </p>
      </div>
    );

  if (chapter === 3)
    return (
      <nav className="machine-hotspots" aria-label="Machines in the engineering workshop">
        {machines.map((id, i) => {
          const p = projects.find((x) => x.id === id);
          return p ? (
            <Link
              key={id}
              href={`/missions/${id}/`}
              className={`machine-link machine-${i}`}
              onFocus={() => onReact('inspect')}
              onMouseEnter={() => onReact('inspect')}
              onClick={() => onAward(`project:${id}`, 20)}
              data-cursor="OPEN"
            >
              <span className="machine-symbol" aria-hidden="true">
                {p.visualIdentity.symbol}
              </span>
              <strong>{p.title}</strong>
              <span>{machineNames[id]}</span>
              <small>INSPECT ↗</small>
            </Link>
          ) : null;
        })}
      </nav>
    );

  if (chapter === 4)
    return (
      <div className="story-interaction failure-interaction">
        <span className="fault-line">
          <i /> SIGNAL OUTSIDE THE TRUST BOUNDARY
        </span>
        <p>The machine still runs. Something else is using it.</p>
        <button
          className="story-action"
          onClick={() => {
            onReact('inspect');
            onGoTo(5);
          }}
        >
          FOLLOW THE UNEXPECTED SIGNAL <span>↗</span>
        </button>
      </div>
    );

  if (chapter === 5)
    return (
      <div className="story-console security-console" data-cursor="SCAN">
        <SecurityLab
          onAward={(id, points) => {
            onAward(id, points);
            if (id === 'cyber-threat') {
              onReact('celebrate');
              onStatus('SHIELD FOUND / understanding is a form of protection.');
            }
          }}
        />
        <p className="console-footnote">
          The shield she earns here travels with her. You can always continue without completing a
          challenge.
        </p>
      </div>
    );

  if (chapter === 6)
    return (
      <div className="story-console infrastructure-console">
        <div className="infrastructure-select" role="group" aria-label="Explore the infrastructure">
          {skills.map((skill, i) => (
            <button
              key={skill.id}
              onClick={() => {
                setTech(i);
                onReact('inspect');
              }}
              aria-pressed={tech === i}
            >
              <span className="infrastructure-dot" />
              <strong>{skill.name}</strong>
              <small>{skill.system}</small>
            </button>
          ))}
        </div>
        <div className="infrastructure-readout" aria-live="polite">
          <span className="eyebrow">{skills[tech].system}</span>
          <h3>{skills[tech].name}</h3>
          <p>{skills[tech].description}</p>
          <div>
            {skills[tech].projects.map((id) => (
              <Link href={`/missions/${id}/`} key={id}>
                {projects.find((x) => x.id === id)?.title} ↗
              </Link>
            ))}
          </div>
        </div>
      </div>
    );

  if (chapter === 7)
    return (
      <div className="story-interaction launch-console">
        <span className="eyebrow">A QUESTION. NOW WITH AN ENGINE.</span>
        <dl>
          {['ENGINE', 'SECURITY', 'NAVIGATION', 'TELEMETRY', 'COMMUNICATION'].map((name, i) => (
            <div className={localProgress > i * 0.13 ? 'online' : ''} key={name}>
              <dt>{name}</dt>
              <dd>{localProgress > i * 0.13 ? 'ONLINE' : 'ASSEMBLING'}</dd>
            </div>
          ))}
        </dl>
        <button
          className="story-action launch-action"
          onClick={() => {
            onAward('artifact-system', 20);
            onReact('celebrate');
            onStatus('SYSTEM FOUND / possibility has a flight path.');
            onGoTo(8);
          }}
        >
          INITIATE LAUNCH <span>↗</span>
        </button>
      </div>
    );

  if (chapter === 8)
    return (
      <div className="launch-telemetry" aria-label="Illustrative launch telemetry">
        <span>SIMULATED FLIGHT / SCROLL DRIVEN</span>
        <dl>
          <div>
            <dt>ALTITUDE</dt>
            <dd>
              {String(Math.round(localProgress * 120)).padStart(3, '0')} <small>KM</small>
            </dd>
          </div>
          <div>
            <dt>TRAJECTORY</dt>
            <dd>UPWARD</dd>
          </div>
          <div>
            <dt>QUESTION</dt>
            <dd>UNCHANGED</dd>
          </div>
        </dl>
      </div>
    );

  if (chapter === 9)
    return (
      <div className="story-interaction orbit-console">
        <span className="eyebrow">AN ORBIT IS A CONVERSATION WITH GRAVITY.</span>
        <div className="orbit-readout">
          <span>POSITION / 36.9 · 17.29</span>
          <span>LINK / {Math.abs(alignment - 69) < 5 ? 'ALIGNED' : 'SEARCHING'}</span>
          <span>CHANNEL / SIMULATED</span>
        </div>
        <label htmlFor="satellite-alignment">
          ALIGN THE SATELLITE <span>{alignment}°</span>
        </label>
        <input
          id="satellite-alignment"
          aria-label="Satellite alignment"
          type="range"
          min="0"
          max="100"
          value={alignment}
          onChange={(e) => {
            const value = Number(e.target.value);
            setAlignment(value);
            if (Math.abs(value - 69) < 5) {
              onAward('artifact-orbit', 20);
              onReact('celebrate');
              onStatus('ORBIT FOUND / a clearer signal at 69°.');
            }
          }}
        />
        <p>
          Find the clear frequency near 69°. An exploration of telemetry, GNSS, and NaVIC—not a live
          spacecraft feed.
        </p>
      </div>
    );

  if (chapter === 10)
    return (
      <div className="story-console constellation-console">
        <ProjectAtlas
          onDiscover={(id) => {
            onAward(`project:${id}`, 20);
            onReact('inspect');
          }}
        />
      </div>
    );

  if (chapter === 11) {
    const log = research[experiment];
    return (
      <div className="story-console research-console" data-cursor="INSPECT">
        <nav className="experiment-index" aria-label="Research experiments">
          {research.map((r, i) => (
            <button
              key={r.id}
              aria-pressed={experiment === i}
              onClick={() => {
                setExperiment(i);
                onAward(`research:${r.id}`, 30);
                onReact('inspect');
              }}
            >
              <span>0{i + 1}</span>
              {r.area.split(' / ')[0]}
              <span>↗</span>
            </button>
          ))}
        </nav>
        <article className="experiment-log" aria-live="polite">
          <span className="eyebrow">
            {log.status} / LOG {String(experiment + 1).padStart(2, '0')}
          </span>
          <h3>{log.title}</h3>
          <dl>
            {[
              ['QUESTION', log.problem],
              ['HYPOTHESIS', log.hypothesis],
              ['SYSTEM', log.proposedSystem],
              ['METHOD', log.experiment],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {log.source && (
            <a className="text-button" href={log.source} target="_blank" rel="noopener noreferrer">
              SOURCE RECORD ↗
            </a>
          )}
          <button
            className="text-button"
            onClick={() => {
              onAward('artifact-knowledge', 30);
              onReact('celebrate');
              onStatus('KNOWLEDGE FOUND / better questions are also progress.');
            }}
          >
            KEEP THE QUESTION ↗
          </button>
        </article>
      </div>
    );
  }

  if (chapter === 12)
    return (
      <div className="story-interaction door-interaction">
        <div className="door-artifacts" role="group" aria-label="Explore the possible keys">
          {['CODE', 'SYSTEM', 'SHIELD'].map((a) => (
            <button
              key={a}
              onClick={() => {
                onReact('inspect');
                onStatus(`${a} opened another boundary. This one needs a question.`);
              }}
            >
              {a}
              <span>◇</span>
            </button>
          ))}
        </div>
        <button
          className="why-key"
          data-cursor="?"
          onClick={() => {
            onAward('artifact-why', 20);
            onReact('reach');
            onStatus('The first question was the key all along.');
          }}
        >
          WHY<span>?</span>
        </button>
        <span className="eyebrow">SOME DOORS OPEN INWARD.</span>
      </div>
    );

  if (chapter === 13) {
    const log = logs[memory];
    return (
      <div className="story-console memory-console">
        <div className="memory-address">
          <span className="eyebrow">MEMORY LOG / {String(memory + 1).padStart(2, '0')}</span>
          <span>LESSON ACQUIRED</span>
        </div>
        <article aria-live="polite">
          <span className="eyebrow">{log.label}</span>
          <h3>{log.title}</h3>
          <p>{log.description}</p>
          {log.source && (
            <a className="text-button" href={log.source} target="_blank" rel="noopener noreferrer">
              ORIGINAL RECORD ↗
            </a>
          )}
        </article>
        <div className="memory-navigation">
          <button
            onClick={() => {
              setMemory((memory + logs.length - 1) % logs.length);
              onReact('inspect');
            }}
            aria-label="Previous memory"
          >
            ←
          </button>
          <div role="group" aria-label="Memory logs">
            {logs.map((m, i) => (
              <button
                key={m.id}
                className={memory === i ? 'selected' : ''}
                aria-label={`Read memory ${i + 1}: ${m.title}`}
                aria-pressed={memory === i}
                onClick={() => {
                  setMemory(i);
                  onReact('inspect');
                }}
              >
                <span />
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setMemory((memory + 1) % logs.length);
              onReact('inspect');
            }}
            aria-label="Next memory"
          >
            →
          </button>
        </div>
      </div>
    );
  }

  if (chapter === 14)
    return (
      <div className="mirror-stages" aria-label="The reflection grows from child to engineer">
        {['CHILD', 'STUDENT', 'BUILDER', 'ENGINEER'].map((stage, i) => (
          <span className={localProgress * 4 >= i ? 'resolved' : ''} key={stage}>
            {stage}
          </span>
        ))}
      </div>
    );

  if (chapter === 15)
    return (
      <div className="story-interaction present-interaction">
        <p>
          {profile.title} · {profile.institution}
        </p>
        <p>{profile.introduction}</p>
        <div className="present-links">
          <button onClick={() => onAction('resume')}>RÉSUMÉ ↓</button>
          <a href={profile.github!} target="_blank" rel="noopener noreferrer">
            GITHUB ↗
          </a>
          <a href={profile.linkedin!} target="_blank" rel="noopener noreferrer">
            LINKEDIN ↗
          </a>
        </div>
      </div>
    );

  if (chapter === 16)
    return (
      <div className="story-interaction final-interaction">
        <div className="transmission-open">
          <i /> TRANSMISSION OPEN
        </div>
        <div className="final-links">
          <button
            className="story-action"
            onClick={() => setContactOpen(!contactOpen)}
            aria-expanded={contactOpen}
            aria-controls="final-transmission"
          >
            LET’S BUILD WHAT COMES NEXT <span>↗</span>
          </button>
          <a href={`mailto:${profile.email}`}>{profile.email} ↗</a>
          <div>
            <a href={profile.github!} target="_blank" rel="noopener noreferrer">
              GITHUB ↗
            </a>
            <a href={profile.linkedin!} target="_blank" rel="noopener noreferrer">
              LINKEDIN ↗
            </a>
            <button onClick={() => onAction('resume')}>RÉSUMÉ ↓</button>
          </div>
        </div>
        <form
          id="final-transmission"
          hidden={!contactOpen}
          className="final-transmission"
          onSubmit={(e) => {
            e.preventDefault();
            const d = new FormData(e.currentTarget);
            window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(String(d.get('subject')))}&body=${encodeURIComponent(String(d.get('message')))}`;
            onStatus('Draft prepared. Send it from your email app.');
          }}
        >
          <label htmlFor="story-subject">SUBJECT</label>
          <input
            id="story-subject"
            name="subject"
            required
            maxLength={180}
            placeholder="A question. An idea. A new mission."
          />
          <label htmlFor="story-message">YOUR MESSAGE</label>
          <textarea
            id="story-message"
            name="message"
            required
            minLength={5}
            maxLength={4000}
            rows={3}
          />
          <button className="story-action">PREPARE EMAIL DRAFT ↗</button>
          <small>Opens your email app; this website does not send mail.</small>
        </form>
      </div>
    );
  return null;
}
