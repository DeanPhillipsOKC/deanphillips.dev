# Post ideas

The owner and the `blog-update` routine both add here. When an idea becomes a draft, move it to
"Drafted" with the slug. Write a post only when the real material exists (the issue shipped and
has results).

## Waiting for material

- **The adversarial review agent** (RepBunny #374). Wait until #374 ships and has reviewed real
  PRs. Lead with the 2026-10-12 dispatcher outage (commit c2ded50 lowered `issues: write` to
  `issues: read`, and a green gate shipped it). Check whether replaying that diff produced a
  blocker, as #374's acceptance requires. Part 2 of the series already teases this post.
  Status 2026-10-12: #374 shipped in commit 9f7a508, but `fire-review.mjs` exits early until the
  routine ID and token are set, so it hasn't reviewed a real PR yet. Wait for its first reviews.

## Drafted

(none yet)
