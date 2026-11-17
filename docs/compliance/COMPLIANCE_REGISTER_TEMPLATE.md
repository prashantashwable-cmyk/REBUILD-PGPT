# Compliance Register (Template)

Product: AIEC Elevator OS, ALL INDIA ELEVATORS COMPANY (AIEC), Pune, Maharashtra pilot.

## How to use this register

* **17 Nov 2026:** the Owner reported that the professional reviews are done. Each row now reads "Reported reviewed — evidence to attach". Set a row to `Verified` only after the reviewer's name, review date and source citation are filled in. See `REVIEW_LOG.md`.
* This is a **template**. Every row is pre-filled only with what the app already models. **No legal citation, effective date or interpretation has been verified.** All rows are "Unverified — needs qualified review".
* A qualified professional (lift engineer, advocate, chartered accountant, privacy counsel) must fill the Source citation, Effective date, Reviewed by and Review date, then set the Status. Do not copy a rule into the app as a fixed legal fact until its row is verified.
* Fill "Next review" for each row (suggested: every 6 months, and on any change of law or of an app rule).
* The app keeps records of papers; it does not issue permits or licences. Several app rules come from reports of law ("as reported; Gazette wording to be checked" in the app source).
* The spec asks for a versioned in-app register with these fields. That in-app register is **Not built**; this file is the manual register until it is.

Status values: `Unverified — needs qualified review` / `Reported reviewed — evidence to attach` / `Verified` / `Partially verified` / `Superseded` / `Not applicable`.

## Register

| ID | Requirement | Jurisdiction | Source citation (to be filled after verification) | Effective date | Applies to (stage / role) | How the app enforces it (config key / event / gate) | Reviewed by | Review date | Next review | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| CR-001 | Lift operating permission / lift licence valid before the lift is handed over or serviced; who must hold it is an Owner and lawyer decision | Maharashtra (Lifts Act and rules, to be verified by a qualified professional) | | | Handover; Admin, QC, Sales, Finance record; service stage; LPC | `licenceGate` = 1: handover refused without a valid recorded licence; licence recordable only after a passed Lift Inspector visit; service visits stop when licence has ended; reminder `licWarnDays` 60. Tests `statutory.test.js`, `bp5market.test.js` | | | | Reported reviewed — evidence to attach (Owner, 17 Nov 2026) |
| CR-002 | Erection permit before erection work | Maharashtra (to be verified) | | | Site preparation to installation; Admin records | `permitGate` = 1; statutory records (`STAT_ITEMS` permit); `statutory.test.js` | | | | Reported reviewed — evidence to attach (Owner, 17 Nov 2026) |
| CR-003 | Lift Inspector inspection of the installed lift before licence | Maharashtra (to be verified) | | | After final QC, before handover; office records | Event records of inspection (pass or fail with fix list); licence only after pass; `statutory.test.js` | | | | Reported reviewed — evidence to attach (Owner, 17 Nov 2026) |
| CR-004 | Company holds a valid lift licence/registration to take jobs (LPC eligibility) | Maharashtra (to be verified) | | | LPC onboarding, RFQ invitation, job release | `PARTNER_PROFILE` (number, holder, issuing office, valid-until); copy checked by office; jobs only while valid; reminder `licWarnDays` 60; `partner.test.js`, `bp2partners.test.js` | | | | Reported reviewed — evidence to attach (Owner, 17 Nov 2026) |
| CR-005 | Third-party (liability) insurance valid for LPC and for work | India / Maharashtra (to be verified) | | | LPC due diligence; new jobs; handover | Insurance record needs a policy number and an end date not in the past; ended insurance blocks new jobs; renewal task within warning days; `bp1compliance.test.js`, `bp2partners.test.js` | | | | Reported reviewed — evidence to attach (Owner, 17 Nov 2026) |
| CR-006 | Accident or entrapment reported to Lift Inspector and police within 24 hours ("as reported"; Gazette wording to be checked) | Maharashtra (Lifts Rules, to be verified) | | | Any incident of type injury or entrapment; Admin, Owner | `INCIDENT_REPORTED`: urgent 24 hour task, incident cannot be closed before report, report needs both Inspector and police; lift stays stopped until safe; log book entry; `bp1compliance.test.js` | | | | Reported reviewed — evidence to attach (Owner, 17 Nov 2026) |
| CR-007 | Safety incident handling: stop-work, root cause, corrective action before closing | India (site safety, to be verified) | | | Site work; team lead, Admin, QC | `dailySafety` = 1 daily 4-photo check; hazard, injury, SOS stop work until office closes; closing needs root cause, fix and decision; SOS GPS; README Site safety | | | | Reported reviewed — evidence to attach (Owner, 17 Nov 2026) |
| CR-008 | Safety-critical QC items (earthing, brakes, governor and safety gear, door interlocks) | India (applicable lift standard, to be verified) | | | Final QC; QC Inspector | Each item with own photo; any fail fails the whole inspection; thresholds `earthMax`, tolerances `tolWidth`, `tolDepth`, `tolPit`, `tolHead` | | | | Reported reviewed — evidence to attach (Owner, 17 Nov 2026) |
| CR-009 | Technician safety training and periodic re-test | India (to be verified; labour and safety rules) | | | Technicians; Admin | `safetyRetest` = 12 months; `requireTraining` (default 0, off); training module; promotion needs training; QC needs QC module and practical test; `ladder.test.js` | | | | Reported reviewed — evidence to attach (Owner, 17 Nov 2026) |
| CR-010 | Digital Personal Data Protection Act, 2023: notice, purpose limitation, consent, correction, deletion, retention, breach handling | India (DPDP Act 2023 and rules, to be verified by a qualified professional) | | | All roles; customer enquiry, finance interest, partner and technician records | Privacy notice screen; call and WhatsApp consent with "asked us to stop"; finance consent with text version and withdrawal removing name and phone (`bp4finance.test.js`); contact masking; data walls for outsiders; access log. **Retention and deletion policy, breach procedure: Not built** | | | | Reported reviewed — evidence to attach (Owner, 17 Nov 2026) |
| CR-011 | Finance referral only: customer consent to share minimum data with named institutions; AIEC is not a lender and promises no approval or rate | India (RBI and lender rules, to be verified) | | | Customer, Sales, Finance | `FIN_INTEREST` with consent text version, `FIN_REFERRED`, `FIN_WITHDRAWN`; no rates or EMI shown; lenders "Not connected"; `bp4finance.test.js`, `rebuild.test.js` | | | | Reported reviewed — evidence to attach (Owner, 17 Nov 2026) |
| CR-012 | GST on supply and installation, on AIEC commission, and tax invoice format | India (CGST/SGST/IGST, to be verified by a qualified CA) | | | Quotation, payment receipt, commission invoice; Finance | `gst` = 18 (%) config; quote shows GST line; receipt is **not** a GST tax invoice; commission invoicing states exist, tax invoice Not built | | | | Reported reviewed — evidence to attach (Owner, 17 Nov 2026) |
| CR-013 | TDS and other withholding on partner and contractor payments | India (Income-tax, to be verified by a qualified CA) | | | Weekly company bill; commission | Not built; bill and commission records carry amounts only | | | | Reported reviewed — evidence to attach (Owner, 17 Nov 2026) |
| CR-014 | Contractor classification of LPC and technicians; labour, ESI/PF and contract-labour rules | India / Maharashtra (to be verified by a qualified professional) | | | LPC onboarding, technician membership, pay | LPC is the pay and contracting entity; technician "paid to my company"; no cash fines; retention off (`retentionPct` 0); signed company agreement check (`contractOk`); no classification logic | | | | Reported reviewed — evidence to attach (Owner, 17 Nov 2026) |
| CR-015 | Marketplace: AIEC as introducer, customer contracts LPC directly; commission 2% on confirmed collections; partner agreement | India (contract, tax and consumer law, to be verified) | | | Model B projects; Owner, Finance | `commRate` = 2 (Proposed — not approved), `MODEL_SET`, `MK_*` events, commission ledger; `bp5market.test.js` | | | | Reported reviewed — evidence to attach (Owner, 17 Nov 2026) |
| CR-016 | Agreement, handover and NOC wording; consumer-protection terms; refund deductions | India / Maharashtra (to be verified by an advocate) | | | Agreement, cancellation, refund | `agreeVersion` = 1; templates only; refund by stage; all Proposed — not approved | | | | Reported reviewed — evidence to attach (Owner, 17 Nov 2026) |
| CR-017 | Pilot geography and capacity (business control, not a legal rule) | Pune, Maharashtra | Owner decision | | Release; Admin, Owner | `serveAreas` = Pune, `cityCode` = PUN; `pilotCap` = 5; Owner-only capacity exception (`CAPACITY_CHECKED`); `bp3kpi.test.js`, `rebuild.test.js` | | | | Reported reviewed — evidence to attach (Owner, 17 Nov 2026) |
| CR-018 | Electronic records, signatures and evidence value of app records | India (IT Act, to be verified) | | | Agreements, signatures, audit trail | Per-phone signed records, tamper check on import, access log; agreements are templates; no e-sign provider connected | | | | Reported reviewed — evidence to attach (Owner, 17 Nov 2026) |

## Review checklist for each row

1. Name the exact law, rule or notification and clause. Write the citation in the Source column. Do not paraphrase from memory.
2. Record the effective date and the date the text was read.
3. Confirm who the duty falls on (AIEC, LPC, owner of the lift, customer) and what the app must do versus what people must do.
4. Compare with the "How the app enforces it" column. If the app is stricter, looser or silent, raise a change request for Head Quarter.
5. Write Reviewed by, Review date and Next review. Change Status only then.
6. If the law changes, mark the row Superseded and add a new row; do not delete history.

## Gaps this register already shows

* No retention, deletion or breach procedure (CR-010).
* No GST tax invoice, no TDS handling (CR-012, CR-013).
* No in-app versioned register (this file replaces it for now).
* No automatic eligibility re-check at every licence-dependent milestone (see `docs/business/AIEC_CONTRACT_VS_MARKETPLACE.md`).
