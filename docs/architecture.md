# Architecture and maintenance — second pass

## Audit decisions

The first version already had useful editorial records, mission routes, accessible project controls, a genuine security simulation, a controlled terminal, persistent discoveries, and a working static export. These remain the technical foundation of version 2.

Its visual continuity was weaker than its component continuity: chapter observers changed an abstract canvas behind independent, vertically stacked blocks. The large name opening revealed the protagonist before a story existed, and there was no day environment. The second pass removes the old `CosmicScene`, replaces the stacked narrative shell, and prunes its unused styling. The constellation, dossier routes, security behavior, data, links, and integrations are reused rather than rebuilt.

The new primary experience is one fixed illustrated stage driven by a single native scroll track. A persistent girl, one signal, and shared structural anchors make the transitions causal. Quick Mode carries the direct technical presentation and recruiter actions, so the cinematic route does not gate information.

## Rendering and file boundaries

Next.js App Router uses `output: 'export'` and `trailingSlash: true`. The homepage, not-found document, and 17 mission pages are prerendered. Browser state stays inside client components; there is no server session, database, private API, or mail service. Export concurrency is bounded to two workers and one page per worker, with a retry for transient failures.

```text
src/
  app/                         Routes, metadata, shared styles, errors, sky bootstrap
  components/
    Experience.tsx             Stable entry point into the existing portfolio
    story/
      StoryExperience.tsx      Mode shell, chapter controls, dialogs, progress constellation
      StoryPanels.tsx          Semantic interactions and chapter-specific records
      story.css                Bespoke night/day story interface
    world/
      StoryWorld.tsx           Canvas lifecycle and fractional scroll input
      renderWorld.ts           Shared environment, camera, terrain, rocket, mirror, signal
      Character.ts             Original articulated protagonist and adult reflection
      geometry.ts              Small drawing and interpolation primitives
    hud/                       Celestial theme control and shared sky bridge
    quick-mode/                Immediate technical profile using the preserved data
    ProjectAtlas.tsx           Search, filters, drag/swipe, zoom, orbit, text index
    SecurityLab.tsx            Preserved educational containment simulation
    Terminal.tsx               Explicit command allowlist and history
    CommandPalette.tsx         Searchable native modal and preference actions
  story/chapters.ts             Structured narrative score and navigation aliases
  data/portfolio.ts            Existing editorial source and evidence states
  hooks/
    useStoryProgress.ts         Native scroll mapping, restoration, chapter snapshots
    useSky.ts                   System-aware, persistent day/night preference
    useExperience.ts            Existing discoveries, sound, motion, and mode store
  types/portfolio.ts            Editorial interfaces
public/                         Original SVG assets and printable résumé
scripts/                        Asset preparation and local static-export server
tests/                          Browser, responsive, accessibility, and server checks
```

## One world, not a section stack

`StoryExperience` owns one `1700svh` track and a fixed viewport stage. `useStoryProgress` converts native window scroll into fractional chapter units from 0 to 16. A mutable ref supplies continuous input to the renderer, while React receives only chapter and coarse local-progress snapshots. This avoids rerendering the entire interface on every animation frame.

`chapters.ts` describes copy, accessible scene text, camera offsets/zoom, character pose/focus, environment, day/night lighting, shared objects, interaction, transition, collectible, and ambient layer. The order is an authored narrative contract: field, signal, forest, workshop, failure, cybersecurity, infrastructure, rocket, launch, space, constellation, research, door, memories, mirror, present, and the next question.

The renderer interpolates the same structural anchors between these locations. Grass and branches become conductive edges, machines become network nodes and service towers, city modules assemble into a rocket, and orbital artifacts become laboratory and memory lights. The signal keeps its identity throughout. Rocket ascent moves the hull, ground, and clouds together; the mirror introduces an adult reflection while the girl remains visible.

The protagonist is procedural vector drawing with articulated limbs and a persistent copper scarf, field jacket, satchel, and collected shield. Pose comes from chapter metadata, scroll movement, cursor attention, idle time, and explicit interaction reactions. The storybook figure is original and symbolic; it does not represent a photograph or a factual dated biography.

Canvas2D is an intentional rendering choice. It supplies the authored depth, parallax, geometry, and body language without loading a mesh pipeline or requiring WebGL. The canvas carries atmosphere and motion; semantic HTML carries every essential fact and action. If drawing is unavailable, the chapter controls, Quick Mode, and dossier routes remain useful.

## Day and night

`useSky` follows `prefers-color-scheme` until the visitor selects a sky. It persists the override under `system369.sky.v2`, synchronizes cross-tab storage changes, and catches unavailable storage. The layout’s early bootstrap applies the selected sky before hydration; `SkyBridge` also applies the preference on mission routes.

The celestial control changes both interface tokens and the illustrated world. Over approximately 1.2 seconds, the moon sets, the sun rises, stars fade, clouds enter, the atmosphere warms, terrain and metal materials change, and the character’s shadow shifts. Light mode uses warm paper, sky, graphite, cobalt, and sunlight; night mode uses deep sky, moonlight, and quiet signal illumination. Reduced motion resolves the new sky immediately.

## Modes, progress, and artifacts

The UI calls the modes Story and Quick. The existing `system369.experience.v1` record intentionally keeps its `explorer` and `recruiter` values as internal aliases, preserving preferences from the first version. Story is the default; Quick immediately renders profile, selected projects, the full project index, technology connections, experience, research, milestones, résumé, and contact actions. It unmounts the world rather than hiding an active animation loop.

`useExperience` retains a stable `useSyncExternalStore` server snapshot, deduplicated award IDs, sound, boot state, and a nullable motion override. With no motion override, the system’s reduced-motion preference controls behavior. Storage failure falls back to an in-memory visit. The sky has a separate store, and `useStoryProgress` stores the current journey position in session storage under `system369.story.position.v2`.

The girl receives symbolic artifacts through optional discoveries. Correct containment reuses the existing `cyber-threat` award, which also gives her the visible shield. The footer’s collected symbols and chapter constellation provide quiet progress feedback. Navigation aliases preserve familiar hashes such as `#universe`, `#lab`, and `#flight-path`, mapping them to the corresponding story destination or Quick section. No challenge blocks Continue or direct navigation.

Sound stays opt-in and off by default. Quiet Web Audio feedback only follows an enabling gesture; nodes disconnect after use and the audio context closes on cleanup.

## Preserved interaction boundaries

The project atlas retains real links to `/missions/<id>/`, now with zoom and orbit controls. Dragging suppresses accidental activation after a movement threshold; touch scrolling remains native, keyboard focus can reach every object, and an index offers a text alternative. Dossiers remain standalone pages rather than generic pop-up cards and keep their architecture, decisions, sources, and evidence states.

Security remains a local educational model: node telemetry exposes anomalous egress and denied requests, healthy-node isolation is refused, correct containment updates the topology, and resetting does not duplicate the discovery award.

The terminal evaluates an explicit command allowlist. It cannot execute JavaScript, shell commands, or remote scans. Its timeline, why, orbit, and launch responses navigate the story through the same controls as the interface. The palette uses native `<dialog>` semantics, keyboard search, Escape, focus restoration, and destination focus after closing.

The transmission form validates its fields and prepares a URL-encoded email draft. It reports draft preparation rather than a sent state. Email, GitHub, LinkedIn, and résumé links continue to come from the central profile data.

## Editorial records

The second pass does not invent new credentials or replace existing portfolio facts. `portfolio.ts` retains three source-available projects, six owner-documented portfolio records, and eight explicitly proposed concepts. Its five career phases, owner-documented internship, awards, leadership, research, and contact details retain their sources. A repository documents features and limitations; it does not establish independently measured adoption or contribution scope.

The generated HTML résumé remains a printable profile compiled from owner-maintained records. An approved PDF can replace it through `profile.resume` without changing interface components.

Project IDs are durable routes and discovery keys. Keep technology-to-project references valid. Narrative edits belong in `chapters.ts`; factual edits belong in `portfolio.ts`. Rebuild after editing either because the deployment is static.

## Lifecycle, accessibility, and delivery

The renderer caps resolution, reduces mobile star counts, updates quiet scenes at 30 fps and active transitions at up to 60 fps, pauses when the document is hidden, and removes its frames and listeners on unmount. Reduced motion draws static states when progress or preferences change. Terminal, palette, security, and Quick Mode interfaces are separately loaded.

A semantic journey outline describes all scenes to assistive technology. Chapter controls, Continue, Skip Story/Quick Mode, visible focus, and HTML records provide alternatives to cinematic motion. The no-script fallback renders the profile, project descriptions, mission links, email, and résumé; mission routes themselves are prerendered. Essential information is never available only in canvas.

`scripts/serve.mjs` serves the static export for local review. It supports GET/HEAD, directory indexes, useful MIME types, immutable hashed assets, and real 404 status. Decoding, resolved-path, and realpath checks prevent traversal outside `out/`. A static host can serve the same files without this server. Set `NEXT_PUBLIC_SITE_URL` before the final build, publish `out/`, enable directory indexes, and preserve `404.html` as a true not-found response.

Release checks include lint, strict type checking, formatting, production export, browser regression, four viewport classes, both skies and modes, project navigation, keyboard behavior, local storage failure, reduced motion, accessibility scanning, and performance measurement. The validation document records measured results; a result from the first version is not automatically a result for version 2.
