#!/usr/bin/env node
// Records the silent social video for the "AI, plainly" training math post (TrainingReel.astro, a reel-only
// figure the post keeps hidden), and saves its link-preview image. Build and preview the site first, then:
//   node scripts/video/ai-plainly-training-math-reel.mjs [post URL]   (default http://localhost:4321/blog/ai-plainly-training-math/)
// Writes public/video/ai-plainly-training-math-reel.mp4 (1080x1350, the 4:5 shape LinkedIn and Facebook feeds
// show biggest) and public/img/og/ai-plainly-training-math.jpg (1200x630). The figure draws itself as a pure
// function of time (every round of training is worked out up front), so every frame is exact no matter how
// slow the screenshots are. Needs ffmpeg on the PATH.
// REEL_STILLS=0,2,4.5 writes only those moments (in seconds) as PNGs to <temp dir>/ai-plainly-training-math-reel/stills
// and stops, which checks a layout in seconds instead of a full recording.
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const url = process.argv[2] ?? 'http://localhost:4321/blog/ai-plainly-training-math/';
const FPS = 30;
const work = join(tmpdir(), 'ai-plainly-training-math-reel');
rmSync(work, { recursive: true, force: true });
mkdirSync(work, { recursive: true });

// PW_CHROME points at a Chrome binary when the pinned Playwright build isn't installed.
const browser = await chromium.launch(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {});
async function open(width, height, mode) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, colorScheme: 'dark' });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate((m) => { document.querySelector('.trl').dataset[m] = '1'; document.body.style.overflow = 'hidden'; }, mode);
  return page;
}

// The video: a poster frame (dots, a wild guess, its misses), measuring the misses, why each is multiplied by
// itself, the score, then 40 rounds of real training with two dials turning,
// ending on the takeaway.
const page = await open(1080, 1350, 'reel');
const total = await page.evaluate(() => window.__trainingReel.total);
if (process.env.REEL_STILLS) {
  mkdirSync(join(work, 'stills'), { recursive: true });
  for (const s of process.env.REEL_STILLS.split(',').map(Number)) {
    await page.evaluate((t) => window.__trainingReel.draw(t), s);
    await page.screenshot({ path: join(work, 'stills', `${s}.png`) });
  }
  await browser.close();
  console.log(`Wrote stills to ${join(work, 'stills')}`);
  process.exit(0);
}
const frames = Math.round(total * FPS);
for (let i = 0; i < frames; i++) {
  await page.evaluate((t) => window.__trainingReel.draw(t), i / FPS);
  await page.screenshot({ path: join(work, `f${String(i).padStart(5, '0')}.png`) });
}
await page.close();
mkdirSync('public/video', { recursive: true });
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(work, 'f%05d.png'),
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', 'public/video/ai-plainly-training-math-reel.mp4']);

// The link preview: "Nobody drew the line." beside the settled line, with the first guess drawn faintly
// (the figure jumps to just after the last round of training whatever time it is given).
const og = await open(1200, 630, 'og');
await og.evaluate(() => window.__trainingReel.draw(25));
await og.screenshot({ path: join(work, 'og.png') });
await og.close();
mkdirSync('public/img/og', { recursive: true });
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', join(work, 'og.png'), '-q:v', '3', 'public/img/og/ai-plainly-training-math.jpg']);
await browser.close();
console.log(`Wrote public/video/ai-plainly-training-math-reel.mp4 (${frames} frames, ${total.toFixed(1)}s) and public/img/og/ai-plainly-training-math.jpg`);
