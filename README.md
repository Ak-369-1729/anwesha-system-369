# ANWESHA // SYSTEM 369

A personal portfolio built as a continuous engineering expedition: an astronomical identity core becomes a project constellation, security topology, engine room, orbital laboratory, flight path, and final transmission.

Built with Next.js, React and strict TypeScript. Original procedural Canvas and SVG artwork carries the narrative without requiring WebGL or downloaded artwork. Fonts are bundled locally through Fontsource.

## Run locally

Use Node.js 20.9 or later and npm. An installed Google Chrome browser is used by the browser tests.

```sh
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). For a clean dependency install after the lockfile exists, use `npm ci`.

```sh
npm run lint
npm run typecheck
npm run build
npm start
npm test
```

`build` produces the complete static website in `out/`. `start` serves that export with the included dependency-free Node server; build first. Browser tests automatically start that server or reuse one already running on port 3000. To inspect a failure, run `npx playwright show-report`.

`next.config.ts` bounds experimental static-export concurrency to two workers and one page per worker, reducing Windows filesystem and memory contention. The normal npm commands above remain unchanged.

Tests use the installed Chrome channel, so no Playwright browser download is required on a machine with Chrome. If Chrome is unavailable, install it or change `channel` in `playwright.config.ts` to an available Playwright browser after installing that browser with the appropriate Playwright command.

No runtime secrets, API keys, or database are required. For deployment, optionally copy .env.example to .env.local and set NEXT_PUBLIC_SITE_URL to the final HTTPS origin for absolute social-image metadata. The build generates public/og.png from the original SVG automatically. The local static server optionally accepts `PORT` (default `3000`) and `HOST` (default `127.0.0.1`). Configure these with your shell or hosting platform, rather than committing them.

## What is implemented

- Twelve connected narrative chapters, with one persistent scene that changes geometry as the visitor travels.
- A searchable, filterable project constellation with drag/swipe navigation, keyboard-accessible mission objects, and a conventional index alternative.
- Seventeen statically generated mission-file routes with architecture, design decisions, challenges, evaluation questions, source links and evidence status.
- An interactive security sandbox: inspect ten network nodes, compare telemetry, and isolate the node crossing its trust boundary.
- A technology engine linked to the project records, expandable research logs, flight path, milestone vault, current-mission feed, black-hole interlude, human introduction, and contact interface.
- Explorer and Recruiter modes; recruiter mode surfaces the profile and removes the cinematic opening and interludes.
- A searchable command palette opened with Ctrl/Cmd + K, plus a controlled terminal with history and discovery commands.
- Locally persisted signal awards, discovery levels and preferences. Awards are deduplicated by discovery ID. The experience still works when browser storage is unavailable.
- Sound off by default, a user-controlled reduced-motion setting, and support for the operating system’s motion preference.
- Responsive mission HUD, mobile navigation, semantic content, visible keyboard focus, modal focus management, a real 404 page, metadata, favicon, and an OpenGraph image.
- Mail and social links supplied by Anwesha. The transmission form prepares a draft in the visitor’s email app; it does not claim to send a message.

## Content and evidence

The portfolio combines the creative brief with Anwesha’s existing GitHub portfolio and project documentation. Each mission distinguishes a **source-available project**, an **owner-documented portfolio record**, or an explicitly **proposed concept record**. Repository documentation supports the features and limitations it describes; it does not establish production adoption, independently measured outcomes, or an individual contribution unless the source says so.

The flight path and vault include owner-documented career milestones, including the Adxania Cyber Solutions internship from August 2025 to February 2026 and IEEE, National Children’s Science Congress and INSPIRE MANAK references. Source links remain attached to those records. Research logs distinguish documented research from exploratory interests and proposed experiments.

Editorial sources include the existing [project catalogue](https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/projects.ts), [timeline](https://github.com/Ak-369-1729/anwesha_portfolio/blob/main/src/data/timeline.ts), [BoundaryLens README](https://github.com/Ak-369-1729/BoundaryLens/blob/main/README.md), and [ChronoHeritage README](https://github.com/Ak-369-1729/Chrono_Heritage/blob/main/README.md).

The résumé action downloads `public/resume.html`, a printable HTML profile compiled from the supplied contact details and owner-maintained records. It is a generated portfolio résumé; no separate official CV file was provided. To use an approved PDF instead, add it to `public/` and update `profile.resume`.

### Edit the portfolio

The central editorial file is `src/data/portfolio.ts`, with its interfaces in `src/types/portfolio.ts`.

| Export           | Controls                                                                                                                                |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `profile`        | Name, roles, introduction, human copy, email, GitHub, LinkedIn and résumé path                                                          |
| `projects`       | Mission records, evidence, source citations, categories, technologies, diagrams, source/demo links, map coordinates, symbols and colors |
| `categories`     | Constellation filters                                                                                                                   |
| `skills`         | Engine-room modules and connected project IDs                                                                                           |
| `research`       | Hypotheses, problems, proposed systems and experiments                                                                                  |
| `milestones`     | Flight-path entries                                                                                                                     |
| `achievements`   | Vault records and evidence state                                                                                                        |
| `currentMission` | Current transmission copy                                                                                                               |

Each project needs a stable unique `id`; its route is `/missions/<id>/`. Coordinates are percentages of the constellation stage. Keep labels separated, and keep node coordinates away from the stage’s outer edges. Add a local asset to `public/` and reference it with a root-relative URL, such as `/resume.pdf`.

Use the existing `Concept record`, `Portfolio record`, and `Source available` statuses consistently with each record’s evidence and citations. Add roles, dates, implementation details, measurements and working URLs when supported by the source. Keep illustrative architecture and proposed evaluation separate from documented behavior. Rebuild after editing: this is a static export.

## Deployment

Deploy the **contents of `out/`** to any static host with HTTPS support. No application server or API environment is needed.

1. Install dependencies with `npm ci`.
2. Run `npm run lint`, `npm run typecheck`, and `npm run build`.
3. Run `npm test` against the production export.
4. Upload `out/` or configure your host’s build command as `npm run build` and its publish directory as `out`.
5. Configure directory indexes, so `/missions/nexus/` serves `/missions/nexus/index.html`.
6. Configure the host’s not-found document as `404.html`, preserving HTTP status 404. Avoid rewriting all missing paths to the homepage.
7. Cache `/_next/static/` with `public, max-age=31536000, immutable`; serve HTML with revalidation or no-cache. The included local server demonstrates these rules.

Set `NEXT_PUBLIC_SITE_URL` to the production origin before building for deployment. Review owner-maintained source records when publishing substantive content changes. The repository does not contain hosting credentials or a forced publishing integration.

## Accessibility

The core information is real HTML and remains available without animation, Canvas, or WebGL. Projects have a text index alternative. All mission nodes, controls and research disclosures work with a keyboard. Dialogs use native modal semantics and restore focus; command navigation moves focus to its destination. Native mouse and touch behavior remain available alongside the optional cursor label.

Both `prefers-reduced-motion` and the HUD toggle reduce motion. Disabling persistence or sound does not block browsing. The contact form has explicit labels and validation and accurately describes its email-draft behavior.

The Playwright suite checks keyboard flows, storage failure, score deduplication, reduced motion, 390/768/1440 px layouts, true 404s, and serious/critical WCAG A/AA issues with axe. Automated checks complement manual keyboard, screen-reader and device review; they do not prove full accessibility compliance.

## Performance

The static export serves prerendered content with locally bundled fonts. The background uses a single Canvas context, a capped pixel ratio, bounded geometry, animation cleanup, and visibility-aware scheduling. Security, terminal and command-palette components load dynamically. Expensive artwork is procedural; there are no autoplay videos, giant textures, trackers, third-party font requests, or multiple animation frameworks.

Local Lighthouse 13.6.0 measured **97 Performance / 100 Accessibility / 100 Best Practices / 100 SEO** on the production export with simulated mobile network conditions and 4× CPU slowdown. The final source-backed export passed all 13 browser checks. These are local measurements, not guarantees for every device or host. Re-measure after changing content or hosting. See `docs/validation.md` for the validation record and source distinctions.

See `docs/architecture.md` for the component boundaries, state model, rendering decisions and maintenance notes.
