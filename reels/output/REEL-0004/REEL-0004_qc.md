# Reel 0004 Quality-Control Log

## Status: QC passed, pending canonical Drive verification

| Checkpoint | Result | Evidence | Safe action |
|---|---|---|---|
| Hindi narration technical integrity | Pass | `REEL-0004_voice_final.wav`; PCM mono, 24 kHz, 55.367458 seconds. | Use as the sole narration input for rendering. |
| Script / claim boundary | Pass | `REEL-0004_script_hi.md` and `REEL-0004_claims.json` mapped to three peer-reviewed sources. | Preserve proposed-account wording; no diagnosis or universal-causation claim. |
| First visual source | Pass | `reel0004_scene01.png`, original 1440×2560, visually inspected. It is text-free and has usable lower-frame caption space. | Retain as scene 1 reference and render input. |
| Initial scenes 2–6 batch | Reject | The recovered storage objects rendered the literal text “Image generation failed”; they are not valid source scenes and must never enter the final MP4. | A single reference-conditioned recovery batch was requested after scene 1 became available. Keep the failed placeholders only as diagnostic evidence, not as production assets. |
| Recovered scenes 2–6 | Pass | All recovered scenes are 1080×1920, text-free, visually distinct, and coherent with the approved scene 1 reference. The review contact sheet is `REEL-0004_recovered_scene_contact_sheet.png`. | Promoted to canonical render filenames; retained failed placeholders outside the approved input set. |
| Captioned MP4 technical QC | Pass | `REEL-0004_final.mp4`; H.264 video, AAC audio, 720×1280, 30 fps, yuv420p, 55.368 seconds, SHA-256 `dc4c2b48713eef9eb8975cf6c236872184eefe3c915c17f7919811ed5079e8f7`. | Use this immutable reviewed candidate for canonical Drive upload. |
| Caption and scene visual QC | Pass | Six timestamps spanning the runtime were reviewed in `REEL-0004_caption_qc_sheet.png`. Hindi subtitles are legible in the lower third, source scenes transition, and no failure placeholder or embedded scene text appears. | Upload media and metadata to the canonical folder, then re-fetch Drive records before lifecycle verification. |

## Completion gate

The render has passed local technical and visual QC. Do not mark Reel 0004 as Drive-verified until the MP4, manifest, provenance, and QC record are uploaded only to the canonical folder and those remote records are re-fetched successfully.
