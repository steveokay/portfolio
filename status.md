# Portfolio Status — v2

Clean restart from v1. Old terminal/control-room concept lives in the
`v1-archive` branch (`8196b10`). v2 is a **field-notebook aesthetic
for cloud/platform recruiters** — light-first, restrained,
single-scroll, recruiter-skimmable. Detail in `CLAUDE.md`.

**Live:** [`portfolio.mokaysteve.workers.dev`](https://portfolio.mokaysteve.workers.dev/)
· Cloudflare Workers static-assets · CI deploy on push to `main`.

---

## Phase 0 — clean slate ✓

- [x] v1 archived on `v1-archive` branch (HEAD `8196b10`)
- [x] Wiped `src/`, `public/`, all v1 configs
- [x] Regenerated node_modules from new scaffold

## Phase 1 — scaffold ✓

- [x] Astro 5 (static output, no SSR adapter)
- [x] Tailwind CSS 3 + `@astrojs/tailwind`
- [x] `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/check`
- [x] Fonts: Inter · Instrument Serif · IBM Plex Mono via `@fontsource`
- [x] Color tokens (CSS vars + Tailwind theme) per CLAUDE.md palette
- [x] TypeScript strict; path alias `~/*` → `src/*`

## Phase 2 — chrome & primitives

- [x] `Base.astro` layout (header + nav + main + footer)
- [x] Type-scale utilities (`text-display`, `text-section`, `text-eyebrow`, `text-meta`)
- [x] Global focus-visible (teal outline, 3px offset)
- [x] Print stylesheet (in `global.css`)
- [x] System-driven dark mode + favicon + theme-color + selection all mode-aware via `color-mix`
- [x] Custom scrollbar
- [ ] `Section.astro` / `Chip.astro` / `Rule.astro` primitives — *deferred*. Sections inline cleanly; extract only if duplication starts hurting.

## Phase 3 — homepage sections ✓

Order per CLAUDE.md canonical structure: Hero → Currently → Selected Work → Certifications → Stack → Contact.

- [x] **Hero** — name, role, one-line positioning, 3 monospace metric chips (`10 yrs / 20× deploy freq / $50K/mo cloud savings`), CTA to contact. Real CV-sourced metrics.
- [x] **Currently** — `Currently.astro`. Real Tala role copy ("Cloud Infrastructure Engineer II at Tala — leading platform automation across AWS, GCP, and Azure with Terraform and Ansible…"), live teal pulse dot on the status row, mode-aware via `color-mix`.
- [x] **Selected work** — `SelectedWork.astro` reads the `caseStudies` content collection, sorted by `order`. Empty collection → section hides itself. Three case studies live (see Phase 4).
- [x] **Cloud certifications** — `Certifications.astro` + `src/data/certifications.ts`. **AWS Certified Cloud Practitioner** (earned 2022-01, expired 2025-01) wired with Credly verification link. Card auto-flips to `○ EXPIRED` style by date.
- [x] **Stack diagram** — `StackDiagram.astro`. Hand-built SVG reference AWS platform (Route 53 → CloudFront → ALB → ECS Fargate, with the request path as the teal accent). Three staggered SMIL pulses travel the request path; CSS-only `:has()` hover-trace; mobile vertical card layout under `md` breakpoint. Reduced-motion safe.
- [x] **Contact** — GitHub + LinkedIn only; **no email or phone on the public surface** by design. Recruiters reach out via DM and receive the full CV (with email + phone) attached. Explicit "public surface · no direct email or phone by design" label as a positive signal.
- [ ] **Writing** — hidden until there's something real to link.

## Phase 4 — case studies ✓

- [x] **Content collection schema** — `src/content/config.ts`. Required: title, eyebrow, oneLiner, stack[], metricHook, year, order. Optional: handle, repo, framing, draft.
- [x] **`/work/[slug]` template** — `src/pages/work/[slug].astro`. Back link, header (eyebrow + display title + handle + framing + italic one-liner + stack chips + meta row with optional repo CTA), bespoke `.cs-prose` typography for MDX body (teal `▸` bullets, mono numbered counters, accent rules, code blocks on cream surface).

**Three case studies — three distinct diagram shapes, three distinct narratives:**

| | Diagram | Narrative | Hard number |
|---|---|---|---|
| **01 OCI Registry** (`/work/oci-registry`) | Service mesh (gateway → core → gRPC mesh + RabbitMQ async fan-out) | Solo engineering depth — designed against the OCI spec from commit one | 75/75 OCI v1.1 conformance by **day 3** · ~45 MB mean distroless · 109 commits in 8 days |
| **02 Backstage IDP** (`/work/cellulant-backstage-idp`) | Hub & spoke (Backstage center · 3 surfaces · 3 underlying systems) | Org-wide platform adoption · 2.5 years at Cellulant | 5 → 100 deploys/day · 2 days → 10 min lead time · 5 hr → 15 min MTTR |
| **03 Cellulant FinOps** (`/work/cellulant-finops`) | Top-down decision tree (workload classification → matched lever → result) | Engineering economics — visibility first, then per-workload lever | $175K → $125K monthly · 28% bill cut · $600K/yr |

- [x] Bespoke architecture diagram per case study (`RegistryDiagram.astro`, `IdpDiagram.astro`, `CostDiagram.astro`). All same field-notebook palette; all have CSS-only `:has()` hover-trace + mobile vertical card layout; none use SMIL motion (case-study reading context is reflective).
- [x] "What I'd do differently" closing block per case study. Case 03 cross-links twice back to case 02 (catalog-as-CI-gate ↔ cost-tags-as-CI-gate) so reading all three signals consistent cross-cutting thinking.

## Phase 5 — polish & accessibility ✓

- [x] **Custom 404** — `src/pages/404.astro`. Eyebrow + serif "Not found." + `find /` shell pretend-output that surfaces the actual missed path via inline script. List of canonical paths as clickable mono entries; back-home CTA. `wrangler.jsonc` `not_found_handling: "404-page"` routes misses through it.
- [x] **Custom favicon** — `public/favicon.svg`. Rounded cream tile with teal serif `S`. Inline `@media (prefers-color-scheme: dark)` inverts cream → near-black and deep-teal → light-teal for system dark mode.
- [x] **OG card** — `public/og.svg` + `public/og.png` (1200×630). Cream + blueprint-dot backdrop, name + role in Georgia, monospace tagline, status-dot URL line; right-side faint architecture-diagram motif so the social preview doubles as a stack hint. PNG rendered from SVG via `sharp`.
- [x] **Resume route** at `/resume` — single-page CV. Summary, 8 real roles end-to-end (Stanbic Bank 2016 → Tala present, with real highlights), Selected projects pulled from content collection, Cloud certifications pulled from data file, Stack categorized + alphabetical within categories. Print stylesheet renders to a clean US-letter PDF via Ctrl+P / Cmd+P. Hint banner is no-print. Header link next to Contact.
- [x] **Dark-mode polish** — `color-mix(in srgb, var(--accent) X%, transparent)` for selection bg and Currently pulse keyframes (follows active accent); split `theme-color` meta with media queries; favicon inverts.
- [x] **WCAG AA contrast** — verified via Lighthouse a11y audit on live URL. Only failure was `opacity-75` dimming on expired cert cards; removed. All other color pairs were already AA.
- [x] **Lighthouse 100 / 100 / 100 / 100** on `portfolio.mokaysteve.workers.dev` (2026-06-17). Performance 100 (FCP 1.3 s, LCP 1.3 s, TBT 0 ms, CLS 0.01, SI 1.7 s, TTFB 190 ms); Accessibility 100; Best Practices 100; SEO 100.
- [x] **PII removal** — email + phone stripped from every public surface (verified by grepping `dist/`). Recruiters get the full CV via DM after first contact.
- [ ] **Reading progress on case-study pages** — CSS-only `animation-timeline: scroll()` where supported. *Deferred polish; not a definition-of-done item.*

## Phase 6 — ship

- [x] Cloudflare Workers project deployed (`portfolio.mokaysteve.workers.dev`)
- [x] GitHub Actions workflow — `npm ci` → `npm run check` → `npm run build` → `wrangler deploy`. Pinned `wrangler ^4` in devDependencies for deterministic CI.
- [x] `PUBLIC_CF_ANALYTICS_TOKEN` configured in repo secrets
- [x] DNS / SSL via `*.workers.dev` (Cloudflare-managed automatically)
- [ ] **Custom domain** — `astro.config.mjs` `site` points at the workers.dev URL. Pick a domain (`steveokoth.dev`?) and bind it to the Worker. ~10 min once the domain exists.
- [ ] **Social previews tested** on LinkedIn / Slack / X — your action. Paste the URL into a draft and confirm the OG card renders.

---

## Definition of done — per CLAUDE.md

- [x] Live on a public URL (custom domain still pending)
- [x] Lighthouse 100 across all four categories
- [x] All content real and dated
- [x] Resume PDF downloads cleanly
- [x] Mobile is genuinely scannable, not just responsive (all three diagrams + cert grid + selected-work cards + currently dl have bespoke mobile layouts)
- [ ] Reviewed by a non-engineer reader for ≤30-second scan-ability
- [ ] Custom domain swapped for the workers.dev URL

---

## Explicitly out of scope

These were v1 mistakes — complexity for marginal recruiter-facing value:

- Live metrics / homelab API integration
- 3D / R3F / WebGL background
- Terminal aesthetic / command palette / animated boot loader
- Custom cursor
- Heavy JS islands beyond minimal hydration
- View Transitions API (premature for a single-scroll site)

---

## Awaiting Steve (real-world actions)

- **Custom domain** — buy / re-purpose a domain, bind it to the Worker. Then update `astro.config.mjs` `site`.
- **Education array** on `src/pages/resume.astro` (`Education[]` at the top). Currently empty → resume shows a sienna TODO callout under the Education heading.
- **Social-preview smoke test** — paste the URL into a LinkedIn / Slack / X draft, confirm the OG card renders. If something looks broken on a specific platform, surface it and we'll fix.
- **(Optional) Renew AWS Cloud Practitioner** or earn an adjacent cert (Solutions Architect Associate is the most-recruiter-noticed next step). Site re-renders the card the moment the data file changes.

---

## Conventions established

- **Data-file pattern** — single-purpose `src/data/*.ts` files for repeated content (`certifications.ts`). Case studies use a content collection instead (`src/content/case-studies/`).
- **Section gating** — sections accept data as props; empty data → section doesn't render. Prevents stubbed-data violations of CLAUDE.md. Used by `Certifications`, `SelectedWork`.
- **Diagrams** — desktop = inline SVG with CSS-only `:has()` interaction; mobile = vertical card stack in same palette. Established by `StackDiagram`, propagated to all three case-study diagrams.
- **Real numbers only** — every metric on the site sources to either the CV, the OCI Janus repo, or Lighthouse-verified observations. Anything unverified is hidden, not stubbed.
- **PII off the public surface** — email and phone live in the CV that's attached to a reply, not in the site. GitHub + LinkedIn are the gateways.
