# Zadanie A — plán: spoľahlivá databáza investorov

> Cieľ databázy nie je „čo najviac mien“, ale **čo najmenej omylov**. Každý
> záznam je tvrdenie „tento subjekt reálne investuje do firiem“ a musí sa dať
> spätne doložiť konkrétnym verejným zdrojom s dátumom.

## 1. Definícia investora

**Investor** je subjekt (firma, fond alebo fyzická osoba), ktorý **opakovane
a systematicky investuje vlastný alebo zverený kapitál do vlastného kapitálu
(alebo konvertibilných nástrojov) súkromných, neburzových firiem** — a vieme to
doložiť aspoň jednou datovanou transakciou z nezávislého zdroja.

Z definície vyplývajú tri testy, ktoré musí prejsť každý záznam:

| Test | Otázka | Čo to vylúči |
|---|---|---|
| **Kapitál** | Investuje vlastné/zverené peniaze, nie peniaze klientov cez sprostredkovanie? | poradcov, platformy, investičné banky |
| **Predmet** | Kupuje podiely v súkromných firmách (nie akcie na burze, nie nehnuteľnosti, nie úvery)? | podielové fondy, hedge fondy, banky, realitné fondy |
| **Aktivita** | Existuje datovaná investícia v okne aktivity, doložená nezávislým zdrojom? | neaktívne fondy, „investorov“ len na LinkedIne |

## 2. Kategórie a kritériá zaradenia

| Typ | Kritérium zaradenia | Okno aktivity | Minimálny dôkaz |
|---|---|---|---|
| **VC** (vrátane CVC a akcelerátorov s equity) | menšinové podiely v startupoch, pre-seed až growth | 24 mesiacov | ≥ 1 nová investícia; existencia fondu/vehiklu alebo korporátneho investičného tímu |
| **Private equity** | buyout alebo growth v etablovaných firmách, často väčšinové podiely | 36 mesiacov | ≥ 1 transakcia + fond alebo investičná spoločnosť v registri |
| **Family office** (single/multi) | spravuje majetok rodiny a **priamo** investuje do firiem | 36 mesiacov | ≥ 1 priama investícia do firmy (nie len do fondov či nehnuteľností) |
| **Angel investor** (fyzická osoba) | investuje vlastné peniaze do startupov | 36 mesiacov | ≥ 2 verejne doložené investície; meno uvedené v investičnom kontexte (napr. tlačová správa kola, profil v angel sieti) |
| **Veľký súkromný investor** | fyzická osoba alebo jej holding mimo štruktúry FO | 36 mesiacov | ≥ 1 priama investícia ≥ 1 mil. EUR |

**Podtypy** (pole `subtype`): `independent_vc`, `cvc`, `accelerator_equity`,
`public_vc` (štátom vlastnený fond investujúci priamo), `buyout`, `growth`,
`sfo`, `mfo`, `angel`, `angel_syndicate`, `private_holding`.

**Zmiešané subjekty** (napr. investičná skupina, ktorá robí VC aj PE): primárny
typ = typ väčšiny transakcií v okne aktivity, sekundárny typ v poli `type_secondary`.

## 3. Pravidlá vyradenia (s kódmi)

| Kód | Vyradiť, ak… | Príklad | Poznámka |
|---|---|---|---|
| X1 | je to **poradca/sprostredkovateľ** (M&A, corporate finance, advokát, investičná banka) | M&A butik | neinvestuje vlastný kapitál |
| X2 | je to **platforma**: investujú jej používatelia, nie ona | crowdfunding, angel klub ako marketplace | zaradiť možno fond/syndikát, ktorý platforma spravuje a sám rozhoduje |
| X3 | je to **program bez equity** | akcelerátor len s mentoringom, grantová agentúra | akcelerátor, ktorý berie podiel, je VC / `accelerator_equity` |
| X4 | investuje **iba na verejných trhoch** | podielové fondy, ETF, robo-advisory, hedge fondy | |
| X5 | poskytuje **iba dlh** alebo investuje **iba do nehnuteľností** | banka, leasing, realitný fond | venture debt = mimo rozsah v1 (kandidát na samostatnú kategóriu) |
| X6 | je **fond fondov / LP** bez priamych investícií | EIF | využijeme ho ako zdroj kandidátov (jeho portfólio sú VC fondy) |
| X7 | je **strategický kupec** bez investičného mandátu | holding, ktorý kupuje firmy na prevádzku | |
| X8 | je **neaktívny** — žiadna doložená investícia v okne aktivity | fond v harvest fáze | presun do archívu, nie zmazanie |
| X9 | je **neoveriteľný** — iba vlastné tvrdenie, žiadny nezávislý zdroj | „investor“ len s webom | karanténa, nevstupuje do DB |
| X10 | je **duplicita alebo vehikel** iného záznamu | Fund II s.r.o. toho istého správcu | jeden záznam na správcu, fondy ako podriadené záznamy |
| X11 | (pre pilot) **sídlo mimo krajiny vzorky** | zahraničný fond s pobočkou | v celej DB nevyraďuje, iba pre meranie vzorky |

**Hraničné prípady rozhodujeme konzervatívne:** pri pochybnosti záznam
nevstúpi do databázy, ale ostane v `excluded.csv` s dôvodom. Pre klienta je
horšie zavolať firme, ktorá neinvestuje (strata dôvery v celú databázu), než
neuvidieť jeden okrajový subjekt.

## 4. Dátový model

Každý záznam = správca (manažér) investícií. Každá hodnota má vlastný riadok v
tabuľke dôkazov (`evidence.csv`) — **zdroj je pri každom údaji, nie pri zázname**.

| Pole | Povinné | Popis |
|---|---|---|
| `id`, `name`, `legal_name`, `registry_id` | áno | IČO / company number z obchodného registra |
| `type`, `subtype`, `type_secondary` | áno | podľa sekcie 2 |
| `country`, `hq_city`, `website` | áno | |
| `sectors` | áno | normalizované do 15 kategórií (software, fintech, health, energy/climate, deeptech, AI, consumer, mobility, proptech, edtech, security, agri/food, industry, media/gaming, generalist) |
| `stages` | áno | pre-seed / seed / A / B+ / growth / buyout |
| `ticket_min_eur`, `ticket_max_eur`, `ticket_basis` | áno* | `stated` (uvádza investor) / `derived` (odvodené z transakcií) / `not_public` |
| `capital_eur`, `capital_measure`, `capital_as_of`, `capital_basis` | áno* | čo číslo meria: veľkosť posledného fondu / AUM / súčet fondov |
| `last_investment` (firma, dátum, kolo) | áno | doložené nezávislým zdrojom |
| `confidence` | áno | high / medium / low — podľa úrovne zdrojov (sekcia 6) |

\* Ticket a kapitál mnohé fondy nezverejňujú. Takýto subjekt **nevyraďujeme**
(je to skutočný investor), ale pole označíme `not_public` alebo ho odvodíme z
verejných transakcií a odvodenie jasne označíme. Úplnosť týchto polí
meriame zvlášť. Vymyslené alebo „odhadnuté modelom“ čísla bez zdroja sú zakázané.

Peňažné hodnoty uchovávame v pôvodnej mene + prepočet na EUR kurzom ČNB
k dátumu stiahnutia (pilot: 27. 10. 2026, 1 EUR = 24,340 CZK, 1 USD = 21,834 CZK).

## 5. Ako overíme pravosť a zaradenie

Štyri úrovne, každá chytá iný typ chyby:

| Úroveň | Čo robí | Chytá |
|---|---|---|
| **L1 — automatické kontroly** | URL odpovedá, doména sedí so subjektom, IČO existuje v registri (ARES), dátumy v okne aktivity, ticket ≤ kapitál, deduplikácia podľa domény a IČO | mŕtve odkazy, preklepy, staré dáta, duplicity |
| **L2 — nezávislý overovací agent** | iný model ako zberový agent; nevidí jeho zdôvodnenie, iba tvrdenia a URL. Pri každom poli otvorí zdroj a označí `supported / partial / not_supported / unavailable`. Navyše sám nájde jednu investíciu subjektu. | halucinácie, zlé priradenie zdroja, zlý typ investora |
| **L3 — ručná kontrola** | náhodná stratifikovaná vzorka + všetky nezhody z L2 + všetky záznamy s `confidence = low`. Výsledok = presnosť s 95 % intervalom spoľahlivosti (Wilson). | systematické chyby pravidiel |
| **L4 — priebežne** | každých 6 mesiacov znovu overiť aktivitu (nová investícia), sledovať tlačové správy portfóliových firiem, spätná väzba od používateľov DB | zastaranie |

**Merané metriky:**
1. **Presnosť zaradenia (record precision)** — podiel záznamov v DB, ktoré sú
   skutočne aktívny investor správneho typu. Cieľ ≥ 95 %.
2. **Presnosť polí (field accuracy)** — podiel hodnôt, ktoré zdroj skutočne
   potvrdzuje. Cieľ ≥ 90 %.
3. **Úplnosť** — podiel záznamov s vyplneným tiketom/kapitálom (bez `not_public`).
4. **Úplnosť pokrytia (recall)** — koľko subjektov zo známeho referenčného
   zoznamu (napr. členovia asociácie s typom VC) sa v DB nachádza.

## 6. Hierarchia zdrojov

| Úroveň | Zdroj | Použitie |
|---|---|---|
| **T1** | regulátor a registre (ČNB JERRS, ESMA, SEC Form ADV/D, Companies House, ARES / obchodný register), výročné správy fondov | existencia, právna forma, veľkosť fondu |
| **T2** | vlastný web investora, tlačová správa investora alebo portfóliovej firmy | sektory, ticket, kapitál (označené ako *self-reported*) |
| **T3** | renomované médiá (CzechCrunch, Forbes, HN, E15, TechCrunch, Sifted) | nezávislý dôkaz transakcie |
| **T4** | agregátory (Crunchbase, Dealroom — verejné stránky, Wikipedia) | iba na hľadanie kandidátov, **nikdy ako jediný dôkaz** |

`confidence = high`, ak má záznam T1 alebo T3 dôkaz aktivity a T1/T2 pri
kapitáli; `medium`, ak je aktivita doložená iba T2; `low` inak (→ ručná kontrola).

## 7. Postup (pipeline)

```
1. Discovery    – kandidáti z ≥ 4 typov zdrojov (asociácie, regulátori, portfóliá
                  fondov fondov, médiá, komunity); záznam o tom, kde sa kto našiel
2. Enrichment   – zberový agent vyplní polia + dôkaz ku každému poľu
3. Rules        – pravidlá zo sekcií 2–3 → include / exclude + kód dôvodu
4. Verification – L1 skript, L2 nezávislý agent, L3 ručná kontrola
5. Publish      – investors.csv + evidence.csv + excluded.csv
6. Refresh      – L4 každých 6 mesiacov
```

Agentom dávame úzke, písomné zadania (`agents/BRIEF-*.md`), aby sa dal postup
zopakovať a aby bolo jasné, čo agent smel a nesmel.

## 8. Odhad rozsahu a spoľahlivosti

Pozri [ODHAD.md](ODHAD.md) — počty podľa typov, z čoho vychádzajú, koľko z nich je
identifikovateľných z verejných zdrojov a s akou spoľahlivosťou.

## 9. Pilot na vzorke

**VC fondy so sídlom v Českej republike.** Dôvody: trh je dostatočne malý na
úplné ručné overenie (desiatky subjektov), existujú referenčné zoznamy (CVCA,
register ČNB, portfóliá EIF a Národního rozvojového fondu) a české zdroje sú
verejne dostupné. Výsledky: [VYSLEDKY.md](VYSLEDKY.md).

## 10. Riziká a obmedzenia

- **Self-reported čísla.** Veľkosť fondu a ticket často uvádza iba investor sám
  (marketing). Označujeme ich `stated` a pri rozpore uprednostňujeme T1.
- **Angel investori a GDPR.** Ide o fyzické osoby: spracúvame iba údaje, ktoré
  sami zverejnili v profesijnom kontexte, s právnym titulom oprávneného záujmu,
  s možnosťou námietky (opt-out) a bez súkromných kontaktov.
- **Rozdiel medzi „fondom“ a „správcom“.** Jeden správca má viac fondov; kapitál
  vždy uvádzame s popisom, čo presne meria.
- **Zastaranie.** VC trh sa mení rýchlo; bez L4 klesá presnosť odhadom o
  niekoľko percentných bodov ročne (fondy prechádzajú do harvest fázy).
