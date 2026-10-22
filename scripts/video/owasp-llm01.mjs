#!/usr/bin/env node
// Makes the short explainer video on the first card of /owasp-llm-top-10/: an animated scene
// (owasp-llm01-scene.html, drawn frame by frame with Playwright) over a narration voiced by
// ElevenLabs. Only the script text below goes to ElevenLabs.
//
// Voice: the owner's ElevenLabs clone, model eleven_v4, with audio tags such as [leans in] that
// direct the delivery (the tags are acted out, not read, and are dropped from the captions).
// Spoken-text rules (docs in the RepBunny repo, demo-video/review/README.md): short plain
// sentences, no colons, semicolons, dashes, or parentheses.
//
//   ELEVENLABS_API_KEY=... node scripts/video/owasp-llm01.mjs
//
// Needs ffmpeg and ffprobe on the PATH and Playwright's Chromium (set PW_CHROME to a Chrome
// binary if the pinned build isn't installed). Lines are cached by their text in the work folder,
// so re-running after a visual tweak makes no ElevenLabs calls.
//
// Output: public/video/owasp-llm01.mp4 (captions burned in) and public/img/owasp-llm01-poster.jpg.
// The transcript on the page is the SCRIPT lines below with their [tags] removed.

import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const VOICE_ID = 'X8kRkdXqxXKyw5xP1oP6'; // the owner's clone, "Deaner2"
const MODEL_ID = 'eleven_v4';
const WORK = process.env.VIDEO_WORK ?? join(tmpdir(), 'owasp-llm01');
const FPS = 30;

// [seconds of silence before the line, the line]. The scene's timing follows these lines.
const SCRIPT = [
  [0.7, '[leans in] Prompt injection, in under a minute.'],
  [0.35, 'A model reads words. Your instructions, an email, a web page. It all arrives as plain text.'],
  [0.45, "[curious] So when an email says ignore your rules, the model can't always tell it's just data."],
  [0.3, "[serious] That's the whole attack. Outside text, trying to give orders."],
  [0.7, "[calm] Here's the part people miss. The fix isn't a better prompt."],
  [0.35, 'Give the model less power.'],
  [0.3, 'Keep the checks in code.'],
  [0.3, 'And let a person approve anything risky.'],
  [0.6, '[warm] Try the quick check on this card. Then take on the other nine.'],
];
const TAIL = 1.6;

const stripTags = (text) => text.replace(/\[[^\]]*\]/g, ' ').replace(/\s+([,.!?;:])/g, '$1').replace(/\s+/g, ' ').trim();
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

mkdirSync(join(WORK, 'lines'), { recursive: true });
const lines = [];
let clock = 0;
for (const [i, [gap, text]] of SCRIPT.entries()) {
  const hash = createHash('sha256').update(JSON.stringify({ text, VOICE_ID, MODEL_ID })).digest('hex').slice(0, 16);
  const file = join(WORK, 'lines', `${hash}.mp3`);
  if (!existsSync(file)) await voice(text, SCRIPT[i - 1]?.[1], SCRIPT[i + 1]?.[1], file);
  const d = duration(file);
  clock += gap;
  lines.push({ s: clock, e: clock + d, caption: stripTags(text), file });
  clock += d;
}
const total = clock + TAIL;
console.log(`Narration ${clock.toFixed(1)}s, video ${total.toFixed(1)}s`);

// Frames
const frames = join(WORK, 'frames');
rmSync(frames, { recursive: true, force: true });
mkdirSync(frames, { recursive: true });
const browser = await chromium.launch(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(resolve('scripts/video/owasp-llm01-scene.html')).href, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.evaluate((tl) => window.setup(tl), { lines, total });
const count = Math.round(total * FPS);
for (let i = 0; i < count; i++) {
  await page.evaluate((t) => window.draw(t), i / FPS);
  await page.screenshot({ path: join(frames, `${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 90 });
}
await browser.close();

// Audio: each line placed at its start time
const inputs = lines.flatMap((l) => ['-i', l.file]);
const delays = lines.map((l, i) => `[${i}:a]adelay=${Math.round(l.s * 1000)}:all=1[a${i}]`).join(';');
const mix = `${delays};${lines.map((_, i) => `[a${i}]`).join('')}amix=inputs=${lines.length}:normalize=0,alimiter=limit=0.95,apad[out]`;
const audio = join(WORK, 'narration.m4a');
execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', mix, '-map', '[out]', '-t', String(total), '-c:a', 'aac', '-b:a', '96k', audio]);

// Video
mkdirSync('public/video', { recursive: true });
mkdirSync('public/img', { recursive: true });
execFileSync('ffmpeg', ['-y', '-v', 'error', '-framerate', String(FPS), '-i', join(frames, '%04d.jpg'), '-i', audio,
  '-c:v', 'libx264', '-crf', '26', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-shortest', '-movflags', '+faststart', 'public/video/owasp-llm01.mp4']);

// Poster: the three fixes
execFileSync('ffmpeg', ['-y', '-v', 'error', '-ss', String(lines[7].e + 0.3), '-i', 'public/video/owasp-llm01.mp4', '-frames:v', '1', '-q:v', '3', 'public/img/owasp-llm01-poster.jpg']);
console.log('Wrote public/video/owasp-llm01.mp4 and public/img/owasp-llm01-poster.jpg');
