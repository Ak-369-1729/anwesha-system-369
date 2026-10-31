'use client';

import Link from 'next/link';
import { CSSProperties, PointerEvent, useEffect, useId, useMemo, useRef, useState } from 'react';
import { categories, projects } from '@/data/portfolio';
import type { ProjectCategory } from '@/types/portfolio';
import './projects/atlas-controls.css';

type ProjectAtlasProps = { onDiscover?: (id: string) => void; compact?: boolean };
type PanState = {
  startX: number;
  startY: number;
  scrollLeft: number;
  scrollTop: number;
  pointerId: number | null;
  dragged: boolean;
};

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
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [geometry, setGeometry] = useState({ width: 940, height: 620 });
  const viewportRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<PanState | null>(null);
  const instanceId = useId().replaceAll(':', '');
  const queryId = `${instanceId}-project-query`;
  const patternId = `${instanceId}-atlas-grid`;
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
  const angle = (Math.abs(rotation) * Math.PI) / 180;
  const transformedWidth =
    (geometry.width * Math.cos(angle) + geometry.height * Math.sin(angle)) * zoom;
  const transformedHeight =
    (geometry.width * Math.sin(angle) + geometry.height * Math.cos(angle)) * zoom;

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver(([entry]) => {
      const mobile = window.matchMedia('(max-width: 600px)').matches;
      const width = Math.max(mobile ? 810 : 940, entry.contentRect.width);
      const height = mobile ? 570 : 620;
      setGeometry((previous) =>
        previous.width === width && previous.height === height ? previous : { width, height },
      );
    });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [view, filtered.length]);

  function clearFilters() {
    setQuery('');
    setCategory('All');
  }

  function changeZoom(delta: number) {
    setZoom((previous) => Math.min(1.5, Math.max(0.8, Math.round((previous + delta) * 10) / 10)));
  }

  function resetMap() {
    setZoom(1);
    setRotation(0);
    requestAnimationFrame(() => {
      const viewport = viewportRef.current;
      if (viewport) {
        viewport.scrollTo({
          left: Math.max(0, (viewport.scrollWidth - viewport.clientWidth) / 2),
          top: Math.max(0, (viewport.scrollHeight - viewport.clientHeight) / 2),
          behavior: 'instant',
        });
      }
    });
  }

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'touch' || event.button !== 0) return;
    panRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: event.currentTarget.scrollLeft,
      scrollTop: event.currentTarget.scrollTop,
      pointerId: event.pointerId,
      dragged: false,
    };
  }

  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const pan = panRef.current;
    if (!pan || pan.pointerId !== event.pointerId) return;
    const delta = event.clientX - pan.startX;
    const deltaY = event.clientY - pan.startY;
    if (!pan.dragged && Math.hypot(delta, deltaY) < 6) return;
    if (!pan.dragged) {
      pan.dragged = true;
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    event.currentTarget.scrollLeft = pan.scrollLeft - delta;
    event.currentTarget.scrollTop = pan.scrollTop - deltaY;
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
          <label htmlFor={queryId} className="sr-only">
            Search projects, categories or technologies
          </label>
          <input
            id={queryId}
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
      {view === 'map' && filtered.length > 0 && (
        <div
          className="atlas-spatial-controls"
          role="group"
          aria-label="Map zoom and orbit controls"
        >
          <div className="atlas-spatial-buttons">
            <button type="button" onClick={() => changeZoom(-0.1)} disabled={zoom <= 0.8}>
              <span aria-hidden="true">−</span>
              <span className="sr-only">Zoom map out</span>
            </button>
            <button type="button" onClick={() => changeZoom(0.1)} disabled={zoom >= 1.5}>
              <span aria-hidden="true">+</span>
              <span className="sr-only">Zoom map in</span>
            </button>
            <span className="atlas-spatial-divider" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setRotation((old) => Math.max(-30, old - 15))}
              disabled={rotation <= -30}
            >
              <span aria-hidden="true">↶</span>
              <span className="sr-only">Orbit map counterclockwise</span>
            </button>
            <button
              type="button"
              onClick={() => setRotation((old) => Math.min(30, old + 15))}
              disabled={rotation >= 30}
            >
              <span aria-hidden="true">↷</span>
              <span className="sr-only">Orbit map clockwise</span>
            </button>
          </div>
          <output className="atlas-spatial-position" aria-live="polite" aria-atomic="true">
            <span className="sr-only">Map zoom </span>
            {Math.round(zoom * 100)}%<span aria-hidden="true"> / </span>
            <span className="sr-only"> and orbit </span>
            {rotation}°
          </output>
          <button type="button" className="atlas-spatial-reset" onClick={resetMap}>
            RESET MAP
          </button>
        </div>
      )}
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
          data-cursor="DRAG"
          className={`atlas-viewport${dragging ? ' is-dragging' : ''}`}
          tabIndex={0}
          role="region"
          aria-label="Project constellation. Swipe or drag to explore; use the zoom and orbit controls, or Tab to visit every project."
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
          <div
            className="atlas-transform-space"
            style={{ width: transformedWidth, height: transformedHeight }}
          >
            <div
              className="atlas-stage atlas-spatial-stage"
              style={{
                width: geometry.width,
                minWidth: geometry.width,
                height: geometry.height,
                transform: `translate(-50%, -50%) scale(${zoom}) rotate(${rotation}deg)`,
              }}
            >
              <svg
                className="atlas-grid"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <pattern id={patternId} width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill={`url(#${patternId})`} />
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
                      transform: `translate(-50%, -50%) rotate(${-rotation}deg)`,
                    } as CSSProperties
                  }
                  onMouseEnter={() => setSelectedId(project.id)}
                  onFocus={() => setSelectedId(project.id)}
                  onClick={() => onDiscover?.(project.id)}
                  draggable={false}
                  data-cursor="OPEN"
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
