/* Company-server settings in a file (server address and company key) are taken only with a valid Head Quarter / Admin
   signature over them (rebuild). Before, the file signature covered only the records, so a forged or altered file
   could point an office phone at another server. Also: a message from a person's server box must be that person's
   own file. Real company data (signing is on). */
const { launch } = require('./lib');
const assert = (c, m) => { if (!c) throw new Error('ASSERT: ' + m); console.log('ok -', m); };
const setup = async () => { const L = await launch(); await L.page.evaluate(async () => { App.set.lang = 'en'; LANG = 'en'; App.set.introDone = true; App.set.guide = false; App.set.mode = 'real'; await loadMode('real'); }); return L; };
const imp = (page, pack, opts) => page.evaluate(async ([txt, o]) => importText(txt, o || {}), [JSON.stringify(pack), opts || null]);
(async () => {
  const A = await setup(), pa = A.page;
  await pa.evaluate(async () => { App.form = { org: 'Test Lifts', name: 'Asha Owner', pin1: '123456', pin2: '123456' }; await ACT.createOrg(); });
  await pa.waitForTimeout(1500);
  const owner = await pa.evaluate(() => App.me.uid);
  const ck = () => pa.evaluate(() => b64(crypto.getRandomValues(new Uint8Array(32))));
  /* a genuine Owner file whose records are signed, with server settings added after signing (as an attacker would) */
  const base = await pa.evaluate(() => finishPack(exportPack('full')));
  assert(!!base.sig, 'the Owner\'s full file is signed');
  const evil = Object.assign(JSON.parse(JSON.stringify(base)), { sync: { url: 'https://evil.example.com', ck: await ck() } });
  const R1 = await setup();
  const r1 = await imp(R1.page, evil);
  assert(r1.ok && r1.syncRefused === true && !(await R1.page.evaluate(() => Sync.cfg())), 'server settings without the Head Quarter\'s signature are refused (the records still load)');

  /* the same settings signed by the Owner are taken */
  const good = await pa.evaluate(async c => { const p = await finishPack(exportPack('full')); p.sync = { url: 'https://sync.example.in', ck: c }; await Sign.signSync(p); return p; }, await ck());
  assert(!!good.ssig, 'the office signs the server settings it puts in a file');
  const R2 = await setup();
  const r2 = await imp(R2.page, good);
  assert(r2.ok && !r2.syncRefused && await R2.page.evaluate(() => Sync.cfg() && Sync.cfg().url === 'https://sync.example.in' && Sync.cfg().role === 'office'), 'signed server settings are taken by a new office phone');

  /* changing the address after signing breaks the signature */
  const changed = Object.assign(JSON.parse(JSON.stringify(good)), {}); changed.sync.url = 'https://evil.example.com';
  const R3 = await setup();
  const r3 = await imp(R3.page, changed);
  assert(r3.syncRefused === true && !(await R3.page.evaluate(() => Sync.cfg())), 'a signed file whose server address was changed is refused');

  /* a signature by someone who is not Head Quarter / Admin does not count */
  await pa.evaluate(async () => { const salt = 'abc'; await perform('USER_ADDED', null, { uid: 'UTECH1', name: 'Ravi Tech', role: 'tech', salt, pin: await pinHash('1111', salt) }); });
  await pa.evaluate(async () => { App.form.pin = '1111'; await tryPin('UTECH1'); }); await pa.waitForTimeout(1200);
  const byTech = await pa.evaluate(async c => { const p = await finishPack(exportPack('full')); p.by = 'UTECH1'; p.sync = { url: 'https://evil.example.com', ck: c }; await Sign.signSync(p); return p; }, await ck());
  const R4 = await setup();
  const r4 = await imp(R4.page, byTech);
  assert(!(await R4.page.evaluate(() => Sync.cfg())), 'server settings signed by a technician are never taken');

  /* a person's server box can only carry that person's own file */
  await pa.evaluate(uid => { App.me = S.users[uid]; }, owner);
  const asOwner = await pa.evaluate(() => finishPack(exportPack('full')));
  const r5 = await imp(pa, asOwner, { from: 'UTECH1' });
  assert(r5.ok === false, 'a message from a technician\'s box that claims to be the Owner\'s file is refused');
  const r6 = await imp(pa, asOwner, { from: 'office' });
  assert(r6.ok === true, 'the same file from an office box is read normally');

  const errs = A.errors.concat(R1.errors, R2.errors, R3.errors, R4.errors).filter(e => !/net::|Failed to fetch|ERR_|nominatim|CORS policy|leaflet/i.test(e));
  assert(!errs.length, 'no page errors' + (errs.length ? ': ' + errs.slice(0, 2).join(' | ') : ''));
  for (const L of [A, R1, R2, R3, R4]) await L.browser.close();
  console.log('SYNC FORGERY PASSED');
})().catch(e => { console.error('FAILED', e.message); process.exit(1); });
