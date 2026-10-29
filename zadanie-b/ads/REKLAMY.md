# Dve verzie reklamy (Meta: Instagram + Facebook, mobil)

Formát: obrázok 1080×1350 (4:5, feed). Pre Stories/Reels by sa rovnaký layout
pretiahol na 1080×1920 (bezpečná zóna hore/dole 250 px). Cieľ kampane: *Leads*
s optimalizáciou na udalosť `Lead` z pixelu (po súhlase) / Conversions API.

## Reklama A — „poplatky“ (segment: má peniaze vo fonde banky)

![A](reklama-a-poplatky.1080x1350.png)

| Pole | Text |
|---|---|
| **Primárny text** | Investujete přes fond v bance? Při 3 000 Kč měsíčně vás poplatky za 20 let můžou stát přes {{diff}}. Spočítejte si svou částku za 10 vteřin a podívejte se, která ETF z NYSE stojí jen pár setin procenta ročně. |
| **Nadpis** | Kolik vám sežerou poplatky? |
| **Popis** | Kalkulačka + srovnání 12 ETF zdarma |
| **Tlačidlo** | Zjistit více |
| **URL** | `/?v=a&utm_source=meta&utm_medium=paid_social&utm_campaign=etf_leadmagnet&utm_content=poplatky` |
| **Cielenie** | CZ, 25–45, záujmy: osobní finance, investování, spoření, penzijní spoření; vylúčiť existujúce leady |

## Reklama B — „dvojča“ (segment: samouk, chce kúpiť VOO/SPY)

![B](reklama-b-dvojce.1080x1350.png)

| Pole | Text |
|---|---|
| **Primárny text** | Chtěli jste koupit VOO nebo SPY a broker vám to nedovolil? Není to chyba. Evropská pravidla (PRIIPs) americká ETF drobným investorům blokují. Ke 12 nejoblíbenějším ETF z NYSE jsme našli evropská dvojčata se stejným indexem. |
| **Nadpis** | VOO si v Česku nekoupíte. Dvojče ano. |
| **Popis** | Srovnání 12 ETF a jejich dvojčat zdarma |
| **Tlačidlo** | Zjistit více |
| **URL** | `/?v=b&utm_source=meta&utm_medium=paid_social&utm_campaign=etf_leadmagnet&utm_content=dvojce` |
| **Cielenie** | CZ, 20–40, záujmy: akcie, ETF, XTB, Trading 212, Revolut, S&P 500, finanční nezávislost |

## Prečo takto

- **Message match:** nadpis, farba a vizuál reklamy = prvá obrazovka stránky.
  Návštevník za 1 sekundu vidí, že je na správnom mieste (`?v=` prepína hero).
- **Konkrétne číslo namiesto sľubu.** Reklama A ukazuje výsledok výpočtu, nie
  „ušetrite na poplatkoch“. Číslo sa počíta z rovnakých dát ako stránka.
- **B stavia na frustrácii, ktorú segment reálne zažil** (broker odmietol nákup
  VOO) a ponúka riešenie, nie výčitku.
- **Bez sľubov výnosov a bez „zaručene“** — pravidlá Meta pre finančné služby a
  česká regulácia (nejde o investičné odporúčanie).
- **{{diff}}** v primárnom texte doplniť číslom z vyrenderovanej reklamy A
  (zaokrúhlené nadol, napr. „300 000 Kč“), aby text a obrázok sedeli.
