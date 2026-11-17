# Pricing, Payment and Commission Rules

Product: AIEC Elevator OS, ALL INDIA ELEVATORS COMPANY (AIEC), Pune pilot.
Every number here is a default in `DEFAULT_CONFIG`. In the app each rule group shows **Proposed — not approved** until Head Quarter approves it in Me, Business rules; changing a number needs approval again. Treat **all** values below as "Proposed — not approved". Prices per component are sample numbers: enter real costs before use.
Status key: **Implemented** / **Partially** / **Not built** / **Needs approval**.

Note on a stale row: the README table "Business rules that need Head Quarter approval" still says Sales discount limit 30%. The code (`DEFAULT_CONFIG`) and `discount.test.js` use **8%** for Sales and **18%** for Admin. This document follows the code. Update the README row.

## 1. Pricing

| Rule | Config key(s) | Default | Group | Approval | Status |
|---|---|---|---|---|---|
| Component costs: auto lift base, manual base, per extra stop, stainless finish, dismantle, special, ARD, curtain, premium | `costAuto` 300000, `costManual` 220000, `costPerStop` 40000, `costSS` 50000, `costDismantle` 30000, `costSpecial` 0, `costArd` 35000, `costCurtain` 12000, `costPremium` 150000 | sample figures | pricing | Proposed — not approved | Implemented |
| Capacity add-on by persons (4, 6, 8, 10, 13) | `cap4` 0, `cap6` 20000, `cap8` 40000, `cap10` 60000, `cap13` 90000 | | pricing | Proposed — not approved | Implemented |
| Installation and transport | `install` 60000, `transport` 15000 | | pricing | Proposed — not approved | Implemented |
| GST | `gst` | 18 (%) | pricing | Proposed — not approved; rate and treatment need CA review | Implemented |
| Start margin | `targetMargin` | 60 (%) | margins | Proposed — not approved | Implemented |
| Rate card version | "New rates start from" date | quotes keep the version in force on their day | pricing, margins | Proposed — not approved | Implemented |
| Quote validity | `validityDays` | 30 | service | Proposed — not approved | Implemented |
| 10-year cost of ownership line | `amcYearly`, `powerYearly` | 0 (owner sets) | service | Proposed — not approved | Implemented (`money.test.js`) |

### Margin formula (from `calcQuote`)

1. `cost` = sum of the component costs the quote needs.
2. Each line is shown at `cost line / (1 - targetMargin/100)`, rounded to the nearest 100 rupees. With 60% that is cost divided by 0.4.
3. `list` = sum of the lines. `discount` = list x discount% (rounded to 100). `price` = list - discount (price before tax).
4. `gst` = round(price x `gst` / 100). `total` = price + gst.
5. **Margin % = (price before tax - cost) / price before tax**, one decimal. This is a gross margin on the quote, not profit; the cost sheet says "gross contribution, not profit" (`money.test.js`).

## 2. Discounts and approval

| Level | Limit | Config key | Behaviour | Test |
|---|---|---|---|---|
| Sales alone | up to 8% | `salesDiscountLimit` | A discount must record what the customer gives in return | `discount.test.js` |
| Admin approves | above 8% up to 18% | `adminDiscountLimit` | 12% needs approval; Admin cannot approve above 18% | `discount.test.js` |
| Head Quarter | above 18% | | 22% goes to Head Quarter only | `discount.test.js` |
| Minimum margin without approval | below 20% | `minMargin` | Only Head Quarter may approve; a second Head Quarter or Admin must agree even when `dualControl` is 0 | `discount.test.js`, README |
| Negotiation step | 5% | `negStep` | Discount steps offered up to the Sales limit | README |

Older quotes without a trade-off stay valid. All Proposed — not approved. Status: Implemented.

## 3. Token, plans and milestones

| Rule | Keys and default | Behaviour | Status |
|---|---|---|---|
| Token | `token` 10000, `tokenMode` 0 | 0 = part of the price, 1 = paid on top. Token larger than total is capped | Implemented. Token treatment: Needs approval (owner and CA) |
| Plan 2 (original) | `payPlan` 2, `arrivalPct` 90, optional `cabinPct` 0, `retentionPct` 0, `retentionDays` 90 | Token, then material by arrival, cabin if set, retention if set, rest at handover | Implemented |
| Plan 1 (by lots) | `payPlan` as default; `p1RailsPct` 30, `p1DoorsPct` 40, `p1DrivePct` 20, final 10% = remainder | Material sent in 3 lots, each only after its part is confirmed; later part cannot come before earlier | Implemented (`payplans.test.js`) |
| Plan choice | Admin sets default; Sales can pick the other plan when the deal is won; a job keeps its plan, also after a rebuild | | Implemented. Default plan: Needs approval |
| Payment gates | An installation stage cannot advance beyond its configured payment gate (token before drawings to customer, lot before dispatch, etc.) | | Implemented (`payplans.test.js`) |
| Field pay | `payLeadValid`, `leadWonPct`, `salesWonPct`, `dupCommission` 10, `refReward` | Off (0) until set; duplicate-lead share 10% | Implemented. Tax and labour treatment: Needs approval |
| Reserve | `reservePct` 0, `reserveRelease` 10 | Off | Partially. Legal basis: Needs approval |

## 4. Payment verification and separation of duties

* Recording is separate from confirming. A payment starts **pending**; it is **confirmed** with a bank reference by Finance. A person who recorded a payment cannot confirm it (`err_same_person`). Failed or reversed needs a reason. A confirmed payment can only be reversed, never edited. (`PAYMENT_STATUS`, `bp4finance.test.js`)
* Verified in `needsSecond()`: with `dualControl` = 1 (default 0), **reversing** a confirmed payment (`PAYMENT_STATUS` → `reversed`) needs a second Head Quarter/Admin who did not ask; confirming a payment never needs a second approver, but the confirmer must not be the person who recorded it. High-risk list: `QUOTE_DECISION`, `PAYMENT_STATUS`, `INCIDENT_RESOLVED`, `DEAL_REOPENED`, `USER_UPDATED`, `PAY_APPROVED`, `CAPACITY_CHECKED`.
* Bank statement match: Finance loads a CSV; lines are matched by UPI reference, else same amount within 3 days. Nothing is confirmed until a person presses Confirm. Unmatched lines are listed. (`recon.test.js`)
* A screenshot alone never confirms a payment. No payment gateway is connected (shown "Not connected", `rebuild.test.js`).
* Receipt per confirmed payment (number, date, customer, purpose, amount, method, bank reference, checker). **A receipt is not a GST tax invoice.**
* Marketplace payments: recorder never confirms their own entry (company vs customer; Finance, Admin or Owner may confirm); amount cannot exceed what is left for the part; one pending payment per part; a Rs 1 payment does not finish a 10% part. (`bp5market.test.js`)

## 5. Refunds and reversals

* After cancellation Finance computes the refund by stage: before order, everything paid less costs (all if the site was rejected); after order, less token and supplier charge; after dispatch, less freight; after cabin payment, less cabin payment and material; after installation starts, nothing by default. A different amount needs a reason. Head Quarter approves or refuses; Finance pays with bank reference; a second Finance person pays where available. Status: Implemented. These deductions are Proposed — not approved and need lawyer review for consumer-law fairness.
* A refund of a Marketplace payment gives a commission **credit note** (`COMM_CREDIT`), negative amount at the same rate; history stays. (`bp5market.test.js`)
* Posted records are never edited; the app uses reversal and correction records.

## 6. Marketplace commission (Model B)

| Item | Rule | Status |
|---|---|---|
| Rate | `commRate` = 2 (%), allowed range 0 to 10. Working assumption, **subject to a signed partner agreement and legal and tax review** | Implemented; Needs approval |
| Base | Each **confirmed** partner collection. Not on quotes, pending, rejected, unverified or unpaid amounts | Implemented |
| Frequency | Once per confirmed payment, keyed by the payment id; a repeat does not double it | Implemented |
| Amount | `round(payment x commRate / 100)`. Example in the test: confirmed payment gives Rs 2,304 commission at 2% | Implemented |
| Ledger states | Verified, Bill sent (Invoiced), Due, Paid, Disputed, Adjusted. Cannot jump to Paid. Finance, Admin or Owner move it | Implemented |
| Rate version | The rate used is stored on each commission line; later changes of `commRate` do not change old lines | Implemented |
| Invoice to partner, due date, reconciliation, GST on commission, partner payout evidence | Ledger has states; real invoicing and tax invoice are Not built | Partially; Needs approval (CA) |
| Pending view | Finance sees expected commission on pending payments, separate from earned | Implemented |
| AIEC revenue vs partner GMV | Separate lists; KPI board shows Marketplace numbers apart | Implemented (`bp3kpi.test.js`) |

## 7. Rounding and display

* `money(n)` shows rupees rounded to the whole rupee with Indian digit grouping, for example Rs 1,15,199. It rounds only for display and quotes round at the stated points above; paise are not tracked.
* Percent splits are rounded individually; the final part is the remainder so a plan always sums to the total exactly (`payplans.test.js`).

## 8. What needs CA and legal review before real use

1. GST rate, place of supply, whether supply and installation is a composite or separate supply, and the tax invoice format.
2. GST and invoicing on AIEC's commission; TDS on partner and contractor payments.
3. Token treatment, retention and reserve, refund deductions, cancellation charges, cabin payment as a milestone.
4. Contractor classification and labour law for LPC technicians and for field-worker pay.
5. Revenue recognition for Model A versus agent commission for Model B.
6. Any escrow, split payment or aggregator use (Not built).
7. Statutory level of the 2% commission and a signed partner agreement.

The app does not file taxes and does not issue tax invoices. Unless Head Quarter approves each rule group, all money numbers remain **Proposed — not approved**.
