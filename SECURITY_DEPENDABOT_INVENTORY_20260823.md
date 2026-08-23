# Dependabot Open-Alert Inventory — 2026-08-23

This inventory is generated from authenticated GitHub Dependabot UI result pages after the dependency-hardening push. It records the 42 alerts still shown during the asynchronous scanner refresh. All are development-scope entries in `pnpm-lock.yaml`; the current local production audit reports zero known vulnerabilities.

| Alert | Package | Affected version or range | Patched version | Severity | Scope | Relationship | Disposition |
|---:|---|---|---|---|---|---|---|
| #3 | esbuild | <= 0.24.2 | 0.25.0 | moderate | development | transitive_or_unspecified | awaiting_latest_lockfile_refresh |
| #6 | tar | = 7.5.1 | 7.5.2 | moderate | development | transitive_or_unspecified | awaiting_latest_lockfile_refresh |
| #10 | pnpm | >= 6.25.0, < 10.27.0 | 10.27.0 | high | development | direct | awaiting_latest_lockfile_refresh |
| #11 | pnpm | < 10.26.0 | 10.26.0 | high | development | direct | awaiting_latest_lockfile_refresh |
| #12 | pnpm | >= 10.0.0, < 10.26.0 | 10.26.0 | high | development | direct | awaiting_latest_lockfile_refresh |
| #14 | tar | <= 7.5.2 | 7.5.3 | high | development | transitive_or_unspecified | awaiting_latest_lockfile_refresh |
| #15 | tar | <= 7.5.3 | 7.5.4 | high | development | transitive_or_unspecified | awaiting_latest_lockfile_refresh |
| #18 | pnpm | < 10.28.2 | 10.28.2 | moderate | development | direct | awaiting_latest_lockfile_refresh |
| #19 | pnpm | < 10.28.1 | 10.28.1 | moderate | development | direct | awaiting_latest_lockfile_refresh |
| #20 | pnpm | < 10.28.1 | 10.28.1 | moderate | development | direct | awaiting_latest_lockfile_refresh |
| #21 | pnpm | < 10.28.2 | 10.28.2 | moderate | development | direct | awaiting_latest_lockfile_refresh |
| #22 | pnpm | < 10.28.1 | 10.28.1 | moderate | development | direct | awaiting_latest_lockfile_refresh |
| #23 | tar | < 7.5.7 | 7.5.7 | high | development | transitive_or_unspecified | awaiting_latest_lockfile_refresh |
| #26 | tar | < 7.5.8 | 7.5.8 | high | development | transitive_or_unspecified | awaiting_latest_lockfile_refresh |
| #33 | tar | <= 7.5.9 | 7.5.10 | high | development | transitive_or_unspecified | awaiting_latest_lockfile_refresh |
| #34 | tar | <= 7.5.10 | 7.5.11 | high | development | transitive_or_unspecified | awaiting_latest_lockfile_refresh |
| #60 | postcss | < 8.5.10 | 8.5.10 | moderate | development | direct | awaiting_latest_lockfile_refresh |
| #88 | @babel/core | <= 7.29.0 | 7.29.6 | low | development | transitive_or_unspecified | awaiting_latest_lockfile_refresh |
| #93 | tar | <= 7.5.15 | 7.5.16 | moderate | development | transitive_or_unspecified | awaiting_latest_lockfile_refresh |
| #103 | pnpm | < 10.33.4 | 10.33.4 | moderate | development | direct | awaiting_latest_lockfile_refresh |
| #104 | pnpm | < 10.34.0 | 10.34.0 | moderate | development | direct | awaiting_latest_lockfile_refresh |
| #105 | pnpm | < 10.34.1 | 10.34.1 | moderate | development | direct | awaiting_latest_lockfile_refresh |
| #106 | pnpm | < 10.34.0 | 10.34.0 | moderate | development | direct | awaiting_latest_lockfile_refresh |
| #107 | pnpm | < 10.34.0 | 10.34.0 | high | development | transitive | awaiting_latest_lockfile_refresh |
| #108 | pnpm | < 10.34.0 | 10.34.0 | moderate | development | direct | awaiting_latest_lockfile_refresh |
| #109 | pnpm | < 10.34.0 | 10.34.0 | high | development | direct | awaiting_latest_lockfile_refresh |
| #110 | pnpm | < 10.34.2 | 10.34.2 | moderate | development | direct | awaiting_latest_lockfile_refresh |
| #111 | pnpm | < 10.34.2 | 10.34.2 | high | development | direct | awaiting_latest_lockfile_refresh |
| #112 | pnpm | < 10.34.2 | 10.34.2 | high | development | direct | awaiting_latest_lockfile_refresh |
| #113 | pnpm | < 10.34.2 | 10.34.2 | high | development | direct | awaiting_latest_lockfile_refresh |
| #114 | pnpm | < 10.34.2 | 10.34.2 | moderate | development | direct | awaiting_latest_lockfile_refresh |
| #115 | pnpm | < 10.34.4 | 10.34.4 | high | development | direct | awaiting_latest_lockfile_refresh |
| #116 | pnpm | < 10.34.4 | 10.34.4 | high | development | direct | awaiting_latest_lockfile_refresh |
| #117 | pnpm | < 10.34.4 | 10.34.4 | high | development | direct | awaiting_latest_lockfile_refresh |
| #120 | tar | <= 7.5.16 | 7.5.17 | moderate | development | transitive_or_unspecified | awaiting_latest_lockfile_refresh |
| #121 | tar | <= 7.5.17 | 7.5.18 | high | development | transitive_or_unspecified | awaiting_latest_lockfile_refresh |
| #122 | tar | <= 7.5.18 | 7.5.19 | critical | development | transitive_or_unspecified | awaiting_latest_lockfile_refresh |
| #123 | tar | <= 7.5.17 | 7.5.18 | moderate | development | transitive_or_unspecified | awaiting_latest_lockfile_refresh |
| #129 | postcss | <= 8.5.11 | 8.5.12 | high | development | direct | awaiting_latest_lockfile_refresh |
| #130 | postcss | <= 8.5.17 | 8.5.18 | high | development | direct | awaiting_latest_lockfile_refresh |
| #131 | tar | <= 7.5.20 | 7.5.21 | high | development | transitive_or_unspecified | awaiting_latest_lockfile_refresh |
| #132 | postcss | <= 8.5.22 | 8.5.23 | moderate | development | direct | awaiting_latest_lockfile_refresh |

## Disposition rule

These rows must be rechecked after GitHub ingests the latest pushed lockfile. The inventory does not claim an alert is fixed solely from a local package update; the only completed runtime finding is the local production audit with zero critical, high, moderate, and low vulnerabilities.
