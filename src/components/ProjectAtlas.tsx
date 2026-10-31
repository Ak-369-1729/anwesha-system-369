'use client';

import Link from 'next/link';
import { CSSProperties, PointerEvent, useMemo, useRef, useState } from 'react';
import { categories, projects } from '@/data/portfolio';
import type { ProjectCategory } from '@/types/portfolio';

type ProjectAtlasProps = { onDiscover?: (id: string) => void; compact?: boolean };
type PanState = { startX: number; scrollLeft: number; pointerId: number | null; dragged: boolean };

const connections = categories.flatMap((category) => {
  const constellation = projects.filter((project) => project.category === category);
  return constellation.slice(1).map((project, index) => [constellation[index], project] as const);
});

export function ProjectAtlas({ onDiscover, compact = false }: ProjectAtlasProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ProjectCategory | 'All'>('All');
  const [view, setView] = useState<'map' | 'list'>(compact ? 'list' : 'map');
  const [selectedId, setSelectedId] = useState('nexus');
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<PanState | null>(null);
  const filtered = useMemo(
    () =>
      projects.filter((project) => {
        const text =
          `${project.title} ${project.category} ${project.codename} ${project.technologies.join(' ')}`.toLowerCase();
        return (
          (category === 'All' || project.category === category) &&
          text.includes(query.trim().toLowerCase())
        );
      }),
    [query, category],
  );
  const visibleIds = new Set(filtered.map((project) => project.id));
  const selected = filtered.find((project) => project.id === selectedId) || filtered[0];

  function clearFilters() {
    setQuery('');
    setCategory('All');
  }

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'touch' || event.button !== 0) return;
    panRef.current = {
      startX: event.clientX,
      scrollLeft: event.currentTarget.scrollLeft,
      pointerId: event.pointerId,
      dragged: false,
    };
  }

  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const pan = panRef.current;
    if (!pan || pan.pointerId !== event.pointerId) return;
    const delta = event.clientX - pan.startX;
    if (!pan.dragged && Math.abs(delta) < 6) return;
    if (!pan.dragged) {
      pan.dragged = true;
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    event.currentTarget.scrollLeft = pan.scrollLeft - delta;
  }

  function pointerUp(event: PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    if (panRef.current) panRef.current.pointerId = null;
    setDragging(false);
  }

  return (
    <div className="project-atlas">
      <div className="atlas-controls">
        <div className="atlas-search">
          <span aria-hidden="true">⌕</span>
          <label htmlFor="project-query" className="sr-only">
            Search projects, categories or technologies
          </label>
          <input
            id="project-query"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a signal…"
            autoComplete="off"
          />
        </div>
        <div className="atlas-view-toggle" role="group" aria-label="Project display">
          <button type="button" aria-pressed={view === 'map'} onClick={() => setView('map')}>
            <span aria-hidden="true">⌖</span> STAR MAP
          </button>
          <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}>
            <span aria-hidden="true">☷</span> INDEX
          </button>
        </div>
      </div>
      <div className="atlas-filters" role="group" aria-label="Filter project constellation">
        <button type="button" aria-pressed={category === 'All'} onClick={() => setCategory('All')}>
          ALL SIGNALS
        </button>
        {categories.map((item) => (
          <button
            type="button"
            key={item}
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="atlas-map-topline">
        <span aria-live="polite" aria-atomic="true">
          {String(filtered.length).padStart(2, '0')} / {projects.length} SIGNALS VISIBLE
        </span>
        <span>
          {view === 'map'
            ? 'DRAG / SWIPE TO EXPLORE · SELECT TO OPEN'
            : 'SELECT A MISSION TO INSPECT'}
        </span>
      </div>
      {filtered.length === 0 ? (
        <div className="atlas-empty" role="status">
          <span aria-hidden="true">⌖</span>
          <h3>No signal at these coordinates.</h3>
          <p>Try a different project, technology, or constellation.</p>
          <button type="button" className="button" onClick={clearFilters}>
            CLEAR FILTERS <span aria-hidden="true">↗</span>
          </button>
        </div>
      ) : view === 'map' ? (
        <div
          ref={viewportRef}
          className={`atlas-viewport${dragging ? ' is-dragging' : ''}`}
          tabIndex={0}
          role="region"
          aria-label="Project constellation. Swipe or drag horizontally; use Tab to visit every project."
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
          onPointerUp={pointerUp}
          onPointerCancel={() => {
            panRef.current = null;
            setDragging(false);
          }}
          onClickCapture={(event) => {
            if (panRef.current?.dragged) {
              event.preventDefault();
              event.stopPropagation();
              panRef.current = null;
            }
          }}
        >
          <div className="atlas-stage">
            <svg
              className="atlas-grid"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="atlas-grid-pattern"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M 10 0 L 0 0 0 10" fill="none" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#atlas-grid-pattern)" />
              <circle cx="47" cy="44" r="26" className="atlas-orbit" />
              <circle cx="47" cy="44" r="41" className="atlas-orbit" />
            </svg>
            <svg
              className="atlas-connections"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {connections
                .filter(([from, to]) => visibleIds.has(from.id) && visibleIds.has(to.id))
                .map(([from, to]) => (
                  <line
                    key={`${from.id}-${to.id}`}
                    x1={from.coordinates.x}
                    y1={from.coordinates.y}
                    x2={to.coordinates.x}
                    y2={to.coordinates.y}
                    style={{ stroke: from.visualIdentity.color }}
                  />
                ))}
            </svg>
            <div className="atlas-axis atlas-axis-x" aria-hidden="true">
              <span>36.900</span>
              <span>37.269</span>
              <span>37.638</span>
            </div>
            <div className="atlas-axis atlas-axis-y" aria-hidden="true">
              <span>17.29</span>
              <span>18.36</span>
            </div>
            {filtered.map((project) => (
              <Link
                key={project.id}
                href={`/missions/${project.id}`}
                className={`project-node shape-${project.visualIdentity.shape}${project.featured ? ' featured' : ''}${selected?.id === project.id ? ' is-selected' : ''}`}
                style={
                  {
                    left: `${project.coordinates.x}%`,
                    top: `${project.coordinates.y}%`,
                    '--node-color': project.visualIdentity.color,
                  } as CSSProperties
                }
                onMouseEnter={() => setSelectedId(project.id)}
                onFocus={() => setSelectedId(project.id)}
                onClick={() => onDiscover?.(project.id)}
                draggable={false}
                data-cursor="SCAN"
              >
                <span className="project-celestial" aria-hidden="true">
                  <i className="project-orbit" />
                  <span>{project.visualIdentity.symbol}</span>
                </span>
                <span className="project-node-name">{project.title}</span>
                <span className="project-node-code">{project.codename}</span>
                <span className="sr-only">. {project.category}. Open mission file.</span>
              </Link>
            ))}
            <span className="atlas-sector-label" aria-hidden="true">
              THE KNOWN UNIVERSE / SECTOR 369
            </span>
          </div>
        </div>
      ) : (
        <nav className="project-index" aria-label="Project index">
          {filtered.map((project, index) => (
            <Link
              key={project.id}
              href={`/missions/${project.id}`}
              className="project-index-row"
              style={{ '--node-color': project.visualIdentity.color } as CSSProperties}
              onFocus={() => setSelectedId(project.id)}
              onMouseEnter={() => setSelectedId(project.id)}
              onClick={() => onDiscover?.(project.id)}
            >
              <span className="project-index-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="project-index-symbol" aria-hidden="true">
                {project.visualIdentity.symbol}
              </span>
              <span className="project-index-title">
                <strong>{project.title}</strong>
                <small>{project.description}</small>
              </span>
              <span className="project-index-category">{project.category}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
      )}
      {selected && (
        <div className="atlas-telemetry">
          <div>
            <span className="eyebrow">OBJECT LOCKED</span>
            <strong>{selected.title}</strong>
            <span className="atlas-object-status">
              <i className="status-dot" />
              {selected.status.toUpperCase()}
            </span>
          </div>
          <div>
            <span className="eyebrow">CLASS / SIGNAL</span>
            <p>
              {selected.category} <span aria-hidden="true">·</span>{' '}
              {selected.technologies.join(' / ')}
            </p>
          </div>
          <Link
            className="atlas-open"
            href={`/missions/${selected.id}`}
            onClick={() => onDiscover?.(selected.id)}
          >
            OPEN MISSION FILE <span aria-hidden="true">↗</span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default ProjectAtlas;
