# Production Readiness Checklist

Purpose: the gates that must be closed before AIEC Elevator OS is used with real customers, money and technicians, and before the rebuild replaces the current production site.
Rule: the **owner of each item signs it off**. An item with no sign-off is open. Items marked REVIEW REQUIRED need a qualified professional; the app, its templates and this document are not legal, safety, engineering or tax advice.

Release status: the rebuild is on branch `ccr-97b11475-gt4r3h`. Production (UNLIT-GPT-HTML GitHub Pages) is not overwritten until every gate below is closed and the Head Quarter approves.

How to use: copy this file when starting the pilot, fill in name and date beside each item.

## A. Legal and regulatory (REVIEW REQUIRED)

- [ ] **A1. Contractor agreement, partner agreement and NOC / handover text reviewed by a lawyer.** Owner: Head Quarter, with a qualified lawyer. The app marks these templates "template, lawyer to review". Evidence: written sign-off and the final text loaded; agreement version number set.
- [ ] **A2. Privacy notice and data keep-and-delete policy checked against the Digital Personal Data Protection Act, 2023.** Owner: Head Quarter, with a lawyer. Evidence: notice text approved, retention periods set.
- [ ] **A3. Maharashtra lift law verified** (Maharashtra Lifts Act and rules: erection permit, Lift Inspector, licence, periodic inspection, who may erect or maintain). Owner: Head Quarter, with a qualified lift engineer or the Lift Inspector's office. Evidence: written list of requirements matched to the app's statutory records.
- [ ] **A4. Insurance, BOCW, ESIC and labour-law position of partner companies and technicians confirmed** (independent contractor status, accident insurance, pay rules). Owner: Head Quarter, lawyer, labour-law adviser.
- [ ] **A5. Consumer-facing wording** (warranty, refund, cancellation, estimate of installation time) reviewed. Owner: Head Quarter, lawyer.

## B. Engineering and safety (REVIEW REQUIRED)

- [ ] **B1. QC checklists and the installation SOP steps (12 steps, inspector points) reviewed and approved by a qualified lift engineer.** Owner: QC lead with the engineer. The nine safety tests that can never be "Not here" are confirmed. Evidence: signed review, changes made in the app templates.
- [ ] **B2. Site safety rules, daily safety check, SOS and incident procedure approved.** Owner: Head Quarter with a safety adviser. The app does not replace statutory inspection.
- [ ] **B3. Training lessons, quiz answers and pay amounts checked** with a lift engineer and labour and accounting rules. Owner: Head Quarter.

## C. Finance and tax (REVIEW REQUIRED)

- [ ] **C1. GST, TDS and commission invoicing reviewed by a Chartered Accountant.** The app's receipts are records, not GST tax invoices. Owner: Finance, with the CA. Evidence: written treatment for customer invoices, partner bills, commission and refunds.
- [ ] **C2. Real rate card entered and approved.** Replace the sample prices in Me, Business rules; the Head Quarter approves each group. No number may stay "Proposed, not approved" if it is used for a real quote. Owner: Head Quarter and Finance.
- [ ] **C3. Pilot numbers decided:** live-job limit 5, installation 14 days and 28 days complex (estimate with start conditions), token amount, payment milestones, margins and discount limits, serve area Pune. Owner: Head Quarter.
- [ ] **C4. Payment details** (UPI, bank) entered by Finance and checked by a second person. There is no payment gateway; the process for confirming money from the bank is written down. Owner: Finance.

## D. Language

- [ ] **D1. Marathi text reviewed by a fluent human** (all screens, safety text, messages, agreement). Owner: Admin, with a fluent reviewer.
- [ ] **D2. Hindi text reviewed by a fluent human.** Same owner. Machine or draft wording is not accepted as final.
- [ ] **D3. WhatsApp message templates** read aloud by a native speaker. Owner: Admin.

## E. People and operations

- [ ] **E1. Emergency contact register filled and tested** (office number, SOS number, rescue line, police, fire, ambulance, lift engineer on call). A test call to every number. The app has no 24x7 rescue staffing; the company must run the rescue line before printing lift QR stickers. Owner: Head Quarter.
- [ ] **E2. Roles assigned:** Head Quarter, at least one Admin and a backup approver. Owner: Head Quarter.
- [ ] **E3. Admin trained** using `ADMIN_DAILY_SOP.md`; Owner trained with `OWNER_WEEKLY_REVIEW.md`. Owner: Head Quarter.
- [ ] **E4. Practice mode walk-through by every role**, then real data begins. Owner: Admin.
- [ ] **E5. Integrations decision:** everyone understands Me, Connections: payment gateway, WhatsApp Business API, SMS, NBFC and banks, e-sign, masked calling, government registries and AI are **not** connected; people do these by hand and record them. Owner: Head Quarter.

## F. Real device tests

- [ ] **F1. Real Android phones (at least two models, one low-end):** camera and photo stamp, GPS and check-in, microphone/voice notes, notifications, PIN sign-in, install to home screen, screen-on while working. Owner: Admin with a field worker.
- [ ] **F2. Offline test:** airplane mode for a working day; create records; reconnect; sync status moves from waiting to received. Owner: Admin.
- [ ] **F3. Poor network and low storage** (under 100 MB free): the app warns and does not lose records. Owner: Admin.
- [ ] **F4. Marathi and Hindi at largest text size** on a real phone. Owner: Admin.
- [ ] **F5. Map** works online (OpenStreetMap); typed landmark works offline. Owner: Admin.
- [ ] **F6. Android APK (if used):** installed from the workflow artifact, signing key stored safely offline, update installed over the previous build. Owner: developer.

## G. Server (only if a company server is used)

- [ ] **G1. Security review of the server** (Supabase Edge Function or Cloudflare Worker or local Node): who can claim it, secret handling, rate limits on join requests, access to the database and storage, logs, region and data residency, pause and limit behaviour of the free plan. Owner: developer with an independent security reviewer. REVIEW REQUIRED.
- [ ] **G2. Server address uses https**; setup secret and recovery code stored on paper, separately from phones. Owner: Head Quarter.
- [ ] **G3. Each person can sync, and a removed person's phone stops.** Owner: Admin.
- [ ] **G4. Alerts (push) tested** on real phones, SOS wakes office phones at once. Owner: Admin.

## H. Backups and rollback

- [ ] **H1. Backup drill completed** as in `BACKUP_AND_RESTORE.md` section 9, including the verification list (record counts, ledger totals, media references). Owner: Admin and Finance.
- [ ] **H2. Server restore drill** (only if a server is used). Owner: Head Quarter.
- [ ] **H3. Device-loss drill:** a phone is "lost", removed, replaced; records checked. Owner: Admin.
- [ ] **H4. Rollback drill completed** as in `DEPLOYMENT_AND_ROLLBACK.md` section 6, under 30 minutes. Owner: developer.
- [ ] **H5. Tag `baseline-605575a` exists** and the previous production files are saved. Owner: developer.

## I. Software release

- [ ] **I1. `npm test` passes** (static check plus all browser tests). Owner: developer.
- [ ] **I2. `node tests/rebuild.test.js` passes.** Owner: developer.
- [ ] **I3. `node tests/shots-roles.js` run, role screenshots reviewed** for all roles. Owner: developer and Admin.
- [ ] **I4. `APP_BUILD` equals the `aiec-os-vNNN` cache name in `sw.js`**, and the live `sw.js` shows that version. Owner: developer.
- [ ] **I5. CI green** on the release commit. Owner: developer.

## J. Final approval

- [ ] **J1. All items above signed or formally waived** with a written reason and an end date for each waiver. Waiving a REVIEW REQUIRED item is a Head Quarter decision and is recorded in the decisions log.
- [ ] **J2. Head Quarter approves go-live** for the pilot in Pune, and records date and version.
- [ ] **J3. Production overwrite** (if wanted) is a separate decision after the pilot, using the rollback plan.

| Gate group | Signed by | Date |
|---|---|---|
| A Legal | | |
| B Engineering and safety | | |
| C Finance and tax | | |
| D Language | | |
| E People and operations | | |
| F Devices | | |
| G Server | | |
| H Backups and rollback | | |
| I Software | | |
| J Final approval | | |
