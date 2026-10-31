# Architecture and maintenance

## Rendering

The project uses the Next.js App Router with `output: 'export'` and `trailingSlash: true`. Build output is static HTML, CSS, fonts, JavaScript and image assets. The homepage and mission dossiers are prerendered; browser-only behavior is isolated in client components. Mission routes are generated from the central project catalogue at build time. There is no server-side session, private API, database, or mail-delivery service.

Experimental export settings bound generation to two workers and one page per worker to reduce Windows filesystem and memory contention. The regular `npm run dev`, `npm run build`, and `npm start` commands are unchanged.

```text
src/
  app/                    App shell, routes, metadata, global styling and errors
  components/
    Experience.tsx        Narrative shell, navigation, chapter observer and dialogs
    CosmicScene.tsx       One persistent procedural astronomical scene
    ProjectAtlas.tsx      Constellation search, filters, panning and index
    SecurityLab.tsx       Isolated educational threat-containment simulation
    Terminal.tsx          Allowlisted frontend commands and command history
    CommandPalette.tsx    Searchable modal navigation and preference actions
  data/portfolio.ts       Editable editorial source
  hooks/useExperience.ts  Local discovery and preference store
  types/portfolio.ts      Strict editorial models
public/                   Original static artwork and printable profile
scripts/serve.mjs          Local production-export server
tests/experience.spec.ts  Browser, responsive and accessibility checks
```

## Continuous scene

`Experience` observes the current chapter with `IntersectionObserver`. The chapter index feeds the persistent `CosmicScene` rather than mounting an unrelated visual background for every section. A bounded set of points moves between an astronomical core, project space, security topology, circuit geometry, laboratory orbits, flight path and anomaly. The final chapter deliberately quiets the visual system.

Canvas draws original projected geometry, so the scene needs no WebGL context, mesh downloads or GPU-specific fallback. The actual portfolio remains semantic HTML. If Canvas is unavailable, the content, project map, links and simulations still function.

The draw loop caps pixel ratio, limits ambient update frequency, pauses while the document is hidden, and cleans up listeners and frames on unmount. Reduced motion uses static chapter states. SVG supplies inspectable project and network paths. CSS handles small interface transitions and the black-hole artwork.

## Editorial model

`portfolio.ts` is the single source for the owner’s profile, projects, skills, research, milestones, achievements and current transmission. `Project` contains IDs, descriptions, categories, technologies, role, problem, solution, architecture, decisions, challenges, impact, lessons, links, status, year, coordinates, constellation, visual identity, evidence and optional source citations.

The editorial model combines owner-maintained GitHub portfolio records and project READMEs with explicitly proposed designs from the creative brief. `Source available`, `Portfolio record`, and `Concept record` distinguish these states in the model and UI. A source can establish documented features or a self-reported milestone without establishing an independently measured result. Personal contributions are specified only when the cited source supports them. Timeline and achievement records retain source links; research logs distinguish portfolio research from exploratory interests.

The generated HTML résumé uses the same owner-maintained profile and career records. It is a printable portfolio résumé rather than a separately supplied official CV file. A PDF can replace it by changing `profile.resume` without altering interface components.

Changing project IDs changes URLs and local award keys. Treat IDs as durable. Connected technology modules reference project IDs; keep those references valid. Editing data requires a rebuild because routes are generated statically.

## Local state

`useExperience` uses `useSyncExternalStore` with a stable server snapshot. This avoids hydration mismatches when browser preferences differ from the initial HTML. The store persists under `system369.experience.v1` in localStorage, synchronizes storage events across tabs, and catches storage read/write failures.

The record stores:

- Award IDs and positive point values, deduplicated per discovery.
- Boot state, Explorer/Recruiter mode, optional sound, and a nullable motion override.

The motion override is separate from the system preference. With no override, `matchMedia('(prefers-reduced-motion: reduce)')` controls the experience. Signal level is derived from the sum of awards. No account or network tracking is involved.

Sound is opt-in. The browser creates a short, quiet Web Audio tone only after a user gesture enables it. Oscillators disconnect after use and the audio context closes during cleanup.

## Interaction boundaries

Project objects are real links to mission routes. Dragging a desktop constellation suppresses accidental link activation only after a movement threshold. Touch scrolling stays native, and a text index offers a familiar alternative.

The threat sandbox is an educational simulation. One node exhibits a policy violation, anomalous egress and repeated denied requests. Inspecting healthy nodes does not isolate them or award points. Correct containment revokes the affected node’s displayed edges; restarting chooses another node while the discovery store prevents repeated farming of the same award.

The terminal evaluates an explicit command allowlist. It cannot execute arbitrary JavaScript, shell commands or remote scans. Command history is local to the mounted terminal. The command palette uses native `<dialog>` behavior, searchable options, Escape, arrow navigation and destination focus management.

The transmission form validates a subject and message, then opens a `mailto:` draft with URL-encoded content. The UI accurately says the visitor must send through their email app. If a delivery service is added, put secrets in that service’s environment, implement abuse protection there, and show a sent state only after an acknowledged response.

## Static server and hosting

`scripts/serve.mjs` is a small production-export server for local review. It supports GET and HEAD, serves directory `index.html` files, sends useful content types, caches hashed Next assets immutably, and returns the exported 404 document with a real 404 status. URL decoding, resolved-path checks and realpath checks prevent escaping `out/`, including through symlinks. Unsupported methods return 405.

The website does not need this server when deployed to a static host. Publish `out/`, enable directory indexes and configure `404.html` as the error document. HTML should revalidate; `/_next/static/` is content-versioned and can be immutable. `NEXT_PUBLIC_SITE_URL` supplies the production origin for absolute metadata URLs; set it before the final deployment build.

## Verification and limits

Required local checks are `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test`. Browser tests exercise project discovery, dossier navigation, command keyboard flows, terminal commands, healthy-versus-anomalous isolation, award persistence, unavailable storage, modes, motion preferences, responsive width bounds, axe WCAG A/AA checks, static MIME types and real 404 responses.

Manual review should cover desktop, tablet and phone layouts, keyboard order, high zoom, contrast, actual email-app behavior and the owner’s approved content. Lighthouse scores depend on the final deployment, device and network; no target score is asserted merely because a build passes. Avoid adding large scene libraries, third-party requests or autoplay media without measuring their effect.
