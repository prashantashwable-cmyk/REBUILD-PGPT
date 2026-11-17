/* Screenshots of every role's main screens in Marathi, Hindi and English, on a 390 px phone (and 320 px for the
   home screens). Usage:
     node tests/shots-roles.js [app.html] [outDir] [--dsf=2] [--langs=en,hi,mr]
   Defaults: the app in this repository, tests/out/roles, device scale 1, all three languages.
   Writes PNGs plus an index.html contact sheet, and fails if a screen scrolls sideways, a word key is missing,
   or the page throws an error. Used for before/after comparison of the rebuild. */
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');
const args = process.argv.slice(2);
const pos = args.filter(a => !a.startsWith('--'));
const opt = k => (args.find(a => a.startsWith('--' + k + '=')) || '').split('=')[1];
const APPFILE = path.resolve(pos[0] || path.join(__dirname, '..', 'AIEC-Elevator-OS.html'));
const DIR = path.resolve(pos[1] || path.join(__dirname, 'out', 'roles'));
const DSF = +(opt('dsf') || 1);
const LANGS = (opt('langs') || 'mr,hi,en').split(',');
fs.rmSync(DIR, { recursive: true, force: true }); fs.mkdirSync(DIR, { recursive: true });

(async () => {
  const browser = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--allow-file-access-from-files'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, geolocation: { latitude: 18.5204, longitude: 73.8567, accuracy: 10 }, timezoneId: 'Asia/Kolkata', permissions: ['geolocation', 'camera', 'microphone'], deviceScaleFactor: DSF });
  await ctx.route(/^https:\/\/(unpkg\.com|tile\.openstreetmap\.org)\//, r => r.abort('internetdisconnected'));
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push('console: ' + m.text()); });
  await page.goto('file://' + APPFILE);
  await page.waitForTimeout(500);
  const ev = (f, a) => page.evaluate(f, a);
  await ev(() => { App.set.devNoInstallGate = true; App.set.lang = 'en'; LANG = 'en'; App.set.introDone = true; App.set.guide = false; });
  await ev(() => { window.__miss = new Set(); const o = t; window.t = (k, v) => { if (!L[k]) window.__miss.add(k); return o(k, v); }; });
  await ev(() => enterPractice()); await page.waitForTimeout(7000);
  const problems = [], made = [];
  const login = async uid => { await ev(uid => { loginAs(S.users[uid]); ACT.permsDone(); Notify.hide(); App.lastErr = null; closeSheet(); W = null; App.form = {}; go('home'); }, uid); await page.waitForTimeout(250); };
  const check = async name => {
    const r = await ev(() => { const sw = document.documentElement.scrollWidth, w = window.innerWidth; return sw > w + 1 ? `${sw}>${w}` : ''; });
    if (r) problems.push(`${name}: scrolls sideways ${r}`);
  };
  const shot = async (group, name, set, langs = LANGS, width = 390) => {
    if (width !== 390) await page.setViewportSize({ width, height: 844 });
    for (const l of langs) {
      await ev(l => { LANG = l; App.set.lang = l; }, l);
      await set(); await page.waitForTimeout(300);
      await ev(() => { const el = document.getElementById('toast'); if (el) el.innerHTML = ''; Notify.hide && Notify.hide(); });
      const file = `${group}_${name}${width !== 390 ? '_' + width : ''}_${l}.png`;
      await check(file);
      await page.screenshot({ path: path.join(DIR, file) });
      made.push({ group, file, label: `${name} ${width !== 390 ? width + 'px ' : ''}(${l})` });
    }
    if (width !== 390) await page.setViewportSize({ width: 390, height: 844 });
    await ev(() => { LANG = 'en'; App.set.lang = 'en'; closeSheet(); });
  };
  const goS = (name, p) => async () => { await ev(([n, p]) => { closeSheet(); W = null; go(n, p || {}); window.scrollTo(0, 0); }, [name, p]); };

  /* front door */
  await shot('A', 'welcome', async () => { await ev(() => { App.me = null; go('welcome'); }); });
  await shot('A', 'login', async () => { await ev(() => { App.me = null; go('login'); }); });
  await shot('A', 'staff_door', async () => { await ev(() => { App.me = null; go('door', { kind: 'staff' }); }); });
  await shot('A', 'pin', async () => { await ev(() => { App.me = null; go('pin', { uid: 'PTECH' }); }); }, ['en']);

  const roles = [['POWNER', 'owner'], ['PADMIN', 'admin'], ['PSALES', 'sales'], ['PFIELD', 'field'], ['PFIN', 'finance'], ['PQC', 'qc'], ['PSUP', 'supplier'], ['PPART1', 'partner'], ['PTECH', 'tech'], ['PCUST', 'customer']];
  for (const [uid, n] of roles) {
    await login(uid);
    await shot('B', n + '_home', goS('home'));
    await shot('B', n + '_home', goS('home'), ['en'], 320);
  }
  /* project screens */
  await login('PADMIN');
  const pid = await ev(() => (Object.values(S.projects).find(P => P.stage === 'install') || Object.values(S.projects)[0]).id);
  await shot('C', 'project_admin', goS('project', { pid }));
  await shot('C', 'me_admin', goS('me'), ['en']);
  await login('PCUST');
  const cp = await ev(() => visibleProjects(App.me)[0] && visibleProjects(App.me)[0].id);
  if (cp) await shot('C', 'project_customer', goS('project', { pid: cp }));
  await login('PTECH');
  await shot('C', 'tech_me', goS('me'), ['en']);

  const miss = await ev(() => [...window.__miss]);
  if (miss.length) problems.push('missing words: ' + miss.join(', '));
  const html = `<!doctype html><meta charset="utf-8"><title>AIEC screens</title><style>body{font-family:system-ui;background:#0f1726;color:#eee;margin:16px}h2{color:#d4a640}figure{display:inline-block;margin:6px;width:200px;vertical-align:top}img{width:200px;border:1px solid #333;border-radius:8px}figcaption{font-size:12px}</style><h1>AIEC Elevator OS — ${path.basename(APPFILE)}</h1>` +
    [...new Set(made.map(m => m.group))].map(g => `<h2>${g}</h2>` + made.filter(m => m.group === g).map(m => `<figure><a href="${m.file}"><img src="${m.file}" loading="lazy"></a><figcaption>${m.label}</figcaption></figure>`).join('')).join('');
  fs.writeFileSync(path.join(DIR, 'index.html'), html);
  await browser.close();
  console.log(`${made.length} screenshots in ${DIR}`);
  const bad = problems.concat(errors);
  if (bad.length) { console.log('PROBLEMS:\n' + bad.join('\n')); process.exit(1); }
  console.log('SHOTS OK');
})().catch(e => { console.error(e); process.exit(1); });
