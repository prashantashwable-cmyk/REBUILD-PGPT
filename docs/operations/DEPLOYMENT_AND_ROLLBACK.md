# Deployment and Rollback

Applies to: AIEC Elevator OS (single file `AIEC-Elevator-OS.html`), pilot in Pune, Maharashtra.
Audience: whoever publishes the app (developer or technically able Admin). Head Quarter (Owner) approves a release.

## 1. What is deployed

| File | Purpose |
|---|---|
| `AIEC-Elevator-OS.html` | The whole app. Contains `APP_BUILD` (currently 107). |
| `sw.js` | Offline support. Contains the cache name `aiec-os-vNNN` (currently `aiec-os-v106`). |
| `manifest.webmanifest`, `icon.svg`, `icon-192.png`, `icon-512.png` | "Add to Home screen". |
| `index.html` | Redirects to the app. |

* There is **no build step**. The file you edit is the file you publish.
* Hosting is static (GitHub Pages). The optional company server (`server/`) is deployed separately; see `server/README.md`.
* Production (the `UNLIT-GPT-HTML` GitHub Pages site) is **not** overwritten by the rebuild. The rebuild lives on branch `ccr-97b11475-gt4r3h` in `prashantashwable-cmyk/REBUILD-PGPT`.
* Git tag `baseline-605575a` is the untouched original imported from `UNLIT-GPT-HTML` commit `605575a`. It is the last-resort rollback point.

## 2. Version bump rule

1. Every change to `AIEC-Elevator-OS.html` that phones must receive needs a new version number.
2. Set `APP_BUILD = N` in `AIEC-Elevator-OS.html`.
3. Set `const CACHE = 'aiec-os-vN'` in `sw.js` to the **same N**.
4. A static test (`tests/static.test.js`, run by `npm run check`) fails if the two differ. Do not work around it.
5. **After any edit to the script (including the build number), run `npm run csp`.** The security policy allows only the script whose SHA-256 it names; a stale hash stops the app from starting. `npm run check` fails with "the security policy matches the app script" until you do. A rollback to build 105 needs no hash (105 had no `script-src`); a rollback to 106+ must keep its own matching meta tag.
5. If `sw.js` does not change, phones keep the old cache and may not update.

## 3. Pre-release checks

1. [ ] Work is on a branch, reviewed by a second person.
2. [ ] Version bump done (section 2).
3. [ ] Install once: `npm install` and `npx playwright install chromium`.
4. [ ] Run all tests: `npm test` (static check, then every file listed in `tests/run-all.js`). Node 20 or newer.
5. [ ] Run the rebuild tests on their own: `node tests/rebuild.test.js`.
6. [ ] Run the role screenshots: `node tests/shots-roles.js`. Look at the images in `tests/out/` for every role (owner, admin, sales, field, finance, qc, supplier, partner, tech, customer): no overflow, no missing words in Marathi or Hindi, sync status strip visible on staff homes.
7. [ ] Open the file in a browser, sign in to **Practice mode**, run one lead-to-handover walk. Practice data is in a separate namespace and never sends messages or payments.
8. [ ] CI is green on the pull request (`.github/workflows/test.yml`: static, four browser shards, screens).
9. [ ] Anything in `PRODUCTION_READINESS_CHECKLIST.md` that is a gate for this release is signed off.

**Never deploy with a failing test.** A red test means do not ship the file to phones.

## 4. Deploy to GitHub Pages

1. Merge the approved pull request into the branch that Pages publishes (setting: repository Settings, Pages, Source: Deploy from a branch, `main`, `/ (root)`).
2. Wait for the Pages build to finish (Actions tab or Pages status).
3. Verify the live version (section 5).
4. Open the live address on one Android phone that has the app installed. Close and reopen the app twice (the service worker is network first and updates on the next load). The Me screen footer version must equal the new `APP_BUILD`.
5. Tell the office which version is live and what changed (one short message).

## 5. Verify the live `sw.js`

Replace `<site>` with the real published address (do not guess it).

```bash
curl -fsS "<site>/sw.js?t=$(date +%s)" | grep -o 'aiec-os-v[0-9]*' | head -1
grep -o 'aiec-os-v[0-9]*' sw.js | head -1
```

Both lines must be identical. The `live` job in `test.yml` does the same check against the published site for the original repository, and fails if GitHub Pages is not publishing (this happened on 7 November 2026 after the repository visibility was changed). If the versions differ: Pages is not publishing or is cached; re-check the Pages source setting, wait, retry. Do not tell users the release is live until they match.

## 6. Rollback

Phones keep working offline from their cache and from their own data, so a bad release can be reversed without losing records. Records are stored on the phones, not in the HTML file.

**When to roll back:** a screen fails to open, sign-in fails, records are refused wrongly, sync status shows widespread failures after the release, or a rule or payment screen shows wrong numbers.

1. [ ] Head Quarter or Admin decides to roll back and writes down the symptom and time.
2. [ ] Find the last good commit or tag (for example the previous release tag; `baseline-605575a` only if nothing newer is good).
3. [ ] Get **both** files from that commit: `AIEC-Elevator-OS.html` and `sw.js`. The previous `sw.js` carries the previous `aiec-os-vNNN`.
4. [ ] Check they match: `APP_BUILD` in the HTML equals the cache name in `sw.js`.
5. [ ] If the previous number is lower than the live one, make the rollback a **new, higher** build instead (copy the old code and set `APP_BUILD` and `CACHE` to live number + 1). Phones update when `sw.js` changes; a lower number can leave some phones on the newer cache.
6. [ ] Run `npm run check` (static) on the rolled-back files.
7. [ ] Publish through the normal path (section 4). Do not edit files on the server by hand.
8. [ ] Verify live `sw.js` (section 5).
9. [ ] On two phones: open the app, confirm version, open one real project, confirm record counts are unchanged (Me screen footer shows records).
10. [ ] Record the decision in the Owner decisions log (`OWNER_WEEKLY_REVIEW.md`).

### Rollback drill (do once before the pilot, then after any change to hosting)

1. [ ] Use a test copy of the site, not production.
2. [ ] Deploy build N (current). Install on a test phone, add Practice data.
3. [ ] Deploy build N+1 with a visible harmless change (for example a rule label). Confirm the phone shows N+1 after two opens.
4. [ ] Roll back as in steps 2 to 9 above. Confirm the phone returns to the intended code and the practice records are still there.
5. [ ] Record who did it, how long it took, and anything unclear. Target: under 30 minutes.

## 7. Android APK (optional)

* Workflow `.github/workflows/android.yml` builds the APK when files under `android/` change, or on demand (Actions, android, Run workflow). Download from the run page, Artifacts, `AIEC-Elevator-OS-apk`.
* The APK is signed with the fixed test key `android/aiec-test.jks`, so each build installs over the previous one. A signed Play Store build is made only if the company's keystore is added as repository secrets. Keep that key and its passwords out of the repository and keep an offline copy: losing it prevents updates.
* The APK does **not** replace the web release process: if the APK loads the hosted app, the hosting rules above still apply. Check what the APK actually loads before promising users that it updates itself.
* Test on a real Android phone (camera, GPS, offline) before sharing the APK. See `PRODUCTION_READINESS_CHECKLIST.md`.

## 8. What never to do

1. Never overwrite production (the original `UNLIT-GPT-HTML` Pages site) before the rebuild has passed the readiness checklist and the Owner has approved.
2. Never deploy with a failing test or a mismatch between `APP_BUILD` and `sw.js`.
3. Never change only one of the two version numbers.
4. Never delete the tag `baseline-605575a`.
5. Never put secrets (setup secret, recovery code, keystore passwords) in the repository, the HTML or chat messages.
6. Never test with real customers' data in Practice mode, and never mix Practice files with real files.
7. Never release late on Friday or just before a customer handover day without a person ready to roll back.
