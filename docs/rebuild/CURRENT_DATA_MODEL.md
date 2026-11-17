# Current data model

The app is **event-sourced**. Nothing is edited in place: every action is an immutable event; the current state `S` is rebuilt from the events by `apply()`. The rebuild keeps this model unchanged, so every existing company file and every historical record stays readable (see §6).

## 1. Event (record)

Made only by `perform(type, pid, data, opt)`:

| Field | Meaning |
|---|---|
| `id` | `<device id>-<6 random chars>` — unique, used for de-duplication on import and sync |
| `n` | per-device sequence number |
| `t` | ISO time from the phone clock (kept strictly increasing locally; a clock far ahead is flagged `clock_gap`) |
| `by` | user id of the actor (the role is looked up from `S.users`) |
| `type` | one of 212 event types in `RULES` (generated list: `docs/architecture/ROLE_PERMISSION_MATRIX.md`) |
| `pid` | project id (`AIEC-YYMM-XXX`) or `null` for company-level records |
| `data` | the payload (validated per type) incl. evidence references `ev: [{id, m, kind, t, gps, hash, dev, q}]` |
| `dev` | device id |
| `v` | record schema version (`EV_V = 2`); an older app refuses to guess newer records ("update the app") |
| `sig` | ECDSA P-256 signature (real mode) by the person's phone key |

Approval wrappers: high-risk actions become `APPROVAL_REQUESTED { aid, action: {type, pid, data}, reason }`; `APPROVAL_DECIDED` replays the inner action with `_aid`.

## 2. State `S` (rebuilt, never stored as truth)

Built by `emptyState()` + `apply()`; main parts:

* `org`, `users` (uid, name, role, salt, PBKDF2 PIN hash, company for technicians, active, grade), `config` (business rules + `approved` per rule group), `priceLog` (rule history), `approvals`, `backup` (backup approver).
* `projects[pid]`: `stage`, `since`, `hist` (dated stage history), `lead`, `site` (address, gps), `req` (lift needs), `quotes` (immutable versions), `payments` (recorded → confirmed/rejected/reversed, payer, reference), `qcSite`, `qcFinal`, `steps` (SOP), `blockers`, `incidents`, `material`/`serials`/`mhand` (material handover), `statutory` (permit, inspection, licence, insurance), `model` (`aiec` | `market`), marketplace fields (RFQ, offers, pick, milestones, confirmed collections, commission), `done` (handover), `amc`, `chat`, `capOk` (capacity exception).
* `workers[uid]`: profile, documents (checked / not checked — never the file), training, partner licence and status history (`pst`), due-diligence checklist, ratings, strikes, appeals, trials.
* `posts` (job marketplace), `tickets`, `stock`, `settle` (pay), `contracts`, `rejected` (records refused by the rules, with the reason), `evidence` (index of media metadata), `byId` (event index).

## 3. Storage keys (IndexedDB DB `aiec-elevator-os`, store `kv`)

Prefix `r:` = real company, `p:` = practice. They never mix.

| Key | Content |
|---|---|
| `<ns>ev:<i>` / `<ns>evn` | events in chunks of 500 / number of chunks (only changed chunks are rewritten) |
| `<ns>snap` | snapshot `{k, last, h, fp, byId, state}` every 300 records; trusted only if the app fingerprint, record count, last id and id-hash match |
| `<ns>m:<mediaId>` | photo / video / signature / voice as a data URL (in-memory cache of 150) |
| `<ns>archived` | ids of photos moved to an archive file |
| `<ns>ck`, `bk`, `rk` | sync: company key, backup key, report key pair (office phones only) |
| `<ns>syncSent` | ids already sent per server box (no duplicate uploads) |
| `<ns>joinReqs`, `reports` | join/enquiry requests and lift-QR reports pulled from the server |
| settings (`App.set`) | language, theme, scale, device id, sequence, per-mode sync config, notification settings, folds |

Fallbacks: localStorage when IndexedDB is unavailable, memory (with a visible warning) when neither works.

## 4. State reconstruction

1. `loadMode()` loads all chunks, sorts events.
2. If the snapshot is trusted, start from it and validate+apply only newer events; else `rebuild()` replays every event through `validate()` + `apply()`.
3. Records that break the rules go to `S.rejected` (shown in Me → Refused entries; and now counted in the home sync strip for the office).
4. `UNDONE` events force a full replay.

## 5. Media, sync payloads, files

* Evidence metadata travels with events; binary media travels in files/sync packs only when needed, keyed by media id and verified by SHA-256.
* Export packs: `full` (office), `person` (one person's projects; other PINs stripped), updates (only the sender's own records). Practice and real files cannot be mixed.
* Server: per-person boxes and an office inbox, AES-GCM encrypted with keys derived from the company key; the server never sees names, prices or photos.

## 6. Migration and compatibility (rebuild)

* **No record format change.** `EV_V` stays 2; no event type removed or renamed.
* New business rule `installDaysComplex` (default 28) is read with a fallback to `installDays`; old companies simply get the default.
* New rule: `serveAreas` default `Pune` (was empty = everywhere). Companies that already set their own list keep it (the value comes from their `CONFIG_SET` records).
* New rule: a capacity exception (`CAPACITY_CHECKED`) made by a non-Owner **after 17 Nov 2026 00:00 UTC** (`CAPOWNER_FROM`) needs Head Quarter approval. Older records stay valid on replay.
* Snapshot fingerprint changes with the new app code, so the first start after the update replays from records once (expected, safe).
* Migration test: the golden fixture (`tests/golden.test.js`, `tests/fixtures/golden-v1.json`) still replays with the same results.
