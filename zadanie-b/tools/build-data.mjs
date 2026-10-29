// research/etf-data.json (zber agenta + ručné overenie) → site/data.js
// Jediný zdroj čísel pre stránku, tahák aj reklamy. Spúšťať po každej aktualizácii dát.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const R = JSON.parse(readFileSync(join(ROOT, 'research', 'etf-data.json'), 'utf8'));

const czDate = (iso) => {
  if (!iso) return '';
  const [y, m, d] = String(iso).split('-').map(Number);
  return d ? `${d}. ${m}. ${y}` : `${m}/${y}`;
};

const etfs = R.etfs
  .filter((e) => /NYSE/i.test(e.exchange || ''))
  .sort((a, b) => (b.aum_usd || 0) - (a.aum_usd || 0))
  .slice(0, 12)
  .map((e) => ({
    ticker: e.ticker,
    name: e.name,
    issuer: e.issuer,
    exchange: e.exchange,
    ter: e.ter_pct,
    aum: e.aum_usd,
    divYield: e.dividend_yield_pct ?? null,
    ret10: e.returns?.y10 ?? null,
    ret5: e.returns?.y5 ?? null,
    retAsOf: czDate(e.returns?.as_of),
    note: e.returns?.y10 == null ? `fond existuje od ${e.inception_year}` : undefined,
    source: e.source_url,
    twin: e.ucits_twin
      ? {
          ticker: e.ucits_twin.ticker,
          isin: e.ucits_twin.isin,
          name: e.ucits_twin.name,
          ter: e.ucits_twin.ter_pct,
          exchange: e.ucits_twin.exchange,
          dist: e.ucits_twin.distribution,
          source: e.ucits_twin.source_url,
        }
      : null,
  }));

// Kalkulačka: fond z banky = prvý fond z research (ručne vybraný reprezentatívny),
// ETF = UCITS dvojča k VOO (to si český investor reálne kúpi).
const bank = R.cz_bank_funds[0];
const voo = etfs.find((e) => e.ticker === 'VOO');
const calc = {
  returnPct: 7,
  bank: { name: bank.fund, provider: bank.provider, ter: bank.ongoing_charges_pct, entry: bank.entry_fee_max_pct, source: bank.source_url },
  etf: { label: voo.twin.ticker, ter: voo.twin.ter },
};

// Ako „platné k“ berieme najčastejší dátum výnosov.
const dates = etfs.map((e) => e.retAsOf).filter(Boolean);
const asOf = dates.sort((a, b) => dates.filter((x) => x === b).length - dates.filter((x) => x === a).length)[0];

const sources = [];
const add = (label, url, date) => { if (url && !sources.some((s) => s.url === url)) sources.push({ label, url, date }); };
for (const e of etfs) add(`${e.ticker} (${e.issuer})`, e.source, e.retAsOf || czDate('2026-10-29'));
for (const e of etfs) if (e.twin) add(`${e.twin.ticker} (dvojče ${e.ticker})`, e.twin.source, czDate('2026-10-29'));
add(`${bank.fund} – KID`, bank.source_url, czDate(bank.kid_date));
for (const p of R.priips || []) add(`PRIIPs: ${p.publisher}`, p.source_url, czDate(p.date));
for (const k of ['cz_tax', 'us_tax', 'dip']) for (const t of R[k] || []) add(t.publisher, t.source_url, czDate(t.date));

const out = { asOf, calc, etfs, sources, notes: { cz_tax: R.cz_tax, us_tax: R.us_tax, dip: R.dip, priips: R.priips } };
writeFileSync(
  join(ROOT, 'site', 'data.js'),
  `// Vygenerované z research/etf-data.json (tools/build-data.mjs) ${new Date().toISOString().slice(0, 10)} — needitovať ručne.\nwindow.ETF_DATA = ${JSON.stringify(out, null, 1)};\n`,
);
console.log(`ETF: ${etfs.length}, zdroje: ${sources.length}, platné k ${asOf}, banka: ${bank.fund} ${bank.ongoing_charges_pct} % + ${bank.entry_fee_max_pct} %`);
