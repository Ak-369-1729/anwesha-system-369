# Validation record — observatory edition

The second pass is a redesign of the existing System 369 repository, not a new project. Portfolio data, contact channels, mission routes, and useful interactions were retained while the primary presentation changed to the continuous story.

## Production refinement — 1 November 2026

All **68 production browser checks passed** against the final static export: 47 retained interaction/fallback checks and 21 production checks. ESLint, strict TypeScript, formatting and the production build pass. The export contains 23 generated routes, including all 17 mission files, the Engineering Profile, robots and sitemap.

The responsive matrix covers **320×568, 360×640, 375×667, 390×844, 412×915, 430×932, 540×960, 768×1024, 820×1180, 1024×768, 1280×720, 1366×768, 1440×900, 1536×864, 1920×1080, 2560×1440, 844×390 and 568×320**. Every scene is checked in both skies with instruments closed/open where applicable. DOM rectangle checks cover the header, footer, navigation, narrative, inspection control, orbit controls, motion invitation and instruments. No unintended collisions or horizontal page overflow remain in this matrix. Quick, terminal, palette, contact, long mission titles, Engineering Profile and 404 surfaces also reflow. Phone instruments scroll independently with reachable close controls.

All local links and 17 mission routes return successfully. The linked GitHub profile, repositories and technical-record URLs returned HTTP 200; LinkedIn returned its automated-client restriction (999), so its supplied URL is preserved without claiming a successful automated check. Per-route metadata, relative canonicals, structured data, robots and sitemap pass checks without localhost metadata. A Windows static-export segment-path mismatch was found through browser console inspection and fixed by generating static payload aliases after builds. Production console checks report no runtime/React/asset errors in the tested surfaces. Axe scans report no serious or critical WCAG violations in the selected surfaces in both skies.

A saved Quick Mode creates **zero canvas elements and zero WebGL context requests**. WebGL loads only for Story Mode, caps DPR at 1.6 desktop / 1.25 mobile, stops its frame loop for hidden tabs, quiet inactive scenes and reduced motion, and redraws on explicit changes. Full-motion regression checks confirm autonomous animation, cursor/scroll camera movement and paused selectable orbits remain intact. No new Lighthouse score is asserted for this release.

The 18-size matrix is browser emulation, not a claim of testing every physical device. No production hosting origin or supplied résumé PDF was available; the Engineering Profile is clearly HTML, and an absolute sitemap is generated only when the deployment origin is configured.

## Motion refinement — 1 November 2026

All 47 production browser checks passed, including four added checks that exercise full motion: the WebGL image changes without user input; cursor and continuous scroll change the real camera; reduced motion remains still until explicit playback; and project orbits pause under keyboard selection and resume afterwards. The existing route, game, accessibility, layout, storage and fallback checks also pass. Build, TypeScript, lint and formatting pass.

The camera now follows a depth path across all 17 scenes. Cursor parallax, faster planet/satellite orbits, gyroscopic rings and travelling network packets make motion visible within a few seconds. Project and skill targets pause their orbital motion during hover or keyboard selection. A visible opening control lets visitors explicitly enable animation when their system preference requests reduced motion.

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

Canvas is decorative and has no exclusive essential content. The HTML story outline, Skip Story/Quick Mode, direct chapter navigation, Continue actions, semantic panels, and no-script project-route fallback must remain usable. No interaction may gate a project, profile, or contact link.

## Current content and evidence

The 17 mission routes use one flat editorial source with six curated flagships. Status labels are ACTIVE BUILD, PROTOTYPE, RESEARCH or CONCEPT; no production deployment or measured result was invented. AGNIPARIKSHA covers burn-in drift/anomaly early warning, Path Guard covers human safety escalation, and Swift MacroTrust covers compile-time macro trust research. Existing public portfolio records and repository READMEs support the remaining descriptions and stacks. The owner's final brief corrects older AGNIPARIKSHA and Path Guard records.

Internship dates remain August 2025–February 2026. Undated milestones omit dates. The girl remains a symbolic narrative. No real résumé PDF exists in the repository: the printable route and every CTA are labeled Engineering Profile. Contact opens a mail-app draft without sending or storing messages.

## Production configuration

Set `NEXT_PUBLIC_SITE_URL` to the deployed HTTPS origin before building. Publish the contents of `out/` with directory indexes and a real 404 fallback. Static generation is bounded to two workers and one page per worker, with retry handling for transient export failures.

Repeat accessibility and performance checks on the deployed site and representative physical devices after changing content, rendering, or hosting. The current validation status above must describe version 2 rather than inheriting version 1’s results.
