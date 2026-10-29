# Brief — reálne dáta pre landing page (ETF na NYSE)

Agent: Claude Sonnet (subagent), web search + web fetch. Iba verejné zdroje.
Ku každému číslu: URL zdroja, dátum, ku ktorému údaj platí („as of“), dátum stiahnutia.

## 1. ETF obchodované na NYSE / NYSE Arca (10–12 kusov)
Pre bežného českého investora relevantné: S&P 500 (VOO, IVV, SPY, SPLG/SPYM),
celý trh USA (VTI, ITOT), svet (VT), svet bez USA (VXUS alebo VEU),
dividendové (SCHD, VYM), dlhopisy (BND alebo AGG), zlato (GLD alebo IAU),
a jeden drahý aktívny/tematický na kontrast (napr. ARKK — over burzu!).
Pre každý: ticker, celý názov, emitent, **primárna burza (over, že je to NYSE
Arca/NYSE, nie Nasdaq či Cboe)**, TER (expense ratio), AUM, rok vzniku,
dividendový výnos, ročné výnosy za 1/5/10 rokov (podľa stránky emitenta, uveď
ku ktorému dátumu a či ide o NAV alebo market price).
Primárny zdroj = stránka emitenta (vanguard, ishares, ssga, schwab…).

## 2. Môže ich Čech kúpiť?
- Nájdi spoľahlivý zdroj k tomu, že retailoví investori v EU nemôžu kupovať
  ETF z USA kvôli PRIIPs / chýbajúcemu KID (napr. ESMA, ČNB, help stránky
  brokerov dostupných v ČR: XTB, Trading 212, DEGIRO, Interactive Brokers, Fio,
  Patria). Ktoré z nich to výslovne uvádzajú?
- Pre každý ETF z bodu 1 nájdi UCITS „dvojča“ (rovnaký index), ktoré si český
  retail kúpiť môže: ticker, ISIN, TER, burza (Xetra/LSE/…), akumulačné vs.
  distribučné. Zdroj: emitent alebo justETF.

## 3. Kontext pre Česko
- Typický podielový fond od banky v ČR: nájdi 1–2 konkrétne akciové fondy
  predávané veľkými bankami (napr. Česká spořitelna/Erste, ČSOB, KB/Amundi) a
  ich priebežné náklady (ongoing charges z KID) + max. vstupný poplatok.
- Daň: časový test 3 roky pre cenné papiere, limit 100 000 Kč príjmov z predaja
  a strop pre oslobodenie (od 2025?) — zdroj (zákon/finanční správa/serióze médiá).
- Zrážková daň z dividend USA pre rezidenta ČR s W-8BEN (15 %) a
  americká dedičská daň pre nerezidentov (limit 60 000 USD) — zdroj IRS.
- DIP (dlouhodobý investiční produkt): od kedy, odpočet až 48 000 Kč — zdroj.

## Výstup
`zadanie-b/research/etf-data.json` (štruktúrované) a
`zadanie-b/research/etf-notes.md` (čo si zistil, čo sa nepodarilo overiť,
kde sa zdroje rozchádzajú). Nič neodhaduj bez označenia „odhad“.
