---
name: blog-update
description: Keeps deanphillips.dev current with the RepBunny project. Reads what changed in the RepBunny repo since the last run, fixes stale facts in live posts (as a pull request the owner merges), drafts at most one new post as an unlisted preview with a publish pull request, and suggests one post to share on LinkedIn and Facebook with ready-to-paste text. Runs as a weekly routine (/blog-update) or by hand. Never makes anything public on its own.
---

# blog-update

Keep the blog in step with the project, and leave every public change for the owner to approve
with a single Merge tap on their phone.

Read `docs/writing-rules.md` first, every run. Use `.claude/skills/humanizer/SKILL.md` on every
piece of text you write: posts, edits, PR descriptions, and share drafts.

## What may change without the owner

- **Unlisted drafts:** a new post with `draft: true`. It builds at `/blog/<slug>/` with a banner and
  `noindex`, and the Writing page, RSS, sitemap, and series nav leave it out.
- `.blog-state.json` and `docs/blog-ideas.md`.

Everything else goes through a pull request the owner merges: publishing a draft
(`draft: false`), any edit to a published post, and any change to layouts, components, or
config. **Never merge one of those yourself.**

## Setup

- Both repos are checked out side by side (in cloud sessions, under `/home/user/`). Find the
  RepBunny repo with `ls ..` and call it `$REP`. This repo is `$BLOG`.
- GitHub in cloud sessions is REST only (GraphQL and search are blocked): use
  `gh api repos/DeanPhillipsOKC/<repo>/...` with explicit `per_page`/`page`. Don't use `gh pr create`,
  `gh issue list`, or `gh search`.
- `main` changes only through pull requests. Work on branches named `claude/blog-<what>-<date>`.
- Open a PR with `gh api repos/DeanPhillipsOKC/deanphillips.dev/pulls -f title=... -f head=<branch> -f base=main -f body=@<file>`.
  Self-merge an allowed PR with `gh api -X PUT repos/DeanPhillipsOKC/deanphillips.dev/pulls/<N>/merge -f merge_method=squash`.
- `npm ci` once, then `npm run build` must pass before any push.

## 1. What changed

Read `.blog-state.json` (`lastRun`, `lastRepCommit`, `suggestedShares`). In `$REP`:

- `git log --oneline <lastRepCommit>..origin/main` for the commits since.
- Closed issues since `lastRun`:
  `gh api "repos/DeanPhillipsOKC/repbunny/issues?state=closed&since=<lastRun>&per_page=100"`
  (drop entries with `pull_request`). Read the titles, and the bodies of anything about the
  delivery process: skills, routines, workflows, testing, reviews, support, cost.
- Open and closed PRs on `deanphillips.dev` from earlier runs, to see what the owner merged,
  closed, or commented on. A comment asking for changes on an open publish or freshness PR is the
  first thing to handle: revise on that PR's branch and reply on the PR with what changed.

If nothing relevant changed and nothing is waiting on a PR, skip to step 5.

## 2. Freshness (edits to live posts)

Check every published post for claims the project has moved past:

- The overview's StatRow and dek. Days since the first commit (2026-09-22, counted inclusive),
  `git rev-list --count origin/main` in `$REP`, closed issues (page through
  `issues?state=closed&per_page=100`, dropping PRs), and the e2e count (`npx playwright test --list`
  in `$REP` after `npm ci`, last line). Update them only if they moved meaningfully (more than about 5%).
- Future-tense lines like "being built", "next up", "coming", or "will". Check each against the
  issue it describes. If it shipped, say so in the past tense. If it was dropped, remove the line.
- Facts the commits contradict, such as a model cutoff, label names, schedule times, or workflow
  behavior.

Put all of it in one PR, `claude/blog-freshness-<date>`, titled `Freshness: <date>`. List each
change and its evidence (issue or commit) in the body. Leave it open for the owner. Add a short
italic "Updated <Month D, YYYY>" note to a post only when a fact a reader would care about changed.

## 3. A new post (at most one per run)

Write one only when the material is real: a shipped change with results, or an idea in
`docs/blog-ideas.md` whose condition is now met. Prefer the ideas file. If nothing qualifies, add
any new idea you spotted to `docs/blog-ideas.md` under "Waiting for material" and stop here.

1. Draft `src/content/blog/<slug>.mdx` per `docs/writing-rules.md` (series fields if it's a part,
   `draft: true`, a `readMinutes` estimate at about 230 words a minute). Verify every number
   against `$REP`. Run the humanizer self-check, and grep for `—` and `–` (there must be none).
2. `npm run build`. Then branch `claude/blog-draft-<slug>`, commit, push, open the PR
   `Draft (unlisted): <title>`, and **self-merge it**. It's an unlisted preview, so it's allowed.
3. Branch `claude/blog-publish-<slug>` from the new `main`, flip `draft: true` to `draft: false`,
   build, push, and open the PR `Publish: <title>` **for the owner**. Its body has:
   - the preview link `https://deanphillips.dev/blog/<slug>/` (live about a minute after the draft
     merge) and a two-sentence summary;
   - the facts checked and their sources;
   - **LinkedIn draft** and **Facebook draft** (step 5's rules) in plain-text code blocks, ready
     to paste once it's live.
4. Move the idea to "Drafted" in `docs/blog-ideas.md` (it goes in the state PR in step 6).

## 4. Don't

- Publish, or edit a published post, without a PR the owner merges.
- Open a new draft while an earlier `Publish:` PR is still open. Remind the owner instead.
- Invent quotes, numbers, or conversations. A sample thread must be labeled as based on a real
  one, and must come from a real issue.
- Mention the web app, PWA, Supabase, or any backend, or promote downloads (see the rules file).

## 5. Share suggestion

Pick one published post that isn't in `suggestedShares`. Prefer the newest, then the part with
the most visual story (a chat thread, a diagram). Write:

- **LinkedIn:** professional, specific numbers, a link, and an invitation to compare notes.
- **Facebook:** for friends and family. No jargon. What Dean built, and why it's neat or funny.
  Warm, short, and a link.

Both in plain text, with the humanizer pass done. Add the slug to `suggestedShares`.

## 6. Save state and tell the owner

Update `.blog-state.json` (`lastRun` = now in UTC, `lastRepCommit` = `$REP`'s `origin/main`,
`suggestedShares`), plus any `docs/blog-ideas.md` change. Ship them on `claude/blog-state-<date>`
and self-merge.

Then send **one** push notification (the `PushNotification` tool) that lists, as links, each PR
waiting on the owner (Publish, Freshness), and says the share suggestion is in the run summary.
End the run with a short summary:

- PRs opened or updated, with links;
- the share suggestion's LinkedIn and Facebook text, in code blocks;
- anything skipped, and why.

If the run found nothing, send no notification and say so in one line.
