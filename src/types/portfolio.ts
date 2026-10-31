export type ProjectCategory =
  | 'Engineering systems'
  | 'AI + intelligence'
  | 'Cybersecurity'
  | 'Infrastructure'
  | 'Research'
  | 'Human impact';

export type ObjectShape = 'planet' | 'satellite' | 'star' | 'anomaly' | 'ring' | 'beacon';

export interface Project {
  id: string;
  title: string;
  codename: string;
  description: string;
  longDescription: string;
  category: ProjectCategory;
  technologies: string[];
  role: string;
  problem: string;
  solution: string;
  architecture: string[];
  decisions: string[];
  challenges: string[];
  impact: string;
  lessons: string;
  github: string | null;
  demo: string | null;
  status: 'Concept record' | 'Portfolio record' | 'Source available';
  year: string | null;
  featured: boolean;
  coordinates: { x: number; y: number };
  constellation: ProjectCategory;
  visualIdentity: { symbol: string; color: string; shape: ObjectShape };
  evidence: string;
  sources?: { title: string; url: string }[];
}

export interface Skill {
  id: string;
  name: string;
  system: string;
  description: string;
  projects: string[];
}

export interface ResearchLog {
  id: string;
  title: string;
  area: string;
  status: 'Research interest' | 'Portfolio research';
  hypothesis: string;
  problem: string;
  proposedSystem: string;
  experiment: string;
  source?: string;
}

export interface Milestone {
  id: string;
  phase: string;
  title: string;
  category: string;
  description: string;
  source?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  status: 'Unverified brief reference' | 'Portfolio documented';
  source?: string;
}
