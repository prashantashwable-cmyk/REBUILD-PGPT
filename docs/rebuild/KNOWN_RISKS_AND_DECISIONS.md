# Known risks and decisions

## 1. Decisions taken in this rebuild (assumptions are configurable and labelled)

| ID | Decision | Why | Who must approve |
|---|---|---|---|
| D-1 | **Keep the single-file event-sourced PWA**; no stack migration. | Master prompt §1.3; the app is mature and tested (111/112 baseline files green). | — (prompt rule) |
| D-2 | Rebuild in repo `REBUILD-PGPT`, branch `ccr-97b11475-gt4r3h`; production in `UNLIT-GPT-HTML` untouched; tag `baseline-605575a` = rollback. | §1.4 | Owner decides when to promote |
| D-3 | Design system v2 (deep navy `#102341`, brass `#c0953a`) as a CSS layer on top of v1; class names unchanged. | §6.1; reviewable, removable | Owner (look) |
| D-4 | Progress label "Milestones verified: X of 7" replaces "Job N% done". | §6.3 forbids stage-count percentages | — |
| D-5 | Installation target per job size: standard `installDays` 14, big/complex `installDaysComplex` **28 (proposed)**; always shown as an estimate with start conditions. | §3.4 | **Owner** (rule group *install*, shows "Proposed — not approved") |
| D-6 | Default service area `Pune`; PCMC and others only when HQ adds them. | §3.3 | **Owner** (rule group *privacy*) |
| D-7 | 6th live job needs an **Owner-approved** capacity exception (Admin's check → approval request). Effective 17 Nov 2026 00:00 UTC; older records valid. | §3.3 | — (prompt rule) |
| D-8 | Marketplace commission stays **2 %** (`commRate`) on confirmed collections only, once per confirmed payment (already implemented). | §3.1 | **Owner + CA/legal** before invoicing |
| D-9 | Connections screen shows every outside service as *Not connected* / *By hand* except the company server and the map. | §1.7, §19.5 | — |
| D-10 | Sync status strip on staff homes (words + dot, never a green tick for phone-only work). | §6.2, §13.2 | — |
| D-12 | KPI board: every number opens to show its written formula; the board shows when it was counted and the data source/sync state; "—" means no records (not zero). | §11.1, §16 | — |
| D-13 | Content-Security-Policy by script hash + SRI on Leaflet (build 107). | §14 | — |
| D-14 | Partner states added: Paused, Rejected, Offboarded; "Expired papers" is worked out automatically, never set by hand. | §8.1 | — |
| D-15 | Partner papers re-checked at every licence-dependent step; ended licence/insurance = controlled hold with an urgent office task; never silently moves the job to another company. | §3.1, §9 | — |
| D-16 | Automated accessibility test (axe-core, WCAG 2 A/AA) added to the suite; the decorative anti-leak watermark is excluded on purpose. | §6.4 | — |
| D-11 | Section headings kept in normal case (not uppercase): `innerText` follows CSS `text-transform`, which would also change what screen readers announce. | Found by `waits.test.js` | — |

## 2. Confirmed risks

| ID | Risk | Severity | Mitigation / status |
|---|---|---|---|
| R-1 | No server-side rule checks: the company server is an end-to-end encrypted mailbox and cannot read records (by design). | Medium (reviewed 17 Nov 2026) | The office phone is the authoritative validator: signatures, sender binding, signed server settings, full `validate()` on every import. A forged-settings hole (S-1) was found and fixed in build 110. See `docs/architecture/SERVER_SIDE_REVIEW.md`. |
| R-2 | Marathi and Hindi text is machine-checked for completeness only. | High for production | Fluent human review before go-live (`PRODUCTION_READINESS_CHECKLIST.md`). New rebuild strings flagged for review. **17 Nov 2026: Owner reports the review is done; attach reviewer name, date and evidence (`docs/compliance/REVIEW_LOG.md`).** |
| R-3 | Legal/safety templates (agreement, NOC, QC checklists, 12 SOP steps, training answers, Maharashtra Lifts Act notes) are not professionally verified. | High for production | Compliance register; status "Unverified". **17 Nov 2026: Owner reports the review is done; attach reviewer name, date and evidence (`docs/compliance/REVIEW_LOG.md`).** |
| R-4 | Drawn signatures are not certified e-signatures. | Medium | Labelled on Connections screen and documents. |
| R-5 | Media stored as data URLs in IndexedDB; large companies may hit quota. | Medium | Storage warning, photo archive, persistent-storage request. Future: Blob storage. |
| R-6 | Client clock is the event time. | Medium | `clock_gap` flag; server receipt time when a server is used. |
| R-7 | ~~CSP had no `script-src`.~~ | Resolved (build 107) | Hash-based CSP: `script-src` allows only the app's own script (SHA-256) and the map library from unpkg, which now also carries an integrity hash (SRI). `npm run csp` rewrites the hash; `npm run check` fails if it is stale. `connect-src` still allows any https address (the office's own server). |
| R-8 | `android/aiec-test.jks` test keystore is in the repository. | Low (test builds only) | Play Store builds use secrets; never ship the test key. |
| R-9 | Background alerts limited on the web (no always-on push without server/native). | Medium | Documented; Android wrapper/push server optional. |
| R-10 | Technician access after handover is rule-based, not a dated window. | Low | Deferred. |
| R-11 | GPS indoors is unreliable. | Low | Far check-in is a flag for the office, never proof. |
| R-12 | `waits.test.js` failed once in the baseline run and passes on re-run (timing-dependent). | Low | Watch in CI; not caused by the rebuild. |
| R-13 | New "Pune" default could mark a real lead out of area if its address omits "Pune" (e.g. only a locality name). | Low | Only affects the public price-guess screen message; HQ edits the list. |

## 3. Provider dependencies (all Not connected)

Payment gateway · WhatsApp Business API · SMS provider · banks/NBFCs · e-sign · masked calling · government registries · AI assistant. Company sync server: optional, self-hosted (Cloudflare/Supabase/Node), configured per company.

## 4. Needs a qualified professional

Maharashtra lift law and rules (licence, permits, inspection, accident reporting, insurance) · GST/TDS/commission invoicing (CA) · contractor/labour classification · DPDP Act 2023 privacy notice and retention · agreement and marketplace partner agreement · safety SOPs and QC tolerances (lift engineer).
