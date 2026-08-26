#!/usr/bin/env bash
set -euo pipefail
ROOT="/home/ubuntu/gpt-oss-drive-ai"
OUT="$ROOT/reels/output/REEL-0020"
CHECKPOINTS="$ROOT/reels/checkpoints"
FOLDER_ID="1RTlgGnMkFo26nJ6HMAwviBUC9Sdo7jqd"
RECORDS="$ROOT/reels/checkpoints/runtime/reel0020_upload_records.jsonl"
mkdir -p "$ROOT/reels/checkpoints/runtime"
: > "$RECORDS"

upload() {
  local path="$1"
  local name
  name="$(basename "$path")"
  local mime="application/octet-stream"
  case "$name" in
    *.mp4) mime="video/mp4";;
    *.wav) mime="audio/wav";;
    *.png) mime="image/png";;
    *.srt) mime="application/x-subrip";;
    *.json) mime="application/json";;
    *.md) mime="text/markdown";;
  esac
  local response
  response="$(gws drive files create --upload "$path" --upload-content-type "$mime" --json "{\"name\":\"$name\",\"parents\":[\"$FOLDER_ID\"]}")"
  printf '%s\n' "$response" >> "$RECORDS"
  printf '%s\n' "$response" | sed -n '1,16p'
}

upload "$OUT/REEL-0020.mp4"
upload "$OUT/REEL-0020_narration.wav"
upload "$OUT/REEL-0020_captions.srt"
upload "$OUT/REEL-0020_research.md"
upload "$OUT/REEL-0020_script_hi.md"
upload "$OUT/REEL-0020_claims.json"
upload "$OUT/REEL-0020_qc.json"
upload "$OUT/REEL-0020_manifest.json"
upload "$OUT/REEL-0020_audio_provenance.json"
for scene_id in 01 02 03 04 05 06; do
  upload "$OUT/REEL-0020_scene_${scene_id}.png"
  upload "$OUT/REEL-0020_scene_${scene_id}_provenance.json"
done
upload "$CHECKPOINTS/REEL-0020_VISUAL_QC_FINDINGS_20260826T132200Z.md"
