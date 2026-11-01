'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
  onAction: (action: string) => void;
};

const commands = [
  { label: 'Go to projects', hint: 'Explore the constellation', target: 'universe', icon: '◈' },
  { label: 'Go to research', hint: 'Open the orbital laboratory', target: 'lab', icon: '⌬' },
  { label: 'Go to engine room', hint: 'Inspect the technology map', target: 'engine', icon: '⌘' },
  {
    label: 'Go to flight path',
    hint: 'Experience and memory logs',
    target: 'flight-path',
    icon: '↗',
  },
  {
    label: 'Go to achievements',
    hint: 'Open the milestone archive',
    target: 'vault',
    icon: '◇',
  },
  { label: 'Contact Anwesha', hint: 'Establish a connection', target: 'contact', icon: '↗' },
  {
    label: 'Open engineering profile',
    hint: 'Read the printable engineering profile',
    action: 'resume',
    icon: '↓',
  },
  {
    label: 'Open GitHub',
    hint: 'Visit the configured source channel',
    action: 'github',
    icon: '⌘',
  },
  { label: 'Open LinkedIn', hint: 'Visit the configured profile', action: 'linkedin', icon: '↗' },
  {
    label: 'Story Mode',
    hint: 'Follow how a question became an engineer',
    action: 'explorer',
    icon: '◎',
  },
  {
    label: 'Quick Mode',
    hint: 'Projects, skills, experience, and contact at a glance',
    action: 'recruiter',
    icon: '≡',
  },
  { label: 'Change sky', hint: 'Move between night and day', action: 'sky', icon: '☼' },
  {
    label: 'Toggle sound',
    hint: 'Sound starts off; entirely optional',
    action: 'sound',
    icon: '♪',
  },
  {
    label: 'Toggle reduced motion',
    hint: 'Control the pace of the experience',
    action: 'motion',
    icon: 'Ⅱ',
  },
  {
    label: 'Open terminal',
    hint: 'A few commands. A few hidden doors.',
    action: 'terminal',
    icon: '>_',
  },
];

export function CommandPalette(props: CommandPaletteProps) {
  return props.open ? <CommandPaletteContent {...props} /> : null;
}

function CommandPaletteContent({ open, onClose, onNavigate, onAction }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const filtered = useMemo(
    () =>
      commands.filter((command) =>
        `${command.label} ${command.hint}`.toLowerCase().includes(query.toLowerCase().trim()),
      ),
    [query],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!dialog.open) dialog.showModal();
    inputRef.current?.focus();
    return () => {
      dialog.close();
      if (previous?.isConnected) previous.focus();
    };
  }, []);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-command-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  function execute(index: number) {
    const command = filtered[index];
    if (!command) return;
    onClose();
    // Let the modal restore its trigger before moving focus to a destination.
    requestAnimationFrame(() => {
      if ('target' in command && command.target) onNavigate(command.target);
      if ('action' in command && command.action) onAction(command.action);
    });
  }

  return (
    <dialog
      ref={dialogRef}
      className="command-dialog"
      aria-labelledby="command-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const box = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < box.left ||
            event.clientX > box.right ||
            event.clientY < box.top ||
            event.clientY > box.bottom
          )
            onClose();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setActive((old) => Math.min(old + 1, filtered.length - 1));
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          setActive((old) => Math.max(old - 1, 0));
        }
        if (event.key === 'Enter' && event.target === inputRef.current) {
          event.preventDefault();
          execute(active);
        }
      }}
    >
      <div className="command-heading">
        <span id="command-title">MISSION CONTROL</span>
        <button type="button" onClick={onClose} aria-label="Close command palette">
          <kbd>ESC</kbd>
        </button>
      </div>
      <div className="command-search">
        <span aria-hidden="true">⌕</span>
        <label className="sr-only" htmlFor="command-query">
          Search commands
        </label>
        <input
          ref={inputRef}
          id="command-query"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          placeholder="Where do you want to go?"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls="command-results"
          aria-activedescendant={filtered[active] ? `command-option-${active}` : undefined}
        />
      </div>
      <div
        className="command-results"
        id="command-results"
        role="listbox"
        aria-label="Available commands"
        ref={listRef}
      >
        {filtered.map((command, index) => (
          <button
            id={`command-option-${index}`}
            type="button"
            key={command.label}
            role="option"
            aria-selected={index === active}
            data-command-index={index}
            className={`command-option${index === active ? ' active' : ''}`}
            onClick={() => execute(index)}
            onMouseEnter={() => setActive(index)}
          >
            <span className="command-icon" aria-hidden="true">
              {command.icon}
            </span>
            <span>
              <strong>{command.label}</strong>
              <small>{command.hint}</small>
            </span>
            <span className="command-enter" aria-hidden="true">
              ↵
            </span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="command-empty" role="status">
            No matching coordinates. Try “projects”, “motion” or “terminal”.
          </p>
        )}
      </div>
      <div className="command-footer">
        <span>
          <kbd>↑</kbd>
          <kbd>↓</kbd> TO NAVIGATE
        </span>
        <span>
          <kbd>↵</kbd> TO OPEN
        </span>
        <span>⌘ / CTRL + K</span>
      </div>
    </dialog>
  );
}

export default CommandPalette;
