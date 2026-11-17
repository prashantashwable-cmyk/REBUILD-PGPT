# Release note — build 106 (rebuild, 17 Nov 2026)

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
Server-side validation (needs Owner approval), KPI formula/freshness on every tile, separate partner states Paused/Rejected/Expired/Offboarded, double-entry ledger (server), hash-based CSP, human review of Marathi/Hindi, professional legal/safety review.

## Rollback
Redeploy build 105 from tag `baseline-605575a` with a higher cache number (see `docs/operations/DEPLOYMENT_AND_ROLLBACK.md`).
