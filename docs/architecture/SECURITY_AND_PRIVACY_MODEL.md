# Security and privacy model

| Control | Implementation | Limit |
|---|---|---|
| Login | per-person PIN (4 or 6 digits), PBKDF2-SHA-256 150,000 rounds + salt; optional fingerprint unlock; PIN re-check for risky actions; lock after idle | Shared phones rely on the PIN |
| Roles | `validate()` on every action and every imported record (212 event types) | Not server-enforced (R-1) |
| Separation of duties | author ≠ approver; recorder ≠ confirmer; approver ≠ payer; inspector did not work on the job; Admin cannot approve own request; capacity exception = Head Quarter | — |
| Signed records | ECDSA P-256 key per person per phone; second phone approval; files signed | First file on a brand-new phone is trusted |
| Data minimisation | person files carry only their projects; other PINs stripped; supplier/partner/tech masked fields; marketplace cards area-only | — |
| Outside companies | access log, copy/print block, blur in app switcher, name watermark | Screenshots cannot be blocked in a browser |
| Transport/server | AES-GCM per box, server stores ciphertext; tokens derived per box | Server must be operated securely |
| Injection | all values escaped (`esc`, `hx`); restrictive `object-src`, `base-uri`, `form-action` | No `script-src` CSP yet (R-7) |
| Consent | privacy notice (DPDP Act 2023 wording, lawyer to confirm); finance consent separate with version; contact sharing with partner only after consent | Retention/deletion policy to be set by HQ |
| Honesty | Connections screen shows every outside service as Not connected / by hand; practice banner on every screen | — |

No secrets are stored in the source: payment details are company settings entered by the HQ; the optional server URL in `server.json` is public. `android/aiec-test.jks` is a test key (R-8).
