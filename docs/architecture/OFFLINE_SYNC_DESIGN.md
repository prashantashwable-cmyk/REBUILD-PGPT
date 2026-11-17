# Offline and sync design

## Local first
* Every action is saved on the phone first (IndexedDB; localStorage / memory fallbacks). Work never waits for a network.
* Drafts of every wizard are saved automatically; ← never loses work.
* Media is stored separately from events (`m:<id>`), referenced by id and SHA-256.
* Persistent storage is requested in the installed app; a storage warning appears before space runs out; old photos can be archived to a file.

## Moving records between phones
1. **Files (no server):** full company file (office), file for one person, "send my updates". Imports re-validate every record and check signatures; practice and real files never mix.
2. **Company server (optional):** office phones and each person's box, AES-GCM encrypted end to end; ticks every minute and a few seconds after each action; cursor-based pulls; ids already sent are remembered (`syncSent`), so retries never duplicate.

## Status the user sees (new in the rebuild)
The greeting card on every staff home shows a small chip: a dot and one word (Practice, On this phone, Not synced, Waiting, Synced, Sync failed, Refused, ⏰ when stale, ⚠️ n for rejected entries). Screen readers hear the full sentence; tapping opens it with links to Refused entries and Connections. The chip adds no height to the home screen (build 111). Full sentences:

| State | Shown text |
|---|---|
| Practice | Practice: saved on this phone only. Nothing is sent anywhere. |
| No server | Saved on this phone · no company server connected (send files to share) |
| Server, never synced | Saved on this phone · not synced yet |
| Offline / waiting | Saved on this phone · waiting to sync |
| Last sync OK | Received by server · last sync {time} (+ "Last sync was N day(s) ago" after 3 days) |
| Error | Saved on this phone · sync failed, will try again |
| Revoked | The server refused this phone · ask the office |
| Rejected records (office) | "{n} entries rejected" → Refused entries |

"Received by server" is deliberately not "verified": money, approvals, QC and licences become confirmed only by their own events from the right person.

## Conflicts
Events are append-only, so two phones never overwrite each other. Conflicting actions (e.g. two people confirming the same payment) are resolved by validation order: the second becomes a refused entry with its reason, visible to the office. Safety and money facts are never overwritten by stale state.

## Limits
Web apps cannot sync while closed (periodic background sync at most ~hourly on Android). Server-received time is not yet stored per record (R-6).
