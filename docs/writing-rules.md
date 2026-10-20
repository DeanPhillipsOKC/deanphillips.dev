# Writing rules for deanphillips.dev

These rules apply to every post, edit, and share draft, whether a person or an agent writes it.
They come from the owner's decisions. The `blog-update` skill reads this file on every run.

## Voice

- Dean writes in the first person: plain, specific, a little dry. Contractions are fine. Hype isn't.
- Run the `humanizer` skill (`.claude/skills/humanizer/SKILL.md`) on every piece of text before it
  goes anywhere. **No em dashes or en dashes, ever.**
- Don't apologize for the work, and don't open with nerves. State what happened and let it stand.
- Every number and claim has to be checked against the RepBunny repo or its GitHub issues. Don't
  write anything you can't point to.
- **Dean's role is the design, not a bystander's.** Never write "AI built it" or "I'm not writing it
  myself" as if he just watched. He designed the system that lets AI agents work autonomously
  without lowering the bar, makes the decisions, and tests everything before it ships, all
  alongside a full-time job. For non-developers: "I make the decisions, they do the typing, and
  nothing goes out without my testing it."

## What RepBunny is, in public

- RepBunny is a strength training log for **iPhone and Android**. Never mention a web app, PWA,
  Supabase, or any backend: those are private to the owner and Christa.
- The automation is safe to run because the shipped app keeps all data on the phone: no accounts,
  no shared database, no servers holding anyone's data. Say so wherever it matters.
- The tester's name is **Christa** (never "Krista").
- **No promotion until RepBunny is in the App Store:** no "download now", no store links, no
  pricing. The posts are about how it's built. repbunny.app may be linked as a place to read more.
- No data from users or support email in posts, beyond the owner's own reports.

## Shape

- Posts are 4 to 5 minutes (about 800 to 1,100 words). If a topic is bigger, make it a series.
- The delivery-team series is `series: ai-delivery-team`. The overview is `part: 0`, and new parts
  take the next number. Exact stats (days, commits, issues, tests) live **only** on the overview.
  Parts say "the full end-to-end suite", not a count.
- The Gesso series (picture to painting lesson) is `series: gesso`, overview `gesso` as `part: 0`,
  with eyebrow "Experiment". It leads with pictures and the interactive Flipbook, CompareSlider, and
  Gallery components, and keeps the reading light. **No costs or prices anywhere in it** (owner's
  call). Its images come from the Gesso repo's lesson runs (a private repo; don't link it).
- Each part opens with one sentence linking the overview, and ends with a "What broke" section
  when there's a real failure to tell.
- Reuse the components in `src/components/blog/` (StatRow, Flow, Steps, Lanes, Callout,
  ChatThread, AskOwner, ReviewCalendar) before writing new ones.

## Share drafts

Each newly published post gets two share drafts, in plain text with no Markdown:

- **LinkedIn:** the professional angle. The hook is the experiment and what it taught. Real
  numbers, a link to the post, and an invitation to compare notes with people doing similar work.
  No "I've been nervous to post this."
- **Facebook:** for friends and family, most of whom aren't developers. No jargon (no "PR",
  "e2e", "lane", "routine"). Say what Dean made and why it's fun or surprising, in a warm,
  everyday voice. Two to four short paragraphs, plus a link. A screenshot suggestion is welcome.
