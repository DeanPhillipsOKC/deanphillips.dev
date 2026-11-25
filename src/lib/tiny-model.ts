// The tiny model from part 1 of "AI, plainly", with the math part 4 runs on it. Nine dials, one from each
// clue word to each answer. An answer's push is the sum of the dials from the clue words in the sentence,
// and the pushes turn into chances with softmax. Training is the exact rule for this one-layer model with
// the standard wrongness (cross-entropy):
//   dial += step * (should - guessed), for each clue word in the sentence.
// Chances are whole percents here, as the post shows them, so `nudge` works from the rounded percents and
// keeps dials to three decimals. That way every receipt on the page adds up exactly as printed (the
// rounding moves a turn by under 0.0025). scripts/ai-plainly-training-math-check.mjs checks the numbers.
export interface Model { answers: string[]; dials: Record<string, Record<string, number>>; step: number }
export interface Sentence { text: string; clues: string[]; answer: string }

export const r3 = (x: number) => Math.round(x * 1000) / 1000;
export function softmax(z: number[]) {
  const m = Math.max(...z), e = z.map((v) => Math.exp(v - m)), t = e.reduce((a, b) => a + b, 0);
  return e.map((v) => v / t);
}
export const pushes = (m: Model, clues: string[]) => m.answers.map((a) => r3(clues.reduce((t, c) => t + m.dials[c][a], 0)));
export const chances = (m: Model, clues: string[]) => softmax(pushes(m, clues));
export const pcts = (m: Model, clues: string[]) => chances(m, clues).map((p) => Math.round(p * 100));

export const clone = (m: Model): Model => JSON.parse(JSON.stringify(m));

/** One guess and one nudge on one sentence. Returns the receipt and the model after. */
export function nudge(m: Model, s: Sentence) {
  const pct = pcts(m, s.clues);
  const should = m.answers.map((a) => (a === s.answer ? 100 : 0));
  const diff = should.map((v, i) => v - pct[i]);
  const turn = diff.map((d) => r3(d * m.step));
  const after = clone(m);
  m.answers.forEach((a, i) => { for (const c of s.clues) after.dials[c][a] = r3(after.dials[c][a] + turn[i]); });
  return { pct, should, diff, turn, after };
}

/** The same sentence, round after round. */
export function rounds(m: Model, s: Sentence, n: number) {
  const out: ReturnType<typeof nudge>[] = [];
  let cur = m;
  for (let i = 0; i < n; i++) { const r = nudge(cur, s); out.push(r); cur = r.after; }
  return out;
}

// The slope ladder (SlopeLadder.astro). One click is 0.1 on a dial, the notch size of part 1's sliders.
export const CLICK = 0.1;
/** Blue's chance (0 to 1) for this sentence with one dial set to x and the rest as they are. */
export function chanceAt(m: Model, s: Sentence, clue: string, answer: string, x: number, of = s.answer) {
  const t = clone(m); t.dials[clue][answer] = x;
  return chances(t, s.clues)[m.answers.indexOf(of)];
}
/** The exact slope of one answer's chance (in points per click) as one dial turns. For softmax it is
 * p(1 - p) for that answer's own dial and -p * q for another answer's dial, times 100 points, times a click. */
export function chanceSlope(m: Model, s: Sentence, answer: string, of = s.answer) {
  const p = chances(m, s.clues), i = m.answers.indexOf(of), j = m.answers.indexOf(answer);
  return 100 * CLICK * (i === j ? p[i] * (1 - p[i]) : -p[i] * p[j]);
}

// The game (TrainGame.astro): only one dial per clue word can move (sky to blue, grass to green, night to
// black). Every other dial stays at zero. A round guesses each sentence in turn and nudges right after it,
// with the same rule and step as above, in exact numbers (nothing rounded). The board shows how far off it
// is, added up: for each sentence, 100 minus the chance it gave the right answer.
export type Moving = Record<string, string>;
export function gameProbs(d: Record<string, number>, moving: Moving, answers: string[], s: Sentence) {
  return softmax(answers.map((a) => s.clues.reduce((t, c) => t + (moving[c] === a ? d[c] : 0), 0)));
}
export function gameOff(d: Record<string, number>, moving: Moving, answers: string[], ss: Sentence[]) {
  return ss.reduce((t, s) => t + 100 * (1 - gameProbs(d, moving, answers, s)[answers.indexOf(s.answer)]), 0);
}
export function gameRound(d: Record<string, number>, moving: Moving, answers: string[], ss: Sentence[], step: number) {
  const next = { ...d }, turn: Record<string, number> = Object.fromEntries(Object.keys(d).map((k) => [k, 0]));
  for (const s of ss) {
    const p = gameProbs(next, moving, answers, s);
    for (const c of s.clues) {
      const a = moving[c], i = answers.indexOf(a);
      const t = step * 100 * ((a === s.answer ? 1 : 0) - p[i]);
      next[c] += t; turn[c] += t;
    }
  }
  return { d: next, turn };
}
