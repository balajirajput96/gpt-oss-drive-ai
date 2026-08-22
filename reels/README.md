# Reel Production Assets

Run `node reels/scripts/generate-registry.mjs` from the project root to deterministically regenerate `reel_registry.json`, `reel_registry.csv`, and `production_state.json`. These generated files are the canonical machine-readable planning and lifecycle records for the 3,000-reel production program.

The registry is deliberately generated rather than manually maintained. Every identifier is stable: its topic tuple is defined by the sequence `pillar → lens → question template`, and its Drive batch is `ceil(reel_number / 30)`. The production workflow must update lifecycle information only in `production_state.json` or a later immutable batch checkpoint; it must not reassign a completed reel ID.

