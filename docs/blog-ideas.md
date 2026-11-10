# Post ideas

The owner and the `blog-update` routine both add here. When an idea becomes a draft, move it to
"Drafted" with the slug. Write a post only when the real material exists (the issue shipped and
has results).

## Waiting for material

- **When the agent's own safety check blocks the reviewer** (RepBunny #1020, #1022, #1024): the
  review agent passed clean PRs, then its session's permission check refused the merge call as
  "merge without review" (part 5, part 7, and PR #1007 and #1018 on 2026-11-05, which the owner
  merged by hand). The fix sends tier 1 and 2 through GitHub auto-merge like tier 3, so no session
  calls merge. Could be a short governance part or a section in the going-public post. Wait until
  a week of tier 1 and 2 merges have gone through the new path with no hand merges.

## Drafted

- **Going public** (RepBunny #937, #942, #943, #944, #945, #946, #947, #949): the `going-public`
  series, drafted 2026-11-10 with the owner as unlisted drafts. `going-public` (part 0, why the
  code is public and the backlog isn't, the snapshot, the license), `going-public-cutover` (part 1,
  the day of the move and what broke), and `going-public-minutes` (part 2, absorbs the parked
  `ai-governance-bill` material, then per-PR e2e and the lanes choosing where e2e runs). Wait about
  a week before publishing so it can say the first public releases and lane PRs held up. On
  publish: an OG image, the homepage's "How I build" testing line and the "RepBunny is the one you
  can try yourself" note (the code is public now), and the resume's pipeline bullets (e2e on every
  pull request, public code). `ai-governance-bill` stays an unlisted draft.
- **Backups with no servers** (RepBunny #432, #869, #871, #874, #875): `ai-delivery-team-backup`, part 7. Drafted
  2026-11-01 by the routine. The review agent caught the lost-phone overwrite on PR #870, then the
  copy went on by default the same morning. Published 2026-11-02 (PR #35). The overview's
  "seven-part" description is in Freshness PR #41.
- **The adversarial review agent** (RepBunny #374): `ai-delivery-team-review`, part 5. Drafted
  2026-10-18, Publish PR #5.
- **Sprint review videos** (RepBunny #605, #606, #607, #663, #664, #668): `ai-delivery-team-sprint-review`,
  part 6. Drafted 2026-10-19 with the owner, before a review with a "change" or "pull" existed;
  it embeds a sample cut in Jessica's voice (`public/video/sprint-review-sample.mp4`). Freshness:
  once a review sends a change back, add it to the reply section (done in Freshness PR #31,
  the v1.5.0 review that pulled the guided first workout).
- **From self-merged to governed, with a threat model** (RepBunny #689, tracking #688): became the
  `ai-governance` series (`ai-governance`, `ai-governance-threat-model`, `ai-governance-hole`),
  written with the owner and published 2026-10-22.
- **What governance cost in Actions minutes** (RepBunny #904, #905): `ai-governance-bill`, part 3
  of the governance series. Drafted 2026-11-04 with the owner, then **parked by the owner the same
  day** (Publish PR #39 closed): the going-public story is the better frame. Stays an unlisted draft;
  reuse its material there. Freshness: after a full month under
  the guard, update "Two days in" with the month's total and whether the cap of 10 changed.
