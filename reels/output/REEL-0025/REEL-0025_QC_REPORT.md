# Reel 0025 Quality-Control Report

**Canonical folder:** `13lsfcptaR3OxMIQxYFC0BhEfv0y-dbDE`
**Question:** इस परंपरा का दृष्टिकोण क्या है?
**Disposition at this report:** Local render passed; Drive package and guarded lifecycle verification remain pending.

## Technical validation

| Check | Result | Evidence |
|---|---|---|
| Portrait video | Pass | H.264, 720×1280, 30 fps, `yuv420p` in `REEL-0025_VIDEO_PROBE.json`. |
| Audio | Pass | AAC mono, 24 kHz; source narration was PCM mono, 24 kHz. |
| Duration | Pass | Final decoded MP4 duration is `62.000000` seconds; within the 55–65-second target. |
| Decoder integrity | Pass | Full video-stream and audio-stream decode to null completed with no FFmpeg error. |
| SHA-256 | Pass | `fc1db925a7b52fa7efdf6674d45a350727ec825bc776604cecaa58bbf28b09ae`. |
| Captions | Pass | Typed SRT validation accepts 15 ordered, non-overlapping Hindi cues, with final end time `62.000` seconds. |

## Visual and provenance validation

The six-scene source contact sheet was visually checked. It contains a distinct indigo, terracotta, gold, and mint abstract motion-graphics set, with no embedded text, logo, photograph, real person, or legacy file reuse. The visual story remains neutral and does not depict religious authority or a claimed religious outcome.

The final-render contact sheet was visually checked at representative points from the timeline. Captions appear as separately composited, high-contrast Hindi/technical-term subtitles, and no unwanted source-image text was observed. Source graphics remain portrait-framed and consistent with the storyboard’s non-homogeneous-traditions, contextual attention, overlap-without-equivalence, and reflective-close sequence.

## Content and safety review

The approved narration and captions attribute the perspective to selected Buddhist traditions and an Indo-Tibetan perspective. They distinguish scholarly review and scholarly opinion from empirical findings. The production does not make a therapeutic, neuroscientific, universal religious, conversion, guaranteed-outcome, or spiritual-truth claim.

## Release disposition

**Local media QC: passed.** The reel must not be considered complete until every package artifact is uploaded to the canonical Drive folder, re-fetched with parent/type/MD5 checks, the final manifest is semantically verified, and `production-runner verify` succeeds.
