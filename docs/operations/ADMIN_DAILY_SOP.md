# Admin Daily SOP

Role: Admin runs the day. The Head Quarter (Owner) stays out of day-to-day work while an Admin exists and receives only what is still stuck after the last reminder, SOS and injury alarms, business rules and two-person approvals.
Business numbers marked "Proposed, not approved" stay marked until the Head Quarter approves them in Me, Business rules. Do not treat them as final.

## 1. Before you start (2 minutes)

1. [ ] Open the app with your PIN on your own phone only.
2. [ ] Look at the **sync status strip** on your home: Saved on this phone, waiting to sync, received by server, failed, refused, stale. Rejected entries are listed there.
   * Waiting or failed: check internet, wait a minute, then Me, Company server (if used).
   * Refused or rejected entries: open each, read the reason, and decide with the sender. Do not accept a record that fails a signature or permission check.
3. [ ] Me, Connections: remember what is **not** connected (payment gateway, WhatsApp Business API, SMS, NBFC and banks, e-sign, masked calling, government registries, AI). Anything that needs one of these is done by a person by hand and then recorded in the app.
4. [ ] Confirm you are in real mode, not Practice (Practice never sends messages or payments).

## 2. Morning queue

1. [ ] Open the **office queue** (everything waiting for the office). Work in this order: critical, high, medium, low; within a level, oldest first.
   * Critical: SOS, person trapped, unsafe lift, emergency part claims. Phone the person first, then record.
   * High: tickets past their time limit, licences and permits, declined orders, payment disputes, unusual data access, work stuck at Head Quarter level.
   * Medium: approvals, late suppliers, part claims, appeals, holds, disputes, problems.
   * Low: onboarding papers, phone clock checks, unassigned leads.
2. [ ] Items close only when the work behind them is done. Do not close an item to clear the count.
3. [ ] New join requests and customer enquiries: check the profile and warnings, **call the person**, then approve, ask for more details, or refuse with a reason.
4. [ ] Unassigned leads: give to Sales or a field worker; check duplicate warnings.
5. [ ] New phone approvals ("Approve a new phone") and phone clock checks: accept or mark not trusted with a reason.

## 3. Escalation ladder (Me, Escalations)

Days are business rules and count working days (Monday to Saturday; Sunday off unless changed; Owner's holiday dates excluded).

| Level | After | What happens |
|---|---|---|
| 1 | 1 day | The responsible person sees a Reminder |
| 2 | 3 days | It comes to the Admin as "Work is stuck" |
| 3 | 7 days (or office acted twice and still stuck) | It goes to the Head Quarter |

1. [ ] Open Me, Escalations. Clear every level 2 item today so that nothing reaches level 3 through your delay.
2. [ ] For each item record one of: *I spoke to them*; *New date agreed* (up to 7 days); *Give to another person* (the clock restarts).
3. [ ] Work on hold or waiting for someone else is "Paused" and is not escalated. Do not use hold to hide delay: a hold needs a reason and a decision.
4. [ ] Anything you cannot clear: write a note and tell the Head Quarter by phone.

## 4. Payments to reconcile with Finance

1. [ ] Payments to verify: Finance confirms money from the bank, not from a screenshot. The app does not connect to a payment gateway or bank; nothing is confirmed automatically.
2. [ ] Bank statement match: Finance loads the bank CSV; matches are suggestions only. A person confirms each.
3. [ ] Customer says "paid" but not seen in the bank: do not release the next stage; ask Finance to check again the next working day, then record a payment issue.
4. [ ] Payment disputes and refunds: a refund is a record in the app. The money moves through the bank. Approvals follow the two-person rule (no one approves their own request).
5. [ ] Supplier bills and technician weekly pay: check, approve, Finance pays.
6. [ ] Receipts are records, not GST tax invoices. Tax invoices come from the accounting process under CA guidance.
7. [ ] End of day: agree one list with Finance: confirmed today, pending, disputed.

## 5. Capacity check requests

* The pilot limit is **5 live jobs** (live = material order through handover stage).
1. [ ] Before releasing a job to material order, check the live count on the home or KPI screen.
2. [ ] Count 5 or fewer after release: go ahead.
3. [ ] A **6th** release cannot be approved by you. Your capacity check becomes an **approval request** that only the Head Quarter (Owner) can approve as a capacity exception. Send it with the reason, the crew available and the date.
4. [ ] Do not give a start date to the customer before the exception is approved.
5. [ ] Installation time is shown as an **estimate with start conditions** (site ready, payments verified, material arrived): 14 days standard, 28 days for big or complex jobs (proposed numbers until approved). Never promise it as a guarantee.
6. [ ] Default serve area is Pune. A lead in PCMC (Pimpri-Chinchwad) or outside needs Head Quarter approval first.

## 6. Partner licence and legal-paper (insurance) expiry

1. [ ] Open the partner companies list. Check the licence end date and the end dates of the legal papers (BOCW, ESIC, accident insurance, safety training). Reminders come 60 days before a licence ends; marks: 7 days or less, 30 days or less, 60 days.
2. [ ] Jobs are given only while the licence is saved, checked and not expired. An expired licence stops new jobs.
3. [ ] When a company renews, check the copy of the paper and record the new date. Do not extend a date on a verbal promise.
4. [ ] BOCW, ESIC, accident-insurance and safety-training papers: an ended paper stops new installation work and saving steps until renewed.
5. [ ] Approve each technician a company adds ("Approve a company's technician"); ensure documents and training are complete.

## 7. Evidence review

1. [ ] Photos flagged "Same photo used before": review and decide.
2. [ ] Site check-ins far from the site: a flag to look at, not proof of absence. GPS is unreliable indoors and in shafts.
3. [ ] Installation step photos, "No" answers on inspector points, blockers: each open problem must be fixed before inspection is asked.
4. [ ] Delivery: seal number, serial numbers, storage photo, material safe-keeping acceptance. A mismatch is an incident.
5. [ ] Safety: daily safety check, incidents, near misses. SOS reaches the office phone only if the phone is synced; call the person.
6. [ ] The app does not replace the statutory inspection or a qualified lift engineer.

## 8. Close the day (after 6 pm)

1. [ ] Open "Close the day". Each open item rolls to tomorrow with a named person.
2. [ ] Open red items need a note.
3. [ ] One close per day. A named Backup approver may close it when you are away.
4. [ ] Check the backup reminder (7 days or 200 records). Make a full company file if due (see `BACKUP_AND_RESTORE.md`).
5. [ ] Send the weekly summary on the day set (the app prepares the message; a person sends it).

## 9. What needs the Head Quarter

1. Capacity exception (6th live job).
2. Any Business rule number change or approval; serve area additions (for example PCMC).
3. Level 3 escalations and anything stuck after the last reminder.
4. SOS or injury (you handle first, then inform).
5. Two-person approvals where you are the requester.
6. Lost Head Quarter phone, suspected data leak, recovery code questions.
7. Release or rollback of the app (see `DEPLOYMENT_AND_ROLLBACK.md`).
