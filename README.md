# ANWESHA // SYSTEM 369

## How a question became an engineer

The second pass transforms the existing portfolio into one illustrated journey. A small girl follows a question from a quiet field through code, machinery, cybersecurity, infrastructure, launch, orbit, research, and memory. Her reflection becomes the present-day engineer near the end. The same signal and the same world objects carry the story between scenes.

**Story** is the primary experience. **Quick** immediately exposes Anwesha’s profile, projects, technical skills, experience, research, milestones, résumé, and contact channels. The original project data, 17 mission routes, contact links, security challenge, terminal, local discoveries, and static deployment model are retained.

Built with Next.js, React, strict TypeScript, original Canvas/SVG illustration, and a progressively loaded Three.js observatory. Archivo is bundled locally; IBM Plex Mono is reserved for technical readouts. There are no external character assets or autoplay videos. Every essential action also has a semantic HTML interface when WebGL is unavailable.

## Run locally

Use Node.js 20.9 or later and npm.

```sh
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). Use `npm ci` for a clean install from the committed lockfile.

```sh
npm run lint
npm run typecheck
npm run build
npm start
npm test
npm run format:check
```

`build` creates the complete static export in `out/`. `start` serves that export with the included dependency-free Node server; build first. Browser tests start the production server or reuse one already running on port 3000. Tests use the installed Google Chrome channel. If Chrome is unavailable, install it or configure an installed Playwright browser in `playwright.config.ts`. Use `npx playwright show-report` to inspect a test report.

No runtime secrets, database, or API keys are required. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin before the deployment build so metadata references the correct domain. `.env.example` documents this optional setting. Asset preparation generates `public/og.png` from the original SVG before development and production builds. The local static server also accepts `PORT` and `HOST`.

`next.config.ts` bounds experimental static generation to two workers and one page per worker, with a retry for transient export failures. These settings reduce Windows filesystem and memory contention without changing the normal npm commands.

## Observatory edition

The opening is a typographic poster, not a résumé hero. The journey now runs from the field and observatory into launch, orbit, skill constellations, project satellites, cybersecurity, research, memory, and the identity reveal. The girl remains in the illustrated world throughout.

- Drag the orbital model horizontally, or use its keyboard-accessible rotation/reset controls. Vertical touch movement remains native scrolling. The scroll-driven camera travels along a depth path; cursor parallax, gyroscopic rings, orbiting satellites and network packets animate the world. Moving targets pause for hover and keyboard selection.
- Skill labels in the constellation open the corresponding technical system. Project satellites open the same real mission routes as Quick Mode and the project index.
- The orbital sphere uses an original lighting, engraving, and scan shader. The network, orbit rings, satellites and solar panels are procedural geometry. These are portfolio visualizations, not live telemetry.
- A scene starts with its world visible. **Explore** opens its field instrument; Close or Escape returns to the world and restores focus. No interaction gates Continue or Quick Mode.
- Three.js is split into an optional client load. Its renderer caps resolution, pauses drawing when hidden, respects reduced motion, and disposes geometry/materials, observers, pointer handlers and the context on unmount. Canvas2D and semantic controls survive WebGL failure.

## The experience

- One native `1700svh` scroll track controls a fixed, full-viewport stage. Camera position, character pose, shared structural anchors, and the original signal change with fractional scroll progress; content is not presented as 17 stacked sections.
- Seventeen structured story scenes move from the night field to the next unexplored star. Optional interactions connect nodes, inspect machines, contain a threat, align telemetry, launch the rocket, open research logs, and unlock the door with a question. Continue and Quick Mode keep every destination accessible without completing a game.
- The original articulated protagonist looks, walks, reaches, reacts, and carries collected artifacts. The shield acquired through containment remains visible. The mirror and final two-figure scene complete the symbolic identity reveal.
- The celestial **Change Sky** control transforms night into day. The moon sets, the sun rises, stars fade, clouds appear, materials brighten, and shadows change over about 1.2 seconds. Day and night are authored palettes and environments; the choice persists and initially follows the system preference.
- The retained project atlas supports search, category filters, map/index views, drag or swipe, zoom, orbit rotation, hover telemetry, keyboard focus, and mission links.
- Mission dossiers remain real, statically generated routes with problem, architecture, technology, decisions, challenges, outcomes, learning, evidence, and source links.
- Quick Mode reuses the same editorial records and provides direct technical navigation. Switching modes preserves the existing local preference store and discovery history.
- Ctrl/Cmd + K opens the command palette. The optional terminal keeps an explicit command allowlist, history, navigation, and hidden discoveries; it cannot execute a shell or scan a remote system.
- Sound remains off by default. Reduced motion, visible focus, native modal behavior, a semantic story outline, and a no-script profile/project-route fallback support alternate ways through the work.

## Edit content and story

The portfolio records remain in `src/data/portfolio.ts`, with strict interfaces in `src/types/portfolio.ts`.

| Export           | Controls                                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------------------------- |
| `profile`        | Identity, introduction, institution, contact/social links, résumé path, and editorial sources              |
| `projects`       | Mission records, technology, architecture, outcomes, evidence, links, map coordinates, and visual identity |
| `categories`     | Constellation filters                                                                                      |
| `skills`         | Technical systems and connected project IDs                                                                |
| `research`       | Questions, hypotheses, proposed systems, methods, and accurate status                                      |
| `milestones`     | Career and engineering memory records                                                                      |
| `achievements`   | Owner-documented milestone logs and sources                                                                |
| `currentMission` | Current editorial transmission                                                                             |

Project IDs are durable URLs: `/missions/<id>/`. Keep technology-to-project references valid. Rebuild after editorial changes because the site is statically exported.

`src/story/chapters.ts` is the narrative score. Each chapter defines its ID, copy, accessible scene description, camera, character pose/focus, environment, day/night lighting, objects, interaction, transition, collectible, and ambient layer. Keep its 17-scene order aligned with the authored world transformations. `StoryPanels.tsx` supplies the semantic interactions; `world/` contains the original illustration and articulated character drawing. Story copy and portfolio facts are deliberately separate.

## Content and evidence

The redesign preserves the source distinctions from the first version. Three mission files are source-available projects, six cite owner-maintained portfolio records, and eight remain explicitly proposed concepts. A repository or portfolio entry supports documented features; it does not independently establish adoption, scientific validation, measured outcomes, or contribution scope.

Career and memory records include the owner-documented Adxania Cyber Solutions internship from August 2025 to February 2026, IEEE SIGHT leadership, NCSC and INSPIRE–MANAK recognition, and Google Cloud Arcade milestones. Research logs distinguish documented research directions from interests and proposed experiments. The girl’s journey is a symbolic narrative, not an invented dated childhood biography.

Editorial sources include the existing [project catalogue](https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/projects.ts), [timeline](https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/timeline.ts), [BoundaryLens README](https://github.com/Ak-369-1729/BoundaryLens/blob/main/README.md), and [ChronoHeritage README](https://github.com/Ak-369-1729/Chrono_Heritage/blob/main/README.md).

The résumé action downloads `public/resume.html`, a printable HTML profile compiled from owner-maintained records and supplied contact details. To use an approved PDF, add it to `public/` and update `profile.resume`.

The contact form prepares a URL-encoded `mailto:` draft. The visitor sends it through their email application; the website does not claim to send mail.

## Deployment

Publish the **contents of `out/`** to a static HTTPS host.

1. Install with `npm ci`.
2. Set `NEXT_PUBLIC_SITE_URL` to the final origin.
3. Run lint, type checking, the production build, and browser tests.
4. Configure the host’s build command as `npm run build` and publish directory as `out`, or upload the generated export.
5. Enable directory indexes so `/missions/nexus/` serves `/missions/nexus/index.html`.
6. Serve `404.html` for missing paths with HTTP status 404. Avoid rewriting every missing path to the homepage.
7. Cache hashed `/_next/static/` assets immutably and revalidate HTML. The included Node server demonstrates these rules.

The code contains no hosting credentials or required backend integration.

## Accessibility and performance

Essential information and controls are semantic HTML. Canvas is decorative and `aria-hidden`; project details, research, technical records, and contact actions have HTML interfaces. The story provides scene descriptions, chapter navigation, Continue, and Quick Mode. Without JavaScript, a profile and project index link to the prerendered mission pages. If Canvas is unavailable, the HTML controls and technical routes remain usable.

Reduced motion selects static world states, disables ambient movement and animated theme transitions, and retains scroll-based navigation. Native mouse, touch, keyboard, and visible focus remain available. Local storage failure does not block browsing. No login, cookies, analytics, or remote telemetry is required.

The illustrated backdrop renders bounded geometry using one Canvas2D context; the optional observatory uses one persistent WebGL context. It caps pixel ratio, uses fewer stars on mobile, updates quiet scenes at 30 fps and moving transitions at up to 60 fps, pauses when the document is hidden, and removes listeners and frames when unmounted. Quick Mode unmounts the world. Security, terminal, command-palette, and Quick Mode interfaces are split into separate loads.

Version 2 is measured separately from the first version. See `docs/validation.md` for the current release-check record; the earlier version’s Lighthouse result is historical, not a performance claim for the redesigned renderer. Repeat performance and accessibility audits on the deployed site and representative devices.

See `docs/architecture.md` for the audit decisions, state boundaries, continuous-scene model, and maintenance guidance.

## Release verification

Version 2 measured 99 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO in a local mobile Lighthouse 13.6.0 audit with 4× CPU slowdown. Production build, TypeScript, lint, formatting, and 35 browser checks pass. See `docs/validation.md` for scope and the distinction between local measurements and deployed-device testing.
