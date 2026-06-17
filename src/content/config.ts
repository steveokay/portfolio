import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Case studies — one MDX file per project in `src/content/case-studies/`.
 *
 * Strict schema by design: every field that ships must be real. Optional
 * fields (repo, framing) hide their UI surface when absent rather than
 * rendering a stub. Empty collection → SelectedWork section hides itself.
 */
const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/case-studies' }),
  schema: z.object({
    /** Display title — readable, not a repo handle */
    title: z.string(),
    /** Optional repo handle, small mono line under the title */
    handle: z.string().optional(),
    /** Top eyebrow, e.g. "case · 01" */
    eyebrow: z.string(),
    /** One-line problem statement, used on the card too */
    oneLiner: z.string(),
    /** Stack tags shown as chips (kept short, alphabetical) */
    stack: z.array(z.string()),
    /** Sharpest single-line outcome for the card */
    metricHook: z.string(),
    /** Year or range, e.g. "2026" */
    year: z.string(),
    /** Sort order — lower = higher on the homepage */
    order: z.number(),
    /** Optional repo URL — rendered as a CTA if present */
    repo: z.string().url().optional(),
    /** Optional framing line — e.g. "Solo build · 8 days" */
    framing: z.string().optional(),
    /** Hide from build */
    draft: z.boolean().default(false),
  }),
});

export const collections = { caseStudies };
