#!/usr/bin/env node
// Makes the two silent loops on a guide card: node scripts/video/owasp-loops.mjs llm06 [...]
// "<slug>-attack" plays the attack, and "<slug>-fixed" plays the fixes landing on the same diagram
// and the attack being stopped. They reuse the card's video scene and config, on a quicker made-up
// schedule since nothing is spoken; a card's `loop` settings override its video config where the
// page's fixes differ from the narrated ones. See lib.mjs (makeLoop).
import { makeLoop } from './lib.mjs';

const at = (n, set) => {
  const lines = Array.from({ length: n }, () => ({ s: 1000, e: 1001 }));
  for (const [i, s] of Object.entries(set)) lines[i] = { s, e: s + 1 };
  return lines;
};

const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error('Usage: node scripts/video/owasp-loops.mjs <slug> [<slug> ...]  (for example llm06)');
  process.exit(2);
}
for (const slug of slugs) {
  const { default: v } = await import(`./owasp/${slug}.mjs`);
  const n = v.script.length;
  const config = { ...v.config, ...v.loop };
  const t = { bubble: 2, wrong: 3, turn: 4, ramp: 2, ...config.t };
  const turn = t.turn;
  // Both loops start at 3.4s, once the scene has drawn itself in, so each repeat starts on a whole
  // diagram instead of a blank one.
  const start = 3.4;
  // The attack: the bad request arrives and does its damage.
  const first = Math.min(t.bubble, t.ramp), early = {};
  for (let i = 0; i < turn; i++) early[i] = i < first ? 0 : 4.4 + 1.6 * (i - first) / Math.max(1, t.wrong - first);
  await makeLoop({ name: `${slug}-attack`, scene: v.scene, config, start, timeline: { lines: at(n, early), total: early[t.wrong] + 3.6 } });
  // The fix: the same calm diagram gets each fix in turn, and then the attack runs again.
  const fixed = { [turn]: -10, [turn + 1]: 4.0, [turn + 2]: 5.4, [turn + 3]: 6.8, [turn + 4]: 8.4 };
  for (let i = 0; i < turn; i++) fixed[i] = -20;
  await makeLoop({ name: `${slug}-fixed`, scene: v.scene, config, start, timeline: { lines: at(n, fixed), total: 12.4 } });
}
