# CLAUDE.md

Guidance for Claude Code working on this repo. Personal portfolio for **Steve Okoth** — cloud / platform engineer targeting mid-market enterprise roles. Read this before generating code, components, or copy.

## Premise

This is a hiring artifact, not an art project. The audience is recruiters and engineering managers at mid-market companies and faang companies hiring for cloud, platform, or infrastructure roles. They skim. They need to see — in under 30 seconds — who Steve is, what cloud, what level, and the evidence.

The site's job is to translate "this person operates real cloud platforms at real scale" into a single confident scroll. Polish, restraint, and concrete numbers carry more weight than visual gimmickry.

**Concept:** a *field-notebook* aesthetic — warm cream background, refined serif headlines, monospace for system text, a single deep-teal accent. Reads as engineering documentation, not as a creative-dev portfolio. The differentiator is calm authority, not maximalism.

## Core principles

- **Confident, not loud.** No animated backgrounds, no terminal cliché, no maximalism. Whitespace and typography carry the design.
- **Receipts over rhetoric.** Every claim ties to a number, a stack, a date, or a link. Nothing vague.
- **One scroll, one story.** Recruiters won't navigate deep — the homepage carries the entire message. Detail pages exist for hiring managers who lean in.
- **Print-friendly.** Light mode default; every page screenshots cleanly for an email or Slack share.
- **Accessibility is non-negotiable.** WCAG AA contrast minimum, full keyboard nav, semantic HTML, real focus rings.

## Tech stack

- **Framework:** Astro 5, static output only. No SSR adapter, no edge runtime — there is nothing on this site that needs request-time context.
- **Styling:** Tailwind CSS 3 + CSS custom properties for the color tokens defined below.
- **Type:** Inter (body), Instrument Serif (display), IBM Plex Mono (code & system labels) — all self-hosted via `@fontsource`.
- **Content:** MDX for case studies, plain Markdown for `/now` and short notes.
- **Diagrams:** hand-built inline SVG, committed to the repo. No chart libraries, no Mermaid runtime.
- **Hosting:** Cloudflare Pages, pure static.
- **CI/CD:** GitHub Actions — `build`, `astro check`, deploy on push to `main`.
- **Analytics:** Cloudflare Web Analytics (cookie-less).
- **Contact:** `mailto:` link only — no form, no backend.

## Visual language

### Color tokens

Defined as CSS variables in `src/styles/global.css` and mirrored in `tailwind.config.mjs`:

```
--bg:        #faf8f4   /* warm cream, near-white */
--surface:   #f1ede4   /* card / inset background */
--ink:       #1a1c1f   /* primary text */
--muted:     #5a5e63   /* secondary text */
--rule:      #d8d3c5   /* borders, dividers, hairlines */
--accent:    #0d5e5e   /* deep teal — links, key metrics, the only accent */
--warn:      #b06a36   /* warm sienna — diagram emphasis only */
```

Dark mode is **optional**, respects `prefers-color-scheme`, but the design is authored light-first. If dark mode ships, it inverts surface tones — accent stays teal.

### Typography

- **Display:** Instrument Serif (400 + 400 italic) — hero headline and section titles only.
- **Body:** Inter (400/500/600), line-height 1.6, max measure ~68 characters.
- **Mono:** IBM Plex Mono (400/500) — for metric values, code, system text, file paths, dates.
- Headline size caps at `clamp(2.25rem, 4.5vw, 3.75rem)`. No display larger.

### Motion

- Section entries fade-up 8px over 240ms on first viewport entry. Once each. Never repeats.
- No parallax. No background animation. No scroll-jacking. No mouse-tracking effects.
- All animation respects `prefers-reduced-motion`.

## Site structure

A single scroll, top-to-bottom:

1. **Hero** — Name · role · one-sentence positioning. Three monospace metric chips below (years · certifications · peak scale operated). Single CTA: contact.
2. **Currently** — One short paragraph and a `status:` line. What Steve is doing right now, what he is open to.
3. **Selected work** — Three case studies as cards on the home page (problem · stack · result). Each links to `/work/[slug]` for the long version.
4. **Cloud & certifications** — Provider badges (inline SVG, hand-built minimal marks — not Credly embeds) with dates. AWS / Azure / GCP / Hashicorp where applicable.
5. **Stack** — Categorized tag groups, alphabetical within each category: Cloud · IaC · Containers & orchestration · Observability · CI/CD · Languages · Data.
6. **Writing** *(conditional)* — Links to technical posts. Section hidden entirely if the array is empty.
7. **Contact** — Direct email, LinkedIn, GitHub. Plain text, large enough to copy on mobile.

Each section title is a single word in Instrument Serif, with a `1px` rule beneath the eyebrow. Mirrors engineering documentation, not marketing landing pages.

## Content rules

- **No "passionate" / "results-driven" / "synergy" / "rockstar."** No corporate filler, no LinkedIn voice.
- **Every metric is real.** Numbers that aren't yet verified mean the section is hidden, not stubbed with `XX%`.
- **Tense:** present for what *is*, past for case studies, future tense reserved for the "currently open to" line.
- **Stack lists alphabetical** within each category — predictability over hierarchy.
- **Cert dates explicit** — `AWS Solutions Architect — Associate · 2024-09`.
- **Case study format:** Problem → Constraints → Architecture (with diagram) → Result (with numbers) → What I'd do differently. The "what I'd do differently" line is the hiring-manager signal.

## Images

- All generated imagery routes through **Higgsfield** (see the higgsfield-generate skill).
- The site uses very few images on purpose: an OG/social card (1200×630), optional case-study cover illustrations.
- **No stock photos. No abstract gradient blobs. No team-photo lookalikes.**
- Architecture diagrams are inline SVG, hand-built, committed to the repo — not raster images.

## Non-negotiables

- Lighthouse: **100 / 100 / 100 / 100** on the deployed site. A static page with this little JS has no excuse.
- WCAG AA contrast on every text/background pair.
- `prefers-reduced-motion` respected universally.
- Custom 404, custom favicon, custom OG image — never framework defaults.
- No tracking beyond Cloudflare Web Analytics.
- Print stylesheet — the homepage prints cleanly to a single page for screenshot or PDF export.
- Resume PDF available at `/resume.pdf`, generated from the print view.

## Commands

```bash
npm install
npm run dev        # astro dev
npm run build      # astro build
npm run preview    # astro preview
npm run check      # astro check (type + content validation)
```

## Definition of done

- Live on a custom domain, served from Cloudflare Pages
- Lighthouse 100 across all four categories on the deployed URL
- Every case study has real numbers, real stack, a real diagram, and a "what I'd do differently" line
- Every certification listed is real and dated
- OG preview renders correctly on LinkedIn, X, and Slack
- Mobile single-column, scannable without horizontal scroll, large enough to read without zoom
- Tested by at least one non-engineer reader for skimmability
