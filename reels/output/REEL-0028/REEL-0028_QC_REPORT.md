# Reel 0028 QC Report

**Registry identity:** `0028 / Batch_001 / MND / L01 / Q28`

**Question:** “कौन-सा डेटा अभी गायब है?”

**Status at this record:** Local production QC passed; canonical Drive production archive, final manifest, guarded lifecycle verification, and post-verify snapshot are still pending.

| QC gate | Verification | Result |
|---|---|---|
| Narration | PCM WAV, mono, 24 kHz; measured duration `64.280 s`. | Pass |
| Captions | 13 ordered, non-overlapping Hindi/Devanagari cues; last cue ends at `64.100 s`, within narration duration. Focused Vitest regression passed. | Pass |
| Render | MP4 has H.264 video at `720 × 1280`, `30 fps`, `yuv420p`; AAC mono audio at 24 kHz; duration `64.280 s`. | Pass |
| Decode | Full `ffmpeg` decode to null sink returned successfully. | Pass |
| Visual sample | Six sampled captioned render frames show a visible white, outlined caption overlay; the six abstract scenes are distinct and sequenced as storyboarded. | Pass |
| Source visual provenance | Six fresh deterministic SVG→PNG frames have unique SHA-256 records; no external/legacy asset was used. | Pass |
| Content boundary | Script uses reports, behaviour, and brain signals as complementary clues; no clinical verdict, mind-reading, numerical accuracy, or metaphysical conclusion is made. | Pass |

## Visual-provenance declaration

`imageGenerationUsed: false`; `quotaOrAccessControlBypass: false`; `reusedLegacyAsset: false`; `embeddedText: false`; `realPersonDepicted: false`.

The visual route is the separate source-controlled generator `reels/scripts/generate-reel0028-visuals.mjs`, which created six original abstract text-free SVG source files and corresponding 720×1280 PNGs. The final captions are an independent compositing layer, not embedded source-image text.

## Final local hash

`R0028_FINAL.mp4` SHA-256: `28652ce388a166ffae5943723b10d29d4f1b955f620bc96fe437b60e9f69d7d3`.
