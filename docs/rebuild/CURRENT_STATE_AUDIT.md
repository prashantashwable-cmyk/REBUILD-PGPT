# Current-state audit — AIEC Elevator OS

**Audited:** 17 Nov 2026 · **Source:** `prashantashwable-cmyk/UNLIT-GPT-HTML`, branch `ccr-941b528b-js9mxg`, commit `605575a` (13 Nov 2026), deployed at `https://prashantashwable-cmyk.github.io/UNLIT-GPT-HTML/AIEC-Elevator-OS.html` (build 105).
**Rollback point in this repository:** tag `baseline-605575a` (the imported files, unchanged).

## 1. Verdict

The existing application is **not a prototype**. It is a large, working, offline-first operating system for the elevator business with an event-sourced core, enforced role rules, signed records, an optional encrypted sync server, and 112 automated browser test files. Almost every capability the master rebuild prompt lists already exists in some form, most of them tested end to end.

A blind rewrite (React/Next/Supabase or similar) would throw away ~1.8 MB of tested business logic, 4,900 three-language word keys and 212 validated event types, with a near-certain loss of rules. The master prompt (§1.2–1.3) forbids that. **Decision: KEEP the architecture and improve it in place, in small tested steps** (see `REBUILD_PLAN.md`).

## 2. What exists, where

| Part | Where (in `AIEC-Elevator-OS.html` unless stated) | Notes |
|---|---|---|
| Boot | `boot()` near the end of the script; splash → gate → door → PIN | IndexedDB opened by `KV.init()`; falls back to localStorage, then memory with a warning |
| Words (mr / hi / en) | `const L = {…}` (≈4,900 keys, `[en, hi, mr]`), `t(key, vars)` | Static test checks every key has all three languages and matching `{placeholders}` |
| Route registry | `SCREENS` object (100 screens), `go()`, `back()`, `render()` | Hardware back stays in the app; focus moves to each screen title |
| Step-by-step tasks | `WIZ` (170 wizards), `wiz()`, `W` | One question per screen, drafts saved |
| Action dispatcher | `ACT` object; `data-a` / `data-v` attributes on buttons | One delegated click handler |
| The only write path | `perform(type, pid, data)` → `validate()` → `apply()` → `EVENTS.push` → `saveAll()` | No other code changes data |
| Rules | `RULES` (212 event types: roles, stages, project visibility, gates, checks), `validate()` | Re-run on every imported record and every server pull |
| State | `apply()` builds `S` from events; `rebuild(events)`; snapshots every 300 records (`makeSnap` / `fromSnap`, fingerprinted) | Snapshot is discarded when the app code or event ids change |
| Who acts next | `needs(P)` / `needs0` → tasks, escalation ladder, notifications | Owner kept out of day-to-day (`splitOA`) |
| Storage | `KV` (IndexedDB store `kv` in DB `aiec-elevator-os`), events in chunks of 500 (`ev:N`), media `m:<id>` as data URLs | Namespaces `r:` (real) and `p:` (practice) never mix |
| Signing | `Sign` — per-person ECDSA P-256 key made on the phone; every real record signed; second phone needs approval | Practice records are not signed |
| Sync | `Sync` — optional company server (Cloudflare Worker / D1, Supabase, or local Node in `server/`); AES-GCM end-to-end encrypted boxes; office inbox | Server stores ciphertext only |
| PWA | `manifest.webmanifest`, `sw.js` (cache `aiec-os-vNNN`), install gate for real use | Practice works in a browser tab |
| Android | `android/` WebView wrapper (Kotlin), GitHub Action builds a test-signed APK | Test keystore is committed (see risks) |
| Tests | `tests/*.test.js` (Playwright + Chromium), `tests/run-all.js` (sharded), `tests/static.test.js`, golden fixture | CI: `.github/workflows/test.yml` incl. a 45-days-later time-travel run |

## 3. Feature families — real status

Legend: **Working** = implemented and covered by an automated test · **Partial** = implemented with documented limits · **Practice-only** = only meaningful with sample data · **Needs server/provider** = cannot be real without an outside service · **Not built**.

| Feature family | Status | Evidence (tests) |
|---|---|---|
| Splash, install gate, onboarding, language, login/PIN/recovery, practice mode | Working | install-gate, signinL1–L5, pinrecover, practice-roles |
| Role-based navigation and screen access | Working | permissions-denied, access, security, security2 |
| Marathi / Hindi / English | Working (machine-checked keys; **human language review still required**) | static, layout, every test's missing-word check |
| Themes (light, colour, dark, contrast), screen size 20–150 % | Working | finish, screen-scale, layout |
| Lead capture, GPS, photos, duplicate detection, scoring, attribution, follow-up | Working | lead-to-handover.e2e, custlead, statlead, salesfield, growth |
| Survey and technical feasibility, shaft limits | Working | survey, sitequality, quality |
| Quote calculation, rate card, versions, margins, discount guardrails, approvals | Working | sales, sales2, discount, money, payplans |
| AIEC Contract vs Marketplace per project | Working | bp5market, market, bars |
| Signatures, payment plans, payment recording/verification, refunds, receipts | Working (signatures are drawn, **not certified e-sign**) | money, moneyline, recon, safetysign |
| Site readiness, QC site inspection, drawings, permits, release gates | Working | gate, sitequality, statutory, beforework |
| Supplier PO, BOM, serial numbers, dispatch, arrival, custody | Working | material, supply, supplierbills |
| Crew assignment, check-in, daily safety, SOP steps, peer checks, blockers, incidents | Working | checkin, safety, safetysign, operations |
| Final QC, safety checks, inspection/licence, handover, asset record, AMC | Working | finish, qcrecheck, statutory, liftlife, service |
| Timeline, chat, customer view, notifications, help, QR, emergency path | Working (QR/SOS reach people by call/WhatsApp; no 24×7 desk in the app) | history, chatplan, notifications, tickets, custtrust |
| Admin queues, dashboards, maps, reports, audit trail, access logs, rules | Working | office, reports, hq, maps, homemap, audit-privacy |
| Users, LPC profile, technician membership, tiers, onboarding, KYC flags, training, trust, ratings, strikes/appeals, job board, earnings, payouts | Working (documents are checked flags; files are not stored) | partner, bp2partners, ladder, fairness, workers, joinflow |
| AMC visits, renewals, tickets, SLAs, escalation | Working | service, tickets, escalation, waits |
| Finance referral interest and consent | Working (referral by hand; no lender connected) | bp4finance |
| Offline storage, signed events, backup/recovery, sync, conflicts | Working (company server optional) | sync, sync2, server-*, snapshot, golden |
| Payment gateway, WhatsApp Business API, SMS, NBFC, e-sign, masked calling, registries | **Not connected** (labelled; a person does the step) | rebuild (Connections screen) |

## 4. Real vs simulated operations

* **Real (in real mode):** every record, signature drawing, photo/video with SHA-256, GPS reading, PIN check, file export/import, encrypted server sync (when configured), PBKDF2 PIN hashing, ECDSA record signing.
* **Opens another app, never claims delivery:** WhatsApp (`wa.me` link), SMS, phone call, e-mail share. The app records that the person opened it.
* **Never simulated in real mode:** payments (Finance confirms with a bank reference), lender decisions, statutory licences (stored as records with who checked them).
* **Practice mode:** 15 sample people, 13 sample jobs, PIN `1111`, striped "PRACTICE — nothing here is real" banner on every screen; never signs, never syncs, never opens WhatsApp/SMS/payments.

## 5. Hard-coded sample data check

Sample names, phone numbers, UPI ID (`aiec.practice@okhdfc`), bank account, licence numbers (`MH/LIFT/2024/1187` …) exist **only inside `seedPractice()`** and are stored under the practice namespace. Real mode starts empty (`setup` / `newOrg`). `server.json` holds the URL of an optional Supabase function used by the server tests; it contains no secret. `android/aiec-test.jks` is a **test** signing key (documented as such) — not for Play Store use.

## 6. Dangerous-pattern review (summary; details in `KNOWN_RISKS_AND_DECISIONS.md`)

| Pattern | Finding |
|---|---|
| HTML injection | Screens are built as template strings into `innerHTML` (31 sites). Values go through `esc()` (486 uses) or the `hx` tagged template. No evaluation of user content found. Residual risk: any new template that forgets `esc()`. |
| CSP | `object-src 'none'; base-uri 'none'; form-action 'none'` only — no `script-src` because the app is one inline script. |
| PIN handling | PBKDF2-SHA-256, 150,000 rounds, per-user salt; optional 6 digits; re-check for risky actions. |
| Authorisation | Enforced in `validate()` on every phone and every imported record — but **there is no authoritative server**. A modified app on one phone can create records; other phones refuse records that break rules or carry a bad signature. |
| Timestamps | Client clock; records from a phone with a clock far ahead are flagged (`clock_gap`); ordering keeps strict monotonicity locally. |
| Duplicate replay | Event ids are unique per device; imports skip known ids; server pulls are cursor-based. |
| Unbounded growth | Events chunked; media stored as data URLs (large); photo archive exists; storage warning shown. |
| Service worker | Versioned cache; a CI job checks the live link serves the current version. |

## 7. Baseline test run (before any change)

Run on 17 Nov 2026 in this environment (Chromium via Playwright, 4 shards): **111 of 112 test files passed.** `waits.test.js` failed once at "the screen shows slowest steps and waiting jobs"; it passes on re-run (timing-sensitive, see risks R-12). Logs were kept with the session; results are summarised in `docs/testing/TEST_RESULTS.md`.

## 8. What needs device or provider testing

Camera and microphone on low-end Android Chrome; GPS accuracy in basements/shafts; background notifications; storage persistence after OS cleanup; the APK on Android 10–15; the company server under real network loss. None of these can be proven in a headless browser.
