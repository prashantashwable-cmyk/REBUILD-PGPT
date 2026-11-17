# Test plan

## Layers

| Layer | What | How to run |
|---|---|---|
| Static | file size budget (2.4 MB), version = sw.js cache, script parses, no duplicate names or word keys, every word in en/hi/mr with matching placeholders, every word the code asks for exists | `npm run check` |
| Domain + journey (browser) | 114 Playwright files: rules, permissions (allowed and refused), money, marketplace, partners, ladder, safety, statutory, offline/sync, server code, every role's screens in three languages at 320 px | `npm test` (or `node tests/run-all.js --shard=N/4` in parallel) |
| Time travel | the same suite as if 45 days later (date-based rules must not break) | `AIEC_SHIFT_DAYS=45 npm test` (weekly in CI) |
| Rebuild checks | the rebuild's rules and screens | `node tests/rebuild.test.js` |
| Accessibility | WCAG 2.0/2.1 A/AA by axe-core: 9 main screens × 4 themes (en) + hi/mr in light and dark = 72 checks | `node tests/a11y.test.js` |
| Visual | every role's home (390 px and 320 px) and key screens in mr/hi/en, sideways-scroll and missing-word checks, contact sheet | `node tests/shots-roles.js [app.html] [outDir] [--dsf=2]`; sign-in set: `npm run shots` |
| Device (manual) | camera, microphone, GPS in basement/shaft, install, offline/online return, background notifications, APK | `PRODUCTION_READINESS_CHECKLIST.md` |

## Master prompt §17.1 scenarios → tests

| # | Scenario | Test file(s) |
|---|---|---|
| 1 | Offline lead, reopen, sync once, no duplicates | sync, sync2, server-sync, lead-to-handover.e2e |
| 2 | Duplicate lead → attach/review | custlead, statlead |
| 3 | Incomplete/unsafe survey blocks final quote | survey, sitequality |
| 4–5 | Conditional 14-day target; complex job longer estimate | rebuild, custtrust, bars |
| 6–7 | Below-floor quote needs approval; sent quote immutable | discount, sales, sales2 |
| 8 | Contracting party and signed version | lead-to-handover.e2e, bp5market |
| 9–10 | Marketplace comparison/pick; models cannot cross | bp5market, market, bars |
| 11–13 | Ineligible partner blocked (also mid-job: controlled hold); revoked technician; technician cannot bid | bp2partners, partner, privacy, rebuild |
| 14 | Supplier sees only own orders | privacy, audit-privacy, security2 |
| 15–17 | Screenshot stays pending; duplicate events not doubled; unconfirmed payment blocks gate | money, recon, server-sync, gate |
| 18–19 | Commission on verified collections; no false AIEC revenue | bp5market |
| 20 | Missing permit/licence blocks | statutory, bp1compliance |
| 21–23 | Failed safety/QC freezes; no self-QC; offline safety event kept | safety, qcrecheck, quality, sync2 |
| 24 | Serial mismatch blocks | material |
| 25–26 | Handover and AMC gates | finish, liftlife |
| 27 | Trapped-person reaches people | tickets, custtrust |
| 28 | Finance consent before sharing; withdrawal | bp4finance |
| 29 | Practice never reaches providers | finish, practice-roles |
| 30 | 5th allowed, 6th blocked unless HQ approves | bp3kpi |
| 31 | Admin cannot approve own high-risk change | bp3kpi, office |
| 32 | No access by changing ids/payloads | permissions-denied, security, security2, access |
| 33 | No missing words in three languages | static, every test, shots-roles |
| 34 | Offline/queued/accepted/rejected/stale states | rebuild, server-sync |
| 35 | Restore preserves integrity | server-backup, golden, snapshot |

## Quality gates
No failing test file; no missing words; no page errors; no sideways scroll at 320 px; every new rule has an allowed and a refused test; nothing is reported as passed unless its output exists (`TEST_RESULTS.md`).
