# Reel 0005 Quality-Control Log

## Status: local QC passed; canonical Drive verification pending

| Check | Result | Evidence | Required action |
|---|---|---|---|
| AI scene 1 generation | Pass | `reel0005_scene01.png`, original 1440×2560 text-free research-table visual. | Use as approved scene 1. |
| AI scenes 2–6 batch | Blocked, recorded | Generation request returned the free-plan daily quota error: `20/20`. No image quota, account, or access control was bypassed. | Use bounded deterministic fallback; retain disclosure in visual provenance. |
| Deterministic fallback scenes 2–6 | Pass | Original SVG sources were rasterized to 1080×1920 PNGs. The contact sheet `REEL-0005_scene_contact_sheet.png` shows distinct scenes, a consistent dark palette, and clear lower thirds. | Use these approved PNGs; do not reuse legacy Reel 0005 media. |
| Text and safety screen | Pass | Review found no embedded visual text, fake data visualization, brain/medical claim, logo, watermark, driving/safety advice, or identifiable face. | Captions remain separate in SRT. |
| Captioned MP4 technical QC | Pass | `REEL-0005_final.mp4`; H.264 video, AAC audio, 720×1280, 30 fps, yuv420p, 60.720 seconds, SHA-256 `6f5d6395252616cad8d0a99696f80e144af31c2a726cd6812157464e6a9da192`. | Use this immutable reviewed candidate for canonical Drive upload. |
| Caption and scene visual QC | Pass | Six timestamps spanning the runtime were reviewed in `REEL-0005_caption_qc_sheet.png`. Subtitles are readable in the lower third, all six planned scenes transition, and no quota-failure placeholder or embedded source text appears. | Upload video and final metadata to the canonical folder, then re-fetch Drive records before lifecycle verification. |

The mixed visual route is intentional and disclosed. The render has passed local technical and visual QC. This reel is not complete until the captioned MP4, provenance, QC, manifest, and canonical Drive upload are re-fetched and lifecycle verification succeeds.
