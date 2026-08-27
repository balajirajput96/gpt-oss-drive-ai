# Drive Root Schema-Compatibility Audit — 2026-08-27

## Records compared

| Record | Location | Declared state | Per-reel evidence represented in the local lifecycle schema |
|---|---|---|---|
| Current Git source state | `reels/production_state.json` | 21 completed and verified; next `0022`. | 21 canonical mappings and 21 `verifiedReels` entries, including canonical folder, video ID, manifest ID, and SHA-256. |
| Global Drive root state | `1sIEySRVL3yGTESxVERFOvna1UTAcFcb5` | 70 completed; next `0073`. | 19 canonical mappings and 19 `verifiedReels` entries, ending at Reel `0019`. |
| Global Drive source checkpoint | `1dY6FqmA8kxHLlJqu1BDbDs1bKvX9HqMg` | `completed_verified: 70`; next `REEL-0073`. | Aggregate summary, range descriptions, latest Reel `0072` evidence, and global checkpoint references; not a schema-compatible array of all 70 per-reel video/manifest/checksum/folder records. |

## Verified incompatibility

The global Drive root lists Reels `0020`–`0072` as completed except `0067`, `0069`, and `0070`-range exceptions, but its `verifiedReels` and `canonicalMappings` stop at `0019`. This leaves 51 listed completions without the per-reel identity required by the current production runner. Conversely, the current Git state contains independently remote-verified canonical records for Reels `0020` and `0021`, which are absent from the root’s detailed mappings.

The referenced checkpoint gives strong aggregate provenance for a separately managed run through `0072`; its `latest_canonical` record fully identifies Reel `0072`, but it does not supply the runner-compatible evidence entries needed to merge all claimed IDs safely. The root’s `authoritativeNextAction` also directs a search for `R0073`, which belongs to that separate aggregate line of work.

## Safe reconciliation decision

Neither record is overwritten, rebased, or treated as silently superseding the other. The local Git lifecycle remains the operational source for the verified canonical sequence through `0021`, with the next deterministic item `0022`. The global Drive root and checkpoint remain preserved as an external aggregate record that requires a future per-reel conversion or independently re-fetched canonical metadata before any of its claimed completions can be adopted into this lifecycle.

This is a **preservation and classification result**, not a claim that the 70 remote aggregate entries have been accepted as canonical completions in the active local runner.
