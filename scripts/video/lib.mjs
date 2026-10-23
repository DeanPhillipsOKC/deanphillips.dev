// Shared by the OWASP card videos (owasp-video.mjs): voices a script with ElevenLabs, renders an
// animated scene frame by frame with Playwright, mixes the audio with ffmpeg, and writes the
// video and its poster. Only the script text goes to ElevenLabs.
//
// Voice: the owner's ElevenLabs clone, model eleven_v4, with audio tags such as [casual] that
// direct the delivery (acted out, not read, and dropped from the captions). Spoken-text rules (the
// RepBunny repo's demo-video/review/README.md): short plain sentences, no colons, semicolons,
// dashes, or parentheses.
//
// Each video should make sense shared on its own, away from the guide: say which list it's from,
// show the fixes working on the diagram (config.replay), and close on a recap of the fixes
// (config.recap), not a pointer to the card. Being helpful and easy to follow matters more than
// length; under a minute is ideal, but going over is fine.
//
// Needs ffmpeg and ffprobe on the PATH and Playwright's Chromium (set PW_CHROME to a Chrome binary
// if the pinned build isn't installed). Lines are cached by their text in the work folder
// (VIDEO_WORK, default the temp dir), so re-rendering after a visual tweak makes no ElevenLabs calls.
// VIDEO_STILLS=12,20.5 writes only those moments (in seconds) as PNGs to <work>/stills and stops,
// which checks a layout in seconds instead of a full render. Each finished video's length goes into
// scripts/video/owasp/durations.json, which the guide page reads for the video's label.

import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const VOICE_ID = 'X8kRkdXqxXKyw5xP1oP6'; // the owner's clone, "Deaner2"
const MODEL_ID = 'eleven_v4';
const FPS = 30;
const TAIL = 1.6;

export const stripTags = (text) => text.replace(/\[[^\]]*\]/g, ' ').replace(/\s+([,.!?;:])/g, '$1').replace(/\s+/g, ' ').trim();
const duration = (file) => Number(String(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file])).trim());

async function voice(text, previous, next, file) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error(`Line not cached and ELEVENLABS_API_KEY is unset: "${text}"`);
  const body = { text, model_id: MODEL_ID };
  if (previous) body.previous_text = previous;
  if (next) body.next_text = next;
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status} for "${text}": ${await res.text()}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  console.log(`  voiced: ${text}`);
}

// video: { slug, script: [[seconds of silence before, line], ...], scene: path to the scene html,
// config: passed to the scene's setup(), posterLine: which line's end the poster is cut after }
export async function makeVideo({ slug, script, scene, config = {}, posterLine = 7 }) {
  const work = process.env.VIDEO_WORK ? join(process.env.VIDEO_WORK, slug) : join(tmpdir(), `owasp-${slug}`);
  mkdirSync(join(work, 'lines'), { recursive: true });
  const lines = [];
  let clock = 0;
  for (const [i, [gap, text]] of script.entries()) {
    const hash = createHash('sha256').update(JSON.stringify({ text, VOICE_ID, MODEL_ID })).digest('hex').slice(0, 16);
    const file = join(work, 'lines', `${hash}.mp3`);
    if (!existsSync(file)) await voice(text, script[i - 1]?.[1], script[i + 1]?.[1], file);
    const d = duration(file);
    clock += gap;
    lines.push({ s: clock, e: clock + d, caption: stripTags(text), file });
    clock += d;
  }
  const total = clock + TAIL;
  console.log(`${slug}: narration ${clock.toFixed(1)}s, video ${total.toFixed(1)}s`);

  // Frames: 540x960 at 2x is 1080x1920
  const frames = join(work, 'frames');
  rmSync(frames, { recursive: true, force: true });
  mkdirSync(frames, { recursive: true });
  const browser = await chromium.launch(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {});
  const page = await browser.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
  await page.goto(pathToFileURL(resolve(scene)).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(([tl, cfg]) => window.setup(tl, cfg), [{ lines, total }, config]);
  if (process.env.VIDEO_STILLS) {
    mkdirSync(join(work, 'stills'), { recursive: true });
    for (const s of process.env.VIDEO_STILLS.split(',').map(Number)) {
      await page.evaluate((t) => window.draw(t), s);
      await page.screenshot({ path: join(work, 'stills', `${s}.png`) });
    }
    await browser.close();
    console.log(`Wrote stills to ${join(work, 'stills')}; lines start at ${lines.map((l) => l.s.toFixed(1)).join(', ')}`);
    return;
  }
  const count = Math.round(total * FPS);
  for (let i = 0; i < count; i++) {
    await page.evaluate((t) => window.draw(t), i / FPS);
    await page.screenshot({ path: join(frames, `${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 88 });
  }
  await browser.close();

  // Audio: each line placed at its start time
  const inputs = lines.flatMap((l) => ['-i', l.file]);
  const delays = lines.map((l, i) => `[${i}:a]adelay=${Math.round(l.s * 1000)}:all=1[a${i}]`).join(';');
  const mix = `${delays};${lines.map((_, i) => `[a${i}]`).join('')}amix=inputs=${lines.length}:normalize=0,alimiter=limit=0.95,apad[out]`;
  const audio = join(work, 'narration.m4a');
  execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', mix, '-map', '[out]', '-t', String(total), '-c:a', 'aac', '-b:a', '96k', audio]);

  mkdirSync('public/video', { recursive: true });
  mkdirSync('public/img', { recursive: true });
  const out = `public/video/owasp-${slug}.mp4`;
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-framerate', String(FPS), '-i', join(frames, '%04d.jpg'), '-i', audio,
    '-c:v', 'libx264', '-crf', '27', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-shortest', '-movflags', '+faststart', out]);
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-ss', String(lines[posterLine].e + 0.3), '-i', out, '-frames:v', '1', '-q:v', '3', `public/img/owasp-${slug}-poster.jpg`]);
  const durations = 'scripts/video/owasp/durations.json';
  const all = existsSync(durations) ? JSON.parse(readFileSync(durations, 'utf8')) : {};
  all[slug] = Math.round(duration(out));
  writeFileSync(durations, `${JSON.stringify(Object.fromEntries(Object.entries(all).sort()), null, 2)}\n`);
  console.log(`Wrote ${out} and public/img/owasp-${slug}-poster.jpg`);
}

// A short silent loop of one scene for the guide page: no narration, no captions, cropped to the
// diagram. timeline is { lines: [{ s, e }], total } on a made-up schedule (see owasp-loops.mjs),
// and the loop runs from `start` (after the diagram has drawn itself in) to timeline.total. The
// poster is the loop's last frame, which is also what reduced-motion visitors see.
export async function makeLoop({ name, scene, config, timeline, start = 0, crop = { y: 72, h: 652 } }) {
  const work = process.env.VIDEO_WORK ? join(process.env.VIDEO_WORK, name) : join(tmpdir(), `owasp-${name}`);
  const frames = join(work, 'frames');
  rmSync(frames, { recursive: true, force: true });
  mkdirSync(frames, { recursive: true });
  const browser = await chromium.launch(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {});
  const page = await browser.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
  await page.goto(pathToFileURL(resolve(scene)).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(([tl, cfg]) => window.setup(tl, cfg), [timeline, { ...config, silent: true }]);
  const count = Math.round((timeline.total - start) * FPS);
  const clip = { x: 0, y: crop.y, width: 540, height: crop.h };
  const stills = process.env.VIDEO_STILLS?.split(',').map(Number);
  for (const [i, t] of (stills ?? [...Array(count).keys()].map((i) => start + i / FPS)).entries()) {
    await page.evaluate((t) => window.draw(t), t);
    await page.screenshot({ path: join(frames, stills ? `${t}.png` : `${String(i).padStart(4, '0')}.jpg`), clip, ...(stills ? {} : { type: 'jpeg', quality: 90 }) });
  }
  await browser.close();
  if (stills) return console.log(`Wrote stills to ${frames}`);
  mkdirSync('public/video', { recursive: true });
  mkdirSync('public/img', { recursive: true });
  const out = `public/video/owasp-${name}.mp4`;
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-framerate', String(FPS), '-i', join(frames, '%04d.jpg'),
    '-vf', 'scale=720:-2', '-c:v', 'libx264', '-crf', '28', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-an', '-movflags', '+faststart', out]);
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', join(frames, `${String(count - 1).padStart(4, '0')}.jpg`), '-vf', 'scale=720:-2', '-q:v', '4', `public/img/owasp-${name}.jpg`]);
  console.log(`Wrote ${out} and public/img/owasp-${name}.jpg (${(timeline.total - start).toFixed(1)}s)`);
}
