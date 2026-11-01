'use client';

import { useState } from 'react';
import Link from 'next/link';
import EvidenceLinks from '@/components/content/EvidenceLinks';
import ProjectAtlas from '../ProjectAtlas';
import {
  achievements,
  currentMission,
  flagshipProjects,
  milestones,
  profile,
  projects,
  research,
  skills,
} from '@/data/portfolio';
import './quick-mode.css';

type QuickPortfolioProps = {
  onAction: (action: string) => void;
  onAward: (id: string, points: number) => void;
  onNavigate?: (id: string) => void;
};

const links = [
  ['universe', 'Projects'],
  ['engine', 'Technology'],
  ['flight-path', 'Experience'],
  ['lab', 'Research'],
  ['vault', 'Milestones'],
  ['contact', 'Contact'],
];

function SourceLink({ href }: { href?: string }) {
  return href ? (
    <a className="q-source" href={href} target="_blank" rel="noopener noreferrer">
      Technical record <span aria-hidden="true">↗</span>
    </a>
  ) : null;
}

function SectionHeading({
  number,
  title,
  detail,
}: {
  number: string;
  title: string;
  detail: string;
}) {
  return (
    <div className="q-section-heading">
      <span className="q-index">{number}</span>
      <h2>{title}</h2>
      <p>{detail}</p>
    </div>
  );
}

export default function QuickPortfolio({ onAction, onAward, onNavigate }: QuickPortfolioProps) {
  const [selectedSkill, setSelectedSkill] = useState(skills[0].id);
  const [draftStatus, setDraftStatus] = useState('');
  const activeSkill = skills.find((skill) => skill.id === selectedSkill) || skills[0];
  const selectedProjects = flagshipProjects;

  return (
    <article className="quick-portfolio" aria-label="Technical portfolio briefing">
      <section id="quick-profile" className="q-profile" aria-labelledby="q-name">
        <div className="q-profile-topline">
          <span className="q-kicker">SYSTEM 369 / THE ENGINEER, AT A GLANCE</span>
          <span className="q-kicker">QUICK MODE</span>
        </div>
        <div className="q-profile-layout">
          <div>
            <h1 id="q-name">{profile.name}</h1>
            <p className="q-role">{profile.positioning}</p>
            <p className="q-affiliation">{profile.institution}</p>
          </div>
          <div className="q-profile-note">
            <p>
              Start with six flagship systems. Inspect source, architecture and technical records.
            </p>
          </div>
        </div>
        <div className="q-profile-actions">
          <button className="q-action q-primary" onClick={() => onAction('resume')}>
            Engineering profile <span aria-hidden="true">↓</span>
          </button>
          {profile.github && (
            <a className="q-action" href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>
          )}
          {profile.linkedin && (
            <a
              className="q-action"
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          )}
          {profile.email && (
            <a className="q-action q-email-link" href={`mailto:${profile.email}`}>
              {profile.email} <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </section>

      <nav className="q-jump-nav" aria-label="Quick portfolio contents">
        {links.map(([id, title]) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={(event) => {
              if (!onNavigate) return;
              event.preventDefault();
              onNavigate(id);
            }}
          >
            {title} <span aria-hidden="true">↗</span>
          </a>
        ))}
      </nav>

      <section id="universe" className="q-section" aria-labelledby="q-projects-title">
        <SectionHeading
          number="01"
          title="Flagship systems."
          detail="Different problems. Visible decisions. Inspect the work beneath the interface."
        />
        <div className="q-selected-projects" aria-labelledby="q-projects-title">
          <h3 id="q-projects-title" className="sr-only">
            Flagship project mission files
          </h3>
          {selectedProjects.map((project, index) => (
            <article className="q-flagship-entry" key={project.id}>
              <Link
                href={`/missions/${project.id}/`}
                className="q-project-row"
                key={project.id}
                onClick={() => onAward(`project:${project.id}`, 20)}
              >
                <span className="q-project-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="q-project-symbol" aria-hidden="true">
                  {project.visualIdentity.symbol}
                </span>
                <div className="q-project-body">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <span className="q-technology-signature">
                    {project.technologies.join(' / ') || 'Problem definition first'}
                  </span>
                </div>
                <span className="q-project-status">{project.status}</span>
                <span className="q-project-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
              <EvidenceLinks project={project} />
            </article>
          ))}
        </div>
        <div className="q-archive-heading">
          <h3>Mission archive</h3>
          <p>Search by project, technology, or constellation.</p>
        </div>
        <ProjectAtlas compact onDiscover={(id) => onAward(`project:${id}`, 20)} />
      </section>

      <section id="engine" className="q-section" aria-labelledby="q-skills-title">
        <SectionHeading
          number="02"
          title="Technology, in context."
          detail="Follow a module to the problems it powers. See the decisions and projects behind each technology."
        />
        <h3 id="q-skills-title" className="sr-only">
          Technology systems and project connections
        </h3>
        <div className="q-skills-layout">
          <div className="q-skill-controls" role="group" aria-label="Select a technology module">
            {skills.map((skill) => (
              <button
                key={skill.id}
                onClick={() => setSelectedSkill(skill.id)}
                aria-pressed={selectedSkill === skill.id}
              >
                <strong>{skill.name}</strong>
                <span>{skill.system}</span>
                <b aria-hidden="true">↗</b>
              </button>
            ))}
          </div>
          <div className="q-skill-detail" aria-live="polite" aria-atomic="true">
            <span className="q-kicker">{activeSkill.system}</span>
            <h3>{activeSkill.name}</h3>
            <p>{activeSkill.description}</p>
            <span className="q-kicker">CONNECTED MISSION RECORDS</span>
            {activeSkill.projects.map((id) => {
              const project = projects.find((item) => item.id === id);
              return project ? (
                <Link key={id} href={`/missions/${id}/`}>
                  {project.title}
                  <span aria-hidden="true">↗</span>
                </Link>
              ) : null;
            })}
          </div>
        </div>
      </section>

      <section id="flight-path" className="q-section" aria-labelledby="q-experience-title">
        <SectionHeading
          number="03"
          title="A path through the work."
          detail="Cybersecurity experience, technical leadership and systems work."
        />
        <h3 id="q-experience-title" className="sr-only">
          Experience and flight path
        </h3>
        <ol className="q-timeline">
          {[...milestones].reverse().map((milestone) => (
            <li key={milestone.id}>
              <span className="q-timeline-index">{milestone.phase}</span>
              <div>
                <span className="q-kicker">{milestone.category}</span>
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
                <SourceLink href={milestone.source} />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="lab" className="q-section" aria-labelledby="q-research-title">
        <SectionHeading
          number="04"
          title="Questions still open."
          detail="Research directions, explicit hypotheses, and methods that can be examined."
        />
        <h3 id="q-research-title" className="sr-only">
          Research notebook
        </h3>
        <div className="q-research">
          {research.map((log, index) => (
            <details
              key={log.id}
              onToggle={(event) => {
                if (event.currentTarget.open) onAward(`research:${log.id}`, 30);
              }}
            >
              <summary>
                <span className="q-project-number">R.{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <span className="q-kicker">{log.area}</span>
                  <h3>{log.title}</h3>
                </div>
                <span className="q-research-status">{log.status}</span>
                <span className="q-detail-plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="q-research-body">
                {[
                  ['Hypothesis', log.hypothesis],
                  ['Problem', log.problem],
                  ['Proposed system', log.proposedSystem],
                  ['Experiment', log.experiment],
                ].map(([title, value]) => (
                  <div key={title}>
                    <h4>{title}</h4>
                    <p>{value}</p>
                  </div>
                ))}
                <SourceLink href={log.source} />
              </div>
            </details>
          ))}
        </div>
      </section>

      <section id="vault" className="q-section" aria-labelledby="q-achievements-title">
        <SectionHeading
          number="05"
          title="Selected milestones."
          detail="Recognition and leadership as waypoints in an ongoing journey."
        />
        <h3 id="q-achievements-title" className="sr-only">
          Achievements and leadership
        </h3>
        <div className="q-achievements">
          {achievements.map((achievement, index) => (
            <article key={achievement.id}>
              <span className="q-project-number">M.{String(index + 1).padStart(2, '0')}</span>
              <div>
                <span className="q-kicker">{achievement.status}</span>
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
                <SourceLink href={achievement.source} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="now" className="q-section q-now" aria-labelledby="q-now-title">
        <SectionHeading number="06" title="The current question." detail={currentMission.status} />
        <div className="q-now-layout">
          <h3 id="q-now-title">{currentMission.mission}</h3>
          <dl>
            {[
              ['Building', currentMission.building],
              ['Exploring', currentMission.exploring],
              ['Research', currentMission.research],
              ['Next', currentMission.next],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="contact" className="q-section q-contact" aria-labelledby="q-contact-title">
        <SectionHeading
          number="07"
          title="A new conversation."
          detail="An idea, a question, or the beginning of another system."
        />
        <div className="q-contact-layout">
          <div>
            <h3 id="q-contact-title">Let’s build what comes next.</h3>
            <p>{profile.human[1]}</p>
            {profile.email && (
              <a className="q-contact-email" href={`mailto:${profile.email}`}>
                {profile.email}
                <span aria-hidden="true">↗</span>
              </a>
            )}
            <div className="q-contact-socials">
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer">
                  GitHub ↗
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn ↗
                </a>
              )}
              <button onClick={() => onAction('resume')}>Engineering profile ↗</button>
            </div>
          </div>
          <form
            className="q-contact-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (!profile.email) return;
              const data = new FormData(event.currentTarget);
              const subject = encodeURIComponent(String(data.get('subject')));
              const message = encodeURIComponent(String(data.get('message')));
              window.location.href = `mailto:${profile.email}?subject=${subject}&body=${message}`;
              setDraftStatus('Email draft prepared. Send it from your email app.');
            }}
          >
            <label htmlFor="q-contact-subject">Subject</label>
            <input
              id="q-contact-subject"
              name="subject"
              required
              maxLength={180}
              placeholder="A question. An idea. A possible mission."
            />
            <label htmlFor="q-contact-message">Your message</label>
            <textarea
              id="q-contact-message"
              name="message"
              required
              minLength={5}
              maxLength={4000}
              rows={4}
              placeholder="What are you thinking about building?"
            />
            <button type="submit" className="q-action q-primary">
              Prepare email draft <span aria-hidden="true">↗</span>
            </button>
            <p className="q-note">
              Opens your email app. This website does not send or store your message.
            </p>
            <p className="q-draft-status" role="status">
              {draftStatus}
            </p>
          </form>
        </div>
      </section>
    </article>
  );
}
