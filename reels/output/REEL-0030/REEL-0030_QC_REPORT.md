# Reel 0030 Quality-Control Report

## Scope

| Check | Result | Evidence |
|---|---|---|
| Final duration | Pass | `57.200` seconds; within the 55–65 second target. |
| Video encoding | Pass | H.264 video, 720×1280, 30 fps, `yuv420p`. |
| Audio encoding | Pass | AAC mono, 24,000 Hz; source narration was decoded before render. |
| Full decode | Pass | `ffmpeg -v error -i R0030_final.mp4 -f null -` completed without decoder errors. |
| Caption timing | Pass | 12 ordered, non-overlapping Devanagari cues; final cue ends at `57.100` seconds, below measured narration duration. |
| Caption visibility | Pass | Six sampled render frames show white outlined Hindi captions in the lower safe area with visible contrast. |
| Source visual quality | Pass | Six original, distinct 720×1280 abstract scenes; no source-image text or real-person depiction observed. |
| Claim boundary | Pass | The narration labels controlled-task patterns and a proposed framework; it gives no learning guarantee, medical claim, or neural certainty. |

## Checksums

| Artifact | SHA-256 |
|---|---|
| `R0030_final.mp4` | `2918d8b6fb87fd266883e41a04fc2acdb24e9b8259e34d8bd749f6e5ae33b58a` |
| `R0030_narration_hi-IN.wav` | `1352c6e2358612efe76f22e2d39d75997081e8ad18777835d842bab131299af4` |

## Disposition

The canonical final render passes technical, caption, visual, and claim-boundary quality gates. The first generated narration was a valid `67.040`-second external take and is preserved as rejected-duration evidence outside Git and the canonical Drive package. The approved `57.200`-second take alone is eligible for archival. Guarded lifecycle verification remains pending until the complete canonical Drive package and final manifest are uploaded and independently read back.
