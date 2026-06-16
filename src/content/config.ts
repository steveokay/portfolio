import { defineCollection, z } from 'astro:content';

const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    metrics: z.object({
      before: z.string(),
      after: z.string(),
      improvement: z.string(),
    }),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  'case-studies': caseStudies,
};
