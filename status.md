# Portfolio Status — v2

Clean restart. Old terminal/control-room concept lives in git history (last commit on the v1 line: `8196b10`). New direction is a **field-notebook aesthetic for mid-market cloud/platform engineering recruiters** — light-first, restrained, single-scroll, recruiter-skimmable. Detail lives in `CLAUDE.md`.

---

## Phase 0 — clean slate ✓

- [x] Archive v1 state on a `v1-archive` branch for posterity (HEAD = `8196b10`)
- [x] Wipe `src/`, `public/`, `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, `wrangler.jsonc`
- [x] Drop node_modules, regenerate from new scaffold
- [x] Deploy workflow swapped from Workers SSR → Cloudflare Pages static

## Phase 1 — scaffold ✓

- [x] Astro 5 scaffold, hand-bootstrapped configs (TypeScript strict)
- [x] Tailwind CSS 3 + `@astrojs/tailwind`
- [x] MDX integration: `@astrojs/mdx`
- [x] Sitemap integration: `@astrojs/sitemap`
- [x] Fonts: `@fontsource/inter` + `instrument-serif` + `ibm-plex-mono`
- [x] Color tokens (CSS vars + tailwind theme extension) per CLAUDE.md palette
- [x] No SSR adapter — pure static output

## Phase 2 — chrome & primitives

- [x] `Base.astro` layout — minimal header (name + contact), `<main>`, minimal footer
- [x] Type scale utilities (`text-display`, `text-section`, `text-eyebrow`, `text-meta`)
- [ ] `Section.astro` primitive — eyebrow + rule + slot for content (deferred; sections still inline their own structure)
- [ ] `Chip.astro` — monospace metric chip (label + value) (deferred; inline in hero for now)
- [ ] `Rule.astro` — hairline divider with optional label (deferred)
- [x] Global focus-visible style (teal outline, 3px offset)
- [x] Print stylesheet (in `global.css`)
- [x] Optional dark mode (`prefers-color-scheme: dark` only, no toggle)
- [x] Custom scrollbar (cream track, teal hover)

## Phase 3 — content sections (home)

- [x] Hero — name · role · one-line positioning · 3 metric chips · contact CTA (v1 copy; metrics chips are still placeholder values)
- [x] **Currently** — `src/components/sections/Currently.astro`. Paragraph + `status:` + `exploring:` lines. Live teal pulse dot on the status row (reduced-motion safe). Copy is hard-coded in the component file — edit the three string constants at the top to update. **TODO(steve):** swap placeholder copy.
- [x] **Selected work** — `src/components/sections/SelectedWork.astro` reads from the `caseStudies` content collection (sorted by `order`). Each card: eyebrow + year header, serif title, optional framing line, italic one-liner, stack chips, metric hook in teal at the bottom, hover lights border teal, full-card link to detail page. Empty collection → section hides itself. **Case study #1 shipped** — OCI registry at `src/content/case-studies/oci-registry.mdx` + bespoke `RegistryDiagram.astro` (gateway → core → gRPC mesh + RabbitMQ async fan-out, mobile vertical layout). Real metrics inline: day-3 OCI conformance, ~45 MB mean distroless, 109 commits in 8 days.
- [x] **Cloud & certifications** — data-driven card grid, `src/components/sections/Certifications.astro` + `src/data/certifications.ts`. Provider mark + status (current/expired auto-flips on date), optional Credly link. Empty array hides the section. **TODO(steve):** swap placeholder certs for real ones in `src/data/certifications.ts`.
- [x] **Stack diagram** — `src/components/diagrams/StackDiagram.astro`. Desktop: hand-built SVG, AWS region boundary, 3 staggered SMIL pulses on the request path, CSS-only hover-trace via `:has()`. Mobile (<md): real vertical card layout, no horizontal scroll, teal left-rule on the request path column. Reduced-motion safe.
- [ ] Writing — conditional section, hidden if empty
- [ ] Contact — email · LinkedIn · GitHub (basic version live; LinkedIn link still TODO)

## Phase 4 — case studies

- [x] **Content collection schema** — `src/content/config.ts`. Required: title, eyebrow, oneLiner, stack[], metricHook, year, order. Optional: handle, repo, framing, draft.
- [x] **`/work/[slug]` template** — `src/pages/work/[slug].astro`. Back link, header (eyebrow + title + handle + framing + one-liner + stack chips + meta row), bespoke `.cs-prose` typography styles for MDX body.
- [x] **Case study #1: OCI registry** — content live at `/work/oci-registry`. Real numbers: day-3 OCI conformance, ~45 MB mean distroless, 109 commits in 8 days, 22/36 hardening items.
- [ ] Case study #2 — TBD source project + metrics from Steve.
- [ ] Case study #3 — TBD source project + metrics from Steve.
- [x] Inline SVG architecture diagram per case study — `RegistryDiagram.astro` establishes the pattern. Same visual language as Stack diagram: cream surface, hairline rules, teal accent path, dashed mesh boundary, CSS-only `:has()` hover-trace, mobile vertical card layout.
- [x] "What I'd do differently" closing block per case study — pattern set in `oci-registry.mdx` (two real lessons surfaced from `security.md` hardening items).

## Phase 5 — polish & accessibility

- [ ] Custom 404 (matches site aesthetic)
- [ ] Custom favicon (SVG, teal mark on cream)
- [ ] OG image (1200×630, generated via Higgsfield, on-brand)
- [ ] Reading progress on case-study pages (CSS-only `animation-timeline: scroll()` where supported, no JS)
- [ ] Optional dark mode (`prefers-color-scheme: dark` only — no toggle)
- [ ] WCAG AA contrast verification (every pair)
- [ ] Lighthouse 100 / 100 / 100 / 100 on the deployed URL
- [ ] Resume PDF route at `/resume.pdf` (rendered via print stylesheet)
- [ ] OG preview validated on LinkedIn, X, Slack

## Phase 6 — ship

- [ ] Cloudflare Pages project + custom domain
- [ ] GitHub Actions workflow — build, `astro check`, deploy
- [ ] `PUBLIC_CF_ANALYTICS_TOKEN` configured
- [ ] DNS, SSL verified
- [ ] Social previews tested

---

## Explicitly out of scope (this rebuild)

- Live metrics / homelab API integration
- 3D / R3F / WebGL background
- Terminal aesthetic / command palette / animated boot loader
- Custom cursor
- Heavy JS islands beyond a possible dark-mode toggle (deferred)
- View Transitions API (premature for a single-scroll site)

These were the v1 mistakes — they added complexity for marginal recruiter-facing value.

---

## Definition of done

- [ ] Live on a custom domain
- [ ] Lighthouse 100 across all four categories
- [ ] All content real and dated
- [ ] At least one recruiter or non-engineer has reviewed it and confirmed it reads in under 30 seconds
- [ ] Resume PDF downloads cleanly
- [ ] Mobile is genuinely scannable, not just responsive

---

## Open decisions

- Custom domain — `steveokoth.dev` is currently in `astro.config.mjs` as a placeholder. Confirm or swap before Phase 6.
- Are there any *real* writing posts to link, or does the Writing section stay hidden for v2?
- Does Steve want a `/now` page (long-form) or just an inline "Currently" block on the home page? Default in CLAUDE.md is inline.
- LinkedIn URL for footer + contact section.

## Awaiting Steve

- **Real certifications list** — name, provider, earned date (YYYY-MM), expires (YYYY-MM), Credly URL. Drop into `src/data/certifications.ts`.
- **Real "Currently" copy** — what you're working on right now + what roles you're open to + 3–5 things you're exploring. Edit `src/components/sections/Currently.astro`.
- **Case-study #1: OCI Image Registry** — the project we noticed at `c:\Users\Athelos\Desktop\claude\image-registry`. Need problem statement, 2–3 hard numbers (tenants, pull/push rate, p99, infra cost), the architectural decision worth telling, the trade-off you *didn't* take, and one "what I'd do differently" line.

## Conventions emerging

- **Data-file pattern** — single-purpose `src/data/*.ts` files for repeated content. Already: `certifications.ts`. Likely next: `caseStudies.ts` (or use a content collection), `writing.ts`.
- **Section gating** — sections accept their data as props; empty data → section doesn't render. Prevents stubbed-data violations of CLAUDE.md.
- **Diagrams** — desktop = inline SVG with CSS-only interaction; mobile = vertical card stack in same palette. Established by Stack diagram.
