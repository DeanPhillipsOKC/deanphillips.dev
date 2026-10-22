#!/usr/bin/env node
// Makes one OWASP card video: node scripts/video/owasp-video.mjs llm02 [llm06 ...]
// Each slug has a config in scripts/video/owasp/<slug>.mjs (its script lines, scene, and what the
// scene draws). See lib.mjs for how the video is made and what it needs.
import { makeVideo } from './lib.mjs';

const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error('Usage: node scripts/video/owasp-video.mjs <slug> [<slug> ...]  (for example llm02)');
  process.exit(2);
}
for (const slug of slugs) {
  const { default: config } = await import(`./owasp/${slug}.mjs`);
  await makeVideo({ slug, ...config });
}
