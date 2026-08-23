# Reel 0003 Quality-Control Record

## Render R1 — Rejected

| Check | Result | Evidence |
|---|---|---|
| Technical container | Pass | 720×1280 H.264/AAC, 30 fps, 58.8 seconds, `yuv420p`.
| Hindi caption rendering | Pass | Lower-third captions were readable, with the approved Noto Sans Devanagari style and 36 px bottom margin.
| Scene sequencing | Fail | Exact-timestamp frame extraction at 4, 14, 24, 34, 44, and 54 seconds showed the opening still in every sample; the render must not be uploaded.
| Evidence safety | Pending re-render | The intended script and visuals remain limited to the approved attention claim boundaries.

### Root cause and corrective action

The initial renderer looped each still image and then asked `zoompan` to emit `frameCount` output frames for each input frame. This inflated the first concat segment beyond the full narration. The renderer now reads each still once and lets `zoompan` emit exactly one `frameCount`-long segment per scene. A fresh render and independent exact-timestamp visual review are mandatory before any Drive upload.

## Render R2 — Passed

| Check | Result | Evidence |
|---|---|---|
| Technical container | Pass | 720×1280 H.264/AAC, 30 fps, `yuv420p`, 58.8 seconds, 5,277,716 bytes. |
| Narration length | Pass | Hindi WAV source measured 58.8 seconds; no tempo modification was required. |
| Captions | Pass | Exact-timestamp frames show legible Hindi lower-third captions with safe contrast, 14 px styling, and 36 px margin. |
| Scene sequencing | Pass | Independent exact-frame extraction at 4, 14, 24, 34, 44, and 54 seconds shows the six intended source scenes in order. |
| Composition | Pass | All scene frames are 9:16; the lower third remains usable for captions and no intrinsic text, logos, or watermarks appear in the original scene assets. |
| Evidence safety | Pass | Script remains within the verified source boundary: unexpected details can sometimes be missed while focus is occupied; it does not claim total perceptual absence, diagnosis, intelligence inference, or driving advice. |
| Integrity | Pass | SHA-256: `33c1d54a15fa40e8697f141091f109f4438d20e1daf46a775faac34a7404e7d9`. |

### Upload decision

Render R2 is the only eligible Reel 0003 video candidate. The rejected R1 file is retained only in the external working area as a recoverable diagnostic artifact and must not be uploaded as the canonical reel.
