# deanphillips.dev

Dean Phillips's personal site and blog: Astro, MDX posts in `src/content/blog/`, and blog components
in `src/components/blog/`. A push to `main` deploys through Cloudflare in about a minute.

- Read `docs/writing-rules.md` before writing or editing anything public, and run the
  `humanizer` skill on all of it.
- `draft: true` builds a post as an unlisted preview (with a banner and noindex, and left out of
  the lists, RSS, and sitemap). Publishing means changing it to `draft: false`, through a PR the
  owner merges.
- The weekly `blog-update` routine (`.claude/skills/blog-update/SKILL.md`) proposes freshness edits,
  at most one new draft, and a share suggestion. Post ideas are queued in `docs/blog-ideas.md`.
- Check changes with `npm run build`.
- When you write or update a blog post, also check whether the homepage's "How I build" section
  (`src/pages/index.astro`, the `#how` steps and the stats strip above it) and the resume
  (`src/pages/resume.astro`) need updating, and put those edits in the same PR. A changed resume
  means regenerating `public/dean-phillips-resume.pdf` with `scripts/resume-pdf.mjs` and keeping it
  to two pages. Say in the PR what you checked, even when nothing changed.

## Reply format

Start every reply with a one-line status of what's done. Put anything the owner has to do in a short **Needs you** block with the exact step, or say "Nothing needed from you." Don't open a reply with questions; ask them after the status, and only when the answer changes what you do next.
