#!/usr/bin/env node
// Checks every number on the "AI, plainly" part 4 visuals against its own copy of the math (written apart
// from src/lib/tiny-model.ts on purpose): the real softmax, slopes worked out by actually turning a dial a
// tiny bit (not from the formula the page uses), the standard wrongness (cross-entropy) and its slope, and
// the update rule dial += step * (should - guessed). Run `npm run build` first, then:
//   node scripts/ai-plainly-training-math-check.mjs
// It reads dist/blog/ai-plainly-training-math/index.html, pulls the numbers out of each figure, and exits 1
// on any mismatch. It also checks that each receipt adds up as printed.
import { readFileSync } from 'node:fs';

const html = readFileSync('dist/blog/ai-plainly-training-math/index.html', 'utf8');
const data = JSON.parse(readFileSync('src/data/ai-plainly/ai-plainly-training-math.json', 'utf8'));
const story = JSON.parse(readFileSync('src/data/ai-plainly/inference.json', 'utf8'));
const M = data.model, A = M.answers, S = story.dials.sentences, sky = S[0];
let bad = 0;
const ok = (cond, msg) => { if (!cond) { bad++; console.log('FAIL', msg); } else console.log('ok  ', msg); };
const fig = (cls) => { const i = html.indexOf(`class="${cls} `); const j = html.indexOf('</figure>', i); return html.slice(i, j); };
const text = (s) => s.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, ' ').replace(/ /g, ' ').replace(/\s+/g, ' ');
const sg = (x, d) => (x > 0 ? '+' : x < 0 ? '−' : '') + Math.abs(x).toFixed(d);

const soft = (z) => { const e = z.map(Math.exp); const t = e.reduce((a, b) => a + b); return e.map((v) => v / t); };
const prob = (m, clues) => soft(A.map((a) => clues.reduce((t, c) => t + m.dials[c][a], 0)));
const pct = (m, clues) => prob(m, clues).map((p) => Math.round(p * 100));
const copy = (m) => JSON.parse(JSON.stringify(m));
const withDial = (m, c, a, dx) => { const n = copy(m); n.dials[c][a] += dx; return n; };
function nudge(m, s) {
  const p = pct(m, s.clues), should = A.map((a) => (a === s.answer ? 100 : 0)), diff = should.map((v, i) => v - p[i]);
  const turn = diff.map((x) => Math.round(x * M.step * 1000) / 1000);
  const n = copy(m);
  A.forEach((a, i) => s.clues.forEach((c) => { n.dials[c][a] = +(n.dials[c][a] + turn[i]).toFixed(3); }));
  return { p, should, diff, turn, n };
}
const blue = (m) => 100 * prob(m, sky.clues)[0];
const h = 1e-6;
// Slope of blue's chance, in points per click (0.1), by turning the dial a hair.
const slope = (a) => ((blue(withDial(M, 'sky', a, h)) - blue(withDial(M, 'sky', a, -h))) / (2 * h)) * 0.1;

// 1. GuessBars.
const g = text(fig('gbr'));
const p0 = pct(M, sky.clues);
ok(p0.join() === '41,34,25', `opening guess is ${p0.join('/')}`);
A.forEach((a, i) => ok(g.includes(`${p0[i]}%should be ${a === 'blue' ? 100 : 0}%`.replace('%should', '% should')), `opening ${a} bar and its should-be`));

// 2. SlopeLadder.
const l = text(fig('sld'));
const b0 = blue(M);
ok(l.includes(`At 0.5, blue gets ${Math.round(b0)}%. One click up adds about ${slope('blue').toFixed(1)} points`), `step 1: ${b0.toFixed(2)}%, slope ${slope('blue').toFixed(3)} per click`);
const perUnit = slope('blue') * 10;
for (const [turn, lab] of [[data.ladder.small, 'small'], [data.ladder.big, 'big']]) {
  const line = b0 + perUnit * turn, real = blue(withDial(M, 'sky', 'blue', turn));
  const fmt = lab === 'small' ? (x) => `${x.toFixed(1)}%` : (x) => `${Math.round(x)}%`;
  console.log(`     ${lab} turn ${turn}: slope says ${line.toFixed(2)}, really ${real.toFixed(2)}`);
  ok(l.includes(`${lab}, ${Math.round(turn * 10)} clicks ${fmt(line)} ${fmt(real)}`), `step 2 ${lab} turn row`);
}
ok(b0 + perUnit * data.ladder.big > 100, 'step 2 big turn promises more than 100%');
const sb = slope('blue'), sgr = slope('green'), sbk = slope('black');
const both = blue(withDial(withDial(M, 'sky', 'blue', 0.1), 'sky', 'green', 0.1)) - b0;
console.log(`     slopes blue ${sb.toFixed(3)} green ${sgr.toFixed(3)} black ${sbk.toFixed(3)}, both one click really ${both.toFixed(3)}`);
ok(l.includes(`sky → blue ${sg(sb, 1)} points`) && l.includes(`sky → green ${sg(sgr, 1)} points`), 'step 3 slopes');
ok(l.includes(`both ${sg(sb, 1)} − ${Math.abs(sgr).toFixed(1)} = ${sg(sb + sgr, 1)} really ${sg(both, 1)}`) && Math.abs(sb + sgr - both) < 0.05, 'step 3 the two add, and match the real change');
ok(l.includes(`sky ↑${sg(sb, 1)} ↓${sg(sgr, 1)} ↓${sg(sbk, 1)} grass 0 0 0 night 0 0 0`), 'step 4 grid of nine slopes');
for (const c of ['grass', 'night']) for (const a of A) ok(Math.abs(blue(withDial(M, c, a, 0.1)) - b0) < 1e-12, `step 4 ${c} → ${a} really has slope 0`);
// Step 5: the slope of the standard wrongness (minus log of the right answer's chance), downhill, for each
// answer's sky dial, is exactly should minus guessed (as fractions).
const wrong = (m) => -Math.log(prob(m, sky.clues)[0]);
const pe = prob(M, sky.clues);
A.forEach((a, i) => {
  const down = -(wrong(withDial(M, 'sky', a, h)) - wrong(withDial(M, 'sky', a, -h))) / (2 * h);
  ok(Math.abs(down - ((a === 'blue' ? 1 : 0) - pe[i])) < 1e-6, `step 5 ${a}: downhill slope ${down.toFixed(4)} = should minus guessed ${((a === 'blue' ? 1 : 0) - pe[i]).toFixed(4)}`);
});
ok(Math.abs(sb / 10 - pe[0] * (1 - pe[0])) < 1e-6 && Math.abs(pe[0] * (1 - pe[0]) - (1 - pe[0])) > 0.1, 'the chance slope is p(1 - p), not should minus guessed, so the page keeps them apart');

// 3. NudgeReceipt.
const r = text(fig('nrc'));
const n1 = nudge(M, sky);
A.forEach((a, i) => {
  ok(n1.should[i] - n1.p[i] === n1.diff[i] && Math.abs(n1.diff[i] * M.step - n1.turn[i]) < 1e-12, `receipt ${a}: ${n1.should[i]} - ${n1.p[i]} = ${n1.diff[i]}, x ${M.step} = ${n1.turn[i]}`);
  ok(r.includes(`${n1.should[i]} − ${n1.p[i]} = ${sg(n1.diff[i], 0)}`) && r.includes(`× ${M.step} = ${sg(n1.turn[i], 3)}`), `receipt ${a} row printed`);
});
ok(n1.diff.reduce((x, y) => x + y) === 0, 'the misses cancel out');
const after = pct(n1.n, sky.clues);
ok(r.includes(`blue 41% → ${after[0]}%`), `receipt guess after is ${after[0]}%`);

// 4. RoundStrip.
const st = text(fig('rnd'));
let m = copy(M); const trail = [];
for (let k = 0; k < data.strip; k++) { const x = nudge(m, sky); trail.push([x.p[0], x.turn[0], x.diff[0]]); m = x.n; }
console.log('     strip rounds', JSON.stringify(trail));
trail.forEach(([p, t], k) => ok(st.includes(`${k + 1} ${p}% +${t.toFixed(3)}`), `strip round ${k + 1}: ${p}% turn +${t.toFixed(3)}`));
ok(st.includes(`Should minus guessed: ${trail.map((x) => x[2]).join(', ')}.`), 'strip miss list');
for (let k = 1; k < trail.length; k++) ok(trail[k][1] < trail[k - 1][1] && trail[k][0] > trail[k - 1][0], `round ${k + 1} climbs and its nudge shrinks`);

// 5. TrainGame: how far off, added up.
const mv = data.game.moving;
const gp = (d, s) => soft(A.map((a) => s.clues.reduce((t, c) => t + (mv[c] === a ? d[c] : 0), 0)));
const off = (d) => S.reduce((t, s) => t + 100 * (1 - gp(d, s)[A.indexOf(s.answer)]), 0);
let d = { sky: 0, grass: 0, night: 0 }; const tr = [off(d)];
for (let k = 0; k < data.game.rounds; k++) { for (const s of S) { const p = gp(d, s); for (const c of s.clues) { const a = mv[c]; d[c] += M.step * 100 * ((a === s.answer ? 1 : 0) - p[A.indexOf(a)]); } } tr.push(off(d)); }
console.log('     game trail', tr.slice(0, 7).map((v) => v.toFixed(0)).join(' '), '...', tr[tr.length - 1].toFixed(0));
const gm = text(fig('tgm'));
ok(gm.includes(`How far off, added up ${tr[0].toFixed(0)} ${tr[tr.length - 1].toFixed(0)}`), 'game still table totals');
for (const c of Object.keys(mv)) ok(gm.includes(`${c} → ${mv[c]} dial 0.0 ${d[c].toFixed(1)}`), `game still ${c} dial ${d[c].toFixed(1)}`);
ok(tr.every((v, k) => !k || v < tr[k - 1]), 'game: how far off drops every round');

// 6. TrainingReceipt and the last line.
ok(405000000000 - 9 === 404999999991 && html.includes('404,999,999,991'), 'closing line subtraction');
ok(text(fig('trc')).toLowerCase().includes('dials tiny model 9'), 'tiny model has 9 dials');
ok(!/score/i.test(text(html.slice(html.indexOf('<article'), html.indexOf('</article>')))), 'the word "score" appears nowhere in the post');

console.log(bad ? `\n${bad} problem(s)` : '\nAll numbers check out.');
process.exit(bad ? 1 : 0);
