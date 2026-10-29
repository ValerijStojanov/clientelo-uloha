// Report lievika z first-party udalostí: node tools/funnel.mjs server-data/events.jsonl
// Hlavný lievik = postupné kroky ku kontaktu; interakcie = čo návštevník robil popri tom
// a aká je konverzia tých, čo interakciu použili, oproti tým, čo nie.
import { readFileSync } from 'node:fs';

const file = process.argv[2] || 'server-data/events.jsonl';
const rows = readFileSync(file, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));

// Len kroky, ktoré musí prejsť každý lead (CTA preskočí k formuláru priamo, preto
// „videl porovnanie“ nie je krok lievika, ale interakcia).
const FUNNEL = [
  ['page_view', 'Príchod'],
  ['form_view', 'Videl formulár'],
  ['form_start', 'Klikol do e-mailu'],
  ['lead', 'Odoslal e-mail = LEAD'],
];
const AFTER = [
  ['newsletter_optin', 'Súhlas s tipmi'],
  ['post_survey', 'Odpovedal na anketu'],
  ['phone_offer_view', 'Videl ponuku hovoru'],
  ['phone_submit', 'Nechal telefón'],
  ['tahak_open', 'Otvoril tahák'],
];
const INTERACTIONS = [
  ['engaged_10s', 'Zostal ≥ 10 s'],
  ['section_view:compare', 'Doscroloval k porovnaniu'],
  ['calc_interact', 'Kalkulačka'],
  ['etf_open', 'Rozklikol ETF'],
  ['locked_click', 'Klikol na zamknutý ETF'],
  ['hero_cta', 'CTA v hero'],
  ['sticky_cta', 'Lepiace CTA'],
  ['faq_open', 'Otvoril FAQ'],
];

const sessions = new Map();
for (const r of rows) {
  if (!sessions.has(r.sid)) sessions.set(r.sid, { variant: r.variant, ev: new Map(), errors: 0 });
  const s = sessions.get(r.sid);
  const key = r.name === 'section_view' ? `section_view:${r.props?.id}` : r.name;
  if (!s.ev.has(key)) s.ev.set(key, r.t);
  if (r.name === 'form_error') s.errors++;
}

const pct = (a, b) => (b ? ((a / b) * 100).toFixed(1) : '–').padStart(5);
const variants = [...new Set([...sessions.values()].map((s) => s.variant))].sort();
for (const v of variants) {
  const list = [...sessions.values()].filter((s) => s.variant === v && s.ev.has('page_view'));
  const n = list.length;
  const has = (k) => list.filter((s) => s.ev.has(k));
  console.log(`\n=== Varianta ${v.toUpperCase()} — ${n} relácií ===`);
  console.log('Hlavný lievik                     počet   % zo všetkých   % z predch. kroku');
  let prev = n;
  for (const [k, label] of FUNNEL) {
    const c = has(k).length;
    console.log(`  ${label.padEnd(30)} ${String(c).padStart(5)}   ${pct(c, n)} %         ${pct(c, prev)} %`);
    prev = c;
  }
  const leads = has('lead');
  console.log('Po odoslaní (z leadov)');
  for (const [k, label] of AFTER) {
    const c = leads.filter((s) => s.ev.has(k)).length;
    console.log(`  ${label.padEnd(30)} ${String(c).padStart(5)}   ${pct(c, leads.length)} %`);
  }
  console.log('Interakcie                         použili   konverzia ak použil / ak nepoužil');
  for (const [k, label] of INTERACTIONS) {
    const used = has(k);
    const not = list.filter((s) => !s.ev.has(k));
    const cu = used.filter((s) => s.ev.has('lead')).length;
    const cn = not.filter((s) => s.ev.has('lead')).length;
    console.log(`  ${label.padEnd(30)} ${String(used.length).padStart(5)}   ${pct(cu, used.length)} % / ${pct(cn, not.length)} %`);
  }
  if (leads.length) {
    const t = leads.map((s) => s.ev.get('lead')).sort((a, b) => a - b);
    console.log(`Medián času do leadu: ${t[Math.floor(t.length / 2)]} s`);
  }
  const errs = list.filter((s) => s.errors).length;
  console.log(`Relácie s chybou vo formulári: ${errs} (${pct(errs, has('form_start').length)} % z tých, čo začali)`);
}
