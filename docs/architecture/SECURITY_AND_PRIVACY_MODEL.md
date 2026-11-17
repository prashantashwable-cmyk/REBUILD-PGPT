# Security and privacy model

| Control | Implementation | Limit |
|---|---|---|
| Login | per-person PIN (4 or 6 digits), PBKDF2-SHA-256 150,000 rounds + salt; optional fingerprint unlock; PIN re-check for risky actions; lock after idle | Shared phones rely on the PIN |
| Roles | `validate()` on every action and every imported record (212 event types) | Not server-enforced (R-1) |
| Separation of duties | author ≠ approver; recorder ≠ confirmer; approver ≠ payer; inspector did not work on the job; Admin cannot approve own request; capacity exception = Head Quarter | — |
| Signed records | ECDSA P-256 key per person per phone; second phone approval; files signed | First file on a brand-new phone is trusted |
| Data minimisation | person files carry only their projects; other PINs stripped; supplier/partner/tech masked fields; marketplace cards area-only | — |
| Outside companies | access log, copy/print block, blur in app switcher, name watermark | Screenshots cannot be blocked in a browser |
| Transport/server | AES-GCM per box, server stores ciphertext; tokens derived per box; server-recorded sender bound to the file on the office phone; server settings in files signed by Head Quarter/Admin (build 110); push subscriptions owner-only; person send limit | Server cannot check business rules (encrypted by design); see `SERVER_SIDE_REVIEW.md` |
| Injection | all values escaped (`esc`, `hx`); CSP: `default-src 'self'`, `script-src` = SHA-256 of the app script + unpkg (Leaflet with SRI), `object-src`/`frame-src`/`base-uri`/`form-action` none (`tools/csp.js`) | `style-src 'unsafe-inline'` (inline styles); `connect-src https:` for the office's server |
| Consent | privacy notice (DPDP Act 2023 wording, lawyer to confirm); finance consent separate with version; contact sharing with partner only after consent | Retention/deletion policy to be set by HQ |
| Honesty | Connections screen shows every outside service as Not connected / by hand; practice banner on every screen | — |

No secrets are stored in the source: payment details are company settings entered by the HQ; the optional server URL in `server.json` is public. `android/aiec-test.jks` is a test key (R-8).
