/* Dumps the app's live rule tables (event types with roles and stages, screens, wizards, menus, default business
   rules, stages) to JSON, for docs/architecture. Usage: node tools/dump-facts.js [out.json]; then python3 tools/gen-permission-docs.py */
const { launch } = require('../tests/lib');
const fs = require('fs');
const path = require('path');
const OUTF = process.argv[2] || path.join(__dirname, '..', 'docs', 'architecture', 'facts.json');
(async () => {
  const { browser, page } = await launch();
  await page.evaluate(() => { App.set.lang = 'en'; LANG = 'en'; App.set.introDone = true; enterPractice(); }); await page.waitForTimeout(7000);
  const d = await page.evaluate(() => ({
    rules: Object.entries(RULES).map(([k, r]) => ({ type: k, roles: r.roles, stages: r.stages || null, project: !!r.project, open: !!r.open, gate: !!r.gate, label: t('ev_' + k) })),
    screens: Object.keys(SCREENS), wiz: Object.keys(WIZ), nav: NAV, config: DEFAULT_CONFIG, groups: RULE_GROUPS, stages: STAGES, phases: PHASES,
    highRisk: HIGH_RISK, live: LIVE_STAGES, roles: Object.keys(ROLE_ICON), outsiders: typeof OUTSIDERS !== 'undefined' ? OUTSIDERS : null,
    kv: KV.mode, evCount: EVENTS.length, users: Object.values(S.users).map(u => [u.uid, u.name, u.role]),
    projects: Object.values(S.projects).map(P => [P.id, P.stage, P.model || 'aiec', jobSize(P)]),
    words: Object.keys(L).length
  }));
  fs.writeFileSync(OUTF, JSON.stringify(d, null, 1));
  console.log(d.rules.length, 'event types', d.screens.length, 'screens', d.wiz.length, 'wizards', d.words, 'words');
  await browser.close();
})();
