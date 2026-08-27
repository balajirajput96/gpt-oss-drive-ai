# Reel 0029 Quality-Control Report

**Registry question:** “इससे जिज्ञासा कैसे बढ़ती है?”

**Canonical folder:** `1kojsK4DbIPKrb9AwGu5RJDSWMjZqyk2o`

| QC gate | Result | Evidence |
|---|---|---|
| Narration duration | Pass | `R0029_narration_hi-IN.wav` measured 61.920 seconds. |
| Narration decode | Pass | PCM S16LE, mono, 24 kHz audio completed an FFmpeg decoder pass. |
| Caption timing | Pass | 13 ordered, non-overlapping Devanagari SRT cues end at 61.800 seconds, below the 61.920-second narration duration; targeted regression passed. |
| Video duration and streams | Pass | `R0029_FINAL.mp4` measured 61.920 seconds; H.264 video and AAC mono 24 kHz audio. |
| Portrait delivery | Pass | Final video is 720×1280, yuv420p, 30 fps. |
| Video decode | Pass | Full FFmpeg decoder pass completed without error. |
| Final video integrity | Pass | SHA-256 `19e8cd3bb85ad8e40a552f11cee04382e289cadace87c13fa9002c60a833b7a6`. |
| Source visuals | Pass | Six distinct original 720×1280 SVG→PNG scenes, text-free and person-free, with SHA-256 provenance. |
| Visual review | Pass | Source and captioned-render contact sheets show distinct scenes, visible lower-third Hindi captions, and no embedded source-image text. |
| Claim boundary | Pass | Script and claim ledger restrict the information-gap account to bounded research findings; they reject manipulation, fixed threshold, dopamine, diagnosis, memory-guarantee, and universal-engagement claims. |
| Legacy boundary | Pass | No file from the three noncanonical historical R0029 folders was reused. |

## Disposition

Local production gates pass. Canonical Drive production upload, full package MD5/metadata readback, final manifest, guarded lifecycle verification, and immutable post-verification snapshot are still required before Reel 0029 can be marked complete.
