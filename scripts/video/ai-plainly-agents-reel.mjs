#!/usr/bin/env node
// Records the silent social video for the "AI, plainly" agents post (AgentsReel.astro, a reel-only figure
// the post keeps hidden), and saves its link-preview image. Build and preview the site first, then:
//   node scripts/video/ai-plainly-agents-reel.mjs [post URL]   (default http://localhost:4321/blog/ai-plainly-agents/)
// Writes public/video/ai-plainly-agents-reel.mp4 (1080x1350, the 4:5 shape LinkedIn and Facebook feeds show
// biggest) and public/img/og/ai-plainly-agents.jpg (1200x630). The figure draws itself as a pure function of
// time, so every frame is exact no matter how slow the screenshots are. Needs ffmpeg on the PATH.
// REEL_STILLS=0,2,4.5 writes only those moments (in seconds) as PNGs to <temp dir>/ai-plainly-agents-reel/stills
// and stops, which checks a layout in seconds instead of a full recording.
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const url = process.argv[2] ?? 'http://localhost:4321/blog/ai-plainly-agents/';
const FPS = 30;
const work = join(tmpdir(), 'ai-plainly-agents-reel');
rmSync(work, { recursive: true, force: true });
mkdirSync(work, { recursive: true });

// PW_CHROME points at a Chrome binary when the pinned Playwright build isn't installed.
const browser = await chromium.launch(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {});
async function open(width, height, mode) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, colorScheme: 'dark' });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate((m) => { document.querySelector('.arl').dataset[m] = '1'; document.body.style.overflow = 'hidden'; }, mode);
  return page;
}

// The video: the whole made-up run once, as text chats, ending on the takeaway.
const page = await open(1080, 1350, 'reel');
const total = await page.evaluate(() => window.__agentsReel.total);
if (process.env.REEL_STILLS) {
  mkdirSync(join(work, 'stills'), { recursive: true });
  for (const s of process.env.REEL_STILLS.split(',').map(Number)) {
    await page.evaluate((t) => window.__agentsReel.draw(t), s);
    await page.screenshot({ path: join(work, 'stills', `${s}.png`) });
  }
  await browser.close();
  console.log(`Wrote stills to ${join(work, 'stills')}`);
  process.exit(0);
}
const frames = Math.round(total * FPS);
for (let i = 0; i < frames; i++) {
  await page.evaluate((t) => window.__agentsReel.draw(t), i / FPS);
  await page.screenshot({ path: join(work, `f${String(i).padStart(5, '0')}.png`) });
}
await page.close();
mkdirSync('public/video', { recursive: true });
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(work, 'f%05d.png'),
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', 'public/video/ai-plainly-agents-reel.mp4']);

// The link preview: the hook, next to turn 3's chat, where the model reads the rain and picks Sunday itself.
const og = await open(1200, 630, 'og');
await og.evaluate(() => window.__agentsReel.draw(17));
await og.screenshot({ path: join(work, 'og.png') });
await og.close();
mkdirSync('public/img/og', { recursive: true });
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', join(work, 'og.png'), '-q:v', '3', 'public/img/og/ai-plainly-agents.jpg']);
await browser.close();
console.log(`Wrote public/video/ai-plainly-agents-reel.mp4 (${frames} frames, ${total.toFixed(1)}s) and public/img/og/ai-plainly-agents.jpg`);
