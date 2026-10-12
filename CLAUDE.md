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
