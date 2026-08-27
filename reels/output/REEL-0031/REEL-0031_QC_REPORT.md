# Reel 0031 QC Report

## Scope and disposition

| QC area | Method | Result |
|---|---|---|
| Narration duration | `ffprobe` on accepted take 02 | Pass: `62.200 s`, within the 55–65 second target. |
| Rejected take preservation | `ffprobe` on take 01 | Retained externally only: `65.800 s`, outside target; excluded from canonical package. |
| Video container and streams | Full `ffprobe` stream/container inspection | Pass: MP4 with H.264 High video and AAC-LC mono audio. |
| Portrait delivery | `ffprobe` video stream inspection | Pass: `720×1280`, `9:16`, `30 fps`, progressive, `yuv420p`. |
| Duration alignment | `ffprobe` audio/video/container durations | Pass: audio, video, and container each report `62.200 s`. |
| Decoder integrity | `ffmpeg -v error -i … -f null -` | Pass: full decode completed with no reported errors. |
| Caption structure | `validateSrt` regression test | Pass: 12 ordered, non-overlapping Devanagari-bearing cues; max cue end `62.000 s` within `62.200 s`. |
| Visual source constraints | Source generator, provenance record, and six-scene contact sheet | Pass: six distinct new 720×1280 text-free abstract scenes; no real person, legacy asset, image-model use, or quota/access-control bypass. |
| Final video visual sample | Six captioned frame samples at approximately 2, 12, 22, 32, 43, and 56 seconds | Pass: portrait framing intact; Hindi captions visible in the lower safe area; no obvious fatal artifact in sampled scenes. |

## Verified final candidate

| Field | Value |
|---|---|
| Final video filename | `REEL-0031_ATTENTION_SELECTIVE_PROCESSING_FINAL.mp4` |
| Final video SHA-256 | `ca0de814a2639d6fcbba1695c39ad17a85ac988cfb6a33ff6e193478e8dab21d` |
| Final video size | `3,550,197 bytes` |
| Final video duration | `62.200 s` |
| Accepted narration filename | `REEL-0031_NARRATION_HI-IN_FINAL.wav` |
| Accepted narration SHA-256 | `703513ac88628a13df9d740bec6e2ee5f2810de752da7efbaed5df0481e82a74` |
| Accepted narration size | `2,985,644 bytes` |
| Caption file | `REEL-0031_CAPTIONS_HI.srt` |
| Caption regression | `15` focused caption tests passed, including R0031. |

## Boundary

This report validates local media only. Canonical Drive media upload, per-artifact Drive readback, final manifest, guarded `verify`, immutable post-verify snapshot, full package audit, and selection of R0032 remain pending. It makes no medical, diagnostic, performance, or completed-reel claim.
