# Workflow state machines

All lifecycle changes happen through events validated by `RULES` (`stages`, `roles`, `gate`, `check`). There is no direct "set stage" action. Stage ids, their phase and icon come from `STAGES`; phases from `PHASES` (lead, sales, agree, site, material, install, handover).

## 1. AIEC Contract project (Model A)

```
new ─LEAD_ACCEPTED→ accepted ─CONTACT_LOGGED→ contacted ─REQ_SAVED→ requirements ─QUOTE_CREATED→ quote_ready
 └─LEAD_RETURNED→ returned (fix → new)                          (margin < floor or discount > limit → quote_approval ─QUOTE_DECISION(2P)→ quote_ready)
quote_ready ─QUOTE_SENT→ quoted ─DEAL_WON→ won ─AGREEMENT_PREPARED→ agreement ─AGREEMENT_SIGNED→ signed
signed ─(token PAYMENT_RECORDED → PAYMENT_STATUS confirmed by Finance)→ site_prep ─QC requested→ qc_site
qc_site ─QC_SITE_RESULT ok→ site_ok | corrections→ site_fix → qc_site | infeasible → decision
site_ok ─(GAD signed, permit gate, capacity gate*)─RELEASED→ material_order ─dispatch→ dispatched ─arrival→ arrived
arrived ─(arrival payment confirmed, incidents closed, serials match)─MATERIAL_HANDED→ installing
installing ─(daily check-in + safety, 12 SOP steps with evidence, peer checks)→ qc_final ─pass→ final_pay | fail→ install_fix → qc_final
final_pay ─(final payment confirmed, inspection + licence records)→ handover ─(signatures customer/tech/QC)─HANDOVER_SIGNED → HANDOVER_COMPLETED→ amc
any open stage ─DEAL_LOST→ lost (DEAL_REOPENED is high-risk)
```
\* Capacity gate: `capFull()` — live jobs (`LIVE_STAGES`: material_order … handover) ≥ `pilotCap` (5). Release waits for a `CAPACITY_CHECKED` record; **from 17 Nov 2026 only the Head Quarter can approve it** (an Admin's check becomes an approval request).

### Gates (cannot be bypassed by UI, direct call or imported file)
| Gate | Where | Rule |
|---|---|---|
| Margin floor / discount limit | `QUOTE_DECISION` | below `minMargin` always needs a second Owner/Admin |
| Payment | stage moves after token / arrival / final | only Finance `confirmed` with reference; recorder ≠ confirmer |
| Site QC | `RELEASED` | QC approval, measurements within tolerances (`tolWidth` …) |
| Statutory | release / handover | `permitGate`, `licenceGate` (records with who checked) |
| Partner eligibility | assign / post / pick; **re-checked** at material handover, every SOP step, `MK_READY`, `MK_DONE` | licence valid, insurance valid, status Active/Conditional, strikes < max; ended papers mid-job = controlled hold (`papersHold`, `err_partner_papers`) + urgent `partner_papers` task |
| Safety | SOP steps | daily safety check (`dailySafety`), check-in gate (`checkinGate`), hazard/SOS stops work |
| Independent QC | `QC_FINAL_RESULT` | inspector must not have worked on the job |
| Material | `MATERIAL_HANDED` | payment confirmed, incidents closed, serial mismatch blocks |

### Clocks
Every waiting step has a start (`since`), a limit, reminders (level 1 after `remindDays`), Admin escalation (`escalateDays`), Head Quarter (`escOwnerDays`). Recorded blockers/holds pause the clock (shown "Paused", never red). The **installation target** counts from material handover minus held days and is `targetDays(P)`: 14 (standard) or 28 (big/complex, proposed) — shown as an estimate with its start conditions.

## 2. Marketplace project (Model B)

`MODEL_SET market` (Admin/HQ) → `RFQ_SENT` to 2–3 eligible companies → customer compares the companies (record, not only price) → `MK_PICKED` (customer/Sales) → optional `MK_PICK_HELD` by AIEC → `MK_ANSWER` (the company accepts or declines; a declined company cannot be picked) → `MK_INTRODUCED` (customer's contact shared only with consent) → milestone payments `MK_PAY_RECORDED` by either side and `MK_PAY_VERIFIED` by the other side or Finance → commission line once per confirmed payment (`commRate` 2 %) → `MK_READY` → one AIEC inspection `MK_INSPECTED` (QC) + working licence → `MK_DONE`. AIEC-contract events are blocked on Marketplace jobs (`mktBlocked`). A job nobody takes returns to an AIEC contract. Tests: `bp5market`, `market`, `bars`.

## 3. Partner company

`Applied → Under review → Verified → Active ⇄ Conditional → Suspended → Terminated` (`PARTNER_STATUS_SET`, reason required). Licence/insurance expiry blocks new jobs automatically. Tests: `bp2partners`, `partner`.

## 4. Technician ladder

`trainee → helper → technician → senior → (QC competence separately)`; promotion suggested by thresholds (`lvHelperJobs` …), confirmed by Admin/Head Quarter; strikes expire (`strikeDays`) and can be appealed. Tests: `ladder`, `fairness`.

## 5. Ticket / AMC

`TICKET_OPENED (severity: trapped / unsafe / breakdown / repeat / routine / billing)` → accepted (`acceptMins`) → assigned → fixed with evidence → customer/office confirms or reopens; SLA hours per severity (`slaUnsafe` 4, `slaBreakdown` 24 …). Trapped-person reports go to people by phone/WhatsApp, never only to a bot. Tests: `tickets`, `service`, `escalation`.
