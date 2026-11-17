# Data and event model

The authoritative description of the current model is `docs/rebuild/CURRENT_DATA_MODEL.md` (event fields, state, storage keys, reconstruction, migration). This page maps the master prompt's logical entities (§12.1) to where each lives today.

| Logical entity (prompt) | Implementation |
|---|---|
| Organisation, UserAccount, RoleAssignment, DeviceSession | `S.org`, `S.users` (one role per login; role changes are `USER_UPDATED`, high-risk), device keys `S.keys`, `DEVICE_USED` / `KEY_APPROVED` |
| Permission | `RULES[type].roles/stages/gate/check` (generated matrix) |
| PartnerCompany, PartnerDocument, PartnerStatusHistory, PartnerTierHistory | `S.users` role `partner` + `S.workers[uid]` (licence, docs checked, `pst` history, due diligence); tier computed by `partnerTier()` |
| TechnicianMembership, Skill, Certification, TrainingAttempt | `users[uid].company` + member approval events, `workers[uid].grade/trials/training` |
| Customer, Contact, Consent, Site, LiftAsset, Lead, LeadAttribution | `projects[pid].lead/site/lift`, customer users, consent events (`*_CONSENT`), lift register |
| Project, ProjectStage, StageEvent, Task, SLAClock, Blocker, Escalation, Approval | `projects[pid]` + `hist`; tasks are computed by `needs()` (not stored); clocks from `since`; `blockers`; `escalations` actions; `S.approvals` |
| Survey, Measurement, SiteReadiness, Drawing, Variation | `qcSite`, survey records, GAD signature, variation events |
| Quote, QuoteVersion, PartnerQuote, RateCard(Version), Agreement, Signature | `quotes[]` (immutable), marketplace offers, `config` + `priceLog`, agreement events, signature evidence |
| PaymentIntent, Payment, Receipt, Refund, Dispute, Ledger, Reconciliation | `payments[]` (status history), refunds, receipts, bank CSV match (`recon`) — single-entry records, corrections by new records |
| PurchaseOrder, BOM, MaterialLot, SerialItem, Dispatch, CustodyEvent, SupplierInvoice | `material`, `serials`, lots, `mhand`, supplier bills |
| WorkAssignment, CheckIn, SafetyCheck, SOPStep, PeerCheck, QCInspection, Defect, Commissioning | `tech/crew`, `shifts`, safety records, `steps`, peer checks, `qcFinal`, fix tasks |
| StatutoryRecord, Inspection, OperatingLicence | `statutory` per lift |
| EvidenceAsset/Metadata/Review | evidence objects `{id, m, kind, t, gps, hash, dev, q}` + media store |
| ChatThread/Message, NotificationOutbox | `chat`, `Notify` (local); server push optional |
| AMCContract, Ticket, ServiceVisit, RescueIncident, SafetyIncident | `amc`, `S.tickets`, visits, incidents/SOS |
| MarketplaceRFQ, Selection, CollectionMilestone, CommissionLedger | marketplace fields on the project; commission computed per confirmed collection |
| FinanceReferral, Consent, Outcome | finance interest/consent/referral events (`bp4finance`) |
| ContractorLedger, PayoutBatch, Rating, Trust, Strike, Appeal | `settle`, pay weeks, ratings, `trustOf()`, strikes, appeals |
| AuditEvent, RuleConfig/Version, BackupManifest, SyncCursor, Idempotency | the event log itself, `config` + `priceLog`, backups, `Sync` cursors, event ids |

**Gap vs prompt:** money is recorded as status-tracked records, not double-entry ledger accounts. Double-entry is required only for a connected backend (§7.5) and is part of the server option in phase 6.
