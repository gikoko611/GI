import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const url = process.env.ANIM_URL || 'http://127.0.0.1:4173/';
const outDir = process.env.FRAMES_DIR || path.resolve('render/frames');
const width = Number(process.env.WIDTH || 480);
const height = Number(process.env.HEIGHT || 854);
const fps = Number(process.env.FPS || 24);
const durationOverride = process.env.DURATION ? Number(process.env.DURATION) : null;

fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  headless: 'new',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--use-gl=swiftshader',
    '--enable-webgl',
    '--mute-audio',
  ],
  defaultViewport: { width, height, deviceScaleFactor: 1 },
});

const page = await browser.newPage();
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });

await page.waitForFunction(
  () => typeof window.__setTime === 'function' && typeof window.__TOTAL_DURATION__ === 'number',
  { timeout: 120000 }
);
const info = await page.evaluate(() => window.__renderInfo());
const totalDuration = durationOverride || info.totalDuration || 300;
const totalFrames = Math.ceil(totalDuration * fps);

console.log(`Rendering ${totalFrames} frames at ${fps}fps (${totalDuration}s) -> ${outDir}`);

for (let i = 0; i < totalFrames; i++) {
  const t = Math.min(i / fps, totalDuration - 0.001);
  await page.evaluate((time) => window.__setTime(time), t);
  // allow a couple of RAFs
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  const framePath = path.join(outDir, `frame_${String(i).padStart(5, '0')}.png`);
  const app = await page.$('#app');
  await app.screenshot({ path: framePath });
  if (i % 48 === 0 || i === totalFrames - 1) {
    console.log(`Captured frame ${i + 1}/${totalFrames} (t=${t.toFixed(2)}s)`);
  }
}

await browser.close();
console.log('Capture complete');
