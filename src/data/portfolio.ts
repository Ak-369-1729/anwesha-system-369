import type {
  Achievement,
  Milestone,
  Project,
  ProjectCategory,
  ResearchLog,
  Skill,
} from '@/types/portfolio';

// One editorial source for routes, spatial navigation, the technical briefing and profile.
export const profile = {
  name: 'Anwesha Kar',
  shortName: 'Anwesha',
  title: 'Software engineer',
  specialization: 'AI · infrastructure · security · human-centered interfaces',
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
  email: 'anwesha.hogwarts@gmail.com',
  github: 'https://github.com/Ak-369-1729',
  linkedin: 'https://www.linkedin.com/in/anwesha-kar-53a065230/',
  resume: '/engineering-profile/',
  contactNote: 'Email, GitHub and LinkedIn.',
  evidenceNote: 'Explore the architecture, source and technical records behind each mission.',
  sources: {
    profile: 'https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/site.ts',
    timeline: 'https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/timeline.ts',
    projects: 'https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/projects.ts',
    education: 'https://github.com/Ak-369-1729/BoundaryLens/blob/main/README.md',
  },
  positioning:
    'Software engineer building systems across AI, infrastructure, security, and human-centered interfaces.',
  documentLabel: 'Engineering profile',
};

export const categories: ProjectCategory[] = [
  'Engineering systems',
  'AI + intelligence',
  'Cybersecurity',
  'Infrastructure',
  'Research',
  'Human impact',
];

export const projects: Project[] = [
  {
    id: 'nexus',
    title: 'NEXUS',
    codename: 'THE DIGITAL TWIN',
    description:
      'A network digital twin that couples anomaly scoring with reversible node isolation.',
    category: 'Cybersecurity',
    technologies: ['Python', 'NetworkX', 'Streamlit', 'Isolation Forest', 'UNSW-NB15'],
    problem:
      'An anomaly score needs topology and response context: where is the suspicious host, and what changes when it is isolated?',
    solution:
      'Clean flow records, score anomalous traffic, locate the affected node in the topology, and rehearse reversible containment through an explicit isolate / restore state.',
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
    coordinates: {
      x: 47,
      y: 44,
    },
    featured: true,
    longDescription:
      'A cybersecurity digital twin connecting UNSW-NB15 flow analysis, Isolation Forest anomaly scores, and NetworkX topology. A Streamlit operator view makes suspicious-node isolation, restoration and state changes inspectable. The response runs in a simulated twin.',
    role: 'Engineering project',
    impact:
      'An inspectable detect → locate → isolate → restore workflow with topology context and response logs.',
    lessons:
      'How should thresholds adapt to network context without hiding the cost of false positives?',
    github: 'https://github.com/Ak-369-1729/NEXUS',
    demo: null,
    status: 'PROTOTYPE',
    year: null,
    constellation: 'Cybersecurity',
    visualIdentity: {
      symbol: '◈',
      color: '#a6f3d0',
      shape: 'ring',
    },
    evidence: 'Prototype source and technical documentation available.',
    sources: [
      {
        title: 'Technical record',
        url: 'https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/projects.ts',
      },
      {
        title: 'NEXUS README',
        url: 'https://github.com/Ak-369-1729/NEXUS/blob/main/README.md',
      },
    ],
  },
  {
    id: 'careeros',
    title: 'CareerOS',
    codename: 'THE NAVIGATOR',
    description:
      'AI-assisted opportunity discovery and a career constellation linking skills to roles.',
    category: 'Engineering systems',
    technologies: ['LLMs', 'Docker'],
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
    decisions: [
      'Use explicit application states instead of ambiguous status text.',
      'Keep personal records exportable.',
    ],
    challenges: [
      'Avoid duplicate applications and stale reminders.',
      'Protect sensitive candidate information.',
    ],
    coordinates: {
      x: 20,
      y: 28,
    },
    featured: true,
    longDescription:
      'A career operating system connecting daily opportunity discovery, internship and job intelligence, personalized tracking and a skill-to-role graph. AI-assisted summaries support decisions; the student stays in control.',
    role: 'Engineering project',
    impact:
      'Opportunity discovery, profile context and career planning are connected in one product workflow.',
    lessons:
      'Learning question: which assumptions survive a working prototype and controlled failure testing?',
    github: null,
    demo: null,
    status: 'ACTIVE BUILD',
    year: null,
    constellation: 'Engineering systems',
    visualIdentity: {
      symbol: '⌘',
      color: '#e2cb96',
      shape: 'planet',
    },
    evidence:
      'Active product build; feature flow and engineering decisions available in the technical record.',
    sources: [
      {
        title: 'CareerOS technical record',
        url: 'https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/projects.ts',
      },
    ],
  },
  {
    id: 'prepai',
    title: 'PrepAI',
    codename: 'THE REHEARSAL',
    description:
      'Interview practice with multi-personality group discussions and an explicit review rubric.',
    category: 'AI + intelligence',
    technologies: ['LLMs'],
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
    decisions: ['Show the rubric alongside feedback.', 'Allow deletion of practice responses.'],
    challenges: [
      'Evaluate inconsistent model feedback.',
      'Prevent private responses from leaking into logs.',
    ],
    coordinates: {
      x: 72,
      y: 24,
    },
    featured: false,
    longDescription:
      'PrepAI / Mockexa is an interview-practice prototype covering technical, HR and group discussion rounds. Contrasting AI personas create discussion dynamics, and an explicit six-part rubric supports review.',
    role: 'Engineering project',
    impact: 'A practice workflow combining distinct participant personas with structured feedback.',
    lessons:
      'Learning question: which assumptions survive a working prototype and controlled failure testing?',
    github: null,
    demo: null,
    status: 'PROTOTYPE',
    year: null,
    constellation: 'AI + intelligence',
    visualIdentity: {
      symbol: '✧',
      color: '#a8bfff',
      shape: 'star',
    },
    evidence: 'Prototype feature flow and review rubric documented in the technical record.',
    sources: [
      {
        title: 'PrepAI technical record',
        url: 'https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/projects.ts',
      },
    ],
  },
  {
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
    coordinates: {
      x: 61,
      y: 61,
    },
    featured: false,
    longDescription:
      'A design investigation into evidence, provenance and inspectable audit trails. This design explores the architecture and trade-offs below.',
    role: 'System design',
    impact: 'The design defines the system boundaries and a path to a testable prototype.',
    lessons: 'Which assumptions survive the first working prototype and controlled failure tests?',
    github: null,
    demo: null,
    status: 'CONCEPT',
    year: null,
    constellation: 'Cybersecurity',
    visualIdentity: {
      symbol: '⊡',
      color: '#a6f3d0',
      shape: 'satellite',
    },
    evidence: 'Concept architecture and evaluation plan.',
  },
  {
    id: 'boundarylens',
    title: 'BoundaryLens',
    codename: 'THE TRUST LINE',
    description:
      'Authorization security and regression testing, with evidence behind every boundary.',
    category: 'Cybersecurity',
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
    coordinates: {
      x: 37,
      y: 71,
    },
    featured: true,
    longDescription:
      'BoundaryLens discovers API endpoints from OpenAPI, Postman and HAR, models authenticated identities and resource ownership, and generates bounded cross-identity tests for BOLA / IDOR and function-level authorization failures. Its repository documents a FastAPI scanner, React / TypeScript dashboard, regression baselines and SARIF reporting.',
    role: 'Repository author: Anwesha Kar',
    impact:
      'A local vulnerable / fixed comparison, reproducible access-control findings, and regression baselines for CI.',
    lessons:
      'How can policy provenance make each authorization finding easier to reproduce and review?',
    github: 'https://github.com/Ak-369-1729/BoundaryLens',
    demo: null,
    status: 'PROTOTYPE',
    year: null,
    constellation: 'Cybersecurity',
    visualIdentity: {
      symbol: '⋈',
      color: '#bfe8dc',
      shape: 'beacon',
    },
    evidence: 'Public source, architecture documentation and a local demonstration fixture.',
    sources: [
      {
        title: 'BoundaryLens README',
        url: 'https://github.com/Ak-369-1729/BoundaryLens/blob/main/README.md',
      },
    ],
  },
  {
    id: 'chronoheritage',
    title: 'ChronoHeritage',
    codename: 'THE MEMORY FIELD',
    description:
      'A provenance-first research platform connecting historical sites, chronology and the observable sky.',
    category: 'Human impact',
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
      'Representing uncertainty in survey and chronology inputs.',
      'Validating astronomy calculations against independent reference cases.',
      'Separating candidate alignments from claims about historical intent.',
    ],
    coordinates: {
      x: 14,
      y: 61,
    },
    featured: true,
    longDescription:
      'ChronoHeritage V3 combines a Next.js interface, FastAPI science services, PostgreSQL / PostGIS, queued analysis and reports. Inputs preserve sources, conventions and uncertainty. A small angular residual is reported as a candidate alignment under assumptions, never as proof of historical intent.',
    role: 'Multi-service research platform',
    impact:
      'A provenance-preserving workflow from site records through calculation, queued analysis and reports.',
    lessons:
      'A reproducible calculation and a supported historical conclusion are different claims.',
    github: 'https://github.com/Ak-369-1729/Chrono_Heritage',
    demo: null,
    status: 'PROTOTYPE',
    year: null,
    constellation: 'Human impact',
    visualIdentity: {
      symbol: '⌛',
      color: '#e2cb96',
      shape: 'ring',
    },
    evidence:
      'Public source and architecture documentation. Demonstration sites are fictional; scientific benchmarking remains ongoing.',
    sources: [
      {
        title: 'ChronoHeritage V3 README',
        url: 'https://github.com/Ak-369-1729/Chrono_Heritage/blob/main/README.md',
      },
    ],
  },
  {
    id: 'rescuers',
    title: 'RESCUERS',
    codename: 'THE LAST SIGNAL',
    description: 'RESQMesh / RESCUERS: preserve critical reports when bandwidth collapses.',
    category: 'Human impact',
    technologies: ['Mesh networking'],
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
    decisions: [
      'Make undelivered state visible.',
      'Prioritize consent, data minimization and reliable retry behavior.',
    ],
    challenges: [
      'Test network partitions and exhausted batteries.',
      'Handle duplicated or expired emergency messages.',
    ],
    coordinates: {
      x: 82,
      y: 52,
    },
    featured: false,
    longDescription:
      'RESCUERS / RESQMesh investigates utility-aware disaster networking under information pressure. Critical reports stay intact, while lower-priority updates become bounded, mergeable summaries. The work includes a communication model and simulation.',
    role: 'Resilient networking research',
    impact:
      'A prioritization model and simulation for preserving useful emergency information as capacity degrades.',
    lessons:
      'How do severity classification, link uncertainty and abuse resistance affect critical-report delivery?',
    github: null,
    demo: null,
    status: 'RESEARCH',
    year: null,
    constellation: 'Human impact',
    visualIdentity: {
      symbol: '⌁',
      color: '#e2cb96',
      shape: 'beacon',
    },
    evidence:
      'Research model, payload policy and illustrative simulation described in the technical record.',
    sources: [
      {
        title: 'RESQMesh technical record',
        url: 'https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/projects.ts',
      },
    ],
  },
  {
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
    coordinates: {
      x: 32,
      y: 16,
    },
    featured: false,
    longDescription:
      'An algorithm workbench focused on understanding behavior rather than collecting answers. This design explores the architecture and trade-offs below.',
    role: 'System design',
    impact: 'The design defines the system boundaries and a path to a testable prototype.',
    lessons: 'Which assumptions survive the first working prototype and controlled failure tests?',
    github: null,
    demo: null,
    status: 'CONCEPT',
    year: null,
    constellation: 'Engineering systems',
    visualIdentity: {
      symbol: '⌬',
      color: '#c3c5ef',
      shape: 'satellite',
    },
    evidence: 'Concept architecture and evaluation plan.',
  },
  {
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
    coordinates: {
      x: 89,
      y: 30,
    },
    featured: false,
    longDescription:
      'A concept for organizing placement preparation and making the next step clear. This design explores the architecture and trade-offs below.',
    role: 'System design',
    impact: 'The design defines the system boundaries and a path to a testable prototype.',
    lessons: 'Which assumptions survive the first working prototype and controlled failure tests?',
    github: null,
    demo: null,
    status: 'CONCEPT',
    year: null,
    constellation: 'AI + intelligence',
    visualIdentity: {
      symbol: '⊹',
      color: '#a8bfff',
      shape: 'star',
    },
    evidence: 'Concept architecture and evaluation plan.',
  },
  {
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
    coordinates: {
      x: 9,
      y: 43,
    },
    featured: false,
    longDescription:
      'A human-centered concept for navigating civic information and services. This design explores the architecture and trade-offs below.',
    role: 'System design',
    impact: 'The design defines the system boundaries and a path to a testable prototype.',
    lessons: 'Which assumptions survive the first working prototype and controlled failure tests?',
    github: null,
    demo: null,
    status: 'CONCEPT',
    year: null,
    constellation: 'Human impact',
    visualIdentity: {
      symbol: '⊙',
      color: '#e2cb96',
      shape: 'planet',
    },
    evidence: 'Concept architecture and evaluation plan.',
  },
  {
    id: 'path-guard',
    title: 'Path Guard',
    codename: 'THE SAFETY SIGNAL',
    description:
      'A personal-safety MVP connecting emergency signals, trusted contacts and escalation.',
    category: 'Human impact',
    technologies: [],
    problem:
      'During an emergency, someone may not be able to unlock a phone, explain their location and contact help in sequence.',
    solution:
      'Turn an explicit voice trigger or supported emergency signal into a reviewable escalation flow: collect the necessary context, contact trusted people, and share location or media with consent.',
    architecture: [
      'Voice / emergency signal',
      'Device-signal review',
      'Escalation rules',
      'Trusted contacts',
      'Location / media sharing',
    ],
    decisions: [
      'Keep manual activation and cancellation available.',
      'Treat sensitive location and media as explicit sharing choices.',
      'Use only sensors and signals available on the device.',
    ],
    challenges: [
      'False alarms and missed activations.',
      'Permission, battery and connectivity limits.',
      'Making emergency actions simple under stress.',
    ],
    coordinates: {
      x: 52,
      y: 83,
    },
    featured: false,
    longDescription:
      'Path Guard focuses on the person using the system: a voice-triggered emergency flow, trusted contacts and location sharing. The MVP direction also considers fall, heart-rate and route-deviation signals where device capabilities permit, with consent-aware media capture or sharing.',
    role: 'Engineering project',
    impact: 'A human-centered safety escalation workflow with trusted contacts at its core.',
    lessons:
      'How can an emergency flow stay fast while allowing a person to recover from a false alarm?',
    github: null,
    demo: null,
    status: 'PROTOTYPE',
    year: null,
    constellation: 'Human impact',
    visualIdentity: {
      symbol: '⌖',
      color: '#a6f3d0',
      shape: 'beacon',
    },
    evidence:
      'Safety MVP direction and escalation architecture. Sensor availability depends on the device.',
    sources: [],
  },
  {
    id: 'eventmesh',
    title: 'EventMesh',
    codename: 'THE EVENT HORIZON',
    description:
      'A delivery layer for asynchronous workflows, from authenticated publishing to dead-letter recovery.',
    category: 'Infrastructure',
    technologies: ['Redis', 'Docker', 'REST APIs'],
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
    coordinates: {
      x: 64,
      y: 38,
    },
    featured: true,
    longDescription:
      'A Redis-backed delivery layer with authenticated publishing, rate limits, idempotency keys, retry backoff and dead-letter recovery. Metrics and health checks make each stage observable.',
    role: 'Engineering project',
    impact: 'Explicit delivery policies and an operator recovery path for asynchronous failures.',
    lessons: 'Reliability work lives in the unhappy path and in the API contract around retries.',
    github: null,
    demo: null,
    status: 'ACTIVE BUILD',
    year: null,
    constellation: 'Infrastructure',
    visualIdentity: {
      symbol: '⌘',
      color: '#a8bfff',
      shape: 'satellite',
    },
    evidence:
      'Active build with a detailed technical record covering delivery semantics and failure recovery.',
    sources: [
      {
        title: 'EventMesh technical record',
        url: 'https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/projects.ts',
      },
    ],
  },
  {
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
    coordinates: {
      x: 76,
      y: 76,
    },
    featured: false,
    longDescription:
      'A design record for detecting visual change with clear consent and traceability. This design explores the architecture and trade-offs below.',
    role: 'System design',
    impact: 'The design defines the system boundaries and a path to a testable prototype.',
    lessons: 'Which assumptions survive the first working prototype and controlled failure tests?',
    github: null,
    demo: null,
    status: 'CONCEPT',
    year: null,
    constellation: 'Infrastructure',
    visualIdentity: {
      symbol: '⊞',
      color: '#bbc7e3',
      shape: 'satellite',
    },
    evidence: 'Concept architecture and evaluation plan.',
  },
  {
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
    coordinates: {
      x: 28,
      y: 47,
    },
    featured: false,
    longDescription:
      'An investigation into explaining algorithm structure and its limits. This design explores the architecture and trade-offs below.',
    role: 'System design',
    impact: 'The design defines the system boundaries and a path to a testable prototype.',
    lessons: 'Which assumptions survive the first working prototype and controlled failure tests?',
    github: null,
    demo: null,
    status: 'CONCEPT',
    year: null,
    constellation: 'Engineering systems',
    visualIdentity: {
      symbol: 'λ',
      color: '#c3c5ef',
      shape: 'star',
    },
    evidence: 'Concept architecture and evaluation plan.',
  },
  {
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
    coordinates: {
      x: 88,
      y: 65,
    },
    featured: false,
    longDescription:
      'A machine-learning concept for recognizing crop disease patterns in images. This design explores the architecture and trade-offs below.',
    role: 'System design',
    impact: 'The design defines the system boundaries and a path to a testable prototype.',
    lessons: 'Which assumptions survive the first working prototype and controlled failure tests?',
    github: null,
    demo: null,
    status: 'CONCEPT',
    year: null,
    constellation: 'AI + intelligence',
    visualIdentity: {
      symbol: '❋',
      color: '#bce2a8',
      shape: 'planet',
    },
    evidence: 'Concept architecture and evaluation plan.',
  },
  {
    id: 'agnipariksha',
    title: 'AGNIPARIKSHA',
    codename: 'THE EARLY WARNING',
    description:
      'Burn-in drift and anomaly analysis for early warning during electronic-system testing.',
    category: 'Engineering systems',
    technologies: [],
    problem:
      'A component can drift before it crosses a hard failure threshold. Burn-in measurements need context across time and across electrical and thermal signals.',
    solution:
      'Align current, voltage and temperature traces, establish expected operating ranges, and surface sustained drift or correlated anomalies for early investigation.',
    architecture: [
      'Burn-in measurements',
      'Time-series alignment',
      'Baseline / thresholds',
      'Drift + anomaly analysis',
      'Early-warning review',
    ],
    decisions: [
      'Keep thresholds and operating conditions visible to the reviewer.',
      'Distinguish transient excursions from sustained drift.',
      'Use warnings to support inspection rather than claiming certain failure prediction.',
    ],
    challenges: [
      'Different components have different operating envelopes.',
      'Thermal settling can resemble degradation.',
      'Predictive thresholds need labeled test runs and controlled evaluation.',
    ],
    coordinates: {
      x: 17,
      y: 82,
    },
    featured: false,
    longDescription:
      'AGNIPARIKSHA examines time-series current, voltage and temperature during burn-in testing. Its prototype direction combines threshold monitoring and predictive drift analysis to identify anomalous behavior and help prioritize components for inspection.',
    role: 'Electronic-system monitoring prototype',
    impact:
      'An early-warning workflow for reviewing electrical and thermal behavior during burn-in.',
    lessons:
      'How early can a warning become useful without overwhelming the reviewer with false alarms?',
    github: null,
    demo: null,
    status: 'PROTOTYPE',
    year: null,
    constellation: 'Engineering systems',
    visualIdentity: {
      symbol: '△',
      color: '#dfa087',
      shape: 'anomaly',
    },
    evidence:
      'Prototype direction and monitoring architecture; current, voltage and temperature are the primary signals.',
    sources: [],
  },
  {
    id: 'swift-macrotrust',
    title: 'Swift MacroTrust',
    codename: 'THE TRUST EXPERIMENT',
    description:
      'Systems-security research on the execution trust boundary of compile-time Swift macros.',
    category: 'Research',
    technologies: ['Swift'],
    problem:
      'Compile-time extensions execute code as part of the build. Their access to resources and their relationship to source-code trust need an explicit security model.',
    solution:
      'Define the relevant threats and security requirements, map macro execution capabilities, and develop restriction and verification approaches for the compiler/plugin boundary.',
    architecture: [
      'Macro / plugin execution',
      'Threat taxonomy',
      'Security requirements',
      'Capability boundary',
      'Verification model',
    ],
    decisions: [
      'Separate execution trust from source-level correctness.',
      'Prefer narrow, explicit capabilities to ambient access.',
      'Tie each verification idea to a concrete threat and requirement.',
    ],
    challenges: [
      'Toolchain behavior evolves across versions.',
      'Useful restrictions must preserve legitimate macro workflows.',
      'Security requirements need executable evaluation fixtures.',
    ],
    coordinates: {
      x: 45,
      y: 15,
    },
    featured: true,
    longDescription:
      'MacroTrust examines the trust introduced when Swift macros or compiler plugins execute during a build. The work develops a threat taxonomy, security requirements, capability restrictions and verification ideas for macro execution and plugin security models.',
    role: 'Systems and security research',
    impact:
      'A threat taxonomy and capability-oriented security framework for compile-time macro execution.',
    lessons:
      'Which capability restrictions can be enforced without breaking legitimate Swift macro workflows?',
    github: null,
    demo: null,
    status: 'RESEARCH',
    year: null,
    constellation: 'Research',
    visualIdentity: {
      symbol: '⟡',
      color: '#c3c5ef',
      shape: 'anomaly',
    },
    evidence:
      'Research record: threat model, requirements, capability boundary and verification approach.',
    sources: [],
  },
];

export const skills: Skill[] = [
  {
    id: 'react',
    name: 'React',
    system: 'INTERFACE ENGINE',
    description: 'Interface state, accessible interaction, and inspectable system views.',
    projects: [
      'boundarylens',
      'chronoheritage',
      'algoforge',
      'placementiq',
      'janmitra',
      'java-algorithm-analyzer',
    ],
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    system: 'SERVICE CORE',
    description: 'Typed service boundaries and explicit request / response contracts.',
    projects: [
      'prooftrail',
      'boundarylens',
      'chronoheritage',
      'janmitra',
      'wheat-disease-detection',
    ],
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    system: 'MEMORY VAULT',
    description: 'Structured state, integrity constraints, and reproducible queries.',
    projects: ['prooftrail', 'chronoheritage', 'placementiq', 'janmitra'],
  },
  {
    id: 'redis',
    name: 'Redis',
    system: 'EVENT BUS',
    description: 'Idempotency windows, rate limits and retry state for asynchronous delivery.',
    projects: ['eventmesh'],
  },
  {
    id: 'docker',
    name: 'Docker',
    system: 'ISOLATION CHAMBER',
    description: 'Repeatable development environments and bounded experiment fixtures.',
    projects: ['careeros', 'boundarylens', 'chronoheritage', 'eventmesh', 'screenshot-monitor'],
  },
  {
    id: 'python',
    name: 'Python',
    system: 'INTELLIGENCE ENGINE',
    description: 'Graph modeling, service logic, analysis, and research tooling.',
    projects: [
      'nexus',
      'prooftrail',
      'boundarylens',
      'chronoheritage',
      'algoforge',
      'placementiq',
      'screenshot-monitor',
      'wheat-disease-detection',
    ],
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
    id: 'networkx',
    name: 'NetworkX',
    system: 'TOPOLOGY ENGINE',
    description: 'Graphs for dependencies, authorization paths, and relay networks.',
    projects: ['nexus'],
  },
];

export const research: ResearchLog[] = [
  {
    id: 'macro-execution',
    title: 'Where should a macro stop?',
    area: 'SWIFT / EXECUTION TRUST',
    status: 'RESEARCH',
    hypothesis:
      'A clearly specified capability boundary could make compiler-extension behavior easier to inspect.',
    problem: 'Build tooling executes code while handling source and developer resources.',
    proposedSystem: 'A controlled macro fixture set, permission model, and execution-trace review.',
    experiment:
      'vary permitted resources and compare observed behavior against documented toolchain guarantees.',
  },
  {
    id: 'authorization',
    title: 'Make trust boundaries visible.',
    area: 'AUTHORIZATION / SECURITY ARCHITECTURE',
    status: 'RESEARCH',
    hypothesis:
      'An explainable access graph could reveal authorization assumptions that a flat policy table hides.',
    problem: 'Indirect permissions and inherited roles make access difficult to reason about.',
    proposedSystem: 'A principal-resource graph with policy provenance and path explanations.',
    experiment:
      'construct a small synthetic organization and test expected versus observed access paths.',
  },
  {
    id: 'disaster-links',
    title: 'A message after the network.',
    area: 'DISASTER-TOLERANT COMMUNICATION',
    status: 'RESEARCH',
    hypothesis:
      'Explicit store-and-forward semantics could preserve useful delivery behavior under intermittent links.',
    problem: 'A normal connected-client assumption fails during partitions.',
    proposedSystem:
      'Local persistence, opportunistic relays, expiry, acknowledgements and duplicate suppression.',
    experiment:
      'inject partitions into a relay simulation and measure delivery delay, duplication and loss.',
  },
  {
    id: 'post-quantum',
    title: 'Security beyond the assumption.',
    area: 'POST-QUANTUM / OS SECURITY',
    status: 'RESEARCH',
    hypothesis:
      'A controlled comparison could clarify migration costs and boundary assumptions before adoption.',
    problem: 'A cryptographic choice changes operational constraints as well as algorithms.',
    proposedSystem:
      'Scyther / Tamarin protocol verification and ML-KEM experiments. Next: a documented test matrix for candidate primitives and isolation concepts.',
    experiment:
      'benchmark vetted implementations under fixed conditions; review threat models separately from speed.',
    source: 'https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/timeline.ts',
  },
  {
    id: 'ai-systems',
    title: 'Useful answers need evidence.',
    area: 'AI SYSTEMS / EVALUATION',
    status: 'RESEARCH',
    hypothesis:
      'Transparent evaluation and uncertainty could make an assistive model more useful than an unexplained score.',
    problem: 'Model outputs can look confident while changing across contexts.',
    proposedSystem: 'A versioned evaluation set, human review rubric and error taxonomy.',
    experiment:
      'compare feedback consistency, calibration and failure cases across controlled inputs.',
  },
  {
    id: 'orbital-telemetry',
    title: 'Listen beyond the horizon.',
    area: 'BALLOONSAT / TELEMETRY / GNSS / NAVIC',
    status: 'RESEARCH',
    hypothesis:
      'A small, well-instrumented telemetry experiment could expose the tradeoffs between position, timing, link quality and power.',
    problem: 'A signal is useful only when its timing, reliability and uncertainty are understood.',
    proposedSystem:
      'BalloonSat, CanSat / ground control, GNSS and telemetry exploration. Next: a simulated channel with timing, uncertainty and link-state metadata.',
    experiment: 'evaluate a controlled simulation before making flight or positioning claims.',
    source: 'https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/timeline.ts',
  },
];

export const milestones: Milestone[] = [
  {
    id: 'observe',
    phase: '01',
    title: 'The first research orbit.',
    category: 'SCHOOL / SCIENCE',
    description: 'NCSC national-finalist experience and INSPIRE–MANAK recognition.',
    source: 'https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/timeline.ts',
  },
  {
    id: 'build',
    phase: '02',
    title: 'Build, test, and learn in public.',
    category: 'UNIVERSITY / ENGINEERING',
    description:
      'Hackathons, technical events and systems projects spanning interfaces, security and infrastructure.',
    source: 'https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/timeline.ts',
  },
  {
    id: 'lead',
    phase: '03',
    title: 'Engineering with a wider purpose.',
    category: 'UNIVERSITY / LEADERSHIP',
    description:
      'Vice Chair, IEEE SIGHT at Chandigarh University; Google Cloud Arcade facilitation.',
    source: 'https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/timeline.ts',
  },
  {
    id: 'investigate',
    phase: '04',
    title: 'Ask what survives the boundary.',
    category: 'UNIVERSITY / RESEARCH',
    description:
      'Scyther and Tamarin protocol verification, ML-KEM experiments, BalloonSat / CanSat ground control, GNSS and telemetry exploration.',
    source: 'https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/timeline.ts',
  },
  {
    id: 'adxania',
    phase: '05',
    title: 'Cybersecurity Intern',
    category: 'AUG 2025 — FEB 2026 / EXPERIENCE',
    description:
      'Adxania Cyber Solutions Pvt. Ltd. — hands-on cybersecurity work in an industry setting.',
    source: 'https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/timeline.ts',
  },
];

export const achievements: Achievement[] = [
  {
    id: 'child-scientist',
    title: 'National Child Scientist recognition',
    description: 'National finalist at the National Children’s Science Congress.',
    status: 'Science',
    source: 'https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/timeline.ts',
  },
  {
    id: 'inspire',
    title: 'INSPIRE Award — MANAK',
    description: 'Recognition for original student ideas under the INSPIRE–MANAK scheme.',
    status: 'Science',
    source: 'https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/timeline.ts',
  },
  {
    id: 'ieee',
    title: 'Vice Chair, IEEE SIGHT',
    description: 'Humanitarian technology leadership at Chandigarh University.',
    status: 'Leadership',
    source: 'https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/timeline.ts',
  },
  {
    id: 'engineering-milestones',
    title: 'Google Cloud Arcade facilitation',
    description: 'Arcade Facilitator — Top 30; 100+ Google Cloud badges and Arcade Legend tier.',
    status: 'Cloud practice',
    source: 'https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/timeline.ts',
  },
];

export const currentMission = {
  label: 'CURRENT TRANSMISSION',
  mission: 'Understand the system underneath.',
  building: 'Systems / interfaces / experiments',
  exploring: 'Security boundaries and resilient communication',
  research: 'Swift macro trust / explainable authorization',
  next: 'A better question.',
  status: 'CURRENT ENGINEERING FOCUS',
  updated: null,
};

export const flagshipIds = [
  'nexus',
  'eventmesh',
  'careeros',
  'chronoheritage',
  'boundarylens',
  'swift-macrotrust',
] as const;
export const flagshipProjects = flagshipIds.map((id) =>
  projects.find((project) => project.id === id)!,
);
