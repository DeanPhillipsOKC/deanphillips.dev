---
name: humanizer
description: Rules for making writing sent on the user's behalf read like a person wrote it, not an AI. Use before finalizing any outward-facing text in the user's name or their product's: email and reply drafts, support responses, GitHub issue comments others will read, release notes, App Store or site copy, social posts, and messages to other people. Lists the tells to remove (em dashes first), drawn from Wikipedia's "Signs of AI writing" guide, plus a final self-check.
---

# humanizer

Anything sent on the user's behalf should read like they wrote it themselves: a busy, friendly
person typing a quick, specific message. Draft normally, then run this pass before the text goes
anywhere (a Gmail draft, a GitHub comment, a store listing, a post).

If the project has a voice or brand doc (for RepBunny, `docs/brand-identity.md`), follow it too.
Where they conflict, the project's doc wins on tone and this file wins on AI tells.

## The rules that matter most

1. **No em dashes (—), ever.** Not in pairs, not for asides, not for emphasis. Use a period, a
   comma, parentheses, or a colon. Rewrite the sentence if none fits. En dashes (–) used as em
   dashes count too. A hyphen in a compound word ("follow-up") is fine.
2. **Get to the point.** The first sentence answers the question or says what happened. No warm-up.
3. **Be specific.** Name the actual screen, button, version, date, or number. Vague praise and
   vague reassurance are the biggest tell after em dashes.
4. **Keep it short.** Cut every sentence that restates another one. Most replies are 3 to 6
   sentences.
5. **Plain words, contractions, normal punctuation.** Write "it's", "we'll", "don't". Use straight
   quotes (' and "), not curly ones.

## Words and phrases to avoid

These show up far more in AI text than in human writing. Use a plain word or cut it.

- **Inflated words:** delve, tapestry, testament, intricate, meticulous, pivotal, crucial, vital,
  paramount, landscape, realm, foster, garner, underscore, showcase, highlight (as a verb),
  enhance, elevate, empower, unlock, interplay, multifaceted, nuanced, navigate (anything but
  directions), embark, journey (anything but travel), robust, leverage, seamless, streamline,
  holistic, synergy, cutting-edge, game-changer, ever-evolving, dynamic, comprehensive, notably,
  invaluable, commendable, profound, resonate, boasts, vibrant, bustling, nestled, renowned,
  enduring, rich (as in "rich history").
- **Importance and legacy padding:** "stands as a testament to", "plays a vital/pivotal role",
  "underscores the importance of", "reflects a broader", "marks a significant milestone",
  "a key turning point", "leaves a lasting legacy".
- **Editorializing and signposting:** "it's important to note", "it's worth noting", "notably",
  "keep in mind that", "rest assured", "needless to say".
- **Stacked transitions:** moreover, furthermore, additionally, in addition, consequently,
  that being said, on the other hand. One "also" or "but" does the job.
- **Wrap-up lines:** "In summary", "In conclusion", "Overall", "Ultimately", or a closing sentence
  that repeats the message.
- **Chatbot openers and closers:** "Great question!", "Certainly!", "Absolutely!", "Of course!",
  "I hope this email finds you well", "I hope this helps", "Feel free to reach out",
  "Don't hesitate to contact us", "Let me know if you have any other questions", "Happy to help!",
  "Thank you for reaching out" as the whole first line.
- **Over-apologizing and over-thanking:** one "sorry" or one "thanks" per message, where it's
  earned.
- **Vague attributions:** "experts say", "many users find", "studies show", "it is widely
  regarded". Say who, or drop it.
- **Hedging stacks:** "may potentially", "could possibly", "generally tends to", "in some cases it
  might". One hedge at most, and only if you're actually unsure.

## Sentence patterns to avoid

- **"Not X, but Y" / "It's not just X, it's Y" / "Not only X but also Y."** Say Y.
- **Threes everywhere.** Three adjectives, three parallel clauses, three bullet points by reflex.
  Use the number of items you actually have.
- **Trailing "-ing" commentary:** "..., ensuring a smooth experience", "..., highlighting our
  commitment to...", "..., reflecting...". Cut it or make it its own plain sentence.
- **False ranges:** "from beginners to seasoned lifters", "everything from X to Y" when there's no
  real range.
- **Synonym cycling:** calling the same thing "the app", "the platform", "the tool", "the solution"
  to avoid repeating a word. Repeat the word.
- **Rhetorical questions and dramatic setups:** "So what does this mean for you?", "Here's the
  thing:", "The result?"
- **Same-shaped sentences.** Vary length naturally. A short sentence is fine. So is a fragment.
- **Promises and filler reassurance:** "We're committed to providing the best experience",
  "Your feedback is incredibly valuable to us". Say what will actually happen.

## Formatting tells

- **No Markdown where it won't render** (email bodies, store listings, most forms): no `**bold**`,
  `#` headings, or `-` bullets typed as text.
- **No bold-label bullets** ("**Speed:** It's fast.") in messages to people.
- **No emoji** unless the brand clearly uses them, and never as bullet markers.
- **No Title Case Headings** in casual messages, and usually no headings at all in an email.
- **No "Subject:" line inside the body**, no placeholders like "[Your Name]" or "[Date]", no
  leftover template brackets.
- **Lists only when the content is a real list** (steps to follow, several distinct items).
  A reply to a person is usually prose.
- **One exclamation point at most**, and only if the user would really say it.

## Final self-check (do it every time)

Before handing text off, check it against this list and fix what you find:

1. Search for `—` and `–`. There should be none.
2. Search for the words and phrases above. Replace each one with a plain word or cut it.
3. Read the first sentence alone. Does it carry the main point? If not, move the point up.
4. Read the last sentence alone. If it only restates or offers generic help, cut it.
5. Count the sentences. Could two go without losing anything? Cut them.
6. Would the user say this out loud to a person they like? If it sounds like a press release or a
   help-desk script, rewrite it plainly.

## Example

Before:
> Thank you so much for reaching out! We truly appreciate your feedback — it plays a vital role in
> helping us enhance the RepBunny experience. Rest assured, our team is actively looking into the
> issue you encountered, ensuring a seamless workout-logging journey moving forward. Don't hesitate
> to reach out if you have any other questions!

After:
> Thanks for sending this. The set you logged on the Progress screen didn't save because of a bug
> on our end, and I've got it logged to fix. If you can tell me which phone you're on, that'll help
> me track it down.
>
> Dean
