# Reel 0026 QC Report

**Registry tuple:** `Batch_001 / MND / L01 / Q26` — “विज्ञान इससे क्या अलग कहता है?”

| Gate | Evidence | Result |
|---|---|---|
| Source visual count and dimensions | Six original deterministic scene PNGs probed at 720×1280. | Pass |
| Source visual provenance | `REEL-0026_VISUAL_PROVENANCE.json` declares `imageGenerationUsed:false`, `quotaOrAccessControlBypass:false`, `reusedLegacyAsset:false`, `embeddedText:false`, and six scenes. | Pass |
| Source visual review | Contact sheet visually inspected: six distinct abstract motion-graphic scenes; no readable source text, religious iconography, logos, faces, or legacy asset use observed. | Pass |
| Narration duration and decode | PCM WAV, 24 kHz mono; 55.720 seconds; full FFmpeg decode completed. | Pass |
| Captions | Eleven Hindi Devanagari SRT cues, ordered and non-overlapping; typed validator reports `maxEndMs: 55700`, within 55,720 ms narration duration. | Pass |
| Final render streams | H.264 video, 720×1280, yuv420p, 30 fps; AAC audio, 24 kHz mono; duration 55.720 seconds. | Pass |
| Final render decode | Full FFmpeg decoder pass completed without errors. | Pass |
| Final visual review | Six-frame contact sheet at 0, 10, 20, 30, 40, and 50 seconds shows portrait framing, scene progression, and legible separately composited Hindi captions after the opening frame. | Pass |
| Content boundaries | Script and captions frame a method/scope distinction only; no clinical, neuroscience-causation, religious-truth, or universal-definition conclusion appears. | Pass |
| Video SHA-256 | `4cf926f58b30e6d6b97547fb22e21e0c3b84064c23266b556651aae18717bbe9` | Recorded |

## QC boundary

This report confirms locally observable package quality only. It does not mark the reel completed. Completion remains blocked until the complete canonical Drive package and final manifest are uploaded, re-fetched, checksum-verified, and accepted by the guarded production runner.
