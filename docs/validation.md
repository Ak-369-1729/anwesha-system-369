# Validation record — observatory edition

The second pass is a redesign of the existing System 369 repository, not a new project. Portfolio data, contact channels, mission routes, and useful interactions were retained while the primary presentation changed to the continuous story.

## Observatory edition — 1 November 2026

- Production build, strict TypeScript, ESLint and formatting: passed.
- All 43 browser checks passed against the optimized static export.
- All 17 scenes were checked with field instruments closed and open at 1366 × 768, 768 × 1024, 390 × 844, 320 × 568 and 844 × 390. Titles clear the header and navigation; instruments clear navigation and replace the title on narrow screens.
- Additional interaction checks cover actual WebGL rotation/reset, drag input, native project-satellite links, selecting a skill node, focus restoration, and the complete WebGL-unavailable path.
- Both skies, Quick Mode, all 17 mission routes, containment, discoveries, storage failure, reduced motion, palette, terminal and no-JavaScript navigation remain covered. No serious or critical axe violations were found in the tested surfaces.
- The loading-screen convention was removed for this static experience: semantic content now paints directly and remains visible without JavaScript. Story restoration waits for the persisted experience state before taking control of scroll.
- Screenshots were visually reviewed for the night/day opening, mobile opening, skill constellation, project satellites, cyber world and mirror. Local browser checks do not replace physical-device or deployed-site review.

The v2 Lighthouse score below is historical and must not be presented as the score of the new Three.js edition.

## V2 release verification (historical)

**Final integrated validation: passed, 31 October 2026.**

- Production export: 20 prerendered pages, including all 17 preserved mission routes.
- Strict TypeScript, ESLint, and formatting: passed.
- Browser regression: all 35 checks passed against the final optimized production export.
- Accessibility: no serious or critical axe violations across Story, Quick, mission pages, and interactive scenes in both skies.
- Visual review: 1440 × 1000 desktop, 1280 × 800 laptop, 768 × 1024 tablet, and 390 × 844 mobile.
- Lighthouse 13.6.0: **99 Performance / 100 Accessibility / 100 Best Practices / 100 SEO**, simulated mobile network and 4× CPU slowdown, no warnings. FCP and LCP: 1.2 seconds; total blocking time: 70 ms; layout shift: zero.

The opening text paints without an opacity delay. Interactive panels load when the journey reaches them. Scene transitions retain their motion, and the reduced-motion alternative remains available.

The release checks cover lint, strict TypeScript, formatting, production export, browser regression, desktop/laptop/tablet/mobile layouts, both night and day, Story and Quick modes, project exploration, keyboard navigation, reduced motion, storage failure, accessible alternatives, and performance. Final results belong to this revision and must be recorded separately from the earlier design.

The original world renderer was reviewed at 1440 × 1000 and 390 × 844 during implementation, including night/day fields, code forest, rocket assembly, orbit, and the child/adult mirror. Those focused reviews informed corrections to cloud-gradient coordinates and mobile composition; they do not replace the integrated release checks.

## Historical reference: first version

The first version passed its production build, lint, strict TypeScript, and 13 browser checks. Its local Lighthouse 13.6.0 audit measured Performance 97, Accessibility 100, Best Practices 100, and SEO 100 using simulated mobile networking and 4× CPU slowdown.

These are historical results for the previous renderer and interface. They are not asserted as the scores of the redesigned world. A deployed audit and physical-device review remain distinct from local measurements.

## What changed and what must remain true

The narrative now uses one `1700svh` native scroll track, one fixed stage, and 17 structured scenes. The same girl, signal, and structural anchors carry the journey across field, code, machines, network, infrastructure, rocket, orbit, laboratory, memories, mirror, and final sky. Day/night changes the illustrated atmosphere and lighting over approximately 1.2 seconds, with an immediate reduced-motion alternative.

Story is the primary mode; Quick retains immediate access to every technical record and recruiter action. The project atlas keeps its search, filtering, focus, drag/swipe, index, and mission links, with zoom and orbit controls added. The security sandbox, command palette, controlled terminal, contact draft, local discoveries, source-backed data, and 17 static mission routes are preserved.

Canvas is decorative and has no exclusive essential content. The HTML story outline, Skip Story/Quick Mode, direct chapter navigation, Continue actions, semantic panels, and no-script project-route fallback must remain usable. No interaction may gate a project, résumé, or contact link.

## Content sources

The redesign leaves the factual editorial model intact. Contact details come from the owner. The creative brief supplies the symbolic narrative and project catalogue. Source-backed details and career records also draw on the existing GitHub portfolio’s project catalogue and timeline, plus READMEs such as BoundaryLens and ChronoHeritage.

The 17 mission files comprise three `Source available` projects, six `Portfolio record` entries, and eight `Concept record` designs. Five sourced career phases include the August 2025–February 2026 Adxania Cyber Solutions internship. Memory logs also include owner-documented IEEE SIGHT leadership, NCSC, INSPIRE–MANAK, and Google Cloud Arcade milestones. Research interests and proposed experiments remain labeled accurately.

The girl represents curiosity and the younger engineer symbolically. Her visual journey does not add invented dated childhood events, credentials, scientific results, or project outcomes.

The résumé remains a generated printable HTML profile compiled from owner records. The contact form opens an email draft and does not send mail. No login, cookies, analytics, backend database, API key, or external telemetry service is required. Preferences and discoveries stay local to the browser.

## Production configuration

Set `NEXT_PUBLIC_SITE_URL` to the deployed HTTPS origin before building. Publish the contents of `out/` with directory indexes and a real 404 fallback. Static generation is bounded to two workers and one page per worker, with retry handling for transient export failures.

Repeat accessibility and performance checks on the deployed site and representative physical devices after changing content, rendering, or hosting. The current validation status above must describe version 2 rather than inheriting version 1’s results.
