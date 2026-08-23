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

The final full-development audit retains **one moderate, transitive-only** finding: `esbuild 0.18.20` introduced by `drizzle-kit 0.31.10 → @esbuild-kit/esm-loader 2.6.5 → @esbuild-kit/core-utils 3.3.2`. The latest compatible Drizzle Kit patch does not yet remove that upstream legacy range. It is absent from the production audit. Compensating controls are that the production deployment does not run Drizzle Kit, database migrations are performed through the managed schema workflow, and the development server is not treated as an internet-facing production service. This dependency remains in the scheduled security review until its upstream chain publishes a compatible patched release.

The authenticated Dependabot review confirmed that GitHub reprocessed the pushed lockfile: **99 alerts closed** and **42 open** remained. The observed remaining alerts are development-scope findings concentrated in package-manager/build tooling chains (`pnpm`, `tar`, and `postcss`) in `pnpm-lock.yaml`; the current local **production** audit remains zero across critical, high, moderate, and low severities. A complete current-alert inventory and explicit post-refresh disposition remain active tasks.

The second authenticated results page showed that the open findings continue into **moderate** development-only `pnpm` integrity, path traversal, archive extraction, and configuration advisories, plus development `postcss` and `tar` advisory chains. This supports treating the current count as a lockfile/tooling refresh issue rather than a production-runtime exposure, while keeping the complete inventory and post-refresh reconciliation open until the latest local removal/update commit is pushed and scanned.

## Final authenticated recheck

After the final toolchain and lockfile push, the authenticated GitHub Dependabot UI reported **140 closed alerts and 1 open alert**. The sole remaining item is a **moderate, development-only, transitive** `esbuild` alert in `pnpm-lock.yaml`, matching the documented `drizzle-kit → @esbuild-kit` legacy chain. It is absent from the production audit, which remains zero across all severities. The remaining item is retained for scheduled upstream monitoring rather than misrepresented as resolved.

**Independent verification:** The authenticated Dependabot UI was rechecked immediately after this record was prepared and continued to show **1 open / 140 closed**, with alert **#3** (`esbuild`, moderate, development scope) as the sole remaining finding.

## Next remediation order

1. Recheck the authenticated Dependabot page after GitHub has ingested the pushed lockfile update; the prior alert count is expected to refresh asynchronously.
2. Continue the scheduled audit on each later production batch and keep the production audit at zero known vulnerabilities.

> This audit does not claim that GitHub’s alert counter has already refreshed. The initial 141 count was observed before the repository had reprocessed the current lockfile.
