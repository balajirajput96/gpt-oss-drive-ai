# Deterministic Production Workflow

The next production run must begin by reading `production_state.json`, locating `nextReelId` in `reel_registry.json`, and checking that the ID is not present in either `completedReelIds` or `failedReels`. It then reads `PILLAR_EVIDENCE_MATRIX.md` and `RESEARCH_EVIDENCE_RULES.md` before research, scripting, visual creation, or narration.

The work state moves only forward: `planned → researching → scripted → assets_ready → rendered → qc_passed → drive_verified`. A failure is recorded with a timestamp, stage, error category, retry count, and next safe action. An ID can become `drive_verified` only when the video and metadata file both have Drive file IDs and their metadata is re-fetched from Drive after upload.

Each batch checkpoint must record the registry version, current Reel ID, source URLs/DOIs, local SHA-256 checksums, Drive parent and child IDs, QC checks, rendered duration and frame geometry, tool availability, and unhandled errors. A retry must reuse the same ID and preserve prior failed attempt records; it must never skip forward silently or generate an alternate topic under the same ID.

