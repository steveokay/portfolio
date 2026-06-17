# Portfolio Status — v2

Clean restart. Old terminal/control-room concept lives in git history (last commit on the v1 line: `8196b10`). New direction is a **field-notebook aesthetic for mid-market cloud/platform engineering recruiters** — light-first, restrained, single-scroll, recruiter-skimmable. Detail lives in `CLAUDE.md`.

---

## Phase 0 — clean slate

- [ ] Archive v1 state on a `v1-archive` branch for posterity
- [ ] Wipe `src/`, `public/`, `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, `wrangler.jsonc` (preserve `.git`, `.github/`, `.gitignore`, `CLAUDE.md`, `status.md`, memory dir)
- [ ] Drop node_modules, regenerate from new scaffold

## Phase 1 — scaffold

- [ ] `npm create astro@latest` — minimal template, TypeScript strict
- [ ] Install Tailwind CSS 3 + `@astrojs/tailwind`
- [ ] Install MDX integration: `@astrojs/mdx`
- [ ] Install fonts: `@fontsource/inter`, `@fontsource/instrument-serif`, `@fontsource/ibm-plex-mono`
- [ ] Configure color tokens (CSS vars + tailwind theme extension) per CLAUDE.md palette
- [ ] No SSR adapter — pure static output, deploy to Cloudflare Pages later

## Phase 2 — chrome & primitives

- [ ] `Base.astro` layout — minimal header (name only, link to top), `<main>`, minimal footer
- [ ] Type scale utilities (`text-display`, `text-eyebrow`, `text-meta`)
- [ ] `Section.astro` primitive — eyebrow + rule + slot for content
- [ ] `Chip.astro` — monospace metric chip (label + value)
- [ ] `Rule.astro` — hairline divider with optional label
- [ ] Global focus-visible style (teal outline, 3px offset)
- [ ] Print stylesheet skeleton

## Phase 3 — content sections (home)

- [ ] Hero — name · role · one-line positioning · 3 metric chips · contact CTA
- [ ] Currently — short paragraph + `status:` line
- [ ] Selected work — 3 case-study cards (problem / stack / result, link to detail)
- [ ] Cloud & certifications — provider badges (hand-built SVG marks) + dates
- [ ] Stack — categorized tag groups (alphabetical within each)
- [ ] Writing — conditional section, hidden if empty
- [ ] Contact — email · LinkedIn · GitHub

## Phase 4 — case studies

- [ ] Content collection schema: `problem`, `constraints`, `architecture`, `result`, `lessons`, `stack[]`, `metrics[]`, `date`
- [ ] `/work/[slug]` template
- [ ] Three case-study MDX files scaffolded with structure only (real content to be written by Steve)
- [ ] Inline SVG architecture diagram per case study (hand-drawn)
- [ ] "What I'd do differently" closing block per case study

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

- Custom domain — `mokaysteve.com`? `steve.eng`? Something else? Decide before Phase 6.
- Are there any *real* writing posts to link, or does the Writing section stay hidden for v2?
- Does Steve want a `/now` page (long-form) or just an inline "Currently" block on the home page? Default in CLAUDE.md is inline.
