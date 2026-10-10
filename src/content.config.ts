import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    // Short title for the browser tab; falls back to title.
    tabTitle: z.string().optional(),
    description: z.string(),
    eyebrow: z.string().default('Building with AI'),
    // Optional second half of the headline, drawn in the gradient.
    titleAccent: z.string().optional(),
    dek: z.string(),
    date: z.coerce.date(),
    readMinutes: z.number(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
