import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()),
    date: z.string(),
    slug: z.string(),
    lang: z.enum(['zh', 'en']).default('zh'),
  }),
});

export const collections = { articles };
