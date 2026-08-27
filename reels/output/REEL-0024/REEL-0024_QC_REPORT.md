# Reel 0024 Quality-Control Report

**Registry identity:** `0024 / Batch_001 / MND / L01 / Q24`
**Question:** कब सहायता लेना ठीक है?
**Canonical Drive folder:** `1Ypox8YV6-DKU6wVaWMrt-nrJ9GfSBi31`
**QC status:** Passed locally; canonical Drive package verification remains required before lifecycle completion.

## Technical validation

| Check | Result |
|---|---|
| Output file | `REEL-0024_FINAL.mp4` |
| Video | H.264, 720×1280 portrait |
| Audio | AAC |
| Decoded duration | 66.120000 seconds |
| File size | 3,375,806 bytes |
| Full decoder pass | Passed with `ffmpeg -f null -` |
| SHA-256 | `dbeb686cb4881a186b4fcb5e4860ec8e826faf3cd712ac02748e95d4d082f8a0` |
| Captions | 15 cues; repository validator passed with final audio duration 66.120 seconds |
| Render composition | Six 11.02-second visual segments, final narration duration matched |

## Visual and provenance validation

Representative rendered frames at approximately 17 and 58 seconds were reviewed. Hindi captions are legible on the lower third, remain distinct from the text-free source art, and do not show an obvious compositing defect. The scenes are portrait-oriented, distinct, and use no real-person depiction, logo, medical symbol, or embedded text.

The visual source route is `original_deterministic_svg_motion_graphics`. The provenance record states `imageGenerationUsed:false`, `quotaOrAccessControlBypass:false`, `reusedLegacyAsset:false`, `embeddedText:false`, and `realPersonDepicted:false`. Generated PNG/video/audio assets remain outside the repository; the new SVG generator is the reproducible source-only record.

## Content and safety review

The narration distinguishes public-health guidance from systematic-review synthesis and a viewer’s optional first step. It says professional contact is an option when distress is severe, persistent, or affects daily life; it does not diagnose any viewer or apply a universal threshold. It distinguishes a trusted safe person from professional assessment, does not assume informal support is appropriate for everyone, and describes barriers as reported research patterns rather than causes for an individual.

The closing safety statement is general: for immediate safety danger, contact local emergency or crisis support now. It deliberately gives no country-specific number, individual triage, treatment direction, or self-harm method information.

## Release disposition

Local render, decoder, caption, visual, provenance, and evidence-boundary checks pass. Upload, remote parent/checksum verification, final manifest reconciliation, and guarded lifecycle verification must all succeed before Reel 0024 can be marked complete.
