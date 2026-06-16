# CLAUDE.md

Guidance for Claude Code (or any agent) working on this repo. This is a personal portfolio site for a devops/backend engineer, aimed at Awwwards-level design. Read this before generating code, components, or copy.

## Premise

This is not a "creative dev" portfolio template. The differentiator is that the site's *engineering execution* is the design statement — performance, real data, infra discipline — not illustration or visual gimmicks borrowed from frontend-design portfolios. If a choice doesn't reinforce that, cut it.

**Concept:** a control-room / terminal aesthetic — dark, monospace-led, status-light accents, a live systems-health strip instead of a generic hero. Apply it everywhere — type, motion, color, the 404 page, the loading state. Schematic/blueprint-style diagrams are welcome *inside* case studies, but the terminal shell is the frame for the whole site.

## Core principles

- Performance is the thesis, not a checkbox: target ~100 Lighthouse performance/accessibility, fast TTFB, no animation library loaded eagerly if it can be deferred.
- One concept, fully committed, not a grab-bag of trends.
- Restraint over density — fewer animations, each one purposeful, all respecting `prefers-reduced-motion`.
- Real content beats decoration. Case studies and metrics carry the site; visuals support them.
- Mobile gets its own reimagined layout of the concept, not a shrunk desktop page.

## Tech stack

- Framework: Astro — static-first, islands architecture. Most pages ship zero JS; interactive pieces (terminal, live metrics widget, network-graph background) are React islands hydrated individually.
- Styling: Tailwind CSS
- Animation: Framer Motion within islands for scroll reveals/transitions; only reach for GSAP if choreography needs timeline control Framer can't give
- Background/3D: React Three Fiber for the network-graph background island — lazy-loaded, never blocking first paint
- Content: MDX for case studies, so technical writing stays close to code
- Hosting: the site itself runs on Cloudflare Pages — fast, globally distributed, and not dependent on infrastructure you personally operate
- Live data: a small, separately-hosted backend service (VPS or homelab) exposes a public API with real metrics — uptime, request counts, last deploy time. The site's live widgets poll this. This is where the "real infra" flex lives, decoupled from the portfolio's own uptime
- CI/CD: GitHub Actions builds and deploys both the site and the metrics service — the pipeline itself should be visible somewhere on the site, not just internal plumbing
- IaC: Terraform for the self-hosted metrics service

## Site structure

1. **Hero** — live terminal or systems-status strip with real data, not a "Hi, I'm X" banner
2. **About** — short, framed around scale and impact ("cut p99 latency 40%"), not job titles
3. **Selected work** — 3–5 case studies in postmortem format: problem, constraints, the architecture decision made, the trade-off *not* taken, a diagram, before/after numbers
4. **Stack** — rendered as an actual infrastructure diagram, not a logo wall
5. **Lab / now** — live status of a current project or homelab, proof the systems are real
6. **Writing** *(optional)* — links to technical posts
7. **Contact** — minimal, no multi-field form

## Conventions

- Diagrams are SVG, hand-built or generated from architecture-as-code — no stock icon sets
- Copy is terse and technical — no "passionate," "results-driven," or similar filler
- Color: near-black background (`#0a0a0a`), warm amber accent (`#ffb000`-ish) — deliberately not the green-on-black hacker cliché. Gradients only when they encode data, never decoratively
- Typography: monospace for data/labels, a clean sans or serif for body copy
- Components: one per file, colocated styles, no prop-drilling past two levels — lift to context if needed

## images
- if you need to generate any images please use higgsfield

## Non-negotiables

- `prefers-reduced-motion` respected everywhere animation appears
- WCAG AA contrast minimum, even within the dark/terminal palette
- No placeholder/Lorem-ipsum metrics in anything shipped to production
- Custom 404, custom loading state, custom favicon — never framework defaults

## Commands

*(fill in once the project is scaffolded)*

```
npm install
npm run dev       # astro dev
npm run build     # astro build
npm run preview   # astro preview
```

## Definition of done

- Lighthouse: ~100 performance, ~100 accessibility
- Every case study has real, specific numbers
- CI/CD pipeline is documented or visible on the site itself
- Mobile layout is intentional, not a responsive afterthought