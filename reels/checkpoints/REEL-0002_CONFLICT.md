# Reel 0002 Canonical-ID Conflict

The canonical Batch 001 archive contains several pre-existing items labelled `REEL-0002`, including an explicitly **not-publication-ready** fallback reel about a sleep-environment topic and another unrelated predictive-processing draft. The archive manifest for the fallback reel states `publication_allowed: false`; therefore, it cannot be treated as a completed item in the deterministic 3,000-reel registry.

The active local Reel 0002 research draft is about the distinction between attention and consciousness. It has not been uploaded to Drive as a canonical Reel 0002 and must not overwrite, replace, or be merged with the pre-existing drafts. The local workflow has recorded `canonical_id_conflict` and remains on ID `0002`.

| Preserved item | Location / status |
|---|---|
| Existing fallback Reel 0002 folder | `1JzyQOs5SYvvrk12rPOXD9kf1OtP1FVHP` — `publication_allowed: false` |
| Existing predictive-processing draft | `1dDaQ4z5sS-JQhu1-oEx24MW6-bPEMY3a` — topic differs from deterministic registry |
| Local attention/consciousness draft | `reels/output/REEL-0002/` — blocked before rendering/upload |
| Recorded lifecycle outcome | `production_state.json` → `failedReels`, retry count 1, `nextReelId: 0002` |

The next safe run must reconcile the canonical mapping through the documented registry and preserve all prior artifacts. It must not advance to Reel 0003 or falsely label any existing Reel 0002 item as verified.

