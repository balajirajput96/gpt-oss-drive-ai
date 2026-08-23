# Security Audit — 2026-08-23

## Evidence sources and scope

The private repository’s authenticated GitHub Dependabot page was inspected directly. It reported **141 open alerts** shortly after the initial source push, including historical lockfile findings for Vite, Vitest, Axios, Fast XML Parser, pnpm, and transitive packages. The repository alert detail for Dependabot **#46** specified that `vite 7.1.9` was affected and required `vite >= 7.3.5` (patch available). The project’s local production audit was also run after bounded upgrades and overrides.

| Check | Verified result | Interpretation |
|---|---|---|
| Direct Dependabot alert #46 | Vite 7.1.9 affected; patch requirement `>= 7.3.5` | The newly installed Vite 7.1.9 must be upgraded before the GitHub scanner refreshes. |
| Direct Dependabot alert #2 | Vitest `< 3.2.6` affected; patch requirement `>= 3.2.6` | The project’s direct Vitest 2.1.9 dependency requires a bounded upgrade before the GitHub scanner refreshes. |
| Local production audit after AWS SDK, tRPC, Axios, Drizzle, NanoID, lodash, and path-to-regexp remediation | 0 critical, 0 high, 26 moderate, 7 low | Production high/critical exposure was removed locally; moderate/low findings require a documented follow-up pass. |
| Application type check and tests after remediation | `pnpm check` passed; 11 Vitest tests passed | Current source behavior remains validated after the dependency changes. |

## Final remediation result

The dependency graph was updated using the exact patched Vite and Vitest version requirements identified in Dependabot, alongside targeted direct upgrades and transitive overrides for the audited production chain. A fresh `pnpm audit --prod --json` completed with **0 critical, 0 high, 0 moderate, and 0 low** findings. `pnpm check` and all **11** Vitest tests passed on the hardened graph.

The authenticated Dependabot review confirmed that the initial alert count was based on the earlier lockfile state. GitHub must asynchronously re-ingest the pushed lockfile before its historical alert count refreshes; no claim is made that its UI count changed before that scan completes.

## Next remediation order

1. Recheck the authenticated Dependabot page after GitHub has ingested the pushed lockfile update; the prior alert count is expected to refresh asynchronously.
2. Continue the scheduled audit on each later production batch and keep the production audit at zero known vulnerabilities.

> This audit does not claim that GitHub’s alert counter has already refreshed. The initial 141 count was observed before the repository had reprocessed the current lockfile.
