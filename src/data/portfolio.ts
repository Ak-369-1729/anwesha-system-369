import type {
  Achievement,
  Milestone,
  ObjectShape,
  Project,
  ProjectCategory,
  ResearchLog,
  Skill,
} from '@/types/portfolio';

/**
 * The single editorial source for System 369.
 * Combines the creative brief, user-supplied contact links, and owner-maintained
 * GitHub portfolio records. Source-backed records name their source. Remaining
 * concept records describe proposed systems, not implemented work. Repository
 * documentation is not an independent audit or a verified runtime measurement.
 */
export const profile = {
  name: 'Anwesha Kar',
  shortName: 'Anwesha',
  title: 'Computer Science Engineer',
  specialization: 'AI/ML & Full-Stack Developer',
  institution: 'Chandigarh University',
  roles: ['Engineer', 'Researcher', 'Builder', 'Explorer', 'Problem solver'],
  system: 'ANWESHA // SYSTEM 369',
  headline: 'Build beyond the known.',
  introduction:
    'I like understanding the systems underneath the interface. Software, infrastructure, security, intelligence, and the people moving between them.',
  human: [
    'Behind the systems, a person asking better questions.',
    'I’m Anwesha. I’m interested in what happens underneath the surface: how software behaves, where trust breaks, and what we can learn by building.',
    'Some ideas start with a problem. Others start with a small, persistent “what if?”',
  ],
  email: 'anwesha.hogwarts@gmail.com' as string | null,
  github: 'https://github.com/Ak-369-1729' as string | null,
  linkedin: 'https://www.linkedin.com/in/anwesha-kar-53a065230/' as string | null,
  resume: '/resume.html',
  contactNote: 'Personal contact links supplied by Anwesha.',
  evidenceNote:
    'Source-backed mission files and career milestones reference Anwesha’s existing GitHub portfolio and project documentation. These are owner-maintained records, not independently audited results. Other mission files remain explicitly labeled concepts. No runtime performance or adoption metrics are claimed.',
  sources: {
    profile: 'https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/site.ts',
    timeline: 'https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/timeline.ts',
    projects: 'https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/projects.ts',
    education: 'https://github.com/Ak-369-1729/BoundaryLens/blob/main/README.md',
  },
};

export const categories: ProjectCategory[] = [
  'Engineering systems',
  'AI + intelligence',
  'Cybersecurity',
  'Infrastructure',
  'Research',
  'Human impact',
];

const evidence =
  'Brief-supplied project title. This is a proposed system record; implementation, authorship, dates, stack and outcomes have not been independently verified.';

type ProjectSeed = Pick<
  Project,
  | 'id'
  | 'title'
  | 'codename'
  | 'description'
  | 'category'
  | 'technologies'
  | 'problem'
  | 'solution'
  | 'architecture'
  | 'decisions'
  | 'challenges'
  | 'coordinates'
  | 'featured'
> & { symbol: string; color: string; shape: ObjectShape };

function concept(seed: ProjectSeed): Project {
  const { symbol, color, shape, ...record } = seed;
  return {
    ...record,
    longDescription: `${record.description} The following mission file describes a proposed architecture to investigate this idea. It does not assert that this system has been implemented.`,
    role: 'Role not supplied',
    impact:
      'No measured results were supplied. Evaluation would require a reproducible baseline, explicit test conditions, and published measurements.',
    lessons:
      'Learning question: which assumptions survive a working prototype and controlled failure testing?',
    github: null,
    demo: null,
    status: 'Concept record',
    year: null,
    constellation: record.category,
    visualIdentity: { symbol, color, shape },
    evidence,
  };
}

const conceptProjects: Project[] = [
  concept({
    id: 'nexus',
    title: 'NEXUS',
    codename: 'THE DIGITAL TWIN',
    description:
      'A cybersecurity digital twin for exploring how failures travel through connected systems.',
    category: 'Cybersecurity',
    technologies: ['Python', 'FastAPI', 'NetworkX', 'React'],
    problem:
      'Design question: how can a security team test the consequences of an attack without risking the live network?',
    solution:
      'Proposed: model services and trust boundaries as a graph, inject controlled incidents, and trace possible propagation paths.',
    architecture: [
      'Network inventory',
      'Topology graph',
      'Scenario engine',
      'Risk trace',
      'Operator view',
    ],
    decisions: [
      'Keep simulated state isolated from production.',
      'Represent dependencies explicitly so the operator can inspect a risk trace.',
    ],
    challenges: [
      'Stale inventories can invalidate simulation results.',
      'A graph path indicates possibility, not a probability of compromise.',
    ],
    coordinates: { x: 47, y: 44 },
    featured: true,
    symbol: '◈',
    color: '#a6f3d0',
    shape: 'ring',
  }),
  concept({
    id: 'careeros',
    title: 'CareerOS',
    codename: 'THE NAVIGATOR',
    description: 'An operating layer for organizing the moving parts of a career search.',
    category: 'Engineering systems',
    technologies: ['React', 'FastAPI', 'PostgreSQL'],
    problem:
      'Design question: how do applications, preparation and follow-ups remain connected as a search grows?',
    solution:
      'Proposed: a structured workspace with application states, preparation notes, and a clear next-action queue.',
    architecture: [
      'Workspace',
      'Application API',
      'State transitions',
      'PostgreSQL',
      'Activity view',
    ],
    decisions: [
      'Use explicit application states instead of ambiguous status text.',
      'Keep personal records exportable.',
    ],
    challenges: [
      'Avoid duplicate applications and stale reminders.',
      'Protect sensitive candidate information.',
    ],
    coordinates: { x: 20, y: 28 },
    featured: true,
    symbol: '⌘',
    color: '#e2cb96',
    shape: 'planet',
  }),
  concept({
    id: 'prepai',
    title: 'PrepAI',
    codename: 'THE REHEARSAL',
    description: 'An AI-assisted space for practicing, receiving feedback, and trying again.',
    category: 'AI + intelligence',
    technologies: ['Python', 'FastAPI', 'React'],
    problem:
      'Design question: how can preparation feedback be useful without presenting model output as unquestionable judgment?',
    solution:
      'Proposed: a practice session pipeline with transparent rubrics, contextual feedback, and user-controlled iteration.',
    architecture: ['Practice prompt', 'Session API', 'Feedback pipeline', 'Rubric check', 'Review'],
    decisions: ['Show the rubric alongside feedback.', 'Allow deletion of practice responses.'],
    challenges: [
      'Evaluate inconsistent model feedback.',
      'Prevent private responses from leaking into logs.',
    ],
    coordinates: { x: 72, y: 24 },
    featured: true,
    symbol: '✧',
    color: '#a8bfff',
    shape: 'star',
  }),
  concept({
    id: 'prooftrail',
    title: 'ProofTrail',
    codename: 'THE WITNESS',
    description: 'A design investigation into evidence, provenance and inspectable audit trails.',
    category: 'Cybersecurity',
    technologies: ['FastAPI', 'PostgreSQL', 'Python'],
    problem:
      'Design question: how can a sequence of sensitive actions remain inspectable and resistant to unnoticed modification?',
    solution:
      'Proposed: append-only events with integrity metadata, scoped access, and an independent verification view.',
    architecture: [
      'Action',
      'Policy check',
      'Append-only log',
      'Integrity verifier',
      'Audit export',
    ],
    decisions: [
      'Separate the event writer from the verification path.',
      'Avoid putting secrets in audit events.',
    ],
    challenges: [
      'Define what integrity guarantees the system actually provides.',
      'Account for retention and privacy obligations.',
    ],
    coordinates: { x: 61, y: 61 },
    featured: false,
    symbol: '⊡',
    color: '#a6f3d0',
    shape: 'satellite',
  }),
  concept({
    id: 'boundarylens',
    title: 'BoundaryLens',
    codename: 'THE TRUST LINE',
    description: 'A way to make authorization boundaries visible before they become incidents.',
    category: 'Cybersecurity',
    technologies: ['Python', 'NetworkX', 'React'],
    problem:
      'Design question: where does an authorization assumption become a path to unintended access?',
    solution:
      'Proposed: map principals, resources, permissions and trust boundaries into an inspectable access graph.',
    architecture: [
      'Policy input',
      'Permission graph',
      'Boundary analysis',
      'Access trace',
      'Review surface',
    ],
    decisions: [
      'Explain every access path.',
      'Treat unknown policy states as unresolved rather than permitted.',
    ],
    challenges: [
      'Model inherited and contextual permissions.',
      'Avoid claiming complete coverage from a partial inventory.',
    ],
    coordinates: { x: 37, y: 71 },
    featured: false,
    symbol: '⋈',
    color: '#bfe8dc',
    shape: 'beacon',
  }),
  concept({
    id: 'chronoheritage',
    title: 'ChronoHeritage',
    codename: 'THE MEMORY FIELD',
    description: 'A concept for making cultural history explorable across time and place.',
    category: 'Human impact',
    technologies: ['React', 'PostgreSQL', 'Python'],
    problem:
      'Design question: how can a digital history experience preserve provenance while inviting exploration?',
    solution:
      'Proposed: connect curated historical records to a temporal and geographic browsing interface.',
    architecture: [
      'Source record',
      'Provenance metadata',
      'Temporal index',
      'Place index',
      'Exploration view',
    ],
    decisions: [
      'Show source provenance with every record.',
      'Represent uncertain dates explicitly.',
    ],
    challenges: [
      'Avoid erasing conflicting historical accounts.',
      'Provide a usable non-map reading experience.',
    ],
    coordinates: { x: 14, y: 61 },
    featured: false,
    symbol: '⌛',
    color: '#e2cb96',
    shape: 'ring',
  }),
  concept({
    id: 'rescuers',
    title: 'RESCUERS',
    codename: 'THE LAST SIGNAL',
    description: 'Disaster-tolerant communication when normal infrastructure cannot be assumed.',
    category: 'Human impact',
    technologies: ['Python', 'Flutter', 'NetworkX'],
    problem:
      'Design question: how does a critical message find its way through intermittent connectivity?',
    solution:
      'Proposed: a store-and-forward message flow with acknowledgements, local persistence and explicit delivery state.',
    architecture: [
      'Message origin',
      'Local queue',
      'Available relay',
      'Recipient',
      'Acknowledgement',
    ],
    decisions: [
      'Make undelivered state visible.',
      'Prioritize consent, data minimization and reliable retry behavior.',
    ],
    challenges: [
      'Test network partitions and exhausted batteries.',
      'Handle duplicated or expired emergency messages.',
    ],
    coordinates: { x: 82, y: 52 },
    featured: true,
    symbol: '⌁',
    color: '#e2cb96',
    shape: 'beacon',
  }),
  concept({
    id: 'algoforge',
    title: 'AlgoForge',
    codename: 'THE TEST BENCH',
    description:
      'An algorithm workbench focused on understanding behavior rather than collecting answers.',
    category: 'Engineering systems',
    technologies: ['Java', 'React', 'Python'],
    problem: 'Design question: how do changes to input shape affect an algorithm’s behavior?',
    solution:
      'Proposed: connect repeatable input generation, step traces, and comparative runs in one learning interface.',
    architecture: [
      'Input generator',
      'Algorithm runner',
      'Step trace',
      'Metrics collector',
      'Comparison',
    ],
    decisions: [
      'Separate theoretical complexity from measured timings.',
      'Run untrusted code only inside an appropriate sandbox.',
    ],
    challenges: ['Control noisy benchmarks.', 'Keep visual traces usable for large inputs.'],
    coordinates: { x: 32, y: 16 },
    featured: false,
    symbol: '⌬',
    color: '#c3c5ef',
    shape: 'satellite',
  }),
  concept({
    id: 'placementiq',
    title: 'PlacementIQ',
    codename: 'THE NEXT MOVE',
    description: 'A concept for organizing placement preparation and making the next step clear.',
    category: 'AI + intelligence',
    technologies: ['Python', 'React', 'PostgreSQL'],
    problem:
      'Design question: how can preparation recommendations remain understandable and useful to the learner?',
    solution:
      'Proposed: combine a learner-controlled goal model with explicit preparation tasks and reviewable suggestions.',
    architecture: [
      'Goal profile',
      'Preparation record',
      'Suggestion engine',
      'Explanation',
      'Learning plan',
    ],
    decisions: [
      'Show why a suggestion appears.',
      'Keep users in control of their goals and records.',
    ],
    challenges: [
      'Avoid reducing readiness to an unsupported score.',
      'Evaluate recommendations against actual learning needs.',
    ],
    coordinates: { x: 89, y: 30 },
    featured: false,
    symbol: '⊹',
    color: '#a8bfff',
    shape: 'star',
  }),
  concept({
    id: 'janmitra',
    title: 'JanMitra',
    codename: 'THE PUBLIC INTERFACE',
    description: 'A human-centered concept for navigating civic information and services.',
    category: 'Human impact',
    technologies: ['React', 'FastAPI', 'PostgreSQL'],
    problem:
      'Design question: how can a service interface reduce confusion without hiding eligibility or procedural details?',
    solution:
      'Proposed: a plain-language service directory with accessible search, source references and clear next steps.',
    architecture: [
      'Service source',
      'Structured directory',
      'Accessible search',
      'Guided path',
      'Official reference',
    ],
    decisions: [
      'Keep official source links visible.',
      'Design for low bandwidth and assistive technology.',
    ],
    challenges: [
      'Keep changing service requirements current.',
      'Test comprehension across languages and literacy levels.',
    ],
    coordinates: { x: 9, y: 43 },
    featured: false,
    symbol: '⊙',
    color: '#e2cb96',
    shape: 'planet',
  }),
  concept({
    id: 'path-guard',
    title: 'Path Guard',
    codename: 'THE SAFE ROUTE',
    description: 'A security exploration into the assumptions hidden inside a path.',
    category: 'Cybersecurity',
    technologies: ['Python', 'FastAPI'],
    problem:
      'Design question: how can path validation fail across encoding, normalization and filesystem boundaries?',
    solution:
      'Proposed: normalize and resolve inputs, apply a strict allowed root, and exercise boundary cases with a regression corpus.',
    architecture: [
      'Untrusted input',
      'Canonical resolution',
      'Boundary policy',
      'Allowed operation',
      'Audit event',
    ],
    decisions: [
      'Validate the resolved path before use.',
      'Avoid string-prefix checks for filesystem containment.',
    ],
    challenges: [
      'Account for symbolic links and race conditions.',
      'Test platform-specific path semantics.',
    ],
    coordinates: { x: 52, y: 83 },
    featured: false,
    symbol: '⌖',
    color: '#a6f3d0',
    shape: 'beacon',
  }),
  concept({
    id: 'eventmesh',
    title: 'EventMesh',
    codename: 'THE EVENT HORIZON',
    description:
      'Distributed work, retries, and the question of what happens after a message fails.',
    category: 'Infrastructure',
    technologies: ['Redis', 'Python', 'Docker', 'PostgreSQL'],
    problem:
      'Design question: how should an event-driven service handle retries without repeating a side effect?',
    solution:
      'Proposed: a durable event flow with an idempotent consumer, bounded retry policy, and a dead-letter queue for investigation.',
    architecture: [
      'Producer',
      'Redis event bus',
      'Idempotent worker',
      'Retry policy',
      'Dead-letter queue',
    ],
    decisions: [
      'Treat duplicate delivery as a normal case.',
      'Keep the idempotency record and side effect consistent.',
    ],
    challenges: [
      'Recover after a crash between processing and acknowledgement.',
      'Provide safe replay and observable failure states.',
    ],
    coordinates: { x: 64, y: 38 },
    featured: true,
    symbol: '⌘',
    color: '#a8bfff',
    shape: 'satellite',
  }),
  concept({
    id: 'screenshot-monitor',
    title: 'Screenshot Monitor',
    codename: 'THE OBSERVER',
    description: 'A design record for detecting visual change with clear consent and traceability.',
    category: 'Infrastructure',
    technologies: ['Python', 'Docker'],
    problem:
      'Design question: how can visual change detection distinguish meaningful changes from rendering noise?',
    solution:
      'Proposed: capture an explicitly permitted surface, normalize predictable variation, and compare against a managed baseline.',
    architecture: [
      'Consented target',
      'Scheduled capture',
      'Normalization',
      'Visual comparison',
      'Change review',
    ],
    decisions: [
      'Scope capture to authorized targets.',
      'Define retention and sensitive-region exclusions.',
    ],
    challenges: [
      'Control font, viewport and animation noise.',
      'Avoid storing private information accidentally.',
    ],
    coordinates: { x: 76, y: 76 },
    featured: false,
    symbol: '⊞',
    color: '#bbc7e3',
    shape: 'satellite',
  }),
  concept({
    id: 'java-algorithm-analyzer',
    title: 'Java Algorithm Analyzer',
    codename: 'THE COMPLEXITY LENS',
    description: 'An investigation into explaining algorithm structure and its limits.',
    category: 'Engineering systems',
    technologies: ['Java', 'React'],
    problem:
      'Design question: which complexity properties can be inferred from source, and which require stronger assumptions?',
    solution:
      'Proposed: inspect syntax and control flow, emit bounded heuristics, and explain every inference with its limitations.',
    architecture: [
      'Java source',
      'Syntax tree',
      'Control-flow inspection',
      'Heuristic analysis',
      'Explanation',
    ],
    decisions: [
      'Label heuristic estimates explicitly.',
      'Avoid promising general automatic complexity proofs.',
    ],
    challenges: [
      'Handle recursion and input-dependent loops.',
      'Distinguish library operations from primitive operations.',
    ],
    coordinates: { x: 28, y: 47 },
    featured: false,
    symbol: 'λ',
    color: '#c3c5ef',
    shape: 'star',
  }),
  concept({
    id: 'wheat-disease-detection',
    title: 'Wheat Disease Detection',
    codename: 'THE FIELD SIGNAL',
    description: 'A machine-learning concept for recognizing crop disease patterns in images.',
    category: 'AI + intelligence',
    technologies: ['Python', 'FastAPI'],
    problem:
      'Design question: how does a crop-image classifier behave outside the conditions represented by its training data?',
    solution:
      'Proposed: a documented image dataset, leakage-safe data split, calibrated classifier and uncertain-prediction workflow.',
    architecture: [
      'Field image',
      'Input quality check',
      'Image classifier',
      'Confidence review',
      'Human assessment',
    ],
    decisions: [
      'Separate fields or collection sessions across evaluation splits.',
      'Show uncertainty and retain expert review.',
    ],
    challenges: [
      'Measure domain shift between curated and real field images.',
      'Assess class imbalance and ambiguous symptoms.',
    ],
    coordinates: { x: 88, y: 65 },
    featured: false,
    symbol: '❋',
    color: '#bce2a8',
    shape: 'planet',
  }),
  concept({
    id: 'agnipariksha',
    title: 'AGNIPARIKSHA',
    codename: 'THE UNKNOWN TEST',
    description:
      'A named project from the brief, held as an open mission until its scope is documented.',
    category: 'Research',
    technologies: [],
    problem: 'The brief supplies the project name but does not describe the problem domain.',
    solution:
      'No architecture is asserted. The next useful step is to establish the problem, intended users, constraints and evidence.',
    architecture: ['Problem definition', 'Constraints', 'Hypothesis', 'Prototype', 'Evaluation'],
    decisions: [
      'Document scope before choosing a stack.',
      'Prefer an explicit unknown to an invented case study.',
    ],
    challenges: ['Establish a testable mission and appropriate evaluation criteria.'],
    coordinates: { x: 17, y: 82 },
    featured: false,
    symbol: '△',
    color: '#dfa087',
    shape: 'anomaly',
  }),
  concept({
    id: 'swift-macrotrust',
    title: 'Swift MacroTrust',
    codename: 'THE TRUST EXPERIMENT',
    description: 'Research questions around the trust boundary of Swift macro execution.',
    category: 'Research',
    technologies: ['Swift', 'Python', 'Docker'],
    problem:
      'Research question: which resources should a compiler extension be able to access, and how can that boundary be tested?',
    solution:
      'Proposed: a permission-oriented threat model and controlled macro execution harness with resource and behavior observations.',
    architecture: [
      'Macro fixture',
      'Permission policy',
      'Isolated test harness',
      'Behavior trace',
      'Threat-model review',
    ],
    decisions: [
      'Distinguish documented guarantees from observed behavior.',
      'Make test conditions and compiler versions reproducible.',
    ],
    challenges: [
      'Avoid overstating a sandbox guarantee.',
      'Keep experiments aligned with the toolchain being tested.',
    ],
    coordinates: { x: 45, y: 15 },
    featured: true,
    symbol: '⟡',
    color: '#c3c5ef',
    shape: 'anomaly',
  }),
];

const portfolioSource =
  'https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/projects.ts';
const sourceRecords: Record<string, Partial<Project>> = {
  nexus: {
    description:
      'A network digital twin that couples anomaly scoring with reversible node isolation.',
    longDescription:
      'Anwesha’s existing portfolio describes a Python prototype over UNSW-NB15 flow records: Dynamic Isolation Forest scores traffic, NetworkX locates flagged nodes, and a Streamlit dashboard exposes the isolate / restore loop. This is a research twin, not a live production sensor.',
    technologies: ['Python', 'NetworkX', 'Streamlit', 'Isolation Forest', 'UNSW-NB15'],
    role: 'Contribution scope not documented',
    problem:
      'An anomaly score needs topology and response context: where is the suspicious host, and what changes when it is isolated?',
    solution:
      'The portfolio record describes mapping anomalous flows onto a NetworkX topology, removing a suspicious node’s connections, then restoring them through an explicit response state.',
    architecture: [
      'UNSW-NB15 flows',
      'Python feature pipeline',
      'Isolation Forest',
      'NetworkX isolate / restore',
      'Streamlit + logs',
    ],
    decisions: [
      'Use unsupervised outlier scoring rather than requiring every attack signature.',
      'Make isolation reversible and record each state transition.',
      'Keep benchmark-dataset results separate from real-network performance claims.',
    ],
    challenges: [
      'Feature scaling and class imbalance in UNSW-NB15.',
      'Choosing useful anomaly thresholds.',
      'Keeping scoring and graph response state consistent.',
    ],
    impact:
      'The documented prototype connects detection to an inspectable containment workflow. No independently verified detection accuracy or live deployment result is asserted.',
    lessons:
      'A benchmark score needs response context and explicit limits before it becomes an operational claim.',
    github: 'https://github.com/Ak-369-1729/NEXUS',
    status: 'Source available',
    evidence:
      'System description follows Anwesha’s existing portfolio project data. Repository linked; individual contribution details require confirmation. No exclusive authorship or real-network performance is asserted.',
    sources: [
      { title: 'Portfolio project record', url: portfolioSource },
      {
        title: 'NEXUS README / attribution',
        url: 'https://github.com/Ak-369-1729/NEXUS/blob/main/README.md',
      },
    ],
  },
  boundarylens: {
    description:
      'Authorization security and regression testing, with evidence behind every boundary.',
    longDescription:
      'BoundaryLens discovers API endpoints from OpenAPI, Postman and HAR, models authenticated identities and resource ownership, and generates bounded cross-identity tests for BOLA / IDOR and function-level authorization failures. Its repository documents a FastAPI scanner, React / TypeScript dashboard, regression baselines and SARIF reporting.',
    technologies: [
      'Python',
      'FastAPI',
      'Pydantic',
      'React',
      'TypeScript',
      'SQLite',
      'Docker',
      'Pytest',
    ],
    role: 'Repository author: Anwesha Kar',
    problem:
      'A valid login does not establish ownership of a resource. Authorization testing needs identity, operation and resource context rather than an HTTP status alone.',
    solution:
      'Establish legitimate response baselines, extract resource relationships, plan bounded cross-identity requests, and compare response evidence with explicit explanations.',
    architecture: [
      'OpenAPI / Postman / HAR',
      'Identity + resource model',
      'Bounded test planner',
      'Differential evidence engine',
      'Matrix / graph / SARIF',
    ],
    decisions: [
      'Focus on authorization instead of claiming broad vulnerability coverage.',
      'Compare observable response evidence instead of equating HTTP 200 with a vulnerability.',
      'Default to safe reads, scope checks, request budgets and secret redaction.',
      'Carry expectations into CI through regression baselines.',
    ],
    challenges: [
      'Application-specific rules and ownership remain partly heuristic.',
      'Coverage depends on discovered endpoints and resources.',
      'Evidence scores are deterministic strength indicators, not probabilities or CVSS.',
    ],
    impact:
      'The repository provides a local vulnerable / fixed Ledgerly comparison and documents CI regression gating. No independent production adoption or security effectiveness metric is claimed.',
    lessons:
      'Security findings become useful when a reviewer can follow the evidence and reproduce the boundary check.',
    github: 'https://github.com/Ak-369-1729/BoundaryLens',
    status: 'Source available',
    evidence:
      'Architecture, author attribution and limitations summarized from the BoundaryLens README. The current environment has not rerun its scanner or tests.',
    sources: [
      {
        title: 'BoundaryLens README',
        url: 'https://github.com/Ak-369-1729/BoundaryLens/blob/main/README.md',
      },
    ],
  },
  chronoheritage: {
    description:
      'A provenance-first research platform connecting historical sites, chronology and the observable sky.',
    longDescription:
      'ChronoHeritage V3 combines a Next.js interface, FastAPI science services, PostgreSQL / PostGIS, queued analysis and reports. Inputs preserve sources, conventions and uncertainty. A small angular residual is reported as a candidate alignment under assumptions, never as proof of historical intent.',
    technologies: [
      'Next.js',
      'React',
      'FastAPI',
      'Python',
      'PostgreSQL',
      'PostGIS',
      'Docker',
      'Skyfield',
    ],
    role: 'Portfolio project; individual role not specified',
    problem:
      'Investigating historical orientations requires more than a matching angle: source provenance, chronology, horizon, conventions and uncertainty must remain attached to the result.',
    solution:
      'Keep survey records, provenance, scientific calculations, uncertainty analysis and review gates in one inspectable research workflow.',
    architecture: [
      'Next.js research workspace',
      'FastAPI science services',
      'PostgreSQL + PostGIS',
      'Queued analysis worker',
      'PDF / CSV / JSON reports',
    ],
    decisions: [
      'Preserve input provenance and hashed run snapshots.',
      'Separate scientific calculations into independently testable modules.',
      'Keep evidence gates explicit and never show blocked benchmarks as passed.',
      'Use revocable server-side sessions and API-enforced permissions.',
    ],
    challenges: [
      'The registry contains five explicitly fictional demonstration sites.',
      'JPL Horizons benchmark cases are documented as blocked pending network execution.',
      'No published-case recalculation, researcher pilot or workflow timing is documented.',
    ],
    impact:
      'A documented software platform for an evidence-led workflow. Scientific validation and adoption gates remain open; candidate alignment is not evidence of intent.',
    lessons:
      'A reproducible calculation and a supported historical conclusion are different claims.',
    github: 'https://github.com/Ak-369-1729/Chrono_Heritage',
    status: 'Source available',
    evidence:
      'Summarized from ChronoHeritage V3 README, including its unpassed scientific and adoption evidence gates. Software and benchmark claims were not rerun in this environment.',
    sources: [
      {
        title: 'ChronoHeritage V3 README',
        url: 'https://github.com/Ak-369-1729/Chrono_Heritage/blob/main/README.md',
      },
    ],
  },
  eventmesh: {
    description:
      'A delivery layer for asynchronous workflows, from authenticated publishing to dead-letter recovery.',
    longDescription:
      'The existing portfolio documents EventMesh as an active build with Redis-backed idempotency, rate limits, retries with backoff, dead-letter handling, metrics and health checks. No throughput benchmark is supplied.',
    technologies: ['Redis', 'Docker', 'REST APIs'],
    role: 'Portfolio project; individual role not specified',
    problem:
      'Services repeatedly reimplement retries, deduplication and failure handling around background work.',
    solution:
      'Make delivery behavior explicit through an authenticated publish API, bounded retries, idempotency windows and inspectable dead-letter events.',
    architecture: [
      'Authenticated producer',
      'Rate limit + idempotency',
      'Redis state / event queue',
      'Dispatcher + retry backoff',
      'Consumer / dead-letter recovery',
    ],
    decisions: [
      'At-least-once delivery with idempotency keys.',
      'Bound retries to protect struggling consumers.',
      'Retain failed payload context for explicit operator replay.',
    ],
    challenges: [
      'Ordering expectations during retries.',
      'Bounded idempotency windows.',
      'Visible failures without overwhelming logs.',
    ],
    impact:
      'An owner-documented engineering build; no measured throughput, latency, adoption or production reliability is claimed.',
    lessons: 'Reliability work lives in the unhappy path and in the API contract around retries.',
    status: 'Portfolio record',
    evidence:
      'The existing portfolio labels EventMesh an active build. Details are owner-maintained project documentation, not a fresh runtime validation.',
    sources: [{ title: 'EventMesh portfolio record', url: portfolioSource }],
  },
  careeros: {
    description:
      'AI-assisted opportunity discovery and a career constellation linking skills to roles.',
    longDescription:
      'Anwesha’s existing portfolio describes CareerOS as an active build for daily opportunity discovery, internship / job intelligence, personalized career tracking and a skill-to-role graph. These are documented project features, not verified placement outcomes.',
    technologies: ['LLMs', 'Docker'],
    role: 'Portfolio project; individual role not specified',
    problem:
      'Opportunities are scattered, while a posting list gives little context about fit or skill gaps.',
    solution:
      'Connect opportunities, skills and roles in a graph, with AI-assisted summaries and reviewable suggestions.',
    architecture: [
      'Opportunity discovery',
      'Career profile',
      'Skills / roles graph',
      'AI-assisted suggestion',
      'User-reviewed plan',
    ],
    impact:
      'Owner-documented active build; no placement improvement or recommendation-quality result is asserted.',
    status: 'Portfolio record',
    evidence:
      'Summary and stack follow the existing CareerOS portfolio record. Architecture is a simplified representation of its documented feature flow.',
    sources: [{ title: 'CareerOS portfolio record', url: portfolioSource }],
  },
  prepai: {
    description:
      'Interview practice with multi-personality group discussions and an explicit review rubric.',
    longDescription:
      'The portfolio lists PrepAI / Mockexa as a prototype covering technical, HR and group discussion practice. It describes contrasting AI personas and review across communication, content, leadership, teamwork, creativity and confidence.',
    technologies: ['LLMs'],
    role: 'Portfolio project; individual role not specified',
    problem:
      'A single polite chatbot does not reproduce discussion dynamics, interruptions or follow-up pressure.',
    solution:
      'Use distinct participant personas and turn-taking behaviors, then make the review rubric visible.',
    architecture: [
      'Practice round',
      'Participant personas',
      'Conversation flow',
      'Six-dimension rubric',
      'Review',
    ],
    impact: 'Owner-documented prototype; no evidence of improved interview outcomes is supplied.',
    status: 'Portfolio record',
    evidence:
      'Features and prototype description follow the existing PrepAI / Mockexa portfolio record. Suggested evaluation questions remain exploratory.',
    sources: [{ title: 'PrepAI portfolio record', url: portfolioSource }],
  },
  rescuers: {
    description: 'RESQMesh / RESCUERS: preserve critical reports when bandwidth collapses.',
    longDescription:
      'The existing portfolio names RESCUERS as an alias of RESQMesh and labels it a concept plus simulation. Critical individual reports remain intact while lower-priority reports become bounded, mergeable summaries under information pressure.',
    technologies: ['Mesh networking'],
    role: 'Portfolio concept + simulation',
    problem:
      'Disaster traffic rises while capacity falls, putting critical SOS messages behind lower-priority traffic.',
    solution:
      'An offline-first, information-pressure-adaptive design that protects critical reports and summarizes lower-priority updates.',
    architecture: [
      'Local report',
      'Urgency classification',
      'Pressure / payload shaping',
      'Store-and-forward mesh',
      'Critical report / bounded summary',
    ],
    impact:
      'A documented concept and illustrative simulation; no field deployment, emergency-service adoption or measured delivery gain is claimed.',
    status: 'Portfolio record',
    evidence:
      'RESCUERS / RESQMesh naming, scope and concept-plus-simulation status follow the existing portfolio record.',
    sources: [{ title: 'RESQMesh portfolio record', url: portfolioSource }],
  },
  'path-guard': {
    description: 'A safety-focused guarding and alerting system.',
    longDescription:
      'The existing portfolio describes Path Guard as a safety-focused guarding system that monitors a path and raises alerts. Its operating environment and implementation details are not documented in that record.',
    technologies: [],
    problem: 'Unsafe paths and unchecked access put people and systems at risk.',
    solution:
      'The portfolio describes monitoring and alerts; implementation detail is not specified.',
    architecture: ['Observed path', 'Monitoring', 'Safety condition', 'Alert'],
    decisions: ['Confirm the operating context before choosing a technical interpretation.'],
    challenges: ['The source does not provide sensor, runtime or deployment details.'],
    impact: 'A documented portfolio project; no measured safety outcome is supplied.',
    lessons:
      'Further technical detail should come from implementation evidence, not from interpreting the title.',
    status: 'Portfolio record',
    evidence:
      'Scope follows the existing Path Guard portfolio entry; the four-step flow is illustrative, not a verified architecture.',
    sources: [{ title: 'Path Guard portfolio record', url: portfolioSource }],
  },
  agnipariksha: {
    description: 'An assessment platform exploring practice under realistic pressure.',
    longDescription:
      'The existing portfolio describes AGNIPARIKSHA as a trial-by-fire assessment platform. It supplies no implementation architecture or technology stack.',
    problem: 'Practice tests often fail to reproduce the pressure of the real assessment.',
    solution:
      'The documented aim is an assessment experience under realistic pressure; detailed design remains unspecified.',
    architecture: ['Assessment setup', 'Timed practice', 'Response', 'Review'],
    decisions: ['Represent unspecified implementation detail honestly.'],
    challenges: ['Evaluation and technical implementation details are not supplied.'],
    impact:
      'A portfolio-listed assessment project; no learning or assessment-validity result is asserted.',
    lessons:
      'An assessment interface needs evidence before it can make a claim about assessment quality.',
    status: 'Portfolio record',
    evidence:
      'Purpose follows the existing AGNIPARIKSHA portfolio entry. The displayed flow is illustrative.',
    sources: [{ title: 'AGNIPARIKSHA portfolio record', url: portfolioSource }],
  },
};

export const projects: Project[] = conceptProjects.map((project) => ({
  ...project,
  ...sourceRecords[project.id],
}));

/** Connections are technical context, not proficiency percentages or employment claims. */
export const skills: Skill[] = [
  {
    id: 'react',
    name: 'React',
    system: 'INTERFACE ENGINE',
    description: 'Interface state, accessible interaction, and inspectable system views.',
    projects: ['careeros', 'nexus', 'janmitra'],
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    system: 'SERVICE CORE',
    description: 'Typed service boundaries and explicit request / response contracts.',
    projects: ['nexus', 'prepai', 'prooftrail'],
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    system: 'MEMORY VAULT',
    description: 'Structured state, integrity constraints, and reproducible queries.',
    projects: ['careeros', 'prooftrail', 'eventmesh'],
  },
  {
    id: 'redis',
    name: 'Redis',
    system: 'EVENT BUS',
    description: 'A proposed delivery layer for the EventMesh retry investigation.',
    projects: ['eventmesh'],
  },
  {
    id: 'docker',
    name: 'Docker',
    system: 'ISOLATION CHAMBER',
    description: 'Repeatable development environments and bounded experiment fixtures.',
    projects: ['eventmesh', 'swift-macrotrust', 'screenshot-monitor'],
  },
  {
    id: 'python',
    name: 'Python',
    system: 'INTELLIGENCE ENGINE',
    description: 'Graph modeling, service logic, analysis, and research tooling.',
    projects: ['nexus', 'wheat-disease-detection', 'rescuers'],
  },
  {
    id: 'java',
    name: 'Java',
    system: 'SYSTEM CORE',
    description: 'Algorithm structure, runtime behavior, and source analysis.',
    projects: ['algoforge', 'java-algorithm-analyzer'],
  },
  {
    id: 'swift',
    name: 'Swift',
    system: 'MACRO MODULE',
    description: 'Language tooling and the trust boundary around compiler extensions.',
    projects: ['swift-macrotrust'],
  },
  {
    id: 'flutter',
    name: 'Flutter',
    system: 'CROSS-PLATFORM INTERFACE',
    description: 'A proposed mobile interaction layer for intermittent communication.',
    projects: ['rescuers'],
  },
  {
    id: 'networkx',
    name: 'NetworkX',
    system: 'TOPOLOGY ENGINE',
    description: 'Graphs for dependencies, authorization paths, and relay networks.',
    projects: ['nexus', 'boundarylens', 'rescuers'],
  },
];

export const research: ResearchLog[] = [
  {
    id: 'macro-execution',
    title: 'Where should a macro stop?',
    area: 'SWIFT / EXECUTION TRUST',
    status: 'Research interest',
    hypothesis:
      'A clearly specified capability boundary could make compiler-extension behavior easier to inspect.',
    problem: 'Build tooling executes code while handling source and developer resources.',
    proposedSystem: 'A controlled macro fixture set, permission model, and execution-trace review.',
    experiment:
      'Proposed: vary permitted resources and compare observed behavior against documented toolchain guarantees.',
  },
  {
    id: 'authorization',
    title: 'Make trust boundaries visible.',
    area: 'AUTHORIZATION / SECURITY ARCHITECTURE',
    status: 'Research interest',
    hypothesis:
      'An explainable access graph could reveal authorization assumptions that a flat policy table hides.',
    problem: 'Indirect permissions and inherited roles make access difficult to reason about.',
    proposedSystem: 'A principal-resource graph with policy provenance and path explanations.',
    experiment:
      'Proposed: construct a small synthetic organization and test expected versus observed access paths.',
  },
  {
    id: 'disaster-links',
    title: 'A message after the network.',
    area: 'DISASTER-TOLERANT COMMUNICATION',
    status: 'Research interest',
    hypothesis:
      'Explicit store-and-forward semantics could preserve useful delivery behavior under intermittent links.',
    problem: 'A normal connected-client assumption fails during partitions.',
    proposedSystem:
      'Local persistence, opportunistic relays, expiry, acknowledgements and duplicate suppression.',
    experiment:
      'Proposed: inject partitions into a relay simulation and measure delivery delay, duplication and loss.',
  },
  {
    id: 'post-quantum',
    title: 'Security beyond the assumption.',
    area: 'POST-QUANTUM / OS SECURITY',
    status: 'Portfolio research',
    hypothesis:
      'A controlled comparison could clarify migration costs and boundary assumptions before adoption.',
    problem: 'A cryptographic choice changes operational constraints as well as algorithms.',
    proposedSystem:
      'The existing portfolio records Scyther / Tamarin protocol verification and ML-KEM experiments. Further proposed work: a documented test matrix for candidate primitives and isolation concepts.',
    experiment:
      'Proposed: benchmark vetted implementations under fixed conditions; review threat models separately from speed. No publication or benchmark result is asserted.',
    source: profile.sources.timeline,
  },
  {
    id: 'ai-systems',
    title: 'Useful answers need evidence.',
    area: 'AI SYSTEMS / EVALUATION',
    status: 'Research interest',
    hypothesis:
      'Transparent evaluation and uncertainty could make an assistive model more useful than an unexplained score.',
    problem: 'Model outputs can look confident while changing across contexts.',
    proposedSystem: 'A versioned evaluation set, human review rubric and error taxonomy.',
    experiment:
      'Proposed: compare feedback consistency, calibration and failure cases across controlled inputs.',
  },
  {
    id: 'orbital-telemetry',
    title: 'Listen beyond the horizon.',
    area: 'BALLOONSAT / TELEMETRY / GNSS / NAVIC',
    status: 'Portfolio research',
    hypothesis:
      'A small, well-instrumented telemetry experiment could expose the tradeoffs between position, timing, link quality and power.',
    problem: 'A signal is useful only when its timing, reliability and uncertainty are understood.',
    proposedSystem:
      'The existing portfolio records BalloonSat, CanSat / ground control, GNSS and telemetry exploration. Further proposed work: a simulated channel with timing, uncertainty and link-state metadata.',
    experiment:
      'Proposed: evaluate a controlled simulation before making flight or positioning claims. NaVIC remains an exploration interest, not a documented result.',
    source: profile.sources.timeline,
  },
];

/** Owner-maintained timeline source; only the internship provides calendar dates. */
export const milestones: Milestone[] = [
  {
    id: 'observe',
    phase: '01',
    title: 'The first research orbit.',
    category: 'SCHOOL / SCIENCE',
    description:
      'National Children’s Science Congress national-finalist experience and INSPIRE–MANAK recognition, as documented in Anwesha’s existing portfolio. Years are not specified.',
    source: profile.sources.timeline,
  },
  {
    id: 'build',
    phase: '02',
    title: 'Build, test, and learn in public.',
    category: 'UNIVERSITY / ENGINEERING',
    description:
      'Hackathons, technical events, and systems projects spanning interfaces, security and infrastructure. The portfolio records this university phase without invented calendar dates.',
    source: profile.sources.timeline,
  },
  {
    id: 'lead',
    phase: '03',
    title: 'Engineering with a wider purpose.',
    category: 'UNIVERSITY / LEADERSHIP',
    description:
      'Vice Chair, IEEE SIGHT at Chandigarh University; Google Cloud Arcade facilitation. Roles are owner-documented; dates are not specified.',
    source: profile.sources.timeline,
  },
  {
    id: 'investigate',
    phase: '04',
    title: 'Ask what survives the boundary.',
    category: 'UNIVERSITY / RESEARCH',
    description:
      'Scyther and Tamarin protocol verification, ML-KEM experiments, BalloonSat / CanSat ground control, GNSS and telemetry exploration are listed in the existing portfolio.',
    source: profile.sources.timeline,
  },
  {
    id: 'adxania',
    phase: '05',
    title: 'Cybersecurity Intern',
    category: 'AUG 2025 — FEB 2026 / EXPERIENCE',
    description:
      'Adxania Cyber Solutions Pvt. Ltd. — hands-on security work in an industry setting. Employer and dates are documented in Anwesha’s existing portfolio; no responsibilities or outcomes beyond that record are asserted.',
    source: profile.sources.timeline,
  },
];

/** Owner-documented milestones; not independently certified award records. */
export const achievements: Achievement[] = [
  {
    id: 'child-scientist',
    title: 'National Child Scientist recognition',
    description:
      'National-finalist experience at the National Children’s Science Congress. Documented in the existing portfolio; year not specified.',
    status: 'Portfolio documented',
    source: profile.sources.timeline,
  },
  {
    id: 'inspire',
    title: 'INSPIRE Award — MANAK',
    description:
      'Recognition under the INSPIRE–MANAK scheme for original student ideas, as recorded in the existing portfolio. Year not specified.',
    status: 'Portfolio documented',
    source: profile.sources.timeline,
  },
  {
    id: 'ieee',
    title: 'Vice Chair, IEEE SIGHT',
    description:
      'Leadership in IEEE’s Special Interest Group on Humanitarian Technology at Chandigarh University. Documented role; service dates not specified.',
    status: 'Portfolio documented',
    source: profile.sources.timeline,
  },
  {
    id: 'engineering-milestones',
    title: 'Google Cloud Arcade facilitation',
    description:
      'The existing portfolio lists Arcade Facilitator — Top 30, 100+ Google Cloud badges, and Arcade Legend tier. These are owner-maintained records, with no invented dates.',
    status: 'Portfolio documented',
    source: profile.sources.timeline,
  },
];

export const currentMission = {
  label: 'CURRENT TRANSMISSION',
  mission: 'Understand the system underneath.',
  building: 'Systems / interfaces / experiments',
  exploring: 'Security boundaries and resilient communication',
  research: 'Swift macro trust / explainable authorization',
  next: 'A better question.',
  status: 'Editorial focus drawn from the brief and existing portfolio',
  updated: null as string | null,
};
