export type CharacterPose =
  'idle' | 'look-up' | 'walk' | 'inspect' | 'reach' | 'react' | 'point' | 'sit' | 'turn';

export type StoryChapter = {
  id: string;
  name: string;
  kicker: string;
  headline: readonly string[];
  copy: readonly string[];
  description: string;
  environment: string;
  camera: { x: number; y: number; zoom: number };
  character: {
    pose: CharacterPose;
    focus: 'signal' | 'machine' | 'network' | 'sky' | 'mirror' | 'visitor';
    scale: number;
  };
  lightingDark: { sky: string; atmosphere: string; signal: string };
  lightingLight: { sky: string; atmosphere: string; signal: string };
  objects: readonly string[];
  interaction: string | null;
  transition: string;
  collectible: string | null;
  musicLayer: string;
};

const night = { sky: '#071622', atmosphere: '#163747', signal: '#baded6' };
const day = { sky: '#dcebf0', atmosphere: '#f2e9d4', signal: '#a56e21' };

/**
 * The narrative score for one persistent world. Camera x/y values are small,
 * normalized viewport offsets; zoom is relative to the illustrated stage.
 * The original signal and the girl's curiosity survive every transition.
 */
export const worldChapters: readonly StoryChapter[] = [
  {
    id: 'night',
    headline: ['She saw', 'questions.'],
    name: 'The night',
    kicker: 'PROLOGUE / A QUESTION TAKES SHAPE',
    copy: ['Some people looked at the stars and saw light.', 'She saw questions.'],
    description:
      'A little girl stands on a quiet hill beneath a vast sky. One star is brighter than the others. In daylight, the same field becomes an early-morning observatory.',
    environment: 'field',
    camera: { x: 0, y: 0, zoom: 1 },
    character: { pose: 'look-up', focus: 'sky', scale: 1 },
    lightingDark: night,
    lightingLight: day,
    objects: ['girl', 'hill', 'signal-star', 'moon'],
    interaction: 'follow-signal',
    transition: 'The strange star descends toward the field.',
    collectible: 'question',
    musicLayer: 'wind',
  },
  {
    id: 'signal',
    headline: ['Follow', 'the signal.'],
    name: 'The observatory',
    kicker: '01 / SOMETHING ANSWERED',
    copy: ['A lens, a dark sky, and one signal that refused to stay still.', 'She followed it.'],
    description:
      'The girl follows the fallen signal. As she reaches out, braces, brackets and binary digits circle the same point of light.',
    environment: 'signal-field',
    camera: { x: 0.01, y: 0, zoom: 1.08 },
    character: { pose: 'reach', focus: 'signal', scale: 1 },
    lightingDark: night,
    lightingLight: day,
    objects: ['girl', 'signal-star', '{}', '[]', '01', '<>'],
    interaction: 'catch-signal',
    transition: 'Grass becomes a coordinate grid; fireflies become pixels.',
    collectible: 'signal',
    musicLayer: 'signal-ping',
  },
  {
    id: 'forest',
    headline: ['Connect', 'the ideas.'],
    name: 'The code forest',
    kicker: '02 / MAGIC FINDS A GRAMMAR',
    copy: [
      'First, she learned how to tell machines what to do.',
      'Then she asked what they could become.',
    ],
    description:
      'The girl walks through branching syntax trees. Connecting three nodes reorganizes the forest and makes a path through it.',
    environment: 'code-forest',
    camera: { x: -0.01, y: 0.01, zoom: 1.04 },
    character: { pose: 'walk', focus: 'signal', scale: 1 },
    lightingDark: { ...night, atmosphere: '#153c40' },
    lightingLight: { ...day, atmosphere: '#d4e5d8' },
    objects: ['girl', 'signal-star', 'syntax-branches', 'code-nodes'],
    interaction: 'connect-nodes',
    transition:
      'Branches straighten into machine frames. The connected signal becomes their power source.',
    collectible: 'code',
    musicLayer: 'soft-mechanism',
  },
  {
    id: 'workshop',
    headline: ['Make it', 'real.'],
    name: 'The workshop',
    kicker: '03 / A QUESTION BECOMES A MACHINE',
    copy: ['The ideas became projects.', 'Each one asked a different engineering question.'],
    description:
      'The code forest becomes an engineering workshop. Real portfolio projects appear as inspectable machinery: a relay, an intelligence core, a map table and a verification ledger.',
    environment: 'workshop',
    camera: { x: 0, y: 0, zoom: 0.98 },
    character: { pose: 'inspect', focus: 'machine', scale: 1 },
    lightingDark: { ...night, atmosphere: '#253341' },
    lightingLight: { ...day, atmosphere: '#e1e5df' },
    objects: ['girl', 'signal-star', 'project-machines', 'architecture-traces'],
    interaction: 'inspect-machine',
    transition: 'A machine loses its rhythm. Its cables become visible trust boundaries.',
    collectible: 'system',
    musicLayer: 'workshop',
  },
  {
    id: 'failure',
    headline: ['What could', 'go wrong?'],
    name: 'The failure',
    kicker: '04 / THE QUESTION CHANGES',
    copy: [
      'Building systems created another question.',
      'What happens when someone tries to break them?',
    ],
    description:
      'A signal leaves its expected path. The girl notices the anomaly; machine lights dim and the same connecting lines become a network.',
    environment: 'fault-boundary',
    camera: { x: 0.01, y: 0, zoom: 1.04 },
    character: { pose: 'react', focus: 'network', scale: 1 },
    lightingDark: { ...night, atmosphere: '#342b39' },
    lightingLight: { ...day, atmosphere: '#e8ddd0' },
    objects: ['girl', 'signal-star', 'machine-nodes', 'anomalous-packet'],
    interaction: null,
    transition: 'Workshop cables resolve into a precise network topology.',
    collectible: null,
    musicLayer: 'uneven-pulse',
  },
  {
    id: 'cyberspace',
    headline: ['Trust has', 'boundaries.'],
    name: 'The trust boundary',
    kicker: '05 / NOTICE. REASON. CONTAIN.',
    copy: [
      'A strong system makes its boundaries visible.',
      'She learned to read the paths between them.',
    ],
    description:
      'The girl inspects a controlled ten-node security simulation. Identify the node sending unusual traffic and isolate it. A small shield remains with her after containment.',
    environment: 'security-network',
    camera: { x: 0, y: -0.01, zoom: 1 },
    character: { pose: 'inspect', focus: 'network', scale: 1 },
    lightingDark: { ...night, atmosphere: '#173b43' },
    lightingLight: { ...day, atmosphere: '#d9e6ea' },
    objects: ['girl', 'signal-star', 'trust-nodes', 'packet-paths', 'shield'],
    interaction: 'isolate-threat',
    transition:
      'The topology zooms outward. Nodes become services; services become infrastructure.',
    collectible: 'shield',
    musicLayer: 'network-pulse',
  },
  {
    id: 'engine',
    headline: ['Think in', 'systems.'],
    name: 'Bigger systems',
    kicker: '06 / THE VIEW GETS WIDER',
    copy: ['Interfaces. Services. Data.', 'She learned to make the parts work together.'],
    description:
      'The network grows into an infrastructure city. Interface layers, gateways, queues, memory cores and isolated containers power the same interconnected world.',
    environment: 'infrastructure',
    camera: { x: -0.02, y: -0.01, zoom: 0.94 },
    character: { pose: 'walk', focus: 'machine', scale: 1 },
    lightingDark: { ...night, atmosphere: '#243448' },
    lightingLight: { ...day, atmosphere: '#d7e3ea' },
    objects: ['girl', 'signal-star', 'service-towers', 'memory-core', 'relay', 'containers'],
    interaction: 'inspect-infrastructure',
    transition: 'Infrastructure modules begin to align around a central spine.',
    collectible: null,
    musicLayer: 'systems-hum',
  },
  {
    id: 'rocket',
    headline: ['Ready for', 'something', 'bigger?'],
    name: 'The possibility',
    kicker: '07 / SOMETHING LARGER WAS TAKING SHAPE',
    copy: ['Looking up was a beginning.', 'She wanted to see what was beyond the frame.'],
    description:
      'The city’s modules assemble into a rocket. Its engine, security, navigation, telemetry and communications are ready. The girl looks toward the same sky where the story began.',
    environment: 'launch-pad',
    camera: { x: 0, y: -0.03, zoom: 0.98 },
    character: { pose: 'look-up', focus: 'sky', scale: 1 },
    lightingDark: { ...night, atmosphere: '#27344b' },
    lightingLight: { ...day, atmosphere: '#d3e9ec' },
    objects: ['girl', 'signal-star', 'assembled-rocket', 'launch-tower'],
    interaction: 'initiate-launch',
    transition: 'The assembled system rises. Ground gives way to cloud and atmosphere.',
    collectible: null,
    musicLayer: 'launch-ready',
  },
  {
    id: 'launch',
    headline: ['Go', 'beyond.'],
    name: 'The launch',
    kicker: '08 / THE GROUND BECOMES A MEMORY',
    copy: ['The field became a point of light.', 'The next question was how far she could go.'],
    description:
      'The rocket lifts through clouds and atmosphere without a cut. The girl and the original signal travel with the camera as the field falls away.',
    environment: 'atmosphere',
    camera: { x: 0, y: -0.04, zoom: 1.02 },
    character: { pose: 'react', focus: 'sky', scale: 0.95 },
    lightingDark: { ...night, atmosphere: '#37556e' },
    lightingLight: { ...day, atmosphere: '#c7e7f2' },
    objects: ['girl', 'signal-star', 'rocket', 'cloud-layers', 'trajectory'],
    interaction: null,
    transition: 'Cloud bands thin into orbital paths. The signal becomes telemetry.',
    collectible: 'orbit',
    musicLayer: 'ignition',
  },
  {
    id: 'space',
    headline: ['Stay', 'connected.'],
    name: 'The link',
    kicker: '09 / EVERY SIGNAL HAS A JOURNEY',
    copy: ['Distance changes the problem.', 'Curiosity keeps the link open.'],
    description:
      'Orbit, position, signal paths and packet flow surround the girl. Satellites and the same guiding star reveal her interests in telemetry, GNSS, NaVIC and space communication.',
    environment: 'orbit',
    camera: { x: 0.01, y: 0, zoom: 0.96 },
    character: { pose: 'point', focus: 'signal', scale: 0.95 },
    lightingDark: { ...night, atmosphere: '#172b47' },
    lightingLight: { ...day, atmosphere: '#d8e8ef' },
    objects: ['girl', 'signal-star', 'satellite', 'planet-limb', 'telemetry-link'],
    interaction: 'align-satellite',
    transition: 'Packet paths connect the stars into recognizable project constellations.',
    collectible: 'signal',
    musicLayer: 'radio-link',
  },
  {
    id: 'universe',
    headline: ['Not stars.', 'Possibilities.'],
    name: 'The constellation',
    kicker: '10 / DIFFERENT WORLDS. CONNECTED QUESTIONS.',
    copy: [
      'The things she built were never isolated.',
      'Each was another way to ask a better question.',
    ],
    description:
      'The sky becomes the searchable project constellation. Every object opens a complete mission file with its architecture, engineering decisions, evidence, and source links.',
    environment: 'constellation',
    camera: { x: 0, y: 0, zoom: 0.96 },
    character: { pose: 'point', focus: 'signal', scale: 0.95 },
    lightingDark: { ...night, atmosphere: '#1f3048' },
    lightingLight: { ...day, atmosphere: '#dce8ed' },
    objects: ['girl', 'signal-star', 'project-constellations', 'orbital-paths'],
    interaction: 'explore-constellation',
    transition: 'A constellation path unfolds into the structure of an orbital laboratory.',
    collectible: null,
    musicLayer: 'orbital-quiet',
  },
  {
    id: 'lab',
    headline: ['Prove it.', 'Ask again.'],
    name: 'The research station',
    kicker: '11 / LEAVE ROOM FOR THE UNKNOWN',
    copy: ['An answer matters.', 'So does knowing how you would test it.'],
    description:
      'The girl reaches a research station. Open experiments show the question, hypothesis, proposed system, method and truthful status for each research direction.',
    environment: 'research-station',
    camera: { x: -0.01, y: 0, zoom: 1.04 },
    character: { pose: 'inspect', focus: 'machine', scale: 1 },
    lightingDark: { ...night, atmosphere: '#233744' },
    lightingLight: { ...day, atmosphere: '#e5e9e3' },
    objects: ['girl', 'signal-star', 'experiment-chambers', 'observatory-window'],
    interaction: 'open-research',
    transition: 'The laboratory’s orbit becomes a corridor. A single door remains closed.',
    collectible: 'knowledge',
    musicLayer: 'laboratory',
  },
  {
    id: 'door',
    headline: ['The key', 'was why.'],
    name: 'The door',
    kicker: '12 / THE OLDEST KEY',
    copy: ['Code. Systems. A shield. A signal.', 'None opened this door.', 'One question did.'],
    description:
      'A door reflects the artifacts collected along the journey. The girl notices the word “WHY?” and reaches toward it. Curiosity opens the way; continuing is always available.',
    environment: 'question-door',
    camera: { x: 0.01, y: 0, zoom: 1.08 },
    character: { pose: 'reach', focus: 'signal', scale: 1 },
    lightingDark: { ...night, atmosphere: '#292c40' },
    lightingLight: { ...day, atmosphere: '#eae2d2' },
    objects: ['girl', 'signal-star', 'door', 'collected-artifacts', 'why'],
    interaction: 'open-door',
    transition: 'The door opens onto a corridor of memories, lit by the same original signal.',
    collectible: 'question',
    musicLayer: 'quiet-door',
  },
  {
    id: 'flight-path',
    headline: ['The work', 'leaves a trace.'],
    name: 'The memory corridor',
    kicker: '13 / WHAT THE JOURNEY LEFT BEHIND',
    copy: ['Some moments became milestones.', 'Others became the reason to keep learning.'],
    description:
      'The girl walks between memory logs containing the source-backed internship, science recognition, leadership, research and engineering milestones in Anwesha’s portfolio.',
    environment: 'memory-corridor',
    camera: { x: 0, y: 0, zoom: 1 },
    character: { pose: 'walk', focus: 'signal', scale: 1 },
    lightingDark: { ...night, atmosphere: '#34333e' },
    lightingLight: { ...day, atmosphere: '#eae1d0' },
    objects: ['girl', 'signal-star', 'memory-lights', 'flight-path'],
    interaction: 'read-memory',
    transition: 'The last memory light becomes a reflective surface at the end of the corridor.',
    collectible: 'knowledge',
    musicLayer: 'memory',
  },
  {
    id: 'mirror',
    headline: ['Same curiosity.', 'New reflection.'],
    name: 'The mirror',
    kicker: '14 / THE QUESTION WAS ALWAYS HERS',
    copy: ['She never stopped asking questions.', 'She just learned how to build the answers.'],
    description:
      'The girl reaches a mirror. Its reflection changes symbolically from child to student, builder, and engineer. The girl stays on one side while a grown silhouette appears on the other.',
    environment: 'mirror',
    camera: { x: 0.01, y: 0, zoom: 1.08 },
    character: { pose: 'reach', focus: 'mirror', scale: 1 },
    lightingDark: { ...night, atmosphere: '#273343' },
    lightingLight: { ...day, atmosphere: '#e4e5dc' },
    objects: ['girl', 'signal-star', 'reflective-door', 'engineer-reflection'],
    interaction: null,
    transition: 'The reflection resolves. At last, the name behind the questions appears.',
    collectible: null,
    musicLayer: 'recognition',
  },
  {
    id: 'human',
    headline: ['Anwesha', 'Kar.'],
    name: 'The engineer',
    kicker: '15 / PRESENT DAY',
    copy: [
      'ANWESHA KAR',
      'Software engineer. Builder. Researcher.',
      'Still asking. Still building.',
    ],
    description:
      'Present-day Anwesha is revealed beside the younger figure. The story’s engineer is the same curious person who first looked toward the sky.',
    environment: 'present-day',
    camera: { x: 0, y: 0, zoom: 1.02 },
    character: { pose: 'turn', focus: 'visitor', scale: 1 },
    lightingDark: night,
    lightingLight: day,
    objects: ['girl', 'engineer', 'signal-star', 'returning-hill'],
    interaction: 'meet-engineer',
    transition:
      'The laboratory recedes into the original field. The sky is familiar, but its stars are now connected.',
    collectible: null,
    musicLayer: 'return',
  },
  {
    id: 'contact',
    headline: ['Your question.', 'Our next build.'],
    name: 'The next question',
    kicker: 'EPILOGUE / TRANSMISSION OPEN',
    copy: ['There is always another question.', 'Let’s build what comes next.'],
    description:
      'The girl and the engineer look toward the same sky. Collected artifacts form a small constellation. One star remains unexplored, and the girl points toward it. Contact, GitHub, LinkedIn and the résumé remain directly available.',
    environment: 'returning-field',
    camera: { x: 0, y: 0, zoom: 1 },
    character: { pose: 'point', focus: 'sky', scale: 1 },
    lightingDark: night,
    lightingLight: day,
    objects: ['girl', 'engineer', 'signal-star', 'artifact-constellation', 'unexplored-star'],
    interaction: 'open-transmission',
    transition: 'The next destination stays open.',
    collectible: 'unknown',
    musicLayer: 'wind',
  },
];

// The visitor follows the observatory into orbit, then discovers the work behind the world.
const journeyOrder = [
  'night',
  'signal',
  'rocket',
  'launch',
  'space',
  'forest',
  'engine',
  'workshop',
  'universe',
  'failure',
  'cyberspace',
  'lab',
  'door',
  'flight-path',
  'mirror',
  'human',
  'contact',
];
export const storyChapters = journeyOrder.map((id) =>
  worldChapters.find((chapter) => chapter.id === id)!,
);
export const worldSceneIndex = (id: string) =>
  worldChapters.findIndex((chapter) => chapter.id === id);
export function worldProgress(progress: number) {
  const lower = Math.max(0, Math.min(16, Math.floor(progress)));
  const upper = Math.min(16, lower + 1);
  const t = progress - lower;
  const eased = t * t * (3 - 2 * t);
  const start = worldSceneIndex(storyChapters[lower].id);
  return start + (worldSceneIndex(storyChapters[upper].id) - start) * eased;
}
export const chapters = storyChapters;
export const LAST_STORY_CHAPTER = storyChapters.length - 1;

const legacyAliases: Record<string, string> = {
  origin: 'signal',
  anomaly: 'door',
  vault: 'flight-path',
  now: 'space',
  'recruiter-briefing': 'human',
  identity: 'human',
  projects: 'universe',
  research: 'lab',
};

export function storyIndex(id: string) {
  const normalized = id.replace(/^#/, '').toLowerCase();
  const resolved = legacyAliases[normalized] || normalized;
  return storyChapters.findIndex((chapter) => chapter.id === resolved);
}
