#!/usr/bin/env node
// Checks every number on the "AI, plainly" part 4 visuals against its own copy of the math (written apart
// from src/lib/tiny-model.ts on purpose): the real softmax, the surprise score, and the update rule
// dial += step * (should - guessed). Run `npm run build` first, then:
//   node scripts/ai-plainly-training-math-check.mjs
// It reads dist/blog/ai-plainly-training-math/index.html, pulls the numbers out of each figure, and exits 1
// on any mismatch. It also checks that each receipt adds up as printed.
import { readFileSync } from 'node:fs';

const html = readFileSync('dist/blog/ai-plainly-training-math/index.html', 'utf8');
const data = JSON.parse(readFileSync('src/data/ai-plainly/ai-plainly-training-math.json', 'utf8'));
const story = JSON.parse(readFileSync('src/data/ai-plainly/inference.json', 'utf8'));
const M = data.model, A = M.answers, S = story.dials.sentences;
let bad = 0;
const ok = (cond, msg) => { if (!cond) { bad++; console.log('FAIL', msg); } else console.log('ok  ', msg); };
const fig = (cls) => { const i = html.indexOf(`class="${cls} `); const j = html.indexOf('</figure>', i); return html.slice(i, j); };
const text = (s) => s.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ');

const soft = (z) => { const e = z.map(Math.exp); const t = e.reduce((a, b) => a + b); return e.map((v) => v / t); };
const score = (m, clues) => A.map((a) => m.start[a] + clues.reduce((t, c) => t + m.dials[c][a], 0));
const pct = (m, clues) => soft(score(m, clues)).map((p) => Math.round(p * 100));
const copy = (m) => JSON.parse(JSON.stringify(m));
function nudge(m, s) {
  const p = pct(m, s.clues), should = A.map((a) => (a === s.answer ? 100 : 0)), diff = should.map((v, i) => v - p[i]);
  const turn = diff.map((x) => Math.round(x * M.step * 100) / 100);
  const n = copy(m);
  A.forEach((a, i) => { n.start[a] = +(n.start[a] + turn[i]).toFixed(2); s.clues.forEach((c) => { n.dials[c][a] = +(n.dials[c][a] + turn[i]).toFixed(2); }); });
  return { p, should, diff, turn, n };
}
const sky = S[0], night = S[2];

// 1. GuessScore: the guess and the surprise rows.
const g = text(fig('gsc'));
const p0 = pct(M, sky.clues);
ok(p0.join() === '41,34,25', `opening guess is ${p0.join('/')}`);
ok(Math.abs(p0.reduce((a, b) => a + b) - 100) === 0, 'opening guess adds to 100');
for (const [c, v] of [[90, 0.1], [41, 0.9], [10, 2.3], [1, 4.6]]) ok((-Math.log(c / 100)).toFixed(1) === v.toFixed(1) && g.includes(`${c}%`) && g.includes(v.toFixed(1)), `surprise at ${c}% is ${v}`);

// 2. SlopeLadder: blue's numbers.
const l = text(fig('sld'));
const b = (c) => M.dials[c].blue;
ok(l.includes(`The sky to blue dial is ${b('sky').toFixed(1)}`), 'ladder slope is the sky to blue dial');
ok(l.includes(`Bottom right is 0.5 + 1.0 − 0.5 = ${(M.start.blue + b('sky') + b('night')).toFixed(1)}`), 'ladder sheet adds up');
const ns = score(M, night.clues)[0];
ok(Math.abs(ns - 1.0) < 1e-9 && l.includes("blue's score 1.0"), `ladder night score for blue is ${ns}`);
ok(l.includes('That\'s the 41% from the top'), 'ladder lands on 41%');
for (const [i, a] of A.entries()) ok(l.includes(`${a} ${M.start[a].toFixed(1)}`) && l.includes(`${score(M, sky.clues)[i].toFixed(1)} ${p0[i]}%`), `ladder row ${a}`);

// 3. NudgeReceipt: should - guessed = miss, x step = turn, guess after.
const r = text(fig('nrc'));
const n1 = nudge(M, sky);
A.forEach((a, i) => {
  ok(n1.should[i] - n1.p[i] === n1.diff[i], `receipt ${a}: ${n1.should[i]} - ${n1.p[i]} = ${n1.diff[i]}`);
  const sgn = (x, d) => (x > 0 ? '+' : x < 0 ? '−' : '') + Math.abs(x).toFixed(d);
  ok(r.includes(`${n1.should[i]} − ${n1.p[i]} = ${sgn(n1.diff[i], 0)}`) && r.includes(`× 0.01 = ${sgn(n1.turn[i], 2)}`), `receipt ${a} row printed`);
  ok(Math.abs(n1.diff[i] * 0.01 - n1.turn[i]) < 1e-9, `receipt ${a}: ${n1.diff[i]} x 0.01 = ${n1.turn[i]}`);
});
ok(n1.diff.reduce((a, b2) => a + b2) === 0, 'the misses cancel out (should and guessed both add to 100)');
const after = pct(n1.n, sky.clues);
ok(r.includes(`blue 41% → ${after[0]}%`), `receipt guess after is ${after[0]}%`);

// 4. RoundStrip: six rounds of the same sentence.
const st = text(fig('rnd'));
let m = copy(M); const trail = [];
for (let k = 0; k < data.strip; k++) { const x = nudge(m, sky); trail.push([x.p[0], x.turn[0], x.diff[0]]); m = x.n; }
console.log('     strip rounds', JSON.stringify(trail));
trail.forEach(([p, t], k) => ok(st.includes(`${k + 1} ${p}% +${t.toFixed(2)}`), `strip round ${k + 1}: ${p}% turn +${t.toFixed(2)}`));
ok(st.includes(`Should minus guessed: ${trail.map((x) => x[2]).join(', ')}.`), 'strip miss list');
for (let k = 1; k < trail.length; k++) ok(trail[k][1] < trail[k - 1][1] && trail[k][0] > trail[k - 1][0], `round ${k + 1} climbs and its nudge shrinks`);

// 5. TrainGame: start, rounds, and the before/after table.
const mv = data.game.moving;
const gp = (d, s) => soft(A.map((a) => s.clues.reduce((t, c) => t + (mv[c] === a ? d[c] : 0), 0)));
const wrong = (d) => S.reduce((t, s) => t - Math.log(gp(d, s)[A.indexOf(s.answer)]), 0);
let d = { sky: 0, grass: 0, night: 0 }; const tr = [wrong(d)];
for (let k = 0; k < data.game.rounds; k++) { for (const s of S) { const p = gp(d, s); for (const c of s.clues) { const a = mv[c]; d[c] += M.step * 100 * ((a === s.answer ? 1 : 0) - p[A.indexOf(a)]); } } tr.push(wrong(d)); }
console.log('     game trail', tr.slice(0, 7).map((v) => v.toFixed(2)).join(' '), '...', tr[tr.length - 1].toFixed(2));
const gm = text(fig('tgm'));
ok(gm.includes(`Total wrongness ${tr[0].toFixed(2)} ${tr[tr.length - 1].toFixed(2)}`), 'game still table totals');
for (const c of Object.keys(mv)) ok(gm.includes(`${c} → ${mv[c]} dial 0.0 ${d[c].toFixed(1)}`), `game still ${c} dial ${d[c].toFixed(1)}`);
for (let k = 1; k < tr.length; k++) if (!(tr[k] < tr[k - 1])) ok(false, `game wrongness drops every round (round ${k})`);

// 6. TrainingReceipt: the dial count joke at the end.
ok(405000000000 - 12 === 404999999988 && html.includes('404,999,999,988'), 'closing line subtraction');
ok(html.includes('12 dials') && text(fig('trc')).toLowerCase().includes('dials tiny model 12'), 'tiny model has 12 dials (9 plus 3 starts)');

console.log(bad ? `\n${bad} problem(s)` : '\nAll numbers check out.');
process.exit(bad ? 1 : 0);
