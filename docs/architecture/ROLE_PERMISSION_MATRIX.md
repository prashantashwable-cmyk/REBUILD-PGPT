# Role permission matrix (generated)

Generated from the app's own `RULES` table by `tools/dump-facts.js` + `tools/gen-permission-docs.py`. Do not edit by hand.
Each row is an event type (an action). ● = the role may perform it (subject to the extra checks in the last columns).
`validate()` enforces this on every action **and again on every record imported from another phone or the server**; hiding a button is never the control.

Extra checks: **Proj** = must be able to see the project (assignment / company / customer relationship), **Stages** = only in these lifecycle stages, **Gate** = an additional live condition (licence, payment, eligibility, separation of duties…), **2P** = second-person approval (high-risk).

Abbreviations: HQ = owner, Adm = admin, Sal = sales, Fld = field, Fin = finance, QC = qc, Sup = supplier, LPC = partner, Tec = tech, Cus = customer.

| Event type | What it does | HQ | Adm | Sal | Fld | Fin | QC | Sup | LPC | Tec | Cus | Proj | Stages | Gate | 2P |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `ACCESS_LOGGED` | Pages opened (log) | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● |  |  |  |  |
| `ACCESS_REVIEWED` | Access log checked | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `AGREEMENT_PREPARED` | Agreement prepared |  |  | ● |  |  |  |  |  |  |  | ✓ | won |  |  |
| `AGREEMENT_SIGNED` | Agreement signed |  |  | ● |  |  |  |  |  |  | ● | ✓ | agreement |  |  |
| `AMC_ENDED` | Maintenance contract ended | ● | ● | ● |  |  |  |  |  |  |  | ✓ | amc |  |  |
| `AMC_RENEWED` | Maintenance contract renewed | ● | ● | ● |  |  |  |  |  |  |  | ✓ | amc |  |  |
| `APPROVAL_DECIDED` | Second approval decided | ● | ● | ● |  | ● | ● |  |  |  |  |  |  | ✓ |  |
| `APPROVAL_REQUESTED` | Second approval asked | ● | ● | ● | ● | ● | ● | ● | ● | ● |  |  |  |  |  |
| `ARRIVED` | Material arrived |  |  |  |  |  |  | ● |  | ● |  | ✓ | dispatched |  |  |
| `ASSIGNED` | Team changed | ● | ● |  |  |  |  |  |  |  |  | ✓ | 24 stages |  |  |
| `BACKUP_ENDED` | Backup approver ended | ● |  |  |  |  |  |  |  |  |  |  |  |  |  |
| `BACKUP_SET` | Backup approver named | ● |  |  |  |  |  |  |  |  |  |  |  |  |  |
| `BLOCKER_RAISED` | Work problem reported | ● | ● | ● |  |  | ● | ● |  | ● |  | ✓ | 23 stages |  |  |
| `BLOCKER_RESOLVED` | Work problem solved | ● | ● | ● |  |  | ● | ● |  | ● |  | ✓ | any |  |  |
| `BUDDY_SET` | Buddy chosen for a new person | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `CAPACITY_CHECKED` | Capacity check recorded | ● | ● |  |  |  |  |  |  |  |  | ✓ | site_ok |  | ✓ |
| `CHARGE_SETTLED` | Damage charge settled | ● | ● |  |  | ● |  |  |  |  |  | ✓ | any |  |  |
| `CHAT_DECISION` | Chat approval decision | ● | ● |  |  |  |  |  |  |  |  | ✓ | any |  |  |
| `CHAT_POSTED` | Chat message | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● | ✓ | any |  |  |
| `CHAT_STATUS` | Chat item updated | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● | ✓ | any |  |  |
| `CHECKIN_REVIEWED` | Check-in looked at | ● | ● |  |  |  |  |  |  |  |  | ✓ | any |  |  |
| `CLAIM_DECIDED` | Part claim decided | ● | ● |  |  |  |  |  |  |  |  | ✓ | any |  |  |
| `CLAIM_RAISED` | Part claim raised |  |  |  |  |  |  |  |  | ● |  | ✓ | arrived, installing, install_fix |  |  |
| `CLAIM_RECEIVED` | Replacement part received |  |  |  |  |  |  |  |  | ● |  | ✓ | any |  |  |
| `CLAIM_SENT` | Replacement part sent |  |  |  |  |  |  | ● |  |  |  | ✓ | any |  |  |
| `CLOCK_REVIEWED` | Clock jump decided | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `COMM_CREDIT` | Commission credit note | ● | ● |  |  | ● |  |  |  |  |  |  |  |  |  |
| `COMM_STATUS` | Commission status changed | ● | ● |  |  | ● |  |  |  |  |  |  |  |  |  |
| `COMPANY_SHARE_SET` | Pay share set | ● | ● |  |  |  |  |  | ● |  |  |  |  |  |  |
| `CONFIG_SET` | Business rule changed | ● |  |  |  |  |  |  |  |  |  |  |  |  |  |
| `CONTACT_CORRECTED` | Contact corrected | ● | ● | ● | ● |  |  |  |  |  |  | ✓ | 23 stages |  |  |
| `CONTACT_LOGGED` | Customer contacted |  |  | ● |  |  |  |  |  |  |  | ✓ | 5 stages |  |  |
| `CONTRACT_ACCEPTED` | Contractor agreement accepted |  |  |  | ● |  | ● | ● | ● | ● |  |  |  |  |  |
| `CORRECTION_DONE` | Correction done |  |  | ● |  |  |  |  |  | ● | ● | ✓ | site_fix, install_fix, installing |  |  |
| `COUNTER_OFFER` | Customer's offer |  |  | ● |  |  |  |  |  |  | ● | ✓ | quoted |  |  |
| `CREW_ADDED` | Crew member added | ● | ● |  |  |  |  |  | ● | ● |  | ✓ | any | ✓ |  |
| `CREW_RATED` | Crew rating |  |  |  |  |  |  |  |  | ● |  | ✓ | any | ✓ |  |
| `CREW_REMOVED` | Crew member removed | ● | ● |  |  |  |  |  | ● | ● |  | ✓ | any | ✓ |  |
| `CUSTOMER_LINKED` | Customer linked to another site | ● | ● | ● |  |  |  |  |  |  |  | ✓ | any |  |  |
| `CUSTOMER_RATED` | Customer rating |  |  | ● |  |  |  |  |  |  | ● | ✓ | any | ✓ |  |
| `DAILY_REPORT` | Daily report sent |  |  |  |  |  |  |  |  | ● |  | ✓ | arrived, installing, install_fix |  |  |
| `DAMAGE_DECIDED` | Site damage decided | ● | ● |  |  |  |  |  |  |  |  | ✓ | any |  |  |
| `DAMAGE_REPORTED` | Site damage reported | ● | ● | ● |  |  | ● |  |  | ● |  | ✓ | arrived, installing, qc_final, install_fix |  |  |
| `DATA_EXPORTED` | Spreadsheet saved | ● |  |  |  |  |  |  |  |  |  |  |  |  |  |
| `DAY_CLOSED` | Day closed | ● | ● | ● |  | ● | ● |  |  |  |  |  |  | ✓ |  |
| `DAY_ENDED_TECH` | Day ended at the site |  |  |  |  |  |  |  |  | ● |  | ✓ | any |  |  |
| `DEAL_LOST` | Lead lost | ● | ● | ● |  |  |  |  |  |  |  | ✓ | 8 stages |  |  |
| `DEAL_REOPENED` | Lead opened again | ● | ● |  |  |  |  |  |  |  |  | ✓ | lost |  | ✓ |
| `DEAL_WON` | Deal won |  |  | ● |  |  |  |  |  |  |  | ✓ | quoted |  |  |
| `DEMOTED` | Level lowered | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `DEVICE_ALERT_SEEN` | Two-phone alert checked | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `DEVICE_USED` | Signed in on a phone | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● |  |  |  |  |
| `DISPATCHED` | Material dispatched |  |  |  |  |  |  | ● |  |  |  | ✓ | material_order |  |  |
| `DISPUTE_CLEARED` | Dispute settled | ● | ● |  |  |  |  |  |  |  |  | ✓ | any |  |  |
| `DISPUTE_SET` | Dispute marked | ● | ● | ● |  |  |  |  |  |  |  | ✓ | any |  |  |
| `DOC_VERIFIED` | Worker document checked | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `DRAWING_ADDED` | Drawing version added | ● | ● |  |  |  |  |  |  |  |  | ✓ | any | ✓ |  |
| `DRAWING_APPROVED` | Drawing version approved | ● | ● |  |  |  |  |  |  |  |  | ✓ | any | ✓ |  |
| `ENQUIRY_ADDED` | Enquiry received | ● | ● | ● |  |  |  |  |  |  |  |  |  |  |  |
| `ENQUIRY_CLOSED` | Enquiry closed | ● | ● | ● | ● |  |  |  |  |  |  |  |  |  |  |
| `ESC_ACTED` | Office acted on stuck work | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `EXPENSE_ADDED` | Expense added | ● | ● | ● |  | ● | ● |  |  | ● |  | ✓ | any |  |  |
| `EXPENSE_DECIDED` | Expense decided | ● | ● |  |  | ● |  |  |  |  |  | ✓ | any |  |  |
| `FINISH_APPROVED` | Cabin finish answered | ● | ● | ● |  |  |  |  |  |  | ● | ✓ | 7 stages |  |  |
| `FIN_INTEREST` | Finance interest recorded (with consent) | ● | ● | ● |  |  |  |  |  |  | ● |  |  |  |  |
| `FIN_REFERRED` | Finance referral recorded | ● | ● |  |  | ● |  |  |  |  |  |  |  |  |  |
| `FIN_WITHDRAWN` | Finance consent withdrawn | ● | ● | ● |  | ● |  |  |  |  | ● |  |  |  |  |
| `FOLLOWUP_SET` | Follow-up set |  |  | ● |  |  |  |  |  |  |  | ✓ | 5 stages |  |  |
| `GAD_SIGNED` | Layout and civil promises signed | ● | ● | ● |  |  |  |  |  |  | ● | ✓ | site_ok |  |  |
| `HANDOVER_COMPLETED` | Handover completed, AMC started | ● | ● |  |  |  | ● |  |  |  |  | ✓ | handover |  |  |
| `HANDOVER_SIGNED` | Handover signed |  |  |  |  |  | ● |  |  | ● | ● | ✓ | handover |  |  |
| `HOLD_DECIDED` | Hold decided | ● | ● |  |  |  |  |  |  |  |  | ✓ | any |  |  |
| `HOLD_ENDED` | Hold ended — work restarts | ● | ● |  |  |  |  |  |  |  |  | ✓ | any |  |  |
| `HOLD_REQUESTED` | Hold asked | ● | ● | ● |  |  |  | ● | ● | ● |  | ✓ | any | ✓ |  |
| `INCIDENT_RAISED` | Security problem reported | ● | ● | ● |  | ● | ● | ● | ● | ● |  | ✓ | any | ✓ |  |
| `INCIDENT_REPORTED` | Accident reported to authorities | ● | ● |  |  |  |  |  |  |  |  | ✓ | any |  |  |
| `INCIDENT_RESOLVED` | Security problem closed | ● | ● |  |  |  |  |  |  |  |  | ✓ | any |  | ✓ |
| `INFEASIBLE_DECIDED` | Decision on "cannot be fitted" | ● | ● |  |  |  |  |  |  |  |  | ✓ | qc_site | ✓ |  |
| `INSPECTION_REQUESTED` | Final inspection requested |  |  |  |  |  |  |  |  | ● |  | ✓ | installing, install_fix |  |  |
| `JOB_APPLIED` | Applied for job |  |  |  |  |  | ● |  | ● |  |  |  |  |  |  |
| `JOB_CLOSED` | Job post closed | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `JOB_CONFIRMED` | Job given | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `JOB_POSTED` | Job posted | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `JOB_WITHDRAWN` | Application withdrawn |  |  |  |  |  | ● |  | ● |  |  |  |  |  |  |
| `JOIN_DECIDED` | Join request decided | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `KEY_ADDED` | New phone added for signing | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● |  |  |  |  |
| `KEY_APPROVED` | New phone approved | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `LEAD_ACCEPTED` | Lead accepted by Sales |  | ● | ● |  |  |  |  |  |  |  | ✓ | new |  |  |
| `LEAD_CREATED` | New site added | ● | ● | ● | ● |  |  |  |  |  | ● |  |  |  |  |
| `LEAD_EDITED` | Site details changed by the customer |  |  |  |  |  |  |  |  |  | ● | ✓ | any | ✓ |  |
| `LEAD_INFO_ADDED` | Photos / info added |  | ● | ● | ● |  |  |  |  |  |  |  | 23 stages |  |  |
| `LEAD_RESUBMITTED` | Lead sent again | ● | ● | ● | ● |  |  |  |  |  |  | ✓ | returned |  |  |
| `LEAD_RETURNED` | Lead sent back |  | ● | ● |  |  |  |  |  |  |  | ✓ | new |  |  |
| `LEGAL_SET` | Legal paper recorded | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `LIFT_MODE_SET` | Lift mode set | ● | ● |  |  |  | ● |  |  | ● |  | ✓ | qc_final, final_pay, handover, amc |  |  |
| `LIFT_OWNER_CHANGED` | Lift owner changed | ● | ● |  |  |  |  |  |  |  |  | ✓ | amc |  |  |
| `LIFT_QR_SET` | Lift QR label changed | ● | ● |  |  |  |  |  |  |  |  | ✓ | amc |  |  |
| `LOT_ARRIVED` | Material lot arrived |  |  |  |  |  |  | ● |  | ● |  | ✓ | arrived, installing |  |  |
| `LOT_DISPATCHED` | Material lot sent |  |  |  |  |  |  | ● |  |  |  | ✓ | arrived, installing |  |  |
| `MATERIAL_HANDED` | Material handed over |  |  |  |  |  |  |  |  | ● |  | ✓ | arrived |  |  |
| `MATERIAL_RECEIPT_SIGNED` | Customer signed for the material |  |  |  |  |  |  |  |  |  | ● | ✓ | arrived |  |  |
| `MEMBER_APPROVED` | Technician approved for the company | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `MEMBER_REMOVED` | Technician left the company | ● | ● |  |  |  |  |  | ● |  |  |  |  |  |  |
| `MK_ANSWER` | Company answered the pick |  |  |  |  |  |  |  | ● |  |  | ✓ | any | ✓ |  |
| `MK_DONE` | Marketplace lift handed over |  |  |  |  |  |  |  | ● |  |  | ✓ | any | ✓ |  |
| `MK_INSPECTED` | AIEC inspection of a Marketplace lift |  |  |  |  |  | ● |  |  |  |  | ✓ | any | ✓ |  |
| `MK_INTRODUCED` | Customer's contact shared with the company | ● | ● | ● |  |  |  |  |  |  | ● | ✓ | any | ✓ |  |
| `MK_PAY_RECORDED` | Partner payment recorded |  |  |  |  |  |  |  | ● |  | ● | ✓ | any | ✓ |  |
| `MK_PAY_VERIFIED` | Partner payment checked | ● | ● |  |  | ● |  |  | ● |  | ● | ✓ | any | ✓ |  |
| `MK_PICKED` | Customer picked a company | ● | ● | ● |  |  |  |  |  |  | ● | ✓ | any | ✓ |  |
| `MK_PICK_HELD` | Pick held by AIEC | ● | ● |  |  |  |  |  |  |  |  | ✓ | any | ✓ |  |
| `MK_READY` | Company asked for the AIEC inspection |  |  |  |  |  |  |  | ● |  |  | ✓ | any | ✓ |  |
| `MODEL_SET` | Sales model set | ● | ● |  |  |  |  |  |  |  |  | ✓ | accepted, contacted, requirements |  |  |
| `MSG_LOGGED` | WhatsApp message sent | ● | ● | ● |  | ● |  |  |  |  |  | ✓ | any |  |  |
| `MSG_STATUS` | Message reply recorded | ● | ● | ● |  | ● |  |  |  |  |  | ✓ | any |  |  |
| `OPTION_CHOSEN` | Option chosen | ● | ● | ● |  |  |  |  |  |  | ● | ✓ | quoted |  |  |
| `OPT_OUT` | Contact asked to stop | ● | ● | ● |  |  |  |  |  |  | ● | ✓ | any |  |  |
| `ORG_CREATED` | Company created |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| `PARTNER_DD_SET` | Company check recorded | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `PARTNER_PROFILE` | Company licence details saved | ● | ● |  |  |  |  |  | ● |  |  |  |  |  |  |
| `PARTNER_STATUS_SET` | Company status changed | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `PAYMENT_RECORDED` | Payment recorded |  |  | ● |  | ● |  |  |  |  | ● | ✓ | any | ✓ |  |
| `PAYMENT_STATUS` | Payment checked by Finance |  |  |  |  | ● |  |  |  |  |  | ✓ | any |  | ✓ |
| `PAY_APPROVED` | Technician pay approved | ● | ● |  |  |  |  |  |  |  |  |  |  |  | ✓ |
| `PAY_DISPUTED` | Pay question asked |  |  |  | ● |  | ● |  | ● | ● |  |  |  |  |  |
| `PAY_DISPUTE_ANSWERED` | Pay question answered | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `PAY_PAID` | Technician paid |  |  |  |  | ● |  |  |  |  |  |  |  |  |  |
| `PEER_CHECKED` | Co-worker check |  |  |  |  |  | ● |  |  | ● |  | ✓ | installing |  |  |
| `PIN_ALERT` | Wrong PIN tries reported | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● |  |  |  |  |
| `PIN_ALERT_SEEN` | PIN alert checked | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `PIN_UPGRADED` | PIN protection upgraded | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● |  |  |  |  |
| `PO_ACCEPTED` | Purchase order accepted |  |  |  |  |  |  | ● |  |  |  | ✓ | material_order |  |  |
| `PO_DECLINED` | Purchase order declined |  |  |  |  |  |  | ● |  |  |  | ✓ | material_order |  |  |
| `PQUOTE_SENT` | Partner quote sent |  |  |  |  |  |  |  | ● |  |  | ✓ | any | ✓ |  |
| `PREP_ITEM_DONE` | Site preparation item done |  |  | ● |  |  |  |  |  |  | ● | ✓ | site_prep |  |  |
| `PRIVACY_ACCEPTED` | Privacy notice read | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● |  |  |  |  |
| `PROJECT_CANCELLED` | Project cancelled | ● |  |  |  |  |  |  |  |  |  | ✓ | any | ✓ |  |
| `PROMOTED` | Promoted | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `QC_FINAL_RESULT` | Final inspection result |  |  |  |  |  | ● |  |  |  |  | ✓ | qc_final |  |  |
| `QC_RECHECK_DONE` | Second QC re-checked a passed lift |  |  |  |  |  | ● |  |  |  |  | ✓ | any |  |  |
| `QC_RECHECK_REVIEWED` | Office reviewed a QC disagreement | ● | ● |  |  |  |  |  |  |  |  | ✓ | any |  |  |
| `QC_REQUESTED` | Site inspection requested |  |  | ● |  |  |  |  |  |  | ● | ✓ | site_prep, site_fix |  |  |
| `QC_SITE_CORRECTED` | Site check corrected (new version) | ● | ● |  |  |  | ● |  |  |  |  | ✓ | site_ok | ✓ |  |
| `QC_SITE_RESULT` | Site inspection result |  |  |  |  |  | ● |  |  |  |  | ✓ | qc_site |  |  |
| `QUOTE_CREATED` | Quotation made |  |  | ● |  |  |  |  |  |  |  | ✓ | requirements, quoted |  |  |
| `QUOTE_DECISION` | Quotation approval decision | ● | ● |  |  |  |  |  |  |  |  | ✓ | quote_approval |  | ✓ |
| `QUOTE_SENT` | Quotation given to customer |  |  | ● |  |  |  |  |  |  |  | ✓ | quote_ready |  |  |
| `RATING_APPEALED` | Rating appealed |  |  | ● | ● |  | ● |  | ● | ● |  |  |  |  |  |
| `RATING_APPEAL_DECIDED` | Rating appeal decided | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `REFERRAL_REWARDED` | Referral thank-you given | ● | ● |  |  |  |  |  |  |  |  | ✓ | any |  |  |
| `REFERRAL_SET` | Referral recorded | ● | ● | ● |  |  |  |  |  |  |  | ✓ | 23 stages |  |  |
| `REFUND_DECIDED` | Refund decided | ● | ● |  |  |  |  |  |  |  |  | ✓ | any |  |  |
| `REFUND_PAID` | Refund paid |  |  |  |  | ● |  |  |  |  |  | ✓ | any |  |  |
| `REFUND_PROPOSED` | Refund worked out |  |  |  |  | ● |  |  |  |  |  | ✓ | lost |  |  |
| `RELEASED` | Drawings released, team assigned | ● | ● |  |  |  |  |  |  |  |  | ✓ | site_ok |  |  |
| `REP_SET` | Representative named | ● | ● | ● |  |  |  |  |  |  | ● | ✓ | 9 stages |  |  |
| `REQ_SAVED` | Lift needs saved |  |  | ● |  |  |  |  |  |  |  | ✓ | contacted, requirements, quoted |  |  |
| `RESERVE_SETTLED` | Reserve paid in final settlement |  |  |  |  | ● |  |  |  |  |  |  |  |  |  |
| `REVIEW_HELD` | Worker review meeting | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `RFQ_SENT` | Quotes asked from partners | ● | ● |  |  |  |  |  |  |  |  | ✓ | any | ✓ |  |
| `SAFETY_CHECKED` | Daily safety check |  |  |  |  |  |  |  |  | ● |  | ✓ | installing, install_fix |  |  |
| `SAFETY_COUNTERSIGNED` | Safety check counter-signed by the builder |  |  |  |  |  |  |  |  | ● | ● | ✓ | any |  |  |
| `SAFETY_REVIEWED` | Safety check reviewed | ● | ● |  |  |  | ● |  | ● |  |  | ✓ | any |  |  |
| `SERIAL_RESOLVED` | Serial mismatch settled | ● | ● |  |  |  |  |  |  |  |  | ✓ | any |  |  |
| `SERVICE_DONE` | Service visit done |  |  |  |  |  |  |  |  | ● |  | ✓ | amc |  |  |
| `SERVICE_LEAD_SET` | Service lead chosen | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `SHIFT_ENDED` | Shift ended |  |  |  | ● |  |  |  |  |  |  |  |  |  |  |
| `SHIFT_STARTED` | Shift started |  |  |  | ● |  |  |  |  |  |  |  |  |  |  |
| `SITE_CHECKED_IN` | Checked in at the site |  |  |  |  |  |  |  |  | ● |  | ✓ | arrived, installing, install_fix |  |  |
| `SITE_GROUP_SET` | Lift added to a site | ● | ● | ● |  |  |  |  |  |  |  | ✓ | 23 stages |  |  |
| `SKILL_CHECKED` | Practical test | ● |  |  |  |  | ● |  |  | ● |  |  |  |  |  |
| `SOC_APPROVED` | Committee member approved | ● | ● | ● |  |  |  |  |  |  | ● | ✓ | any |  |  |
| `SOC_SET` | Society committee set | ● | ● | ● |  |  |  |  |  |  |  | ✓ | any | ✓ |  |
| `SOC_VOTED` | Committee member voted | ● | ● | ● |  |  |  |  |  |  | ● | ✓ | any |  |  |
| `SOP_STEP_DONE` | Installation step done |  |  |  |  |  |  |  |  | ● |  | ✓ | installing |  |  |
| `SOS_CLOSED` | SOS closed — person safe | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `SOS_RAISED` | SOS raised | ● | ● | ● | ● | ● | ● | ● | ● | ● |  |  |  |  |  |
| `SPOT_CHECKED` | Photo spot check | ● | ● |  |  |  | ● |  |  |  |  | ✓ | any |  |  |
| `STAGE_BACK` | Moved back a stage | ● | ● |  |  |  |  |  |  |  |  | ✓ | any | ✓ |  |
| `STATUTORY_SET` | Statutory record saved | ● | ● | ● |  | ● | ● |  |  |  |  | ✓ | any | ✓ |  |
| `STAT_LEAD_SET` | Statutory liaison chosen | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `STOCK_ITEM_SET` | Stock item set | ● | ● |  |  | ● |  |  |  |  |  |  |  |  |  |
| `STOCK_MOVED` | Stock moved | ● | ● |  |  | ● |  |  |  | ● |  |  |  |  |  |
| `STRIKE_APPEALED` | Strike appeal | ● | ● | ● | ● | ● | ● | ● | ● | ● |  |  |  |  |  |
| `STRIKE_DECIDED` | Strike appeal decided | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `SUPPLIER_INVOICE` | Supplier invoice |  |  |  |  |  |  | ● |  |  |  | ✓ | any | ✓ |  |
| `SUP_COMPARED` | Suppliers compared | ● | ● |  |  |  |  |  |  |  |  | ✓ | site_ok |  |  |
| `SUP_INVOICE_DECIDED` | Supplier invoice checked | ● | ● |  |  |  |  |  |  |  |  | ✓ | any |  |  |
| `SUP_INVOICE_PAID` | Supplier invoice paid |  |  |  |  | ● |  |  |  |  |  | ✓ | any |  |  |
| `SURPRISE_DONE` | Surprise inspection |  |  |  |  |  | ● |  |  |  |  | ✓ | any |  |  |
| `SURPRISE_SET` | Surprise inspection planned | ● | ● |  |  |  |  |  |  |  |  | ✓ | arrived, installing, install_fix |  |  |
| `SURVEY_DONE` | Shaft measured before price | ● | ● | ● | ● |  |  |  |  |  |  | ✓ | 6 stages |  |  |
| `TEAM_SET` | Company changed the team | ● | ● |  |  |  |  |  | ● |  |  | ✓ | any | ✓ |  |
| `TEMPLATE_DELETED` | Message template removed | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `TEMPLATE_SET` | Message template saved | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `TICKET_ACCEPTED` | Breakdown accepted | ● | ● | ● |  |  | ● |  |  | ● |  |  | any |  |  |
| `TICKET_ASSIGNED` | Problem given to a person | ● | ● | ● |  |  | ● |  |  | ● |  | ✓ | any | ✓ |  |
| `TICKET_CLOSED` | Problem checked | ● | ● |  |  |  |  |  |  |  | ● | ✓ | any |  |  |
| `TICKET_OPENED` | Problem reported | ● | ● | ● |  |  |  |  |  | ● | ● | ✓ | any | ✓ |  |
| `TICKET_SEVERITY` | Ticket urgency changed | ● | ● | ● |  |  | ● |  |  | ● |  | ✓ | any | ✓ |  |
| `TICKET_UPDATED` | Problem work update | ● | ● | ● |  |  | ● |  |  | ● |  |  | any |  |  |
| `TRAINING_PASSED` | Training passed | ● | ● | ● | ● | ● | ● | ● | ● | ● |  |  |  |  |  |
| `TRAINING_VIDEO_SET` | Training video set | ● | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| `TRIAL_RESULT` | Trial job result | ● | ● |  |  |  | ● |  |  | ● |  | ✓ | any |  |  |
| `UNDONE` | Taken back | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● |  |  |  |  |
| `USER_ADDED` | Person added | ● | ● | ● |  |  |  |  | ● |  |  |  |  |  |  |
| `USER_UPDATED` | Person changed | ● | ● |  |  |  |  |  |  |  |  |  |  |  | ✓ |
| `VARIATION_DECLINED` | Variation not accepted |  |  | ● |  |  |  |  |  |  | ● | ✓ | any |  |  |
| `VARIATION_PROPOSED` | Variation quote | ● | ● | ● |  |  |  |  |  |  |  | ✓ | any |  |  |
| `VARIATION_SIGNED` | Variation signed |  |  | ● |  |  |  |  |  |  | ● | ✓ | any |  |  |
| `WARRANTY_CALLED` | Warranty-end call made | ● | ● | ● |  |  |  |  |  |  |  | ✓ | amc |  |  |
| `WORKER_PROFILE` | Worker profile saved | ● | ● | ● | ● | ● | ● | ● | ● | ● |  |  |  |  |  |

## Totals

| Role | Event types allowed |
|---|---|
| owner | 145 |
| admin | 142 |
| sales | 78 |
| field | 25 |
| finance | 37 |
| qc | 45 |
| supplier | 27 |
| partner | 35 |
| tech | 51 |
| customer | 38 |

Total event types: 212. High-risk (second person, or Head Quarter for capacity exceptions): `QUOTE_DECISION`, `PAYMENT_STATUS`, `INCIDENT_RESOLVED`, `DEAL_REOPENED`, `USER_UPDATED`, `PAY_APPROVED`, `CAPACITY_CHECKED`.

## Menus per role (bottom navigation)

| Role | Menu |
|---|---|
| field | home · projects · chat · me |
| sales | home · projects · callnext · chat · me |
| tech | home · stock · steps · damage · mywork · me |
| finance | home · projects · chat · me |
| supplier | home · projects · chat · me |
| customer | home · mypay · docs · chat · me |
| default | home · projects · chat · me |
