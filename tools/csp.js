/* Writes the Content-Security-Policy of AIEC-Elevator-OS.html. The app is one inline script, so script-src allows
   exactly that script by its SHA-256 (plus the map library from unpkg, which also carries an integrity hash).
   Any edit to the script changes its hash: run `npm run csp` after editing, or the app will not start and
   `npm run check` fails with "the security policy matches the app script".
   Usage: node tools/csp.js [--check] */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const FILE = path.join(__dirname, '..', 'AIEC-Elevator-OS.html');
const policy = hash => [
  "default-src 'self'",
  `script-src 'sha256-${hash}' https://unpkg.com`,
  "style-src 'self' 'unsafe-inline' https://unpkg.com",
  "img-src 'self' data: blob: https://tile.openstreetmap.org https://unpkg.com",
  "media-src 'self' data: blob:",
  /* the company server is any https address the office types (and a local test server) */
  "connect-src 'self' https: http://127.0.0.1:* http://localhost:* data: blob:",
  "font-src 'self' data:", "worker-src 'self'", "manifest-src 'self'", "frame-src 'none'",
  "object-src 'none'", "base-uri 'none'", "form-action 'none'"
].join('; ');
const scriptHash = html => { const m = html.match(/<script>([\s\S]*?)<\/script>/); if (!m) throw new Error('no inline script'); return crypto.createHash('sha256').update(m[1], 'utf8').digest('base64'); };
const META = /<meta http-equiv="Content-Security-Policy" content="[^"]*">/;
function expected(html) { return `<meta http-equiv="Content-Security-Policy" content="${policy(scriptHash(html))}">`; }
module.exports = { expected, scriptHash, META };
if (require.main === module) {
  const html = fs.readFileSync(FILE, 'utf8');
  if (!META.test(html)) { console.error('no CSP meta tag found'); process.exit(1); }
  const cur = html.match(META)[0], want = expected(html);
  if (process.argv.includes('--check')) { console.log(cur === want ? 'CSP OK' : 'CSP STALE: run npm run csp'); process.exit(cur === want ? 0 : 1); }
  fs.writeFileSync(FILE, html.replace(META, want));
  console.log(cur === want ? 'CSP already current' : 'CSP updated: sha256-' + scriptHash(html));
}
