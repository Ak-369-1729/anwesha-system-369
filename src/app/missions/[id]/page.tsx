import Link from 'next/link';
import { notFound } from 'next/navigation';
import { profile, projects } from '@/data/portfolio';
import { pageMetadata, person, siteUrl } from '@/lib/seo';
import { PageSeo } from '@/components/content/PageSeo';
import EvidenceLinks from '@/components/content/EvidenceLinks';

type Props = { params: Promise<{ id: string }> };
export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}
export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  return pageMetadata(
    project ? `${project.title} — ${project.codename} | Anwesha Kar` : 'Signal lost | SYSTEM 369',
    project?.description ?? 'Uncharted coordinates.',
    `/missions/${id}/`,
  );
}
export default async function MissionPage({ params }: Props) {
  const { id } = await params;
  const index = projects.findIndex((p) => p.id === id);
  const p = projects[index];
  if (!p) notFound();
  const next = projects[(index + 1) % projects.length];
  return (
    <div
      className="mission-file"
      style={{ '--mission-color': p.visualIdentity.color } as React.CSSProperties}
    >
      <PageSeo
        path={`/missions/${p.id}/`}
        data={{
          '@type': p.status === 'RESEARCH' ? 'CreativeWork' : 'SoftwareSourceCode',
          name: p.title,
          description: p.description,
          creativeWorkStatus: p.status,
          publisher: person,
          ...(p.github ? { codeRepository: p.github } : {}),
          url: siteUrl(`/missions/${p.id}/`),
          keywords: p.technologies.join(', '),
        }}
      />
      <header className="file-hud">
        <Link href="/#universe" className="file-back">
          ↖ RETURN TO THE UNIVERSE
        </Link>
        <span className="eyebrow">ANWESHA // SYSTEM 369</span>
        <Link href={profile.resume} className="eyebrow">
          ENGINEERING PROFILE ↗
        </Link>
      </header>
      <main className="file-main">
        <div className="file-classification">
          <span>
            {p.featured ? 'FLAGSHIP SYSTEM' : 'MISSION ARCHIVE'} /{' '}
            {String(index + 1).padStart(3, '0')}
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
              <span>STATUS / {p.status}</span>
              <span>{p.technologies.join(' · ') || 'SIGNAL & SYSTEM DESIGN'}</span>
            </div>
          </div>
          <div className="file-symbol" aria-hidden="true">
            <span>{p.visualIdentity.symbol}</span>
            <i />
            <b />
          </div>
        </div>
        <div className="file-evidence">
          <span className="eyebrow">MISSION RECORD</span>
          <p>{p.evidence}</p>
          <EvidenceLinks project={p} />
        </div>
        <nav className="file-contents" aria-label="Mission file contents">
          {[
            ['question', '01 QUESTION'],
            ['system', '02 SYSTEM'],
            ['architecture', '03 ARCHITECTURE'],
            ['decisions', '04 DECISIONS'],
            ['constraints', '05 CONSTRAINTS'],
            ['evidence', '06 EVIDENCE'],
            ['next-question', '07 NEXT QUESTION'],
          ].map(([anchor, label]) => (
            <a key={anchor} href={`#${anchor}`}>
              {label}
            </a>
          ))}
        </nav>
        <div className="file-two-column">
          <section id="question" className="file-section">
            <span className="eyebrow">01 / QUESTION</span>
            <h2>The question.</h2>
            <p>{p.problem}</p>
          </section>
          <section id="system" className="file-section">
            <span className="eyebrow">02 / SYSTEM</span>
            <h2>The approach.</h2>
            <p>{p.solution}</p>
            <p>{p.longDescription}</p>
          </section>
        </div>
        <section id="architecture" className="file-section">
          <span className="eyebrow">
            03 / {p.status === 'CONCEPT' ? 'CONCEPT ARCHITECTURE' : 'SYSTEM ARCHITECTURE'}
          </span>
          <h2>Follow the signal.</h2>
          <ol className="architecture-flow" aria-label={`${p.title} architecture`}>
            {p.architecture.map((step, i) => (
              <li key={step}>
                <span className="architecture-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="architecture-name">{step}</span>
                {i < p.architecture.length - 1 && (
                  <span className="architecture-arrow" aria-hidden="true">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
          {p.technologies.length > 0 && (
            <div className="file-stack">
              <span className="eyebrow">
                {p.status === 'CONCEPT' ? 'DESIGN TECHNOLOGIES' : 'TECHNOLOGY SIGNATURE'}
              </span>
              <div>
                {p.technologies.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          )}
        </section>
        <div className="file-two-column">
          <section id="decisions" className="file-section">
            <span className="eyebrow">04 / ENGINEERING DECISIONS</span>
            <h2>Decisions that matter.</h2>
            <ul className="file-decisions">
              {p.decisions.map((d, i) => (
                <li key={d}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {d}
                </li>
              ))}
            </ul>
          </section>
          <section id="constraints" className="file-section">
            <span className="eyebrow">05 / CONSTRAINTS</span>
            <h2>Where it gets difficult.</h2>
            <ul className="file-decisions">
              {p.challenges.map((d, i) => (
                <li key={d}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {d}
                </li>
              ))}
            </ul>
          </section>
        </div>
        <section id="evidence" className="file-section">
          <span className="eyebrow">06 / EVIDENCE</span>
          <h2>Inspect the work.</h2>
          <p>{p.impact}</p>
          <EvidenceLinks project={p} architecture={false} />
        </section>
        <section id="next-question" className="file-section">
          <span className="eyebrow">07 / NEXT QUESTION</span>
          <h2>The next question.</h2>
          <p>{p.lessons}</p>
          <a
            className="text-button"
            href={`mailto:${profile.email}?subject=${encodeURIComponent(`A question about ${p.title}`)}`}
          >
            ASK ABOUT THIS MISSION ↗
          </a>
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
