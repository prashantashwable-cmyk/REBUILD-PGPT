# Role and permission audit

The full action × role table is generated from the app's own rules: **`docs/architecture/ROLE_PERMISSION_MATRIX.md`** (212 event types). Regenerate with `node tools/dump-facts.js && python3 tools/gen-permission-docs.py`.

## 1. How access is enforced (layers)

| Layer | Mechanism | Bypassable by UI tricks? |
|---|---|---|
| Action | `validate()` → `RULES[type].roles`, `.stages`, `.gate`, `.check`; separation of duties (author ≠ approver, recorder ≠ confirmer); `needsSecond()` for high-risk actions | No — runs inside `perform()` for every action |
| Imported data | the same `validate()` for every record in a file or server pull; signature check per person key; unknown second phones held until approved | No |
| Project data | `canSee(u, P)` / `visibleProjects(u)`: field = own leads, supplier = own orders (no prices/phones), technician = assigned jobs, partner = its company's jobs, customer = own lift(s) | No (export packs for a person contain only what `canSee` allows) |
| Field masking | `seeF(u, field)`: phone, address, money fields hidden per role; marketplace cards show area only until a company is chosen | — |
| Screen | `SCREENS` render only permitted actions; `allowed()` pre-check hides buttons | Yes, but hiding is convenience only |
| Access log | outside companies (`partner`, `tech`, `supplier`) have sensitive screen views logged (`ACCESS_LOGGED`), copying/printing blocked, screen blurred in app switcher, watermark with name | — |
| Refusal explanation | `errText()` says why and, for `err_role`, who can do it | — |

## 2. Roles and their surface

| Role | Menu | Main allowed actions (count) | Cannot |
|---|---|---|---|
| owner (Head Quarter) | home · projects · chat · me | 145 | approve own request (`err_same_person`); act as Finance confirmer of own record |
| admin | same | 142 | approve own high-risk request; approve a capacity exception (Owner only, from 17 Nov 2026) |
| sales | home · leads · call next · chat · me | 78 | change cost base, margins, rules; approve own quotation; confirm payments |
| field | home · sites · chat · me | 25 | see prices, other surveyors' leads, partner bids |
| finance | home · projects · chat · me | 37 | confirm a payment they recorded; pay a pay-week they approved |
| qc | home · projects · chat · me | 45 | inspect a job they worked on |
| supplier | home · orders · chat · me | 27 | see customers' phones, prices, unrelated projects |
| partner (LPC) | home · projects · chat · me | 35 | take jobs with expired licence/insurance, too many strikes, or when not Active/Conditional |
| tech | today · material · steps · damage · pay · me | 51 | submit company bids, change terms, see other companies; act without approved company membership |
| customer | my lift · pay · papers · help · me | 38 | see margins, internal notes, other bids, crew rates |

## 3. Findings

| # | Finding | Severity | Action in rebuild |
|---|---|---|---|
| P-1 | Authority is enforced on every phone, not by a server. A tampered app can create records locally; other phones refuse them (rules + signatures). | High (architectural) | Kept, documented; server-side validation is the recommended next step (`REBUILD_PLAN.md` phase 6 option). |
| P-2 | Pilot-cap exception could be recorded by an Admin; master prompt §3.3 requires the Owner. | Medium | **Fixed**: Admin's check becomes an approval request; only the Owner can approve (test: `bp3kpi`, `rebuild`). |
| P-3 | `APPROVAL_DECIDED` allowed for sales/finance/qc only as a named backup approver — verified correct. | — | None |
| P-4 | Customer saw internal sync information? No — the new sync strip is hidden for customers (test: `rebuild`). | — | — |
| P-5 | Technician access after the job: limited to assigned jobs; AMC/ticket work re-opens access per ticket. Time-bounded windows after handover are rule-based, not date-based. | Low | Deferred; noted in risks. |

## 4. Positive and negative tests

Permission refusals: `permissions-denied`, `security`, `security2`, `access`, `audit-privacy`, `privacy`, `partner`, `market`, `bp2partners`, `bp5market`, `rebuild`. Each role's practice home is rendered in every language by `practice-roles` and `tests/shots-roles.js`.
