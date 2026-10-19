// Prints /resume/ to a PDF. Run `npm run build` first; this serves dist/ with `astro preview`.
//
//   node scripts/resume-pdf.mjs                       -> public/dean-phillips-resume.pdf (the public copy)
//   node scripts/resume-pdf.mjs --phone "(405) ..." --out C:/somewhere/resume.pdf
//
// The phone number only goes into PDFs written outside the repo, so it never lands on the site.
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const phone = arg('phone');
const out = resolve(arg('out') ?? 'public/dean-phillips-resume.pdf');
if (phone && out.startsWith(resolve('.'))) {
  console.error('A PDF with a phone number has to be written outside the repo (use --out).');
  process.exit(1);
}

const port = 4329;
const server = spawn(`npx astro preview --port ${port}`, { shell: true, stdio: 'ignore' });
const url = `http://localhost:${port}/resume/`;

try {
  for (let i = 0; ; i++) {
    try { if ((await fetch(url)).ok) break; } catch {}
    if (i > 60) throw new Error(`astro preview never answered at ${url}`);
    await new Promise((r) => setTimeout(r, 500));
  }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  if (phone) {
    await page.evaluate((p) => {
      const li = document.querySelector('[data-phone]');
      li.textContent = p;
      li.hidden = false;
    }, phone);
  }
  await page.pdf({ path: out, format: 'Letter', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  console.log(`Wrote ${out}`);
} finally {
  server.kill();
  if (process.platform === 'win32') spawn('taskkill', ['/pid', String(server.pid), '/t', '/f'], { stdio: 'ignore' });
}
