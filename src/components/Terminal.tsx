'use client';

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { projects, profile } from '@/data/portfolio';

type TerminalProps = {
  onNavigate: (id: string) => void;
  onAward: (id: string, points: number) => void;
  onAction?: (action: string) => void;
  onClose?: () => void;
};

type Entry = { command?: string; response: string; tone?: 'success' | 'muted' };

const initial: Entry[] = [
  {
    response: 'SYSTEM 369 / LOCAL SHELL\nA small window into the way I think. Type help to begin.',
    tone: 'muted',
  },
];

const projectNames = projects.map((project) => project.title).join(' · ');

export function Terminal({ onNavigate, onAward, onAction, onClose }: TerminalProps) {
  const [input, setInput] = useState('');
  const [entries, setEntries] = useState<Entry[]>(initial);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [matrix, setMatrix] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onClose) inputRef.current?.focus();
  }, [onClose]);

  useEffect(() => {
    const output = outputRef.current;
    if (output) output.scrollTop = output.scrollHeight;
  }, [entries]);

  function run(raw: string) {
    const command = raw.trim();
    if (!command) return;
    const normalized = command.toLowerCase().replace(/\s+/g, ' ');
    setInput('');
    setHistory((old) => [...old, command]);
    setHistoryIndex(-1);
    let response: string;
    let tone: Entry['tone'];
    switch (normalized) {
      case 'help':
        response =
          'NAVIGATE  projects · skills · research · timeline · contact\nIDENTITY  whoami · github · resume\nJOURNEY   why · scan · launch · orbit\nSYSTEM    clear · matrix · coffee\nTry reading a file. Curiosity is a useful permission.';
        break;
      case 'whoami':
        response = `ANWESHA KAR\n${profile.positioning}\nI follow a question until it becomes a system.`;
        break;
      case 'projects':
      case 'ls projects':
        response = projectNames;
        onNavigate('universe');
        break;
      case 'skills':
        response =
          'INTERFACES  React · Flutter\nSERVICES    FastAPI · Java\nDATA        PostgreSQL · Redis\nSYSTEMS     Docker · Python · Swift · NetworkX\nSee the engine room for the project connections across the mission files.';
        onNavigate('engine');
        break;
      case 'research':
        response =
          'RESEARCH INTERESTS\nSecure Swift macro execution · authorization · disaster-tolerant communication · AI systems · telemetry · GNSS / NaVIC\nOpening the research notebook.';
        onNavigate('lab');
        break;
      case 'experience':
      case 'timeline':
        response =
          'Opening the memory corridor: engineering, research, leadership, and the Adxania cybersecurity internship and its technical context.';
        onNavigate('flight-path');
        break;
      case 'contact':
        response = 'Opening the transmission interface.';
        onNavigate('contact');
        break;
      case 'github':
        response = 'Opening the source channel. Follow the work beneath the interface.';
        onAction?.('github');
        break;
      case 'resume':
      case 'profile':
        response =
          'Opening the printable engineering profile: project architecture, experience, and the questions still open.';
        onAction?.('resume');
        break;
      case 'sudo hire anwesha':
        response =
          'Evaluating candidate...\nCuriosity: detected\nSystems thinking: detected\nPermission granted.\nThe next dependency is a conversation.';
        tone = 'success';
        onAward('hire-command', 50);
        break;
      case 'cat future.txt':
        response = 'still compiling...\nSome of the best variables are not assigned yet.';
        break;
      case 'cat 369.txt':
      case '369':
      case 'why 369':
        response =
          '369 is a personal system marker — part coordinate, part signature.\nThe next question is always open.';
        onAward('artifact-369', 50);
        tone = 'success';
        break;
      case 'launch':
        response =
          'ENGINE / SECURITY / NAVIGATION / TELEMETRY / COMMUNICATION\nTrajectory ready. Returning to the launch sequence.';
        if (onAction) onAction('launch');
        else onNavigate('launch');
        break;
      case 'orbit':
        response =
          'LINK ACQUIRED\nPosition is a question of timing. Opening the orbital telemetry view.';
        onNavigate('space');
        break;
      case 'why':
        response =
          'Because an answer is useful.\nAnd understanding why it works lets you build the next one.\n\nThe oldest key still opens the most interesting doors.';
        onAward('why-command', 10);
        break;
      case 'scan':
        response =
          'LOCAL DIAGNOSTIC\nNo remote systems scanned.\nOpening the security sandbox: inspect the telemetry, then isolate the anomaly.';
        onNavigate('cyberspace');
        break;
      case 'matrix':
        setMatrix((old) => !old);
        response = matrix
          ? 'Visual diagnostic disabled.'
          : 'Visual diagnostic enabled. The interesting part is still the code underneath.';
        break;
      case 'coffee':
        response =
          'Error 418: I’m a teapot.\nSuggested workaround: step away, make something warm, return with a better question.';
        break;
      case 'pwd':
        response = '/universe/sol/earth/curiosity';
        break;
      case 'ls':
        response = 'projects/  research/  memories/  future.txt  369.txt';
        break;
      case 'clear':
        setEntries([]);
        return;
      default:
        response = `Command not found: ${command}\nType help to inspect the available commands.`;
    }
    setEntries((old) => [...old, { command, response, tone }]);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    run(input);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    const next =
      event.key === 'ArrowUp'
        ? Math.min(historyIndex + 1, history.length - 1)
        : Math.max(historyIndex - 1, -1);
    setHistoryIndex(next);
    setInput(next === -1 ? '' : history[history.length - 1 - next] || '');
  }

  return (
    <section
      className={`terminal-shell${matrix ? ' terminal-matrix' : ''}`}
      aria-label="Interactive system terminal"
    >
      <div className="terminal-chrome">
        <span className="terminal-lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>anwesha@system369: ~</span>
        {onClose ? (
          <button
            type="button"
            className="terminal-close"
            onClick={onClose}
            aria-label="Close terminal"
          >
            ×
          </button>
        ) : (
          <span className="terminal-local">LOCAL SESSION</span>
        )}
      </div>
      <div
        ref={outputRef}
        className="terminal-output"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        tabIndex={0}
      >
        {entries.map((entry, index) => (
          <div className={`terminal-entry ${entry.tone || ''}`} key={index}>
            {entry.command && (
              <p className="terminal-command">
                <span aria-hidden="true">❯</span> {entry.command}
              </p>
            )}
            <p className="terminal-response">{entry.response}</p>
          </div>
        ))}
        {matrix && (
          <pre className="terminal-matrix-readout" aria-label="Decorative visual diagnostic">
            {
              '01001100  00110110  00111001\n  01000011  01101111  01100100\n00100110  00111100  00111110'
            }
          </pre>
        )}
      </div>
      <form className="terminal-form" onSubmit={onSubmit}>
        <label htmlFor="system-command" className="sr-only">
          Enter a system command
        </label>
        <span aria-hidden="true">❯</span>
        <input
          ref={inputRef}
          id="system-command"
          name="command"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="help"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <button type="submit" aria-label="Run command">
          ↵
        </button>
      </form>
      <div className="terminal-hint">
        <span>↑ ↓ HISTORY</span>
        <span>ENTER TO RUN</span>
      </div>
    </section>
  );
}

export default Terminal;
