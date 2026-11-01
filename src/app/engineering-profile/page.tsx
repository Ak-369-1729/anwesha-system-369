import Link from 'next/link';
import { profile, flagshipProjects, milestones, achievements, skills } from '@/data/portfolio';
import { pageMetadata, person } from '@/lib/seo';
import { PageSeo } from '@/components/content/PageSeo';
import PrintProfile from '@/components/content/PrintProfile';
export const metadata = pageMetadata(
  'Engineering Profile — Anwesha Kar | SYSTEM 369',
  profile.positioning,
  '/engineering-profile/',
);
export default function EngineeringProfile() {
  return (
    <main className="engineering-profile">
      <PageSeo path="/engineering-profile/" data={person} />
      <header>
        <Link href="/">↖ SYSTEM 369</Link>
        <span>ENGINEERING PROFILE</span>
        <PrintProfile />
      </header>
      <h1>{profile.name}</h1>
      <p className="profile-positioning">{profile.positioning}</p>
      <p>{profile.institution}</p>
      <nav aria-label="Profile contact links">
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <a href={profile.github} target="_blank" rel="noopener noreferrer">
          GitHub ↗
        </a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn ↗
        </a>
      </nav>
      <section>
        <h2>Experience & leadership</h2>
        {[...milestones].reverse().map((m) => (
          <article key={m.id}>
            <span className="eyebrow">{m.category}</span>
            <h3>{m.title}</h3>
            <p>{m.description}</p>
          </article>
        ))}
      </section>
      <section>
        <h2>Flagship systems</h2>
        {flagshipProjects.map((p) => (
          <article key={p.id}>
            <span className="eyebrow">{p.status}</span>
            <h3>
              <Link href={`/missions/${p.id}/`}>{p.title} ↗</Link>
            </h3>
            <p>{p.description}</p>
            <p>{p.technologies.join(' · ')}</p>
          </article>
        ))}
      </section>
      <section>
        <h2>Technology in context</h2>
        <dl>
          {skills.map((s) => (
            <div key={s.id}>
              <dt>{s.name}</dt>
              <dd>{s.description}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section>
        <h2>Selected milestones</h2>
        {achievements.map((a) => (
          <article key={a.id}>
            <h3>{a.title}</h3>
            <p>{a.description}</p>
          </article>
        ))}
      </section>
      <footer>
        This is a printable engineering profile. Project architecture and technical records are
        linked from each mission file.
      </footer>
    </main>
  );
}
