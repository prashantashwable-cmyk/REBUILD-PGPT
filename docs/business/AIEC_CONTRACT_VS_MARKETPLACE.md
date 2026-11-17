# AIEC Contract (Model A) vs National Elevator Marketplace (Model B)

Product: AIEC Elevator OS (single-file offline PWA) for ALL INDIA ELEVATORS COMPANY (AIEC). Pilot: Pune, Maharashtra.
Status key: **Implemented** (in the app and covered by a test) / **Partially** / **Not built** / **Needs approval** (a business or legal decision is still open).
Nothing in this file is legal or tax advice. Wherever law, tax or contract wording matters it says "to be verified by a qualified professional".

## 1. Principle

Every project runs under exactly one execution model, and the screens always say which one.

* **Model A, AIEC Contract:** the customer contracts with AIEC. AIEC owns the quotation, payment schedule, coordination and handover. An approved Licensed Partner Company (LPC) executes the work under AIEC.
* **Model B, National Elevator Marketplace:** AIEC qualifies the enquiry and introduces 2 to 3 eligible LPCs. The customer picks one and contracts that LPC directly. The customer pays the LPC directly. AIEC earns a commission on verified partner collections only.

Model is stored per project (`P.model`: `aiec` or `market`). Source: `MODEL_SET`, `RFQ_SENT`, `PQUOTE_SENT`, `MK_*` event rules in `AIEC-Elevator-OS.html`.

## 2. Side-by-side

| Topic | Model A: AIEC Contract | Model B: Marketplace | Status |
|---|---|---|---|
| Contracting party | Customer and AIEC (agreement, versioned by `agreeVersion`) | Customer and the picked LPC. AIEC is an introducer and QC coordinator, not the contractor | A: Implemented. B: Implemented (record of pick and accepted terms). Binding wording of both agreements: Needs approval (qualified lawyer) |
| Quote owner | AIEC quotation from the rate card (`calcQuote`), rate-card version kept on the quote | Each invited LPC sends a structured quote (`PQUOTE_SENT`). AIEC does not price the job | Implemented (`bp5market.test.js`, `discount.test.js`) |
| Quote format | AIEC quote with GST line, validity `validityDays` (30) | Standard format: base, tax, freight, installation, make (OEM), civil and electrical included or excluded, exclusions, days, 5 payment parts that must add up to 100%, warranty, AMC, validity | Implemented. Incomplete quotes are refused (`err_fill`, `err_mkt_100`) |
| Who is asked to quote | Not applicable | Admin or Owner asks at least 2 and at most 3 live companies at a time, never the same one twice; a suspended company cannot be asked | Implemented (`bp5market.test.js`) |
| Customer choice | Accepts or counters AIEC's quote | Compares quotes, listed by record (stars, tier, trust) not by price; warns when scopes differ; picks one (`MK_PICKED`) | Implemented. Fairness of the comparison to be reviewed by Owner: Needs approval |
| Payee | AIEC bank or UPI details (`payUpi`, `payName`, `payBank`, `payAcc`, `payIfsc`) | The picked LPC directly. AIEC never receives the customer's principal in the app | Implemented as a rule of the data model. Any escrow, split payment or aggregator: Not built, needs legal, tax and provider approval |
| Payment recorded by | Sales or Finance records, Finance confirms (`PAYMENT_STATUS`, cannot confirm what you recorded: `err_same_person`) | The LPC or the customer records (`MK_PAY_RECORDED`) | Implemented |
| Payment confirmed by | Finance only, with a bank reference; optional bank-CSV suggestion screen, a person presses Confirm (`recon.test.js`) | The other side, or Finance, Admin, Owner. The side that recorded never confirms (`err_self_verify`). A 1 rupee payment does not finish a part; overpaying a part is refused | Implemented (`bp5market.test.js`). No gateway: Not connected (`rebuild.test.js`) |
| Payment plan | Plan 1 (30/40/20/10, material in lots) or plan 2 (token, `arrivalPct`, handover), kept by the job (`payplans.test.js`) | The LPC's own 5 milestones from its quote, fixed when the LPC accepts | Implemented. Which plan is the default: Needs approval |
| AIEC commission | None (AIEC revenue is the price) | `commRate` = 2 (%), working assumption, **only** on a payment that is confirmed, once per payment, kept in a separate ledger | Implemented. 2% itself: Needs approval (signed partner agreement, legal and tax review) |
| Commission ledger | Not applicable | `S.comm`: Verified, Invoiced ("Bill sent"), Due, Paid, Disputed, Adjusted; cannot jump to Paid; refund gives a credit note (`COMM_CREDIT`) | Implemented. GST and invoicing treatment of commission: Needs approval (CA) |
| Statutory duties | AIEC Admin records permit, Lift Inspector visit and lift licence; handover refused without licence (`licenceGate`) | Same working-licence check before handover (`MK_DONE` checks `licenceGate`), plus one AIEC QC inspection with 2 photos. Who is the lift licence holder: Owner decision with a lawyer | Implemented as records. The app does not issue permits or licences |
| Insurance and incidents | Third-party insurance recorded and warned; accident or entrapment needs a report to Lift Inspector and police, 24 hours as reported (`bp1compliance.test.js`) | Company-level insurance check blocks new jobs when it ends (`bp2partners.test.js`). The 24 hour incident task applies to any job in the app | Implemented as records. The 24 hour rule wording: to be verified by a qualified professional |
| Warranty | `warrantyMonths` (12) from the AIEC agreement | From the LPC's quote (`warranty`, 0 to 120 months). Handover stores it on the lift | Implemented. Who stands behind warranty if the LPC fails: Needs approval (see section 5) |
| AMC and service | AIEC AMC visits (`amcVisits`, 4 a year; `amcPrice`) | Handover (`MK_DONE`) puts the lift into AMC with a QR code and visit dates; the partner's quoted AMC price is recorded | Partially. Who contracts and bills later AMC years under Model B: Needs approval |
| What the customer sees | AIEC quote, AIEC payment details, AIEC milestones | The comparison, then the LPC's name on quote, payment parts and progress. Contact is shared with the LPC only after a consent tick (`MK_INTRODUCED`) | Implemented. Wording on every receipt and agreement that names the contracting party: Partially (receipts are records, not GST tax invoices) |
| What the partner sees | Only the jobs they hold; no customer phone, no prices or margins (masked) | Only its own quote; never rivals' details; building name, exact address and phone only after it holds the job | Implemented (`partner.test.js`, `market.test.js`, `bp5market.test.js`) |
| Hold and ineligibility | Hold needs office approval; no escalation while on hold; approved hold days are excluded from the install target (`statutory.test.js`) | Admin or Owner can hold a pick with a reason (`MK_PICK_HELD`). If the picked LPC can no longer take jobs, the office is told to hold the pick. Nothing moves to another LPC silently | Implemented. Re-check of eligibility at every later milestone: Partially (see section 4) |
| Decline | Not applicable | An LPC can decline with a reason; the customer can pick again; a company that declined cannot be picked again | Implemented |
| Nobody takes the job | Not applicable | No quote after 5 days gives the office a follow-up task; Admin can take the job back to an AIEC contract with a reason | Implemented |
| Pilot cap | Counts as live from `material_order` to `handover` | Same | Implemented (section 6) |
| Install estimate | `installDays` 14 for standard, `installDaysComplex` 28 for big or complex; shown as an estimate | The LPC quotes its own days (1 to 365) | Implemented (`rebuild.test.js`). 28 days is Proposed, not approved |

## 3. Model change rules

| Rule | Detail | Status |
|---|---|---|
| Who may change | Admin or Owner only (`MODEL_SET`) | Implemented |
| When | Only while the job is at `accepted`, `contacted` or `requirements` | Implemented |
| A to B | Refused if the job already has an AIEC quote or is already Marketplace (`err_mkt_has_quote`) | Implemented |
| B to A | Allowed only if no LPC has accepted the job, and needs a written reason. The companies stop seeing the job; the AIEC steps return. Earlier Marketplace records stay in the log | Implemented (`bp5market.test.js`) |
| After an LPC accepted or money moved | No change in the app | Implemented as a block. A formal approved override process: Not built, Needs approval |
| Customer consent to a model change | Not recorded as a separate consent step | Not built |

## 4. What prevents cross-contamination

| Guard | How it works | Test |
|---|---|---|
| AIEC quote, agreement and payment steps on a Marketplace job | These steps are not offered and are refused on a Marketplace job | `bp5market.test.js` ("AIEC agreement, AIEC payments and AIEC quotes are not offered or accepted on a Marketplace job") |
| Marketplace steps on an AIEC job | `RFQ_SENT`, `PQUOTE_SENT`, `MK_*` gates return `err_access` unless the job is Marketplace (`isMkt(P)`) | `bp5market.test.js` |
| Separate money | AIEC receipts are `P.payments`; partner collections are `P.mkt.pays`; commission is `S.comm`. Three lists, three screens (Pay, Marketplace payment, Commission ledger) | `bp5market.test.js`, `bp4finance.test.js` |
| Commission only on confirmed money | Created when `MK_PAY_VERIFIED` is ok, keyed by the payment so a repeat cannot double it. Rejected or pending payments give none | `bp5market.test.js` ("commission is 2% of what was paid (Rs 2,304)") |
| Corrections | A refund adds a credit note line (`COMM_CREDIT`); history is never overwritten | `bp5market.test.js` |
| Separation of duties | Recorder never confirms own entry on either side | `bp5market.test.js`, `bp1compliance.test.js` |
| Contact and data walls | Customer contact reaches the LPC only through a consent record; partner files have prices, names, phones removed | `bp5market.test.js`, `partner.test.js` |
| Eligibility on RFQ | `rfqWhyNot` checks status, licence, insurance and capacity when asking companies | `bp2partners.test.js`, `bp5market.test.js` |
| Handover gates | All parts paid, one passed AIEC inspection, working licence, then `MK_DONE` | `bp5market.test.js` |
| Replay | Replaying the records gives the same job and ledger | `bp5market.test.js`, `rebuild.test.js` |

Eligibility is checked at asking (RFQ) and at pick (a pick of an ineligible company prompts the office to hold). A single check at every later milestone is **Partially** built: it blocks new jobs and handover paths, but the master prompt's "recheck at project release and every licence-dependent milestone" is **Not built** as a separate automatic hold.

## 5. Open decisions (Head Quarter, lawyer, CA)

1. Exact agreement wording for both models, and which party is the lift licence holder (to be verified by a qualified professional).
2. Whether AIEC may collect commission by invoice to the LPC, GST on that commission, and the signed partner agreement (CA and lawyer).
3. Warranty and AMC responsibility after a Marketplace handover.
4. Any escrow or split-payment arrangement. Not built; needs legal, tax and provider approval.
5. Whether on-hold jobs count against the pilot cap (the app currently counts by stage only).
6. The 2% rate and all other money numbers: **Proposed, not approved** until Head Quarter approves the rule group in Me, Business rules.

## 6. Pilot limits that apply to both models

* **Geography:** `serveAreas` = `Pune`, `cityCode` = `PUN`. PCMC and other cities are out of area until Head Quarter adds them. (`rebuild.test.js`)
* **Cap:** `pilotCap` = 5 live jobs. Live stages: `material_order`, `dispatched`, `arrived`, `installing`, `qc_final`, `install_fix`, `final_pay`, `handover`. A 6th release is refused unless a documented capacity exception exists. An Admin's `CAPACITY_CHECKED` becomes an approval request; only the Owner can approve it, and the Admin who asked cannot. The note must be at least 10 characters. `0` means no limit. Old records already released are never refused by the rule. (`bp3kpi.test.js`)
* **Install target:** 14 days only for standard site-ready jobs; 28 days default for big jobs (`jobSize` = big: hospital or commercial use, 10 or more stops, or capacity 13 or more persons). Always an estimate, not a guarantee; hold days are excluded. (`rebuild.test.js`, `statutory.test.js`)
* **Finance:** referral only. AIEC is not a lender. Interest is recorded with consent text version; withdrawal removes name and phone; lenders show "Not connected". (`bp4finance.test.js`, `rebuild.test.js`)
