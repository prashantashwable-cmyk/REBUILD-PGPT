# Test results

Environment: Linux container, Node 22.23, Playwright 1.56 + Chromium (headless), 390×844 phone viewport, Asia/Kolkata, 4 shards in parallel. Date: 17 Nov 2026. Summaries of the real output are in `docs/testing/logs/`.

## Baseline (build 105, unchanged import)
* Static: **passed**.
* Browser suite: **111 of 112 files passed**. `waits.test.js` failed once ("the screen shows slowest steps and waiting jobs") and passed when re-run — timing-dependent, pre-existing. Log: `logs/baseline-summary.txt`.

## Build 106 — full run (run 1)
* Static: **passed** (2.27 MB of 2.4 MB budget; version 106 = sw.js; 4,9xx word keys complete in en/hi/mr; every word the code asks for exists).
* Browser suite: **113 files, 111 passed, 2 failed**, 2,327 passing assertions. Log: `logs/run1-summary.txt`.
  * `finish.test.js` — asserted the old dark-theme background `rgb(20,22,27)`; the v2 dark theme is deep navy `rgb(13,20,32)` (intended change). Test updated.
  * `custtrust.test.js` — made the "installing" job late by `installDays + 6` days; that job is a big job whose estimate is now 28 days, so it was correctly *not* late. Test updated to use the job's own `targetDays(P)`.
* No app code changed after run 1 started (only the two tests and docs).

## Build 106 — re-run of every file touched by the rebuild (run 2)
`static`, `finish`, `custtrust`, `rebuild`, `bars`, `bp3kpi`, `bp5market`, `audit-privacy`, `waits`: **all passed** (exit 0). Log: `logs/run2-rerun-summary.txt`.

**Result: every test file passes on build 106** (run 1 for the 111 unchanged files, run 2 for the rest).

## Build 107 — full run (run 3)
Hash-based CSP + SRI and the KPI dictionary: **113 of 113 files passed**, 2,362 passing assertions, no CSP violations (any blocked script or style would surface as a page error and fail the test). Log: `logs/run3-build107-summary.txt`.

## Build 108 — full run (run 4)
Partner states Paused / Rejected / Offboarded / Expired papers: **113 of 113 files passed**, 2,369 passing assertions. Log: `logs/run4-build108-summary.txt`.

## Build 109 — full run (run 5)
Controlled hold on ended partner papers + accessibility test: **114 of 114 files passed**, 2,376 passing assertions; `a11y.test.js`: no WCAG 2 A/AA violations in 72 screen checks. Log: `logs/run5-build109-summary.txt`.

## Build 110 — full run (run 6)
Server-side review fixes: **116 of 116 files passed**, 2,394 passing assertions. New: `server-hardening.test.js` (9 checks, no browser) and `sync-forgery.test.js` (9 checks on a real, signed company). The forged-settings hole was also reproduced on build 109 and shown closed on build 110. Log: `logs/run6-build110-summary.txt`.

## Build 111 — full run (run 7, current)
**116 of 116 files passed**, 2,394 passing assertions. Log: `logs/run7-build111-summary.txt`.
Why build 111: on GitHub's CI fonts, build 110's Admin home measured 2,643 px against the 2,600 px limit in `home-fold.test.js` (the sync line added about 58 px). The status became a chip in the greeting card. Measured at the same moment, the Admin home is now 2,496 px, the same as the original build 105 (2,496 px); build 110 was 2,565 px. The limit was not changed.

## Tests changed in the rebuild (and why)
| File | Change | Reason |
|---|---|---|
| `bars.test.js`, `bp5market.test.js` | "Job N% done" → "Milestones verified: N of 7" | honest progress (§6.3) |
| `bp3kpi.test.js` | Admin's capacity check is now a request; Admin cannot approve it; Head Quarter approves | §3.3 |
| `audit-privacy.test.js` | capacity check recorded by the Head Quarter | same rule |
| `finish.test.js` | new dark-theme colour | design v2 |
| `custtrust.test.js` | late = job's own target | per-size target (§3.4) |
| `rebuild.test.js` (new) | 37 checks: rebuild rules, screens, KPI formulas, partner states, controlled hold | — |
| `a11y.test.js` (new) | axe-core WCAG 2 A/AA, 72 screen checks (dev dependency `axe-core` 4.10.2) | build 109 |
| `access.test.js`, `static.test.js` | CSP now checked as script-hash policy; static check fails if the hash is stale | build 107 |
| `shots-roles.js` (new) | role screenshots mr/hi/en, sideways-scroll and missing-word checks: 58 screens, **SHOTS OK** | before/after |

## Not executed here (needs real devices / services)
Android camera/mic/GPS, installed-PWA background behaviour, APK install, live company server under network loss, time-travel run (`AIEC_SHIFT_DAYS=45`, runs weekly in CI).
