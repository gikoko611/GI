import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { SCENES } from '../src/scenes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, 'audio');
const tmpDir = path.join(outDir, 'tmp');
fs.mkdirSync(tmpDir, { recursive: true });

const voice = process.env.TTS_VOICE || 'en-us';
const rate = process.env.TTS_RATE || '150';

function run(cmd, args) {
  execFileSync(cmd, args, { stdio: 'inherit' });
}

function hasCmd(cmd) {
  try { execFileSync('bash', ['-lc', `command -v ${cmd}`], { stdio: 'ignore' }); return true; }
  catch { return false; }
}

const canTts = hasCmd('espeak-ng') || hasCmd('espeak');
const ttsCmd = hasCmd('espeak-ng') ? 'espeak-ng' : 'espeak';

if (!canTts) {
  console.warn('No espeak/espeak-ng found; generating silent audio track.');
}

const segments = [];
for (let i = 0; i < SCENES.length; i++) {
  const s = SCENES[i];
  const raw = path.join(tmpDir, `scene_${String(i).padStart(2, '0')}_raw.wav`);
  const seg = path.join(tmpDir, `scene_${String(i).padStart(2, '0')}.wav`);
  const dur = s.duration || 10;
  const text = (s.narration || '').replace(/"/g, '\\"');

  if (canTts) {
    try {
      run(ttsCmd, ['-v', voice, '-s', String(rate), '-w', raw, text]);
    } catch (e) {
      console.warn(`TTS failed for scene ${i + 1}, using silence.`);
      run('ffmpeg', ['-y', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo', '-t', String(dur), raw]);
    }
  } else {
    run('ffmpeg', ['-y', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo', '-t', String(dur), raw]);
  }

  // pad or trim to exact duration
  run('ffmpeg', ['-y', '-i', raw, '-af', 'apad', '-t', String(dur), '-ar', '44100', '-ac', '2', seg]);
  segments.push(seg);
  console.log(`Audio segment ready: ${i + 1}/${SCENES.length} (${dur}s)`);
}

const listPath = path.join(outDir, 'concat.txt');
fs.writeFileSync(listPath, segments.map(s => `file '${s}'`).join('\n'));
const outPath = path.join(outDir, 'narration.wav');
run('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', listPath, '-c', 'copy', outPath]);
console.log(`Narration audio created: ${outPath}`);
