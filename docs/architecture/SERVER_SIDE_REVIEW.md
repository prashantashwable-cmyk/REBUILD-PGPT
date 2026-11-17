# Server-side review (17 Nov 2026, build 110)

## Can the company server check the business rules itself?
**No, not without giving up the privacy design, and that would be the wrong trade.** The server (`server/core.mjs`, deployable on Cloudflare D1, Cloudflare Durable Objects, Supabase or local Node) is an **end-to-end encrypted mailbox**. Every message is encrypted with AES-GCM on the phone using keys derived from the company key, which only office phones hold. The server never sees names, prices, photos or records, so it cannot run `validate()`. Letting it read records would make it the most valuable target in the system.

What makes records trustworthy instead:

| Layer | Where | What it guarantees |
|---|---|---|
| Box tokens (hashed on the server) | server | only registered phones can write; a person reads only their own box; only office phones read the inbox and write to person boxes |
| Server-recorded sender | server | each message's `from` is the box that sent it, never what the body claims |
| Per-box encryption keys | phones | a message in the inbox from box X can only have been written by X (or an office phone) |
| **Sender binding (new)** | office phone | a message from person X's box must be X's own file; anything else is refused |
| Record signatures | every phone | each record carries its maker's ECDSA signature; changed or forged records are refused |
| `validate()` on import | every phone | every imported record is re-checked against all 212 rules (roles, stages, gates, separation of duties) |
| **Signed server settings (new)** | every phone | a file's server address and keys are taken only with a valid Head Quarter/Admin signature over them |

So the **office phone is the authoritative validator**: nothing reaches the company record without passing its signature checks and the full rule check.

## Findings and fixes

| # | Finding | Severity | Status |
|---|---|---|---|
| S-1 | The server settings in a file (`pack.sync`: server address, company key) were taken whenever the file *claimed* to be from the Head Quarter/Admin. The file signature covered only the records, not these settings. A registered person (e.g. a technician) could send the office a forged file through the inbox, or alter a genuine file in transit, so that the office phone switched to an attacker's server and key. Every later sync would then send company data, readable, to the attacker. Present since build 105; reproduced on build 109. | **High** | **Fixed (build 110):** separate signature `ssig` over the settings; taken only if it verifies with an approved Head Quarter/Admin key. Test: `sync-forgery.test.js`. |
| S-2 | The office did not compare a message's server-recorded sender box with the file inside it. | Medium | **Fixed:** inbox messages from a person's box must carry that person's own file. Test: `sync-forgery.test.js`. |
| S-3 | Any registered phone could remove or take over another box's push-alert subscription (`/push-sub`), if it knew the endpoint. | Low | **Fixed:** a phone changes only its own subscription; the office may tidy any. Test: `server-hardening.test.js`. |
| S-4 | A person's phone shared the general 600-per-minute limit for sending to the office inbox (up to about 500 MB a minute of 900 KB messages). | Low–Medium | **Fixed:** 60 sends a minute for person phones; office phones unchanged. Test: `server-hardening.test.js`. |
| S-5 | On Cloudflare D1, per-minute rate counters were written to `meta` and never removed; ended invites were not removed either. | Low (storage growth) | **Fixed:** pruned with old messages. |
| S-6 | Per-network limits for public reports and join requests use `X-Forwarded-For` when not on Cloudflare; a client can change that header. | Low | Open. Global limits (300 and 60 a minute) still apply. On Supabase or Node, put the server behind a proxy that sets the header. |
| S-7 | A brand-new phone trusts the keys in the first file it loads. | Known limit | Unchanged (no central certificate authority). Only load company files received directly from the office. |
| S-8 | `ADMIN_SECRET` (setup and restore) is limited to 20 tries a minute. | Low | Use a long random secret (32+ characters); documented. |

Checked and fine: tokens are stored only as SHA-256; secret comparisons are constant-time; CORS allows any origin but uses bearer tokens, not cookies; one-time codes allow 5 tries, are rate limited and expire within 3 days; push endpoints are limited to known push services; the server returns no stack traces.

## Effect on existing installations
* Files made by build 110 carry the new signature. **An older file with server settings, or one from build 109 or earlier, still loads its records, but its server settings are refused** on a real-company phone. The office sends a fresh file or one-time code from build 110. Practice mode is unchanged.
* Phones already connected keep their settings; nothing needs to be redone.
