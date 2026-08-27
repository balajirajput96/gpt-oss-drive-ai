# Reel 0022 Quality-Control Report

**Canonical identity:** `0022 / Batch_001 / MND / L01 / Q22`
**Question:** इसे नैतिक रूप से कैसे समझें?
**Canonical Drive folder:** `1F1NbhWGNY-_a-QfOUm50CE2rooBxlRWB`

## Technical checks

| Check | Result | Evidence |
|---|---|---|
| Container and video codec | Pass | MP4 with H.264 video, `yuv420p`. |
| Portrait dimensions | Pass | `720 × 1280` pixels. |
| Audio codec | Pass | AAC, mono, 24 kHz. |
| Render duration | Pass with documented variance | `71.160` seconds; narration was longer than the approximate 60-second target despite one bounded concise-regeneration attempt. |
| Decoder pass | Pass | Full `ffmpeg -f null -` decode returned successfully. |
| Caption timing | Pass | 15 cues, ordered, non-overlapping, Hindi-bearing, and ending at `71.160` seconds. |
| Render checksum | Pass | SHA-256 `71cc114efa2f745b0a61a03a770e5c60d6e2043f64e54b0378475cab7148a6e7`. |
| Frame review | Pass | Representative start/end frames show intact portrait composition and readable two-line-or-fewer caption treatment. |

## Content and provenance checks

| Requirement | Result | Evidence |
|---|---|---|
| Registry alignment | Pass | Exact `MND/L01/Q22` identity and question were retained. |
| Evidence boundary | Pass | The script treats autonomy, consent, privacy, and transparency as ethical-framework/systematic-review factors, not individual clinical effects. |
| Scope controls | Pass | No universal manipulation, addiction, illegality, health diagnosis, screen-time causation, or legal advice claim. |
| Visual provenance | Pass | Six original text-free deterministic SVG-derived scenes; `imageGenerationUsed:false`, `quotaOrAccessControlBypass:false`, and `reusedLegacyAsset:false`. |
| Audio provenance | Pass | Newly generated Hindi narration was transcribed and captioned from the actual spoken segments. |
| Global Drive state | Isolated | This package does not overwrite or adopt the divergent global root `production_state.json`. |

## Release decision

The pre-upload package is cleared for canonical Drive archival and remote metadata/checksum verification. The workflow must not mark Reel 0022 verified or advance to Reel 0023 until every required artifact has been uploaded to the canonical folder, re-fetched, and recorded in the final manifest.
