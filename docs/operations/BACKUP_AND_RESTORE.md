# Backup and Restore

Applies to: AIEC Elevator OS (offline-first). Owners of this procedure: Head Quarter (Owner) and Admin.

## 1. Where data lives

1. **On each phone:** records are saved in the browser's **IndexedDB**. If that is unavailable the app falls back to **localStorage**, then to **memory only**, with a warning. Memory-only data is lost when the app closes. The Me screen footer shows the storage in use and the number of records.
2. Records are signed by the phone that made them and are stored in chunks.
3. Photos are stored on the phone with the records they belong to.
4. **Practice mode** uses a separate namespace. Practice files and real files can never be mixed. Nothing in Practice needs backing up.
5. **Company server (optional):** if Me, Company server is turned on, phones lock (encrypt) every update before sending it. The server holds an inbox for the office and one box per person, and cannot read names, prices or photos.
6. Without a server, the only copies are the phones and any files people have shared. **A phone that has not shared its records recently is the only copy of them.**

## 2. Kinds of file (Me, Share data with other phones)

| File | For | Contains |
|---|---|---|
| Full company file | Head Quarter and Admin phones | Whole company data. Other people's logins only if "include everyone's logins" is chosen. |
| File for one person | That person's phone | Only that person's projects. Other people's PINs removed. |
| Send my updates to office | A person sends work to the office | Only what that person did themselves. The office accepts nothing else. |

Send files by WhatsApp or email, to the person who needs them only. A full company file is sensitive: treat it like a bank statement.

## 3. Backup reminder

* The Head Quarter or Admin is reminded to save a file after **7 days** or **200 records** that exist only on their phone.
* When the reminder appears: make the full company file the same day and keep it in two places (for example company email and a second device or drive owned by the company).
* Name files with the date, for example `aiec-full-YYYY-MM-DD`. Keep the last 4 weekly files and the last 3 monthly files.

## 4. Photo archive

* Head Quarter, Me, Share data, **Archive old photos** saves photos of lifts handed over long ago to a file and removes them from that phone. Loading the file brings them back.
1. [ ] Make a full company file first.
2. [ ] Archive. Keep the archive file with the same care as the full file.
3. [ ] Test once that loading it brings a sample photo back before relying on it.
4. [ ] Never delete an archive file while a warranty, dispute or insurance claim may need the photos.

## 5. Server backups (only if a company server is used)

* Head Quarter: Me, Company server, **Make the recovery code**. It is shown once. Write it on paper and keep it away from office phones, with the setup secret (if one was set). Nobody can open a backup without it, including the server host.
* After that an office phone uploads a locked backup of the whole company (records and photos) once a day. The newest 7 are kept.
* If the recovery code is changed, keep the old code for older backups.
* The Company server screen has a ready check: https address, recovery code, a recent backup, office number. The Head Quarter reviews it weekly.
* Supabase free plan pauses an idle project after about a week; Restore it in the Supabase dashboard (nothing is lost). Cloudflare free plan stops requests for the rest of the day if limits are exceeded.
* Server security review is required before real use. See `PRODUCTION_READINESS_CHECKLIST.md`.

## 6. Restore procedures

### A. One person's phone (lost app data, new phone)
1. [ ] Admin makes **File for one person**, or a **login code for a new phone** if a server is used (give the 6-digit code over a phone call; it works once, for 2 days, deleted after 5 wrong tries).
2. [ ] Person loads the file or enters the code on the new phone.
3. [ ] A person's second phone must be approved by the Head Quarter or Admin (task "Approve a new phone"). Records from that phone are held back until then.
4. [ ] Person sends "my updates" again.

### B. Office phone from a file
1. [ ] On the new phone choose the way in for a company (not Practice) and load the **Full company file**.
2. [ ] Note that a brand-new phone trusts the first file it loads. Only load a file you received from a known person on a known channel.
3. [ ] Admin approves the new phone if it is a second phone for that person.

### C. Whole company from the server backup
1. [ ] Needed: server address, setup secret (if set), recovery code.
2. [ ] New phone, first screen: **Restore the company from backup**. Enter the three items.
3. [ ] The company returns and the phone becomes an office phone on the server again.
4. [ ] Make a new full company file straight away.

## 7. Verify after any restore

1. [ ] **Record count:** The Me screen footer shows the storage in use, the number of records and the version. Compare with the number noted before the loss or on the last full file (note the count whenever a file is made).
2. [ ] **Projects:** the list of live jobs and the count by stage match the notes from the last weekly review.
3. [ ] **Ledger totals:** in Finance, compare payments confirmed, payments pending, refunds, commission due and commission received against the last saved report or spreadsheet export. Any difference is investigated before payments continue.
4. [ ] **Media references:** open 5 projects from different stages and 3 old handed-over lifts: photos, signatures and the drawing pages open. Missing photos from archived lifts need the archive file.
5. [ ] **People:** each role can sign in (Head Quarter, Admin, one of each other role). Removed people stay removed.
6. [ ] **Sync status:** the strip on a staff home shows no stale or refused entries after the first sync; rejected entries are listed and read by the Admin.
7. [ ] **Business rules:** Me, Business rules shows the approved numbers; "Proposed, not approved" labels are as before.
8. [ ] Record in the decisions log: date, cause, source of restore, who verified.

## 8. Device-loss procedure

1. [ ] Person reports the loss to the Admin at once (phone call).
2. [ ] Admin removes the person in the app (or blocks the phone). With a server, removal deletes their box and the phone stops at once. Without a server, the phone's data stays on the phone; the PIN (slow-hashed; wrong tries are reported to the office) is the only barrier. Treat the data as exposed if the phone was unlocked.
3. [ ] If it is an office phone: the Head Quarter changes the recovery code if the paper may have been with the phone, and checks that another office phone holds a recent full file.
4. [ ] If it was the **only** Head Quarter phone: an Admin must approve the Head Quarter's new phone.
5. [ ] Work done since the person's last "send my updates" is lost unless the phone returns. Ask the person and their lead to re-enter from photos and messages, and mark it in the notes.
6. [ ] Set up the replacement under section 6A or 6B.
7. [ ] Customer or personal data exposure may need notice under India's Digital Personal Data Protection Act, 2023. Have a lawyer confirm the duty and wording (qualified legal review required).

## 9. Drill

Do once before the pilot and every quarter:
1. [ ] Make a full file on phone 1. Note the record count.
2. [ ] Load it on a clean test phone. Run section 7.
3. [ ] If using a server: do restore C on a test server and phone.
4. [ ] Record time taken and gaps found.
