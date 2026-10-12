import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) => z.object({
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
    // 1200x630 link-preview image under public/, e.g. /img/og/<slug>.jpg.
    image: z.string().optional(),
    // Art with no text, shown as the post's thumbnail on the Writing page.
    cover: image().optional(),
    draft: z.boolean().default(false),
    // Posts sharing a `series` id get a part nav. Part 0 is the overview, the only one listed on the
    // Writing page; the rest show as a list under its card.
    series: z.string().optional(),
    part: z.number().int().min(0).optional(),
    // Short label for the part nav; falls back to tabTitle, then title.
    partTitle: z.string().optional(),
  }),
});

export const collections = { blog };
