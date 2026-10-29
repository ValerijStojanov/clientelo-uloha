// Report lievika z first-party udalostí: node tools/funnel.mjs server-data/events.jsonl
// Každý krok = podiel relácií (sid), ktoré udalosť aspoň raz poslali, podľa varianty.
import { readFileSync } from 'node:fs';

const file = process.argv[2] || 'server-data/events.jsonl';
const rows = readFileSync(file, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));

const STEPS = [
  ['page_view', 'Príchod'],
  ['engaged_10s', 'Zostal 10 s'],
  ['calc_interact', 'Použil kalkulačku'],
  ['section_view:compare', 'Videl porovnanie'],
  ['form_view', 'Videl formulár'],
  ['form_start', 'Klikol do e-mailu'],
  ['lead', 'Odoslal e-mail (LEAD)'],
  ['newsletter_optin', 'Súhlas s tipmi'],
  ['post_survey', 'Odpovedal na anketu'],
  ['phone_submit', 'Nechal telefón'],
];

const sessions = new Map();
for (const r of rows) {
  if (!sessions.has(r.sid)) sessions.set(r.sid, { variant: r.variant, ev: new Map() });
  const s = sessions.get(r.sid);
  const key = r.name === 'section_view' ? `section_view:${r.props?.id}` : r.name;
  if (!s.ev.has(key)) s.ev.set(key, r.t);
  if (r.name === 'form_error') s.errors = (s.errors || 0) + 1;
}

const variants = [...new Set([...sessions.values()].map((s) => s.variant))].sort();
for (const v of variants) {
  const list = [...sessions.values()].filter((s) => s.variant === v);
  const n = list.filter((s) => s.ev.has('page_view')).length;
  console.log(`\nVarianta ${v.toUpperCase()} — ${n} relácií`);
  let prev = n;
  for (const [key, label] of STEPS) {
    const k = list.filter((s) => s.ev.has(key)).length;
    const ofAll = n ? ((k / n) * 100).toFixed(1) : '0.0';
    const ofPrev = prev ? ((k / prev) * 100).toFixed(0) : '–';
    console.log(`  ${label.padEnd(24)} ${String(k).padStart(5)}  ${ofAll.padStart(5)} %   (z predch. ${ofPrev} %)`);
    if (k) prev = k;
  }
  const leads = list.filter((s) => s.ev.has('lead'));
  if (leads.length) {
    const times = leads.map((s) => s.ev.get('lead')).sort((a, b) => a - b);
    const withCalc = leads.filter((s) => s.ev.has('calc_interact')).length;
    console.log(`  Medián času do leadu: ${times[Math.floor(times.length / 2)]} s; leady po kalkulačke: ${withCalc}/${leads.length}`);
  }
  const errs = list.filter((s) => s.errors).length;
  if (errs) console.log(`  Relácie s chybou formulára: ${errs}`);
}
