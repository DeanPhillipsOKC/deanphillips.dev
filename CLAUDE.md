# deanphillips.dev

Dean Phillips's personal site and blog: Astro, MDX posts in `src/content/blog/`, and blog components
in `src/components/blog/`. A push to `main` deploys through Cloudflare in about a minute.

- Read `docs/writing-rules.md` before writing or editing anything public, and run the
  `humanizer` skill on all of it.
- `draft: true` builds a post as an unlisted preview (with a banner and noindex, and left out of
  the lists, RSS, and sitemap). Publishing means changing it to `draft: false`.
- Agents merge their own PRs once `npm run build` passes. It's a blog, and the owner doesn't review
  PRs. The one gate is publishing: a post goes public only after the owner has read the preview and
  approved it, either by telling a session or with an approving comment on its `Publish:` PR.
- The weekly `blog-update` routine (`.claude/skills/blog-update/SKILL.md`) proposes freshness edits,
  at most one new draft, and a share suggestion. Post ideas are queued in `docs/blog-ideas.md`.
- Check changes with `npm run build`.
- When you write or update a blog post, also check whether the homepage's "How I build" section
  (`src/pages/index.astro`, the `#how` steps and the stats strip above it) and the resume
  (`src/pages/resume.astro`) need updating, and put those edits in the same PR. A changed resume
  means regenerating `public/dean-phillips-resume.pdf` with `scripts/resume-pdf.mjs` and keeping it
  to two pages. Say in the PR what you checked, even when nothing changed.

## Reply format

Start every reply with a one-line status of what's done. Right after it, put anything the owner has to do or answer in a short **Needs you** block, as a numbered list with the exact step for each, or say "Nothing needed from you." Number it even when there is only one item. The owner has ADHD, so an ask is never left lower in the reply or folded into a paragraph. Explanation comes after the block. Only ask when the answer changes what you do next.
