# Pilot: VC investori so sídlom v Českej republike — výsledky a presnosť

Dátum zberu a overenia: **29. 10. 2026**. Okno aktivity VC: nová investícia od 29. 10. 2024.

## Dáta

| Súbor | Obsah |
|---|---|
| [data/investors.csv](data/investors.csv) | **24 overených VC investorov** (finálna verzia po L2 + L3) |
| [data/evidence.csv](data/evidence.csv) | **234 dôkazov** — ku každej hodnote URL, vydavateľ, dátum zdroja, dátum stiahnutia, citát, HTTP stav, poznámka L3 |
| [data/excluded.csv](data/excluded.csv) | 36 vyradených kandidátov s kódom a dôvodom (vrátane skutočných investorov iného typu) |
| [data/raw/](data/raw/) | pôvodný výstup zberových agentov (nemenený — na porovnanie) |
| [verification/](verification/) | L1 report, verdikty L2, rozhodnutia L3, metriky, hárok pre ľudskú kontrolu |

## Priebeh

```
60 kandidátov z 5 typov zdrojov (asociácia, EIF/verejné, médiá, databázy, komunita)
 └─ zber (4× Sonnet) ──► 29 zaradených, 31 vyradených
     └─ L1 skript ─────► 0 vyradených; 5 príznakov (chýbajúce povinné pole, 1 podozrivý ticket)
         └─ L2 (5× Opus naslepo) ─► 9 záznamov s problémom typu/aktivity/sídla,
         │                          3 polia „not_supported“, 34 „partial“; 2 z 12 vyradených sú aktívni
         └─ L3 (rozhodnutie) ─► −6 vyradených, +1 pridaný, 2 preštruktúrované, 13 opravených
                                 = 24 investorov vo finálnej DB
```

## Presnosť

### 1. Zaradenie: je záznam skutočne aktívny VC so sídlom v ČR?

| Úroveň | Výsledok |
|---|---|
| **Zberový agent sám (bez overenia)** | **21 / 29 = 72 %** (95 % CI 54–85 %) |
| Po L2 + L3 | 24 záznamov; každý má nezávisle nájdenú investíciu v okne |

8 chýb zberového agenta podľa druhu:

| Druh chyby | Počet | Záznamy |
|---|---|---|
| **Iný typ investora** zaradený ako VC | 3 | QQ Capital a BD Partners (family office — agent ich tak sám označil, a aj tak zaradil), Miton (investičná skupina s väčšinovými akvizíciami) |
| **Skupina namiesto VC ramena** | 2 | Rockaway Capital (holding PE + VC + blockchain → Rockaway Ventures), Jet Investment (PE + reality → Jet Venture 1) |
| **Sídlo mimo ČR** | 1 | Tachles VC (správca je americká LLC) |
| **Neaktívny** (len follow-on, tím odišiel) | 1 | Springtide Ventures |
| **Typ nepreukázaný** | 1 | Patero (možný investičný klub, jediná investícia na hrane okna) |

**Nikto z 29 nebol „náhodná firma“.** Každý zaradený subjekt reálne investuje
do firiem. Chyby sú v zaradení do správnej kategórie, nie v existencii.

### 2. Presnosť polí (263 hodnôt overených L2 otvorením zdroja)

| | Výsledok |
|---|---|
| **Zdroj hodnotu doslovne potvrdzuje** (`supported`) | **226 / 263 = 86 %** (95 % CI 81–90 %) |
| Potvrdzuje aspoň čiastočne (`supported` + `partial`) | 260 / 263 = 99 % (95 % CI 97–100 %) |
| Zdroj hodnotu nepotvrdzuje (`not_supported`) | 3 (IČO a právny názov N1 — iná firma; sektor Reflex) |

Podľa polí (podiel `supported`):

| Pole | Presnosť | Typická chyba |
|---|---|---|
| web, nezávislý dôkaz investície | 100 % | — |
| IČO, právny názov | 97 % | firma s podobným názvom (N1) |
| sídlo | 93 % | sídlo fondu v Luxembursku / USA vs. tím v Prahe |
| posledná investícia | 90 % | zastaraná (existuje novšia) alebo follow-on |
| ticket | 89 % | rozsah z marketingu, reálne investície mimo neho |
| štádiá | 68 % | natiahnuté z vágnej formulácie alebo jedinej investície |
| sektory | 57 % | „generalist“ / mapovanie do kategórií bez opory v texte |
| **kapitál** | **53 %** | **cieľ fondu zapísaný ako kapitál**, staré čísla, raz hodnota portfólia |

### 3. Vyradení — chyby opačným smerom

L2 znovu overil 12 kandidátov vyradených ako neaktívnych / neoveriteľných:

| | Výsledok |
|---|---|
| Rozhodnutie o vyradení správne | 11 / 12 |
| **Falošne vyradený skutočný investor** | **1** — Koopeo Ventures (TRIFFT Loyalty, 7/2025) → pridaný |
| Správne vyradený, ale so zlým dôvodom | 3 — Orbit Capital (nie neaktívny, ale venture debt: X5), RockawayX (aktívny, ale typ/sídlo nejasné → karanténa X9), mAccelerator (doplnené X11, poľský fond) |

Príčina: trom zo štyroch zberových agentov sa uprostred práce minula kvóta
vyhľadávania. Preto overovanie vyradených patrí do postupu natrvalo.

### 4. Spoľahlivosť samotného overovateľa

Aby L2 len „nepečiatkoval“, otvoril som (L3) náhodne vybrané verdikty sám:
**7 / 7 zhoda** (95 % CI 65–100 %) — vrátane chyby IČO pri N1 (overené v ARES) a
falošne vyradeného Koopeo (overené v zdroji). Malá vzorka, preto je pripravený
hárok pre človeka: [verification/l3-checklist.csv](verification/l3-checklist.csv)
(10 náhodných záznamov, 75 hodnôt so zdrojom).

### 5. Úplnosť finálnej DB (24 záznamov)

| Pole | Vyplnené | Poznámka |
|---|---|---|
| posledná investícia | 100 % | podmienka zaradenia |
| sektory | 92 % | |
| IČO | 92 % | N1 a Tensor majú správcu v Luxembursku |
| štádiá | 88 % | |
| ticket | 75 % | zvyšok fondy nezverejňujú |
| kapitál | 58 % | + pri 7 z 14 je to cieľ / priebežný stav, nie uzavretý fond (stĺpec `capital_status`) |

## Čo z pilotu vyplýva

1. **Bez nezávislého overenia by DB mala ~72 % presnosť zaradenia** — pod cieľom 95 %.
   Overovacia vrstva (L2 + L3) nie je voliteľná, je to väčšina hodnoty produktu.
2. **Existenciu a aktivitu agent zistí spoľahlivo** (nezávislý dôkaz investície 100 %).
   **Typ investora a čísla (kapitál, sektory) sú slabé miesto.** Práve kvôli nim
   si klient databázu kupuje, preto sa na ne sústreďuje overovanie aj ručná kontrola.
3. **Zhoda názvu v registri nestačí** — L1 skript prepustil IČO cudzej firmy.
   Pravidlo upravené: IČO len pri zhode štatutárov s partnermi fondu.
4. **Pravidlá potrebovali spresnenie** (pozri `rules_clarified` v
   [l3-adjudication.json](verification/l3-adjudication.json)): sídlo = miesto tímu,
   nie fondu; záznam patrí správcovi, nie vozidlu; follow-on nie je nová investícia;
   kapitál má stav (cieľ / priebežne / uzavretý / AUM); FO a PE skupiny mimo VC.
   Tieto spresnenia som vrátil do [PLAN.md](PLAN.md) (sekcia 11).

## Obmedzenia merania

- **Malá vzorka** (29 záznamov, 263 polí) → široké intervaly spoľahlivosti.
- **L3 robila AI** (hlavná session), nie človek. Ľudská kontrola hárku
  `l3-checklist.csv` je prvý krok pred rozšírením.
- **Úplnosť pokrytia (recall)** som nezmeral: zoznam členov CVCA sa nedal
  načítať (neplatný certifikát), takže chýba referenčný zoznam. Nepriamy
  ukazovateľ: 1 z 12 vyradených bol falošne negatívny.
- Česká VC scéna je dobre pokrytá médiami (CzechCrunch, Lupa.cz). V krajinách s
  menej transparentnými médiami bude presnosť aj úplnosť nižšia.
