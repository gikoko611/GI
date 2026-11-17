#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

PORT="${PORT:-4173}"
FPS="${FPS:-24}"
WIDTH="${WIDTH:-480}"
HEIGHT="${HEIGHT:-854}"
FRAMES_DIR="${FRAMES_DIR:-$ROOT_DIR/render/frames}"
OUT_DIR="${OUT_DIR:-$ROOT_DIR/output}"
mkdir -p "$FRAMES_DIR" "$OUT_DIR"

# Start static server
node render/serve.mjs &
SERVER_PID=$!
cleanup() { kill "$SERVER_PID" 2>/dev/null || true; }
trap cleanup EXIT

# Wait for server
for i in {1..60}; do
  if curl -fsS "http://127.0.0.1:${PORT}/" >/dev/null 2>&1; then
    break
  fi
  sleep 0.5
done

# Capture frames
ANIM_URL="http://127.0.0.1:${PORT}/" FRAMES_DIR="$FRAMES_DIR" FPS="$FPS" WIDTH="$WIDTH" HEIGHT="$HEIGHT" node render/capture.mjs

# Build narration audio (English TTS + padded per scene)
node render/build_audio.mjs

# Encode video and mux audio
ffmpeg -y -framerate "$FPS" -i "$FRAMES_DIR/frame_%05d.png" -i "$ROOT_DIR/render/audio/narration.wav" \
  -c:v libx264 -pix_fmt yuv420p -r "$FPS" -c:a aac -b:a 128k -shortest \
  "$OUT_DIR/baw_khayi_lan_480x854.mp4"

echo "Render complete: $OUT_DIR/baw_khayi_lan_480x854.mp4"
