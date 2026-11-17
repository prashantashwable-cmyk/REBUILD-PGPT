# Licensed Partner Company (LPC) and Technician Operating Model

Product: AIEC Elevator OS, ALL INDIA ELEVATORS COMPANY (AIEC), Pune pilot.
Status key: **Implemented** / **Partially** / **Not built** / **Needs approval**. All thresholds below are defaults in `DEFAULT_CONFIG` and are **Proposed, not approved** until Head Quarter approves the rule group in Me, Business rules. Legal and labour points are "to be verified by a qualified professional".

## 1. Core idea

* The **LPC is the company-level execution role** (role `partner`). It holds the lift licence, takes jobs, brings its own crew, and is paid by AIEC (Model A) or by the customer (Model B).
* **Technicians are members under an LPC** (role `tech`). They do not apply for jobs alone, they are not paid directly by AIEC, and their work is shown as "paid to my company".
* AIEC approves each technician and checks company documents. AIEC does not employ the technicians. Whether the arrangement is contractor, employment or something else for labour and tax law is to be verified by a qualified professional. (Needs approval)

Proof: `partner.test.js`, `market.test.js`, `bp2partners.test.js`.

## 2. Partner states

Implemented states (`P_STATUS`): Applied, Under review, Verified, Active, Conditional, Suspended, Terminated.

| State | Can take new jobs? | Notes |
|---|---|---|
| Applied, Under review, Verified | No | A company set up before the status rule counts as Active when its licence is valid, else Under review |
| Active | Yes | Refused without a valid lift licence |
| Conditional | Yes | Marked as a warning on the company page |
| Suspended, Terminated | No | A suspended company is not offered new jobs; handover tasks go |

* Every change needs a reason, is allowed only for Admin or Owner (Sales cannot), only applies to partner companies, and is kept in a company history. (`bp2partners.test.js`)
* The master prompt also lists Paused, Rejected, Expired and Offboarded as states: **Not built** (Terminated and Suspended cover them for now). Needs approval before adding.

## 3. Documents and due-diligence checks

The office ticks 11 checks per company (`DD_ITEMS`). Each tick needs a note of what was seen.

| Check | Auto from records? | Status |
|---|---|---|
| Identity (KYC) | Yes, when the ID document is marked verified | Implemented |
| Authorised signatory | No, ticked by office | Implemented |
| Lift licence | Yes, from the licence record | Implemented |
| Electrical licence | No | Implemented |
| Third-party insurance (with end date) | No, ticked with an end date | Implemented |
| Team | Yes, when it has members | Implemented |
| References, safety record, service capability, bank details | No | Implemented as ticks |
| Agreement | Yes, from the signed company contract | Implemented |
| File hash, issuing body and OCR validation, registry lookup | No | Not built; documents are checked by a person |

## 4. Licence and insurance gates

| Gate | Config key | Behaviour | Test |
|---|---|---|---|
| Company lift licence (number, holder, issuing office, valid-until, copy checked by office) | `licWarnDays` 60 | A company gets jobs only while the licence is saved, checked and not expired. Reminders 60 days before expiry. A changed number or date needs the office to check the copy again before new jobs | `partner.test.js` |
| Insurance | (status check) | An ended insurance blocks new jobs; renewal opens them again. Insurance ending within the warning days gives a renewal task | `bp2partners.test.js`, `bp1compliance.test.js` |
| Lift licence at handover | `licenceGate` 1 | Handover refused without a valid lift licence for the lift; recorded only after a passed Lift Inspector visit | `statutory.test.js` |
| Erection permit | `permitGate` 1 | Permit record required before the gated stages | `statutory.test.js` |
| Big-job record | `partnerBigJobs` 2, `partnerBigStars` 3.8 | A company with no finished jobs cannot take a big job | `partner.test.js` |
| Strikes | `partnerMaxStrikes` 5 | A company with too many strikes cannot apply | `market.test.js` |

The app keeps records. It does not issue or validate licences with a government registry (Not built). Which entity must hold the lift licence under Maharashtra law: to be verified by a qualified professional.

## 5. Tiers (not a licence)

Tier is computed from the record, never from payment, and is shown with its reason (`partnerTier`, `tierOf`).

| Tier | Rule in the app |
|---|---|
| Silver | Default for a new company; also if the others are not met |
| Gold | 3 or more finished jobs, first-time QC pass 75% or more, at most 1 strike |
| Platinum | 10 or more jobs, first-time pass 90% or more, 0 strikes, company trust 80 or more |

* The page says the tier is never paid for. A tier never replaces a licence or insurance check. (`bp2partners.test.js`)
* The spec's Bronze tier and a versioned tier policy are Not built. These cut-offs are code values, not config keys. Needs approval.

## 6. Technician membership

| Rule | Status | Test |
|---|---|---|
| The company adds its own technicians, starting only as Trainee or Helper | Implemented | `partner.test.js` |
| An AIEC Admin approves each one; the company cannot approve its own technician | Implemented | `partner.test.js` |
| Unapproved technician cannot be placed on a site | Implemented | `partner.test.js` |
| Owner or Admin can add a technician directly into a company, or move one | Implemented | `partner.test.js` |
| Only members of the company holding a job can be its lead or crew; company changes its own team | Implemented | `partner.test.js`, `market.test.js` |
| A technician without a company gets a "Link technician to a company" task for the office | Implemented | `partner.test.js` |
| When a technician leaves, future jobs ask the company for a replacement; past work stays on the old company's bill; history is not deleted | Implemented | `partner.test.js` |
| Membership start and end dates, allowed job types, safety authorisations, supervisor per member | Partially (company and approval only) | |
| Block a technician from belonging to two companies | Implemented by single `company` field. A multi-company exception rule: Not built | |
| Training and onboarding documents before first job | Partially (`requireTraining` 0 is off by default) | |

## 7. Career ladder

Trainee, Helper, Technician, Senior Technician, QC Inspector. Applicant stage before Trainee is the join request, not a ladder level.

| Level | Targets to reach (config keys) | Pay rate | Spot-check share | May do |
|---|---|---|---|---|
| Trainee | start level | `rateTrainee` 60% | `spotTrainee` 50% | Crew only |
| Helper | `lvHelperJobs` 3, `lvHelperStars` 3.5, `lvHelperReviews` 3, `lvHelperDays` 30 | `rateHelper` 80% | 50% | Crew only |
| Technician | `lvTechJobs` 8, `lvTechStars` 4, `lvTechReviews` 8, `lvTechTrust` 60, `lvTechDays` 90 | `rateTech` 100% | `spotTech` 20% | Lead small and normal jobs |
| Senior | `lvSeniorJobs` 10, `lvSeniorPass` 80, `lvSeniorStars` 4.2, `lvSeniorReviews` 15, `lvSeniorTrust` 75, `lvSeniorDays` 180 | `rateSenior` 120% | `spotSenior` 5% | Lead big jobs, add and rate crew |
| QC Inspector | `lvQcJobs` 20, `lvQcPass` 90, `lvQcStars` 4.5, `lvQcReviews` 30, `lvQcTrust` 85 | Per inspection `payQcInspection` 1500 | Not applicable | Inspect jobs they did not work on |

Rules proved by `ladder.test.js`:

* Stars with fewer than 3 reviews show "New"; the average is pulled toward 3.5 so one review cannot give a perfect score; one review per job per reviewer; no self-review.
* A QC fail caused by site or material never counts against the installer.
* Promotion is refused until every target is met. The Admin gets "Promotion ready". Nobody promotes or tests themself. QC records the practical test.
* Admin approves promotions up to Senior. **Only the Owner can make a QC Inspector**, and the role cannot be changed by a simple role edit.
* Work keeps the pay rate of the day it was done.
* Big job = `jobSize` big (hospital or commercial use, 10 or more stops, or 13 or more persons); a Technician cannot lead it.
* Pay rates, spot rates and thresholds are Proposed, not approved. They are starting templates and need labour and accounting review.

## 8. Strikes and appeals

* Strikes come only from facts: QC fail caused by workmanship, a 1 to 2 star rating, a confirmed complaint, work that sat until Head Quarter had to act, a failed spot check (counts 2).
* A strike expires after `strikeDays` 90.
* Effects: 2 strikes pause promotion; 3 mean crew-only work and a meeting with the Admin; 4 go to Head Quarter for a suspension decision. Nothing happens to a person without a human decision.
* Appeal: someone who did not give the strike decides; the person who reported it cannot decide the appeal; the Owner can remove a strike after appeal. (`ladder.test.js`)
* No cash fines. Bonus points are separate from pay. Any deduction or retention needs a signed agreement and review by a qualified professional (Not built; `retentionPct` is 0).

## 9. Pay goes to the company

* The company is paid weekly for its technicians' verified work, at each person's level rate. Admin or Owner approves the company bill, Finance pays it, and the company can question it. A technician sees the value of their work marked "paid to my company". Approval is for the company, not the technician. (`partner.test.js`)
* Marketplace Model B: the LPC is paid by the customer directly; this weekly bill applies to AIEC-paid work only.
* Payout model, any retention, TDS and contractor classification: Not decided, to be verified by a qualified professional (CA and labour counsel). Do not treat 10% weekly payout or 90 day hold as a rule.

## 10. Data protection

* A partner or technician phone receives only its own jobs. Customer phone, name, notes, prices, margins, payment amounts, other companies' details and WhatsApp messages are removed before the file is made. Contact goes through project chat or the AIEC office number (`officeNumber`). (`partner.test.js`, `bp5market.test.js`)
* The job card on the board shows area only; building name, exact address and phone only after the company holds the job. (`market.test.js`)
* Watermark with viewer name, access log and "Unusual looking at data" task for the office.
* Personal data of technicians (identity, phone) stays on phones until deleted. A retention and deletion policy under the Digital Personal Data Protection Act, 2023 is **Not built**; Head Quarter must set it with a qualified professional.
* Limits: a web app cannot block screenshots; there is no company server.
