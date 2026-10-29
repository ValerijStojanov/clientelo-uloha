# Clientelo — praktická úloha (Junior AI Developer)

Vypracované **obe zadania** (A aj B), aby sa dal porovnať prístup. Celé riešenie
vzniklo v Claude Code (Claude Opus 5.5 ako hlavný agent + subagenti), postup a
chyby AI sú popísané nižšie.

| | Zadanie | Výsledok |
|---|---|---|
| **A** | Spoľahlivá databáza investorov | [zadanie-a/](zadanie-a/) — plán, pravidlá, odhad rozsahu, pilot na českých VC so zdrojom pri každom údaji, meranie presnosti, náklady na celý svet |
| **B** | Konverzná landing page (ETF z NYSE) | [zadanie-b/](zadanie-b/) — stránka, 2 reklamy, meranie lievika, README so zdôvodnením |
| | Export konverzácie | [ai-log/](ai-log/) |

## Ako som pracoval s AI

### Rozdelenie práce

Hlavná session (Claude Opus 5.5 v Claude Code) plánovala, písala kód, robila
rozhodnutia a kontrolovala. Zber dát robili **subagenti s úzkym písomným
zadaním** (súbory `BRIEF-*.md` sú v repozitári, aby sa dal postup zopakovať):

| Agent | Model | Zadanie | Výstup |
|---|---|---|---|
| Odhad trhu | Sonnet 5.5 | [BRIEF-0](zadanie-a/agents/BRIEF-0-scale.md): verejné počty investorov podľa typu, s URL a dátumom | [scale-sources.md](zadanie-a/agents/scale-sources.md) |
| Discovery | Sonnet 5.5 | [BRIEF-1](zadanie-a/agents/BRIEF-1-discovery.md): 40–60 kandidátov „českých VC“ vrátane hraničných prípadov, z ≥ 4 typov zdrojov | 60 kandidátov |
| Zber × 4 (paralelne) | Sonnet 5.5 | [BRIEF-2](zadanie-a/agents/BRIEF-2-enrichment.md): pravidlá z PLAN.md, zdroj ku každému poľu, ARES, zákaz hodnôt z pamäti | `data/raw/batch-*.json` |
| Overovanie × 5 (paralelne) | **Opus 5.5** | [BRIEF-3](zadanie-a/agents/BRIEF-3-verification.md): **naslepo** (bez zdôvodnenia a istoty zberového agenta) otvoriť každý zdroj, nájsť vlastnú investíciu, znovu overiť vyradených | `verification/l2-part*.json` |
| Dáta ETF | Sonnet 5.5 | [BRIEF-etf](zadanie-b/research/BRIEF-etf.md): poplatky, výnosy, burza, UCITS dvojčatá, PRIIPs, dane — s „as of“ dátumom | [etf-data.json](zadanie-b/research/etf-data.json), [etf-notes.md](zadanie-b/research/etf-notes.md) |

Dôvody tohto rozdelenia:
- **Zber a overovanie robí iný model.** Ten istý model by pri kontrole vlastnej
  práce opakoval tie isté chyby.
- **Overovateľ nevidí zdôvodnenie zberového agenta**, iba tvrdenie a URL, aby sa
  ním nenechal presvedčiť.
- **Vyradení kandidáti sa tiež overujú.** Chyba býva aj opačná: vyhodený skutočný investor.

### Ako som kontroloval výstup agentov

1. **Automaticky (L1)**: skript [build.py](zadanie-a/tools/build.py) kontroluje
   dostupnosť URL, IČO v ARES, okno aktivity, povinné polia a konzistenciu
   ticketu so štádiom. Na stránke kontroluje [build-data.mjs](zadanie-b/tools/build-data.mjs),
   že všetky ETF sú z NYSE.
2. **Nezávislým agentom (L2)**, ako je popísané vyššie.
3. **Sám (L3)**: rozhodol som každú nezhodu medzi L0 a L2
   ([l3-adjudication.json](zadanie-a/verification/l3-adjudication.json)) a
   **náhodne vybrané verdikty overovateľa som otvoril sám**, aby som overil aj
   overovateľa (7/7 zhoda). Kľúčové čísla stránky (VOO, KID Amundi, ceník KB, GFŘ)
   som stiahol a prečítal z pôvodných PDF, nie zo zhrnutia.
4. **V prehliadači**: celý lievik stránky (preklep v e-maile → odoslanie → anketa
   → telefón) som prešiel a skontroloval udalosti na serveri.

Úprimne: L3 tu robila tiež AI (hlavná session), nie človek. Pre ľudskú kontrolu
je pripravený hárok [l3-checklist.csv](zadanie-a/verification/l3-checklist.csv).

### Kde sa AI mýlila

**Zberoví agenti (zadanie A):**
- **Zlá firma podľa zhody názvu.** N1 dostalo IČO firmy „Nation1 Investment s.r.o.“,
  ktorá s fondom nemá nič spoločné (iní štatutári, NACE obchod a reality). Môj
  L1 skript to **nezachytil**, lebo porovnával len názov. Teraz to ide do pravidiel.
- **Typ investora:** dve family office (QQ Capital, BD Partners), investičná
  skupina s väčšinovými akvizíciami (Miton) a PE skupina (Jet Investment) boli
  zaradené ako VC. Pri QQ a BD agent sám napísal „Family office“ a aj tak ich zaradil.
- **Kapitál:** cieľová veľkosť fondu bola zapísaná ako kapitál (Purple 40 mil. EUR
  oproti skutočne získaným 700 mil. Kč; Look AI, JIC), pri Mitone dokonca
  „hodnota firiem, ktoré sme pomáhali budovať“ (450 mil. EUR).
- **Falošne vyradený investor:** Koopeo Ventures vyradený ako neaktívny, hoci
  v 7/2025 investoval (TRIFFT Loyalty). Agentovi došla kvóta vyhľadávania.
- **Fondové vozidlo namiesto správcu** (StartupYard Batch 15, J&T SICAV, Presto Fund II)
  a **follow-on namiesto novej investície** ako dôkaz aktivity.
- **Citáty:** časť „doslovných“ citátov boli v skutočnosti zhrnutia nástroja WebFetch.
- **Vlastný report agenta nesedel so súborom** (hlásil 9 zaradených, v súbore 10).

**Agent na dáta ETF (zadanie B):**
- Správne odhalil, že ARKK, VXUS a BND **nie sú na NYSE** (môj vlastný brief ich navrhoval).
- Nástroj WebFetch (zhrnutie malým modelom) **prehodil výnosy SPY** (3-ročný za 1-ročný);
  agent to odhalil porovnaním s PDF.
- Nenašiel poplatky bankového fondu — doplnil som ich sám z KID a ceníka.
- Tvrdenie „v Česku nekúpite“ nie je univerzálne (Fio) → texty stránky aj reklamy som opravil.

**Moje vlastné chyby (hlavná session):**
- V zadaní agentovi dávky 3 som napísal „použi logiku X11“ pre PE fondy, hoci X11
  znamenalo „sídlo mimo krajiny“ → definícia X11 bola následne rozšírená.
- Udalosť „videl sekciu“ s prahom 50 % sa pri sekcii vyššej ako obrazovka **nikdy
  nespustila** a lievik ukazoval „200 % z predchádzajúceho kroku“. Opravené po teste v prehliadači.
- L1 kontrola „pre-seed s veľkým ticketom“ označila Credo ako podozrivé, ale
  Credo naozaj píše pre-seed šeky 1–5 mil. USD → falošný poplach, ktorý L2 vyriešil.

### Obmedzenia, na ktoré som narazil

- **Kvóta vyhľadávania subagentov** sa minula pri 3 zo 4 zberových agentov
  uprostred práce. Preto overovateľ znovu kontroluje vyradených.
- Weby blokujú automatické sťahovanie (Crunchbase, Dealroom, Schwab: 403) a
  cvca.cz má neplatný certifikát → zoznam členov CVCA len cez vyhľadávač.

Export konverzácie: [ai-log/](ai-log/).
