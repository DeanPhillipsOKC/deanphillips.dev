import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

// Draft posts build as unlisted previews (see src/pages/blog/[...slug].astro), so the sitemap
// has to leave them out by URL. A draft is any post whose frontmatter says `draft: true`.
const blogDir = new URL('./src/content/blog/', import.meta.url);
const draftPaths = new Set(
  readdirSync(blogDir)
    .filter((f) => /\.mdx?$/.test(f) && /^draft:\s*true\s*$/m.test(readFileSync(new URL(f, blogDir), 'utf8').split(/^---\s*$/m)[1] ?? ''))
    .map((f) => `/blog/${f.replace(/\.mdx?$/, '')}/`),
);

// Pages that are built but not announced yet: noindex in the page, and out of the sitemap.
const unlistedPages = new Set(['/owasp-llm-top-10/']);

export default defineConfig({
  site: 'https://deanphillips.dev',
  integrations: [mdx(), sitemap({ filter: (page) => { const path = new URL(page).pathname; return !draftPaths.has(path) && !unlistedPages.has(path); } })],
});
