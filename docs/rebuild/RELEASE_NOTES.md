# Release note — builds 106–110 (rebuild, 17 Nov 2026)

## Build 111
* The sync status on the home screen is now a small chip in the greeting card (dot + one word; tap for the full sentence) instead of a full-width line. The home screen is back to its original height, which the "home stays short" test requires on CI's fonts. Card spacing returned to the original values.
* CI: runners pinned to Ubuntu 24.04 and Playwright 1.63.0 (GitHub's `ubuntu-latest` moved to 26.04, where Playwright 1.56 cannot install Chromium).

## Build 110
* **Security fix (high):** server settings in a file (company server address and key) are now taken only with a valid Head Quarter/Admin signature over them. Before, a forged or altered file could switch an office phone to another server. **Older files with server settings still load their records but not their server settings**; send a fresh file or one-time code. Connected phones keep working.
* Office phones refuse an inbox message whose file does not belong to the box that sent it.
* Server: phones change only their own alert subscription; person phones may send at most 60 messages a minute; old rate counters and ended invites are cleaned up on Cloudflare D1.
* Professional reviews recorded as reported by the Owner (`docs/compliance/REVIEW_LOG.md`); evidence still to attach.

## Build 109
* **Controlled hold when a partner's papers end mid-job:** the company holding a job is re-checked at material handover, every installation step, and the Marketplace inspection request and handover. If its lift licence or insurance has ended, the step is refused with the reason, and the office gets an urgent "Job on hold" task that opens the company's page. When the office records renewed papers, the hold lifts by itself. Older records stay valid (rule from 17 Nov 2026).
* **Accessibility:** automated WCAG 2.0/2.1 A/AA checks (axe-core) on the main screens of every kind of user in all themes and languages: 72 checks, no violations. Fixed on the way: inactive bottom-menu labels in the dark theme (2.8:1 → passes) and green status text in the optional colour theme (3.95:1 → passes).

## Build 108
* Partner company states: **Paused**, **Rejected** and **Offboarded** added (reason required, Head Quarter/Admin); **Expired papers** shown automatically when a company's lift licence or insurance has ended. Paused companies get no new jobs but keep their open jobs; Rejected/Offboarded companies' open jobs get a handover task.

## Build 107
* **KPI board:** every number opens to show how it is worked out (in Marathi, Hindi and English), with an "as of" line naming the data source and sync state; "—" means no records yet, not zero.
* **Security:** the Content-Security-Policy now allows only the app's own script (by SHA-256) and the map library, which carries an integrity hash. After editing the script, run `npm run csp`.

## Build 106

Based on build 105 (`UNLIT-GPT-HTML@605575a`, tag `baseline-605575a`). Nothing was removed; every existing workflow, record and test is kept.

## What changed
**Look (all screens, all three languages)**
* New design system: deep navy foundation, brass accent, cleaner cards, a brand mark in the top bar, a clearer bottom menu (pill on the current item), refined buttons, tabs, doors, sheets and the front-door screens. Light, colour, dark and high-contrast themes still work; touch sizes unchanged.
* The gold box around each screen title (screen-reader focus) no longer shows; keyboard focus rings stay.

**Honesty and control**
* Progress shows **"Milestones verified: X of 7"** instead of a percentage made from stage counts.
* Installation target is an **estimate per job size**: standard jobs 14 days, big/complex jobs 28 days (new rule *installDaysComplex*, **proposed — needs Head Quarter approval**). Project page, quotation and agreement say it is an estimate and when the count starts.
* **Pilot geography:** default service area is **Pune**; PCMC and other areas only after the Head Quarter adds them (rule *serveAreas*).
* **Pilot limit:** a 6th live job needs a **Head Quarter-approved** capacity exception. An Admin's capacity check now becomes an approval request.
* **Sync status** on every staff home, in words: saved on this phone / waiting to sync / received by server / failed / refused / stale, and rejected entries for the office.
* **Me → Connections:** the true status of every outside service.

## Integrations — exact status
| Service | Status |
|---|---|
| Company server (sync) | Optional; *Connected* only when the office set it up and it answers |
| Payment gateway | Not connected — Finance confirms with the bank reference |
| WhatsApp Business API | Not connected — the app opens WhatsApp; the person sends |
| SMS provider | Not connected — opens the phone's messages app |
| Banks / NBFCs | Not connected — referral by hand after consent |
| e-Sign provider | Not connected — drawn signatures, not certified |
| Bank statement feed | By hand (CSV) |
| Masked calling | Not connected |
| Government registries | Not connected — documents checked by hand |
| Street map / address lookup | OpenStreetMap when online; own simple map offline |
| AI assistant | None |

## Migration
No record format change (record version stays 2). Existing company files load as before; the first start replays records once (the snapshot belongs to the old app code). Old capacity checks by an Admin stay valid; the new Head Quarter rule applies from 17 Nov 2026 00:00 UTC. Companies that already set service areas keep theirs.

## Deferred
Server-side validation (needs Owner approval), double-entry ledger (server), human review of Marathi/Hindi, professional legal/safety review.

## Rollback
Redeploy the previous build (or build 105 from tag `baseline-605575a`) with a higher cache number (see `docs/operations/DEPLOYMENT_AND_ROLLBACK.md`).
