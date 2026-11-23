#!/usr/bin/env node
// Records the opening animation of the "AI, plainly" inference post (NextWord.astro) as a silent social
// video, and saves its link-preview image. Build and preview the site first, then:
//   node scripts/video/next-word-reel.mjs [post URL]   (default http://localhost:4321/blog/ai-plainly/)
// Writes public/video/ai-plainly-reel.mp4 (1080x1350, the 4:5 shape LinkedIn and Facebook feeds show
// biggest) and public/img/og/ai-plainly.jpg (1200x630). The component draws itself as a pure function of
// time, so every frame is exact no matter how slow the screenshots are. Needs ffmpeg on the PATH.
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const url = process.argv[2] ?? 'http://localhost:4321/blog/ai-plainly/';
const FPS = 30;
const work = join(tmpdir(), 'ai-plainly-reel');
rmSync(work, { recursive: true, force: true });
mkdirSync(work, { recursive: true });

// PW_CHROME points at a Chrome binary when the pinned Playwright build isn't installed.
const browser = await chromium.launch(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {});
async function open(width, height) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, colorScheme: 'dark' });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => { document.querySelector('.nw').dataset.reel = '1'; document.body.style.overflow = 'hidden'; });
  // The figure changes size in reel mode, so the 3D space has to measure itself again.
  await page.waitForTimeout(200);
  await page.evaluate(() => window.__nextWord.fit());
  return page;
}

// The video: the whole loop once, then a short hold on the finished answer.
const page = await open(1080, 1350);
const total = await page.evaluate(() => window.__nextWord.total);
const frames = Math.round(total * FPS);
for (let i = 0; i < frames; i++) {
  await page.evaluate((t) => window.__nextWord.draw(t), Math.min(i / FPS, total - 0.001));
  await page.screenshot({ path: join(work, `f${String(i).padStart(5, '0')}.png`) });
}
await page.close();
mkdirSync('public/video', { recursive: true });
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(work, 'f%05d.png'),
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', 'public/video/ai-plainly-reel.mp4']);

// The link preview: the 3D space at the moment the AI takes its second-best guess.
const og = await open(1200, 630);
await og.evaluate(() => {
  const nw = document.querySelector('.nw');
  nw.style.setProperty('--reel-size', '2.4cqw');
  nw.style.setProperty('--reel-space', '1200 / 330');
  nw.querySelector('.nw-q').style.display = 'none';
  nw.querySelector('.nw-guess').style.display = 'none';
  window.__nextWord.fit();
  nw.style.setProperty('--reel-title', '3.4cqw');
  nw.querySelector('.nw-reel-end').style.display = 'none';
  nw.style.padding = '3cqw 0';
  nw.style.gap = '1cqw';
  window.__nextWord.draw(5 * 1.5 + 1.4);
});
await og.waitForTimeout(100);
await og.evaluate(() => {
  window.__nextWord.draw(5 * 1.5 + 1.4);
});
await og.screenshot({ path: join(work, 'og.png') });
await og.close();
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', join(work, 'og.png'), '-q:v', '3', 'public/img/og/ai-plainly.jpg']);
await browser.close();
console.log(`Wrote public/video/ai-plainly-reel.mp4 (${frames} frames, ${total.toFixed(1)}s) and public/img/og/ai-plainly.jpg`);
