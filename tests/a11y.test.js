/* Accessibility (WCAG 2.0/2.1 level A and AA, by axe-core) on the main screens of every kind of user, in all five
   themes and all three languages: front door, Head Quarter, technician, customer, sales, KPI board, Connections, Me and
   the project list. The faint name watermark shown to outside companies is decorative (aria-hidden) and is skipped. */
const fs = require('fs');
const { launch } = require('./lib');
const assert = (c, m) => { if (!c) throw new Error('ASSERT: ' + m); console.log('ok -', m); };
(async () => {
  const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  const { browser, page, errors } = await launch();
  await page.evaluate(() => { App.set.lang = 'en'; LANG = 'en'; App.set.introDone = true; App.set.guide = false; enterPractice(); }); await page.waitForTimeout(7000);
  await page.evaluate(AXE);
  const screens = [['gate', null], ['home', 'POWNER'], ['home', 'PTECH'], ['home', 'PCUST'], ['home', 'PSALES'], ['kpi', 'POWNER'], ['connections', 'PADMIN'], ['me', 'PADMIN'], ['projects', 'PADMIN']];
  /* every screen in every theme in English; every screen in Hindi and Marathi in the default and dark themes */
  const runs = [];
  for (const th of ['light', 'color', 'dark', 'contrast']) for (const s of screens) runs.push([th, 'en', ...s]);
  for (const l of ['hi', 'mr']) for (const th of ['light', 'dark']) for (const s of screens) runs.push([th, l, ...s]);
  const bad = [];
  for (const [theme, l, scr, uid] of runs) {
    await page.evaluate(([scr, uid, l, theme]) => { LANG = l; App.set.lang = l; App.set.theme = theme; applyTheme(); closeSheet(); W = null; if (uid) { loginAs(S.users[uid]); ACT.permsDone(); Notify.hide(); } else App.me = null; go(scr); }, [scr, uid, l, theme]);
    await page.waitForTimeout(150);
    const v = await page.evaluate(async () => (await axe.run({ exclude: [['.wm']] }, { runOnly: ['wcag2a', 'wcag2aa'], resultTypes: ['violations'], preload: false })).violations.map(x => `${x.id}: ${x.nodes[0].target.join(' ')}`));
    if (v.length) bad.push(`${theme}/${l}/${scr}/${uid || '-'}: ${v.slice(0, 3).join(' | ')}`);
  }
  assert(!bad.length, `no WCAG 2 A/AA violations in ${runs.length} screen checks` + (bad.length ? ':\n  ' + bad.slice(0, 8).join('\n  ') : ''));
  await page.evaluate(() => { App.set.theme = 'auto'; applyTheme(); });
  const errs = errors.filter(e => !/net::|Failed to fetch|ERR_|nominatim|CORS policy|leaflet/i.test(e)); assert(!errs.length, 'no page errors' + (errs.length ? ': ' + errs.slice(0, 2).join(' | ') : ''));
  await browser.close(); console.log('A11Y PASSED');
})().catch(e => { console.error('FAILED', e.message); process.exit(1); });
