# Rebuild plan

Principle: **improve the working system in small, tested, reversible steps.** Every step keeps the full test suite green and the record format unchanged.

| Phase | Scope | Status | Rollback point |
|---|---|---|---|
| 0 Baseline | Import app unchanged; tag `baseline-605575a`; baseline tests (111/112); before-screenshots (`tests/shots-roles.js`); audit docs | **Done** | tag `baseline-605575a` |
| 1 Domain foundation | Rules for: complex-job target, Pune geography default, Owner-only capacity exception, milestone-based progress; generated permission matrix | **Done** | commit "Rebuild phase 1-2" |
| 2 Frontend | Design system v2 (navy/brass), brand mark, nav, cards, front-door look, sync status strip, Connections screen; screenshots in mr/hi/en | **Done** | same |
| 3 Delivery & safety | Already implemented in v105 (LPC, membership, safety gates, SOP, QC, licence, handover, AMC). Rebuild verified by existing tests; no change needed now | Verified | — |
| 4 Marketplace & finance referral | Already implemented (bp4finance, bp5market). Commission 2 % on confirmed collections verified | Verified | — |
| 5 Command center & workforce | KPI dictionary on the board (formula per number, as-of time, source); partner states Paused/Rejected/Offboarded/Expired | **Done (build 107)** | commit "Rebuild round 2" |
| 6 Hardening & release | Hash-based CSP + SRI **done (build 107)**. Pending: human language review; legal/safety review; Android device tests; optional server-side validation (needs Owner approval); promote to production | Partly done | — |

## Next highest-risk work items

1. ~~Server-side validation~~ — reviewed in build 110: impossible without breaking end-to-end encryption; the office phone validates instead. Fixed the holes found (`docs/architecture/SERVER_SIDE_REVIEW.md`).
2. **Human review of Marathi/Hindi** for all safety and money screens (R-2).
3. **Professional review** of compliance templates (R-3).
4. ~~KPI dictionary in the app~~ — done in build 107.
5. Media to Blob storage with quota accounting (R-5).

## Release / promotion steps

See `docs/operations/DEPLOYMENT_AND_ROLLBACK.md`. In short: all tests green → bump `APP_BUILD` and `sw.js` cache together → copy files to the production Pages repo → confirm the live `sw.js` version → keep the previous build ready to redeploy.
