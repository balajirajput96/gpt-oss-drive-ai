# Reel 0021 Local QC Report

## Identity and scope

| Field | Value |
|---|---|
| Tuple | `Batch_001 / MND / L01 / Q21` |
| Question | **हम अपने अनुमान कैसे जाँच सकते हैं?** |
| Completion state | Local package quality checks passed; **canonical Drive verification pending**. |

## Technical checks

| Check | Result |
|---|---|
| Video container | MP4 with H.264 video and AAC audio |
| Frame | 720 × 1280, yuv420p, 9:16 portrait |
| Render duration | 51.760 seconds |
| Render size | 2,785,085 bytes |
| Local video SHA-256 | `3b2d7623a729544e25b1083f22b388258d556c30a7902ccfbe2dadf1c082bd5a` |
| Narration | Hindi WAV; 51.760 seconds |
| Captions | Six Hindi cue intervals, transcript-aligned and bounded to 51.500 seconds |

## Visual and provenance checks

The deterministic generator created six unique 720 × 1280 RGBA PNG scenes from original SVG sources. It records `imageGenerationUsed: false`, `quotaOrAccessControlBypass: false`, `embeddedText: false`, and `reusedLegacyAsset: false` in `visual_provenance.json`.

The first scene was inspected visually: its high-contrast abstract attention network fits the portrait frame and contains no text, logo, watermark, real person, or medical cue. The closing scene was also inspected visually: its abstract concentric focus motif is text-free, portrait-safe, and unbranded. These inspections sample the common generator frame, palette, and border treatment; all six image files separately passed 720 × 1280 format checks.

## Content and claim checks

The script distinguishes the experiment-specific finding about yes/no reports, follow-up questions, and absent trials from the practical notebook heuristic. It states that a one-off exercise is not a diagnosis and does not determine ability. It avoids treatment advice, mental-state diagnosis, prevalence statistics, theory verdicts, and fabricated sources. The evidence record cites Nartker et al. (2025) and Craig et al. (2020).

## Remaining gate

The video and all eight package records were uploaded to `1whUYcihmhtLIPEv-aMtF40nSM0OlVWIp`. Re-fetched Drive metadata confirms non-trashed records with the expected parent; the video is `1RgkkSDbgmHFlZ6KbuhXexfrKMHFDN5fd`, 2,785,085 bytes, and has Drive MD5 `f6e8579164081e3c8c2aaed64d72d8aa`, matching the staged local MP4. Drive did not return the requested optional `videoMediaMetadata` property; local ffprobe remains the technical decode evidence.

The manifest was uploaded as `1KJqUP4hL5GbpeMBuJdNu5PgLDH6400IY`; its re-fetched parent and MD5 match its local source. The mandatory production runner then accepted the canonical video, manifest, SHA-256, and folder ID at `2026-08-27T03:26:37.734Z`. It recorded Reel 0021 as Drive-verified and advanced the local deterministic next ID to `0022`.

The divergent global Drive root-state file was deliberately not overwritten. A post-verification local state snapshot will instead be archived in this canonical folder; the unresolved global conflict remains separately documented.
