/* Rebuild (Nov 2026) checks against the master rebuild prompt: honest milestone progress (no stage-count percentage),
   the installation target as an estimate per job size (big jobs never inherit the 14-day standard), Pune-only pilot
   geography by default, the owner-approved working numbers (5 live jobs, 2% marketplace commission), the sync status
   strip in words, the Connections screen that never claims an outside service is connected, and the v2 look in
   Marathi, Hindi and English. */
const { launch, miss } = require('./lib');
const assert = (c, m) => { if (!c) throw new Error('ASSERT: ' + m); console.log('ok -', m); };
(async () => {
  const { browser, page, errors } = await launch();
  await page.evaluate(() => { App.set.lang = 'en'; LANG = 'en'; App.set.introDone = true; App.set.guide = false; enterPractice(); }); await page.waitForTimeout(7000);
  const ev = f => page.evaluate(new Function('return (' + f + ')'));
  const act = (type, pid, data, as) => page.evaluate(([type, pid, data, as]) => perform(type, pid, data, { as, quiet: true }).then(r => ({ ok: r.ok, err: r.err && (r.err.k || r.err) })), [type, pid, data, as]);

  /* owner-approved working numbers */
  assert(await ev(`S.config.pilotCap === 5 && S.config.commRate === 2 && S.config.cityCode === 'PUN'`), 'pilot limit 5 live jobs, marketplace commission 2%, city code PUN');
  assert(await ev(`DEFAULT_CONFIG.serveAreas === 'Pune' && pgServed('Kothrud, Pune') && !pgServed('Pimpri, PCMC') && !pgServed('Nagpur')`), 'pilot geography is Pune only: PCMC and other cities are out of area until the Head Quarter adds them');
  assert(await ev(`groupOf('serveAreas') === 'privacy' && groupOf('installDaysComplex') === 'install'`), 'areas and target days are Head Quarter-approved rule groups');

  /* installation target per job size */
  const big = await ev(`Object.values(S.projects).find(P => jobSize(P) === 'big' && P.req).id`);
  const std = await ev(`Object.values(S.projects).find(P => jobSize(P) !== 'big' && P.req).id`);
  assert(await ev(`targetDays(S.projects['${std}']) === 14 && targetDays(S.projects['${big}']) === 28`), 'a standard job gets the 14-day estimate, a big or complex job 28 days (it never inherits the standard target)');
  assert((await act('CONFIG_SET', null, { key: 'installDaysComplex', value: 400 }, 'POWNER')).err, 'the complex target has a sane upper limit');
  assert((await act('CONFIG_SET', null, { key: 'installDaysComplex', value: 35 }, 'PSALES')).err, 'Sales cannot change the target');
  assert((await act('CONFIG_SET', null, { key: 'installDaysComplex', value: 35 }, 'POWNER')).ok && await ev(`targetDays(S.projects['${big}']) === 35 && targetDays(S.projects['${std}']) === 14`), 'the Head Quarter can change the complex target without touching the standard one');
  await page.evaluate(() => { loginAs(S.users.PADMIN); ACT.permsDone(); Notify.hide(); });
  const inst = await ev(`(Object.values(S.projects).find(P => P.mhand && !P.done && P.stage !== 'amc') || {}).id`);
  await page.evaluate(pid => go('project', { pid }), inst); await page.waitForTimeout(300);
  let txt = await page.innerText('main');
  assert(/estimate, not a guaranteed date/.test(txt) && /starts only when the site is ready/.test(txt), 'the project shows the target as an estimate with its start conditions');
  const body = await page.innerText('body');
  assert(/Milestones verified: \d of 7/.test(body) && !/Job \d+% done/.test(body), 'progress counts verified milestones, never a stage-count percentage');
  const qhtml = await ev(`docQuote(S.projects['${std}'], 1)`);
  assert(/not a guaranteed date/.test(qhtml), 'the quotation says the installation time is an estimate');

  /* sync status in words */
  await page.evaluate(() => go('home')); await page.waitForTimeout(200);
  assert(/Practice: saved on this phone only/.test(await page.innerText('.hero')), 'practice mode says nothing leaves the phone');
  const st = await page.evaluate(() => {
    const out = {}, mode = App.mode, cfg = Sync.cfg, state = Sync.state; App.mode = 'real';
    Sync.cfg = () => null; out.none = syncStatus().k;
    Sync.cfg = () => ({ url: 'https://x', role: 'office' }); Sync.state = null; out.never = syncStatus().k;
    Sync.cfg = () => ({ url: 'https://x', role: 'office', last: new Date().toISOString() }); Sync.state = { st: 'ok' }; out.ok = syncStatus().k + '|' + syncStatus().cls;
    Sync.cfg = () => ({ url: 'https://x', role: 'office', last: new Date(Date.now() - 5 * 864e5).toISOString() }); out.stale = syncStatus().stale;
    Sync.state = { st: 'err' }; out.err = syncStatus().k; Sync.state = { st: 'revoked' }; out.rev = syncStatus().k; Sync.state = { st: 'wait' }; out.wait = syncStatus().k;
    App.mode = mode; Sync.cfg = cfg; Sync.state = state; return out;
  });
  assert(st.none === 'ss_local' && st.never === 'ss_never' && st.ok === 'ss_ok|s-ok' && st.stale === 5 && st.err === 'ss_err' && st.rev === 'ss_revoked' && st.wait === 'ss_wait', 'sync status: no server, never synced, received by server, stale, failed, refused, waiting: ' + JSON.stringify(st));
  assert(await ev(`(() => { App.me = S.users.PCUST; const h = syncStrip(App.me); App.me = S.users.PADMIN; return h === ''; })()`), 'customers do not see the internal sync strip');

  /* connections: never claims an outside service */
  await page.evaluate(() => go('me')); await page.waitForTimeout(200);
  assert(!!(await page.$('[data-a="nav"][data-v="connections"]')), 'Me has the Connections screen');
  await page.evaluate(() => go('connections')); await page.waitForTimeout(300);
  txt = await page.innerText('main');
  assert(/Payment gateway\s*Not connected/.test(txt) && /WhatsApp Business.*\s*Not connected/.test(txt) && /Banks \/ NBFCs for finance\s*Not connected/.test(txt) && /e-Sign provider\s*Not connected/.test(txt), 'payment gateway, WhatsApp, lenders and e-sign are shown as Not connected');
  assert(/Company server \(sync\)\s*Not connected/.test(txt) && /nothing below is ever contacted/.test(txt), 'in practice even the company server is Not connected');
  assert(!/(Payment gateway|NBFC|e-Sign|WhatsApp Business)[^\n]*\n?\s*Connected/.test(txt), 'no outside service says Connected');

  /* partner states: Paused / Rejected / Offboarded block new jobs; Expired papers is worked out, never set by hand */
  const C = 'PPART1', post = await ev(`(Object.values(S.posts).find(p => jobWhyNot('PPART1', p) === null) || {}).id`);
  const pact = (status, reason) => act('PARTNER_STATUS_SET', null, { uid: C, status, reason }, 'PADMIN');
  assert(await ev(`P_STATUS.map(x => x[0]).join() === 'APPLIED,UNDER_REVIEW,VERIFIED,ACTIVE,CONDITIONAL,PAUSED,SUSPENDED,REJECTED,OFFBOARDED,TERMINATED'`), 'partner states include Paused, Rejected and Offboarded');
  assert((await act('PARTNER_STATUS_SET', null, { uid: C, status: 'EXPIRED', reason: 'x' }, 'PADMIN')).err === 'err_choose', '"Expired" cannot be set by hand');
  assert((await pact('PAUSED', 'Company asked for a 2-week break (festival)')).ok && !(await ev(`partnerTakes('${C}')`)) && (!post || await ev(`jobWhyNot('${C}', S.posts['${post}']) !== null`)), 'a Paused company gets no new jobs');
  assert(!(await ev(`Object.values(S.projects).some(P => P.partner === '${C}' && needs(P).some(n => n.k === 'partner_handover'))`)), 'pausing does not ask for a handover of open jobs');
  assert((await pact('OFFBOARDED', 'Left on agreed terms; final bill settled')).ok && await ev(`Object.values(S.projects).filter(P => P.partner === '${C}' && OPEN_STAGES.includes(P.stage)).every(P => needs(P).some(n => n.k === 'partner_handover'))`), 'an Offboarded company\'s open jobs get a handover task');
  assert((await pact('ACTIVE', 'Back after review')).ok && await ev(`partnerShown('${C}') === 'ACTIVE'`), 'the company can be made Active again with a reason');
  assert(await ev(`(() => { const l = licOf('${C}'), k = l.licExpiry; l.licExpiry = '2020-01-01'; const s = partnerShown('${C}'); l.licExpiry = k; return s === 'EXPIRED'; })()`), 'an Active company whose licence has ended shows "Expired papers"');

  /* KPI dictionary: every number on the board explains its formula and says how fresh it is */
  await page.evaluate(() => { loginAs(S.users.POWNER); ACT.permsDone(); Notify.hide(); go('kpi', { days: 30 }); }); await page.waitForTimeout(300);
  const kp = await page.evaluate(() => { const keys = kpiData(30).flatMap(([g, r]) => r.map(x => x[0])); return { keys, missing: keys.filter(k => !L['kf_' + k.slice(4)]), rows: document.querySelectorAll('details.kpid').length, asof: /As of .* counted from the records on this phone/.test(document.querySelector('main').innerText) }; });
  assert(kp.keys.length >= 18 && !kp.missing.length && kp.rows === kp.keys.length, `every KPI (${kp.keys.length}) has a written formula and opens to show it` + (kp.missing.length ? ': missing ' + kp.missing.join(',') : ''));
  assert(kp.asof, 'the board says when it was counted and where the numbers come from');
  await page.click('details.kpid >> nth=6'); await page.waitForTimeout(100);
  assert(/Recorded but unconfirmed payments are not counted/.test(await page.innerText('main')), 'opening a number shows how it is worked out');
  await page.evaluate(() => { loginAs(S.users.PADMIN); ACT.permsDone(); Notify.hide(); });

  /* three languages, v2 look */
  for (const l of ['hi', 'mr']) {
    await page.evaluate(l => { LANG = l; App.set.lang = l; go('connections'); }, l); await page.waitForTimeout(150);
    await page.evaluate(() => go('home')); await page.waitForTimeout(150);
  }
  await page.evaluate(() => { LANG = 'en'; App.set.lang = 'en'; });
  assert(await ev(`getComputedStyle(document.documentElement).getPropertyValue('--graph').trim() === '#102341'`), 'design system v2: deep navy foundation');
  assert(await ev(`(() => { const m = App.me; App.me = null; go('gate'); const f = document.body.classList.contains('front'); App.me = m; go('home'); return f && !document.body.classList.contains('front'); })()`), 'front-door screens get their own background, signed-in screens do not');
  const sw = await ev(`document.documentElement.scrollWidth <= window.innerWidth + 1`);
  assert(sw, 'no sideways scroll');
  const mm = await miss(page); assert(!mm.length, 'no missing words in English, Hindi or Marathi' + (mm.length ? ': ' + mm.join(' ') : ''));
  const errs = errors.filter(e => !/net::|Failed to fetch|ERR_|nominatim|CORS policy|leaflet/i.test(e)); assert(!errs.length, 'no page errors' + (errs.length ? ': ' + errs.slice(0, 2).join(' | ') : ''));
  await browser.close(); console.log('REBUILD PASSED');
})().catch(e => { console.error('FAILED', e.message); process.exit(1); });
