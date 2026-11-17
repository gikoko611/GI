# ဘဝခရီးလမ်း (The Journey of Life)

Myanmar-style educational 3D animation (Three.js/WebGL).

## Specs
- Title: **ဘဝခရီးလမ်း** (The Journey of Life)
- Duration: **5 minutes** (30 scenes, ~10s each)
- Resolution: **480×854** (9:16 vertical, 480p)
- FPS: **24** (configurable)
- Watermark: **Powered by အိုင်ကိုကို** (overlay on video)
- Narration: **English TTS** (`espeak-ng`) for timing
- Subtitles: **Myanmar (Burmese)** on-screen text per scene

## Structure
- `index.html`, `src/` — Three.js animation (timeline-driven, deterministic via `window.__setTime(t)`)
- `src/scenes.js` — 30-scene script (Myanmar subtitles + English narration)
- `render/` — headless capture (Puppeteer) and audio/video muxing (ffmpeg)
- `../.github/workflows/render-life-animation.yml` — GitHub Actions workflow to render and upload MP4 artifact

## Local render (Linux)
Requirements: Node.js 18+, `ffmpeg`, `espeak-ng`, Chromium dependencies/fonts.

```bash
cd life-animation
npm install
bash render/render.sh
```

Output: `output/baw_khayi_lan_480x854.mp4`

## GitHub Actions render
Run the **Render Life Animation** workflow (manually via *workflow_dispatch* or on push to `life-animation/**`). The rendered MP4 is uploaded as a workflow artifact named `baw-khayi-lan-480x854`.

> Note: Full 5-minute frame capture in CI can take significant time; adjust `fps` input if needed.
