/* Server hardening (rebuild): a phone may change only its own push-alert subscription; a person's phone has its own,
   lower limit for sending to the office inbox; the server records which box each message came from (never what the
   phone claims), which the office phone then checks against the file inside. */
const assert = (c, m) => { if (!c) throw new Error('ASSERT: ' + m); console.log('ok -', m); };
(async () => {
  const { handle, memoryStore, sha256hex } = await import('../server/core.mjs');
  const store = memoryStore(), env = { PUSH_TEST_HOST: 'push.test' }, tok = 'o'.repeat(40), a = 'a'.repeat(40), b = 'b'.repeat(40);
  const call = (method, path, body, headers = {}) => handle(new Request('http://x' + path, { method, headers: Object.assign({ 'Content-Type': 'application/json' }, headers), body: body ? JSON.stringify(body) : undefined }), env, store);
  const O = { Authorization: 'Bearer ' + tok }, A = { Authorization: 'Bearer ' + a, 'X-Box': 'UA' }, B = { Authorization: 'Bearer ' + b, 'X-Box': 'UB' };
  await call('POST', '/setup', { officeHash: await sha256hex(tok) });
  await call('PUT', '/box/UA', { hash: await sha256hex(a) }, O); await call('PUT', '/box/UB', { hash: await sha256hex(b) }, O);

  /* push subscriptions */
  const ep = 'http://push.test/ep/phone-a';
  assert((await call('POST', '/push-sub', { endpoint: ep }, A)).status === 200 && store.subs.get(ep) === 'UA', 'a phone subscribes its own box to alerts');
  assert((await call('POST', '/push-sub', { endpoint: ep }, B)).status === 403 && store.subs.get(ep) === 'UA', 'another person cannot take over that subscription');
  assert((await call('DELETE', '/push-sub', { endpoint: ep }, B)).status === 403 && store.subs.has(ep), 'another person cannot remove it');
  assert((await call('DELETE', '/push-sub', { endpoint: ep }, A)).status === 200 && !store.subs.has(ep), 'the phone itself can remove it');
  await call('POST', '/push-sub', { endpoint: ep }, A);
  assert((await call('DELETE', '/push-sub', { endpoint: ep }, O)).status === 200 && !store.subs.has(ep), 'the office can tidy any subscription');

  /* sender is set by the server */
  const s = await call('POST', '/send/inbox', { blob: 'abc.def', from: 'office' }, A);
  assert(s.status === 200 && store.msgs[store.msgs.length - 1].frm === 'UA', 'the server records the real sender box, whatever the body claims');
  assert((await call('POST', '/send/UB', { blob: 'abc.def' }, A)).status === 403, 'a person cannot write into another person\'s box');

  /* person send limit */
  let last; for (let i = 0; i < 61; i++) last = await call('POST', '/send/inbox', { blob: 'abc.def' }, B);
  assert(last.status === 429, 'a person\'s phone cannot flood the office inbox (60 a minute)');
  let off; for (let i = 0; i < 61; i++) off = await call('POST', '/send/inbox', { blob: 'abc.def' }, O);
  assert(off.status === 200, 'office phones keep the higher limit');
  console.log('SERVER HARDENING PASSED');
})().catch(e => { console.error('FAILED', e.message); process.exit(1); });
