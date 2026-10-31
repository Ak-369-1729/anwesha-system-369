import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { profile, projects } from '@/data/portfolio';
type Props = { params: Promise<{ id: string }> };
export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = projects.find((x) => x.id === id);
  return {
    title: p ? `${p.title} — Mission File / System 369` : 'Signal lost',
    description: p?.description,
  };
}
export default async function MissionPage({ params }: Props) {
  const { id } = await params;
  const index = projects.findIndex((x) => x.id === id);
  const p = projects[index];
  if (!p) notFound();
  const next = projects[(index + 1) % projects.length];
  return (
    <div
      className="mission-file"
      style={{ '--mission-color': p.visualIdentity.color } as React.CSSProperties}
    >
      <header className="file-hud">
        <Link href="/#universe" className="file-back">
          ↖ RETURN TO THE UNIVERSE
        </Link>
        <span className="eyebrow">ANWESHA // SYSTEM 369</span>
        <a href={profile.resume} download="Anwesha-Kar-Profile.html" className="eyebrow">
          RÉSUMÉ ↓
        </a>
      </header>
      <main className="file-main">
        <div className="file-classification">
          <span>
            <i className="live-dot" /> MISSION ARCHIVE / {String(index + 1).padStart(3, '0')}
          </span>
          <span>{p.category.toUpperCase()}</span>
        </div>
        <div className="file-hero">
          <div>
            <span className="eyebrow">{p.codename}</span>
            <h1>
              {p.title}
              <span>.</span>
            </h1>
            <p>{p.description}</p>
            <div className="file-meta">
              <span>STATUS / {p.status.toUpperCase()}</span>
              <span>
                TYPE / {p.status === 'Concept record' ? 'DESIGN EXPLORATION' : 'PROJECT RECORD'}
              </span>
            </div>
          </div>
          <div className="file-symbol" aria-hidden="true">
            <span>{p.visualIdentity.symbol}</span>
            <i />
            <b />
          </div>
        </div>
        <p className="file-evidence">
          <span className="eyebrow">EVIDENCE STATE</span>
          {p.evidence}
        </p>
        <div className="file-sources">
          {p.sources?.map((source) => (
            <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">
              {source.title} ↗
            </a>
          ))}
        </div>
        <div className="file-contents">
          <a href="#mission">01 MISSION</a>
          <a href="#architecture">02 ARCHITECTURE</a>
          <a href="#decisions">03 DECISIONS</a>
          <a href="#outcomes">04 OUTCOMES</a>
        </div>
        <section id="mission" className="file-section">
          <span className="eyebrow">01 / MISSION BRIEF</span>
          <div className="file-two-column">
            <div>
              <h2>The question.</h2>
              <p>{p.problem}</p>
            </div>
            <div>
              <h2>The approach.</h2>
              <p>{p.solution}</p>
            </div>
          </div>
        </section>
        <section id="architecture" className="file-section">
          <span className="eyebrow">
            02 / {p.status === 'Source available' ? 'SYSTEM ARCHITECTURE' : 'PROPOSED ARCHITECTURE'}
          </span>
          <h2>Follow the signal.</h2>
          <p className="file-intro">
            A system is easier to reason about when its boundaries are visible.
          </p>
          <ol className="architecture-flow" aria-label={`${p.title} proposed architecture`}>
            {p.architecture.map((step, i) => (
              <li key={step}>
                <span className="architecture-index">0{i + 1}</span>
                <span className="architecture-name">{step}</span>
                {i < p.architecture.length - 1 && (
                  <span className="architecture-arrow" aria-hidden="true">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
          <div className="file-stack">
            <span className="eyebrow">CANDIDATE TECHNOLOGY SIGNATURE</span>
            <div>
              {p.technologies.length ? (
                p.technologies.map((t) => <span key={t}>{t}</span>)
              ) : (
                <span>Stack follows the problem definition.</span>
              )}
            </div>
          </div>
        </section>
        <section id="decisions" className="file-section">
          <span className="eyebrow">03 / ENGINEERING NOTEBOOK</span>
          <div className="file-two-column">
            <div>
              <h2>Decisions that matter.</h2>
              <ul className="file-decisions">
                {p.decisions.map((d, i) => (
                  <li key={d}>
                    <span>0{i + 1}</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2>Where it gets difficult.</h2>
              <ul className="file-decisions">
                {p.challenges.map((d, i) => (
                  <li key={d}>
                    <span>0{i + 1}</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section id="outcomes" className="file-section">
          <span className="eyebrow">04 / IMPACT & LEARNING</span>
          <div className="file-two-column">
            <div>
              <h2>Evidence before claims.</h2>
              <p>{p.impact}</p>
            </div>
            <div>
              <h2>The next question.</h2>
              <p>{p.lessons}</p>
            </div>
          </div>
          <div className="file-links">
            {p.github && (
              <a
                className="button primary"
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                VIEW SOURCE ↗
              </a>
            )}
            {p.demo && (
              <a className="button outline" href={p.demo} target="_blank" rel="noopener noreferrer">
                LAUNCH DEMO ↗
              </a>
            )}
            <a
              className="button outline"
              href={profile.github!}
              target="_blank"
              rel="noopener noreferrer"
            >
              ANWESHA’S GITHUB ↗
            </a>
            <a
              className="text-button"
              href={`mailto:${profile.email}?subject=${encodeURIComponent(`A question about ${p.title}`)}`}
            >
              ASK ABOUT THIS MISSION ↗
            </a>
          </div>
        </section>
        <Link href={`/missions/${next.id}/`} className="next-file">
          <div>
            <span className="eyebrow">NEXT SIGNAL / {next.category.toUpperCase()}</span>
            <h2>{next.title}</h2>
          </div>
          <span aria-hidden="true">↗</span>
        </Link>
        <footer className="file-footer">
          <Link href="/#universe">↖ ALL MISSION RECORDS</Link>
          <span>36.9 / 17.29 — KEEP ASKING.</span>
        </footer>
      </main>
    </div>
  );
}
