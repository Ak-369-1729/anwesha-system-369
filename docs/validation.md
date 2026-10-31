# Validation record

Validated locally on 31 October 2026 with Node 24.21.0, Next.js 16.4.3, React 19.3.1, TypeScript 6.0.3, and installed Google Chrome.

## Completed checks

- Dependency installation completed and exact versions are recorded in the lockfile.
- Development server started successfully; the homepage returned HTTP 200.
- ESLint completed without errors or warnings.
- Strict TypeScript checking completed successfully.
- Production static export completed successfully: homepage, not-found output, and 17 mission routes.
- All 13 Playwright checks passed against the final source-backed production export.
- Lighthouse 13.6.0 against the local production export: Performance 97, Accessibility 100, Best Practices 100, SEO 100. This used the mobile form factor, simulated network throttling, and a 4× CPU slowdown, with no audit warnings.
- The homepage and NEXUS mission page had no serious or critical WCAG A/AA violations in the automated axe scan.
- Visually reviewed desktop at 1440 × 1000, tablet at 768 × 1024, and mobile at 390 × 844. Verified no page-level horizontal overflow at these widths.
- Reviewed the constellation and the full-page mission-file treatment; corrected oversized SVG connection strokes and overlapping mobile annotations.

The browser suite covers project search and filtering, empty states, mission navigation, command-palette keyboard and focus behavior, terminal commands and history, threat containment, deduplicated persistent scoring, unavailable storage, recruiter preferences, reduced motion, responsive layout, static MIME types, traversal rejection, and true 404 responses.

## Content sources

Contact details are supplied by the owner. The creative brief supplies the narrative direction and project catalogue. Source-backed project descriptions, career dates and milestone records also draw on Anwesha’s existing GitHub portfolio, including its project catalogue and timeline, plus repository READMEs such as BoundaryLens and ChronoHeritage.

Mission files label their evidence state: `Source available` links to project documentation, `Portfolio record` cites an owner-maintained portfolio entry, and `Concept record` describes a proposed design. Individual contributions are asserted only where the source establishes them. The Adxania Cyber Solutions internship dates and IEEE, NCSC and INSPIRE MANAK milestones are owner-documented records, rather than independently audited credentials. Research interests and proposed experiments remain labeled accordingly.

At this revision, the 17 mission files comprise three source-available projects, six owner-documented portfolio records, and eight concept records. The flight path contains five sourced phases, including the August 2025–February 2026 internship. The vault also includes owner-documented Google Cloud Arcade facilitation. Post-quantum security and orbital telemetry logs distinguish existing portfolio research from their further proposed experiments.

The résumé download is a printable HTML profile compiled from these owner records and supplied contact details. A separate official CV file was not supplied. No project benchmarks, scientific validation or adoption results were inferred from the presence of a repository.

The site prepares an email draft and does not send mail. No login, analytics, cookies, backend database, API key, or telemetry service is required. Exploration preferences remain in local storage.

## Production notes

Set `NEXT_PUBLIC_SITE_URL` to the deployed HTTPS origin before the final build so social-image URLs resolve on the correct domain. Publish `out/` with directory indexes and a real 404 fallback. The measured Lighthouse result is a local benchmark; repeat it in the deployment environment and on representative physical devices.

Static-export concurrency is bounded to two workers and one page per worker through Next.js experimental settings, reducing Windows resource contention without changing the standard npm scripts.
