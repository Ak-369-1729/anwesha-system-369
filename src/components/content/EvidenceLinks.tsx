import type { Project } from '@/types/portfolio';
export default function EvidenceLinks({
  project,
  architecture = true,
}: {
  project: Project;
  architecture?: boolean;
}) {
  const documents = project.sources?.filter((source) => source.url !== project.github) ?? [];
  return (
    <div className="evidence-links" aria-label={`${project.title} evidence`}>
      {project.github && (
        <a href={project.github} target="_blank" rel="noopener noreferrer">
          SOURCE ↗
        </a>
      )}
      {project.demo && (
        <a href={project.demo} target="_blank" rel="noopener noreferrer">
          LIVE ↗
        </a>
      )}
      {documents.slice(0, 1).map((source) => (
        <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">
          TECHNICAL RECORD ↗
        </a>
      ))}
      {architecture && <a href={`/missions/${project.id}/#architecture`}>ARCHITECTURE ↗</a>}
      {!project.github && documents.length === 0 && (
        <span>{project.status === 'RESEARCH' ? 'RESEARCH RECORD' : 'DESIGN RECORD'}</span>
      )}
    </div>
  );
}
