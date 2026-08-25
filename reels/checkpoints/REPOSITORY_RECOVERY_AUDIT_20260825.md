# Repository Recovery Audit — 2026-08-25

| Area | Verified result | Disposition |
|---|---|---|
| Git branch relationship | Local `main` had no unique commits and was five commits behind `github/main`; it fast-forwarded to `76e0635`. | A rebase was not required and was therefore not performed. |
| Reel 0019 barrier | The preserved registry-aligned candidate had a real SRT overlap. | Corrected transcript-aligned captions, re-render, SHA-256, Drive artifacts, remote parent checks, runner verification, and root-state semantic comparison passed. Reel 0019 is Drive-verified and next ID is `0020`. |
| Caption regression | No reusable SRT timing gate existed. | Typed parser/validator plus tests now reject overlap, invalid duration, and non-Hindi captions; the actual corrected Reel 0019 SRT is tested. |
| Formatting | `prettier --check .` failed across source and immutable evidence archives. | Archives are ignored; source/configuration formatting was normalized and `pnpm format:check` passes. |
| Build resources | Production build received signal 143 while a stale TypeScript watch process consumed memory. | The non-server watcher was safely stopped; the bounded `NODE_OPTIONS=--max-old-space-size=1536 pnpm build` passes. |
| Runtime | Local authenticated dashboard was visually checked after restart. | Dashboard renders; current server/network activity showed no new runtime rendering failure. |
| Gemini | The server's catalogue health endpoint was exercised directly without exposing a key. | Google Gemini returned HTTP 200 with 50 available models. |
| Production dependencies | `pnpm audit --prod --audit-level=moderate` was run. | No known production vulnerabilities were found. |
| First-party CI | No repository workflow file existed. | A least-privilege workflow now runs formatting, typecheck, tests, and the bounded build. Remote run remains pending until push. |
| Dependabot API | Authenticated repository access works, but listing Dependabot alerts returned HTTP 403. | Alert state was not changed. The documented dev-only moderate transitive alert remains unresolved; required security-alert permission is unavailable to this session. |
| External CLIs | GitHub and Google Workspace CLIs are reachable; Gemini, gcloud, Antigravity, and Datadog CLIs are unavailable. | Unavailable CLIs are not project runtime dependencies and were not force-installed or impersonated. |

The existing hourly schedule remains singular and active. It continues with GitHub and Google Workspace connectors and has not been recreated or modified.
