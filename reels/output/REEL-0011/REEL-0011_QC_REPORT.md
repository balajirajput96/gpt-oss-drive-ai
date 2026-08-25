# Reel 0011 Final QC Report

| QC area | Result | Verification record |
|---|---|---|
| Canonical identity | Pass | `MND/L01/Q11`; question: “भाषा इसे कैसे प्रभावित करती है?” |
| Video duration | Pass | 59.792 seconds after disclosed 1.06× pacing normalization. |
| Orientation and video | Pass | 720×1280, H.264, 30 fps, 9:16. |
| Audio | Pass | AAC, mono, 24 kHz; Hindi narration present. |
| Decode integrity | Pass | FFmpeg null-output decode completed without errors. |
| Video SHA-256 | Pass | `4c100c189918068f5362735a3c39543d937f4c4fbfd7a4394aae9fb6cab66324`. |
| Captions | Pass | Final visual review found Hindi captions legible through the closing frame. |
| Source visuals | Pass | Original deterministic SVG-to-raster motion graphics; no embedded text, logos, watermark, real people, or image-generation claim. |
| Claim safety | Pass | Visual review confirmed cautious framing: labels may guide task attention; memory/decision alternatives stated; no diagnostic, medical, universal, or raw-perception causal claim. |
| Narration content | Pass | Speech-to-text check retained the direct-study finding, caveat, theory distinction, and “do not jump to conclusions” close. |

## Provenance and limitations

The image-generation quota was not bypassed. The visual route is a disclosed original deterministic fallback: six locally authored SVG scenes were rasterized and animated in the render. The resulting reel illustrates experimental concepts; it does not display brain recordings, prove a neural mechanism, or claim that labels alter every observer’s sensory experience.

The reel is **complete and Drive-verified**. The canonical video, manifest, SHA-256, and parent folder were re-fetched, and the deterministic runner advanced only after that verification gate passed.
