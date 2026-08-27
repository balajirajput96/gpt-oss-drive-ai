# Reel 0027 QC Report

## Passed local checks

| Gate | Result |
|---|---|
| Narration | PCM WAV, mono 24 kHz, decoded duration 61.600 seconds. |
| Captions | 12 ordered, non-overlapping Devanagari cues; final end 61.500 seconds; typed validator and regression suite passed. |
| Render | H.264 video + AAC audio, 720×1280, 61.600 seconds; full FFmpeg decode passed. |
| Video digest | `f735f3381a526cf498b34413b9f689771fb1794342fb463d4d64e8713b7e7405` (SHA-256). |
| Visual provenance | Six original deterministic SVG-to-PNG scenes; text-free source art, no legacy asset reuse, no image-generation or quota bypass. |
| Visual review | Individual render frame reviewed: clean framing and legible Hindi captions. Composite-sheet seam was isolated as sheet assembly only, not video content. |

## Remaining gate

Canonical Drive production upload/readback, final manifest semantic verification, guarded runner verification, and immutable post-verify snapshot remain required before any completion claim or next-reel activation.
