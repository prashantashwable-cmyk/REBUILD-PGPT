#!/usr/bin/env python3
"""Generates docs/architecture/ROLE_PERMISSION_MATRIX.md from docs/architecture/facts.json (made by tools/dump-facts.js).
The matrix is the app's own RULES table: the same table validate() enforces on every action and every imported record."""
import json, os, sys
root = os.path.join(os.path.dirname(__file__), '..')
d = json.load(open(sys.argv[1] if len(sys.argv) > 1 else os.path.join(root, 'docs', 'architecture', 'facts.json')))
ROLES = ['owner', 'admin', 'sales', 'field', 'finance', 'qc', 'supplier', 'partner', 'tech', 'customer']
SHORT = {'owner': 'HQ', 'admin': 'Adm', 'sales': 'Sal', 'field': 'Fld', 'finance': 'Fin', 'qc': 'QC', 'supplier': 'Sup', 'partner': 'LPC', 'tech': 'Tec', 'customer': 'Cus'}
rows = sorted(d['rules'], key=lambda r: r['type'])
out = ['# Role permission matrix (generated)', '',
       'Generated from the app\'s own `RULES` table by `tools/dump-facts.js` + `tools/gen-permission-docs.py`. Do not edit by hand.',
       'Each row is an event type (an action). ● = the role may perform it (subject to the extra checks in the last columns).',
       '`validate()` enforces this on every action **and again on every record imported from another phone or the server**; hiding a button is never the control.', '',
       'Extra checks: **Proj** = must be able to see the project (assignment / company / customer relationship), **Stages** = only in these lifecycle stages, **Gate** = an additional live condition (licence, payment, eligibility, separation of duties…), **2P** = second-person approval (high-risk).', '',
       'Abbreviations: ' + ', '.join(f'{SHORT[r]} = {r}' for r in ROLES) + '.', '',
       '| Event type | What it does | ' + ' | '.join(SHORT[r] for r in ROLES) + ' | Proj | Stages | Gate | 2P |',
       '|---|---|' + '---|' * len(ROLES) + '---|---|---|---|']
hr = set(d['highRisk'])
for r in rows:
    roles = r.get('roles') or []
    st = r.get('stages')
    stages = ('any' if not st else (', '.join(st) if len(st) <= 4 else f'{len(st)} stages'))
    lab = (r.get('label') or '').replace('|', '/')
    if lab.startswith('ev_'): lab = ''
    out.append(f"| `{r['type']}` | {lab} | " + ' | '.join('●' if x in roles else '' for x in ROLES) + f" | {'✓' if r.get('project') and not r.get('open') else ''} | {stages if r.get('project') else ''} | {'✓' if r.get('gate') else ''} | {'✓' if r['type'] in hr else ''} |")
counts = {x: sum(1 for r in rows if x in (r.get('roles') or [])) for x in ROLES}
out += ['', '## Totals', '', '| Role | Event types allowed |', '|---|---|'] + [f'| {x} | {counts[x]} |' for x in ROLES]
out += ['', f"Total event types: {len(rows)}. High-risk (second person, or Head Quarter for capacity exceptions): {', '.join('`'+x+'`' for x in d['highRisk'])}.", '',
        '## Menus per role (bottom navigation)', '', '| Role | Menu |', '|---|---|'] + [f"| {k} | {' · '.join(i[0] for i in v)} |" for k, v in d['nav'].items()]
open(os.path.join(root, 'docs', 'architecture', 'ROLE_PERMISSION_MATRIX.md'), 'w').write('\n'.join(out) + '\n')
print('written', len(rows), 'rows')
