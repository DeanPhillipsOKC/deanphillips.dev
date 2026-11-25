// The tiny model from part 1 of "AI, plainly", with the math part 4 runs on it. Each answer's score is its
// start (a bias) plus the dial from every clue word in the sentence. The scores turn into percentages with
// softmax, and training is the exact rule for this one-layer model with cross-entropy loss:
//   dial += step * (should - guessed), for the start and for each clue word in the sentence.
// Percentages are whole numbers here, as the post shows them, so `nudge` works from the rounded percents
// and keeps dials to two decimals. That way every receipt on the page adds up exactly as printed (the
// rounding moves a turn by under 0.005). scripts/ai-plainly-training-math-check.mjs checks the numbers.
export interface Model { answers: string[]; start: Record<string, number>; dials: Record<string, Record<string, number>>; step: number }
export interface Sentence { text: string; clues: string[]; answer: string }

export const r2 = (x: number) => Math.round(x * 100) / 100;
export function softmax(z: number[]) {
  const m = Math.max(...z), e = z.map((v) => Math.exp(v - m)), t = e.reduce((a, b) => a + b, 0);
  return e.map((v) => v / t);
}
export const scores = (m: Model, clues: string[]) => m.answers.map((a) => r2((m.start[a] ?? 0) + clues.reduce((t, c) => t + m.dials[c][a], 0)));
export const pcts = (m: Model, clues: string[]) => softmax(scores(m, clues)).map((p) => Math.round(p * 100));
/** How surprised it was: how low a chance it gave the right answer (cross-entropy). */
export const surprise = (p: number) => -Math.log(p);

export const clone = (m: Model): Model => JSON.parse(JSON.stringify(m));

/** One guess and one nudge on one sentence. Returns the receipt and the model after. */
export function nudge(m: Model, s: Sentence) {
  const pct = pcts(m, s.clues);
  const should = m.answers.map((a) => (a === s.answer ? 100 : 0));
  const diff = should.map((v, i) => v - pct[i]);
  const turn = diff.map((d) => r2(d * m.step));
  const after = clone(m);
  m.answers.forEach((a, i) => {
    after.start[a] = r2(after.start[a] + turn[i]);
    for (const c of s.clues) after.dials[c][a] = r2(after.dials[c][a] + turn[i]);
  });
  return { pct, should, diff, turn, after };
}

/** The same sentence, round after round. */
export function rounds(m: Model, s: Sentence, n: number) {
  const out: ReturnType<typeof nudge>[] = [];
  let cur = m;
  for (let i = 0; i < n; i++) { const r = nudge(cur, s); out.push(r); cur = r.after; }
  return out;
}

// The game (TrainGame.astro): only one dial per clue word can move (sky to blue, grass to green, night to
// black). Every other dial and every start stays at zero. A round guesses each sentence in turn and nudges
// right after it, with the same rule and step as above, in exact numbers (nothing rounded).
export type Moving = Record<string, string>;
export function gameProbs(d: Record<string, number>, moving: Moving, answers: string[], s: Sentence) {
  return softmax(answers.map((a) => s.clues.reduce((t, c) => t + (moving[c] === a ? d[c] : 0), 0)));
}
export function gameWrong(d: Record<string, number>, moving: Moving, answers: string[], ss: Sentence[]) {
  return ss.reduce((t, s) => t + surprise(gameProbs(d, moving, answers, s)[answers.indexOf(s.answer)]), 0);
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
