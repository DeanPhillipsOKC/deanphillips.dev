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
  a week of tier 1 and 2 merges have gone through the new path with no hand merges. As of
  2026-11-15 nothing has merged in the public code repo since Nov 10 (the open issues are
  all needs-review or waiting on the owner), so there's no week of merges to point to yet.
  Still true on 2026-11-22: no commits to repbunny-code since Nov 10 (`4dd5901`).
- **Claude writes a neural network's weights by hand** (experiment, not started; from TLDR AI,
  2026-11-18): two articles show frontier models reading and writing network weights directly, with no
  training. Fable 5.2 hand-built an image classifier the way 1990s researchers did, and GPT-6 Astra
  worked out what a network was for from its raw weights. Small weekend version: have Claude write
  the weights of a tiny network for a toy problem (XOR, a small digit set), check it against a trained
  one, and write up how it went about it. Material exists only once the experiment has been run.

## AI, plainly (series queue)

Explainers for people who use AI but haven't looked under the hood, developers included. Keep the
visuals plain and readable for someone who hasn't read anything yet (see the 3D note under the
inference post). Owner's ideas, 2026-11-24. Suggested order:

- **Tools** (promised at the end of part 0): why a model that can only guess words can still search
  the web, read files, and run code. The model writes a request, a regular program does the work, and
  the result is pasted into the conversation. Search tools are also where "find the nearest match in a
  big space of numbers" really happens (retrieval), so the owner's original picture of inference
  belongs here.
- **The agentic loop**: the inference loop wrapped in a bigger loop of think, use a tool, read the
  result, repeat, until the job is done. Can link the Gesso agent-loop post as a real example.
- **The math, with nothing past arithmetic**: weights as "how much one thing pushes another", slope
  as "how far up for each step over" (no formulas or symbols), training as nudging a line until it
  fits the points, and distance and "lining up" in a space with many directions as comparing two
  long lists of numbers item by item. The punchline is that it's multiplying and adding, billions of
  times. Builds on the DialDemo (a dial is a slope).
- **Format idea**: a card-based "AI, plainly" field guide in the style of the OWASP page (one concept
  per card, same parts on every card, each card shareable on its own), with each card linking to the
  post that goes deep. Decide with the owner before building.

## Drafted

- **AI, plainly: inference** (owner's idea, 2026-11-23): `ai-plainly`, part 0 of a new `ai-plainly`
  series explaining AI to non-developers with the Feynman technique. Drafted 2026-11-23 and
  published the same day (after an adversarial beginner review, PR #73). Opens with the owner's own first explanation (search the training data as vectors) as the gap
  the technique finds. Interactive pieces: NextWord (the opening animation with probability bars, also recorded as the social
  video `public/video/ai-plainly-reel.mp4` by `scripts/video/next-word-reel.mjs`), StudyVsExam,
  TokenSplit, WordMap, AttentionDemo, BeTheModel, and a GuessCards quiz. All percentages and IDs are
  labeled as made up. Next parts it promises: tools (web search, files, running code), then agents.
  A 3D token cloud with a glowing "thought" point and a blue trail was tried for both the post and the
  reel (PRs #70, #71) and dropped by the owner on 2026-11-23. It looked cool but cluttered, hid the
  picked words, and made inference feel mysterious, which works against a series meant to demystify
  it. Keep this series' visuals plain and readable for someone who hasn't read the post.
- **Going public** (RepBunny #937, #942, #943, #944, #945, #946, #947, #949): the `going-public`
  series, drafted 2026-11-10 with the owner as unlisted drafts. `going-public` (part 0, why the
  code is public and the backlog isn't, the snapshot, the license), `going-public-cutover` (part 1,
  the day of the move and what broke), and `going-public-minutes` (part 2, absorbs the parked
  `ai-governance-bill` material, then per-PR e2e and the lanes choosing where e2e runs). Wait about
  a week before publishing so it can say the first public releases and lane PRs held up. As of 2026-11-15, v1.0.37 and
  v1.0.38 shipped from the public repo and its PRs #6 to #13 merged by Nov 10.
  Nothing has merged there since (still true on 2026-11-22), so the "held up" line has
  only those two releases to point to. On
  publish: an OG image, the homepage's "How I build" testing line and the "RepBunny is the one you
  can try yourself" note (the code is public now). The resume already covers e2e on every pull
  request and the public code (updated 2026-11-10). `ai-governance-bill` stays an unlisted draft.
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
