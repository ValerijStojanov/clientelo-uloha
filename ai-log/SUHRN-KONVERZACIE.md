# Dokumentácia priebehu spolupráce s Claude Code

**Projekt:** Spracovanie zadania A – databáza investorov a zadania B – investičná landing page  
**Dátum realizácie:** 29. 10. 2026  
**Hlavný nástroj:** Claude Code (desktop)  
**Hlavný model:** Claude Opus 5.5  
**Subagenti:** Claude Sonnet 5.5 a Claude Opus 5.5  
**Výsledné prostredie:** GitHub, Vercel, lokálne vývojové prostredie

> Štruktúrovaný súhrn pracovnej konverzácie, nie doslovný export (dôvod v sekcii 8).
> Podrobnosti o práci s AI sú v hlavnom [README.md](../README.md#ako-som-pracoval-s-ai).

---

## 1. Zadanie projektu

Projekt sa skladal z dvoch hlavných častí, ktoré sa riešili v rámci jednej pracovnej session.

### 1.1 Zadanie A – databáza investorov

Prvá časť bola zameraná na identifikáciu, klasifikáciu a overovanie relevantných investorov podľa vopred stanovených kritérií.

Požadovaným výsledkom bola štruktúrovaná databáza subjektov s doložiteľnými informáciami a zdrojmi.

Kľúčové činnosti zahŕňali:

1. Vyhľadanie potenciálne relevantných investorov.
2. Definovanie pravidiel na ich zaradenie alebo vyradenie.
3. Získanie verejne dostupných informácií.
4. Kontrolu identity a investičnej aktivity.
5. Overenie výsledkov nezávislými AI agentmi.
6. Vyriešenie sporných prípadov.
7. Vyhodnotenie presnosti a kvality získaných dát.

### 1.2 Zadanie B – investičná landing page

Druhá časť zahŕňala návrh a implementáciu webovej stránky zameranej na investičnú tému.

Súčasťou riešenia boli:

- Landing page s interaktívnou investičnou kalkulačkou.
- Porovnanie vybraných ETF a ich európskych UCITS alternatív.
- Formulár na získavanie potenciálnych zákazníkov.
- Nadväzujúci dotazníkový proces.
- Systém merania používateľských interakcií.
- Dve reklamné kreatívy.
- Testovanie používateľského prechodu.
- Príprava produkčného nasadenia.

Obe zadania sa najprv vyvíjali lokálne. Publikovanie na GitHub a Vercel prebehlo až na neskoršiu výslovnú požiadavku používateľa.

---

## 2. Použité AI nástroje a organizácia práce

### 2.1 Hlavný AI agent

Hlavným koordinátorom projektu bol Claude Opus 5.5 prostredníctvom aplikácie Claude Code.

Jeho úlohou bolo predovšetkým:

- Analyzovať požiadavky zadania.
- Navrhnúť plán realizácie.
- Rozdeľovať prácu medzi subagentov.
- Implementovať webovú aplikáciu.
- Vyhodnocovať výsledky čiastkových úloh.
- Kontrolovať a opravovať nájdené chyby.
- Pripravovať finálnu dokumentáciu.

Hlavný agent fungoval ako centrálna koordinačná vrstva medzi zadaním, vývojom, výskumom a overovaním výsledkov.

### 2.2 Špecializovaní subagenti

Na jednotlivé úlohy sa použilo spolu **12 subagentov**.

| Oblasť | Počet agentov | Úloha |
|---|---:|---|
| Discovery investorov | 1 | Vyhľadanie 60 kandidátov |
| Zber informácií | 4 | Spracovanie kandidátov podľa metodiky |
| Nezávislé overovanie | 5 | Kontrola zaradenia a vyradenia |
| ETF research | 1 | Zber produktových a regulačných dát |
| Odhad trhu | 1 | Podklady na odhad veľkosti trhu |
| **Spolu** | **12** | |

Na zber dát sa použil Claude Sonnet 5.5, nezávislé overovanie prebiehalo pomocou Claude Opus 5.5.

Toto rozdelenie umožnilo využiť rôzne modely podľa charakteru úlohy. Rutinnejšie rešeršné činnosti boli oddelené od náročnejšieho rozhodovania a kontroly.

Dôležitým princípom bolo, že výsledok jedného AI agenta sa automaticky nepovažoval za overený.

---

## 3. Priebeh realizácie

### Fáza 1 – Analýza zadania a plánovanie

Na začiatku používateľ poskytol e-mail s oboma zadaniami a požiadal o ich realizáciu.

Claude najprv identifikoval dve samostatné pracovné oblasti a vyžiadal si upresnenie rozsahu a spôsobu publikovania.

Používateľ potvrdil, že chce realizovať obe časti, spočiatku však iba lokálne.

Následne bol založený projektový repozitár a vytvorený súbor `PLAN.md`.

Plán obsahoval najmä:

- Pracovnú definíciu relevantného investora.
- Kritériá zaradenia do databázy.
- Jedenásť kategórií dôvodov vyradenia (X1–X11).
- Návrh dátového modelu.
- Viacúrovňový systém overovania (L1–L4).
- Postup riešenia nejednoznačných prípadov.

**Význam tejto fázy:** Pred začatím samotného zberu dát bola stanovená jednotná metodika. Tým sa znížilo riziko, že jednotliví agenti budú rovnaké kritériá interpretovať rozdielne.

### Fáza 2 – Paralelný výskum

Po vytvorení plánu boli spustení traja výskumní subagenti.

Prvý agent sa zameral na vyhľadanie 60 potenciálnych českých VC investorov.

Druhý agent spracovával informácie o ETF, ich vlastnostiach, európskych alternatívach a dostupných zdrojoch.

Tretí agent vyhľadával verejné údaje o počtoch investorov a súvisiace informácie využiteľné na odhad veľkosti trhu.

Výskumné úlohy prebiehali paralelne, takže vývoj webovej aplikácie mohol pokračovať bez čakania na dokončenie všetkých rešerší.

### Fáza 3 – Implementácia landing page

Kým subagenti spracovávali výskumné úlohy, hlavný agent implementoval zadanie B.

Vznikla landing page s niekoľkými hlavnými funkčnými prvkami.

**Interaktívna kalkulačka**

Úvodná časť stránky obsahovala kalkulačku prezentovanú formou vizuálnej „účtenky“. Jej účelom bolo zrozumiteľne zobrazovať investičné výpočty a umožniť používateľovi pracovať s ich výsledkami.

**Porovnanie ETF**

Súčasťou stránky bolo porovnanie investičných produktov. Niektoré informácie sa sprístupňovali prostredníctvom uzamknutej časti používateľského rozhrania.

**Lead generation formulár**

Primárny formulár obsahoval iba jedno vstupné pole. Cieľom bolo minimalizovať počiatočnú náročnosť interakcie a umožniť nadviazanie ďalšej komunikácie.

**Meranie interakcií**

Bolo implementované first-party meranie používateľských udalostí bez použitia cookies.

**Backend**

Súčasťou riešenia bol server a API potrebné na fungovanie formulára a nadväzujúcich procesov.

### Fáza 4 – Používateľské testovanie a optimalizácia

Po implementácii bola stránka otvorená a otestovaná v prehliadači, vrátane mobilného zobrazenia.

Pri kontrole sa zistilo, že prvá obrazovka na mobilných zariadeniach zaberá príliš veľa vertikálneho priestoru.

Hlavný agent preto upravil rozloženie úvodnej sekcie tak, aby bolo hlavné CTA viditeľné bez scrollovania.

Táto úprava bola zameraná na použiteľnosť a dostupnosť hlavnej akcie. Jej skutočný dopad na konverzný pomer však v rámci opísaného testovania nebol preukázaný.

### Fáza 5 – Zber dát o investoroch

Po dokončení počiatočného discovery boli spustení štyria samostatní zberoví agenti.

Každý spracovával približne 15 kandidátov podľa metodiky definovanej v `BRIEF-2`.

Agenti vyhľadávali informácie potrebné na klasifikáciu jednotlivých subjektov a zaznamenávali podklady na ich následné overenie.

Výsledkom zberovej fázy bolo 29 predbežne zaradených kandidátov.

Zároveň boli na základe dostupných trhových informácií pripravené podklady pre dokument `ODHAD.md`.

### Fáza 6 – Reklamné kreatívy

V rámci zadania B vznikli dve reklamné kreatívy.

Pripravili sa v HTML, z ktorého sa následne vytvorili PNG súbory.

Dôležitým rozhodnutím bolo použitie rovnakých dátových podkladov ako v investičnej kalkulačke.

Tým sa podporila číselná konzistencia medzi reklamnou komunikáciou a samotnou landing page.

### Fáza 7 – Testovanie konverzného procesu

Následne bol otestovaný kompletný používateľský prechod formulárom.

Test zahŕňal nasledujúci scenár:

1. Zadanie e-mailovej adresy s preklepom.
2. Opravu vstupu.
3. Odoslanie formulára.
4. Prechod do nadväzujúcej ankety.
5. Zadanie telefónneho čísla.
6. Kontrolu zaznamenaných udalostí.

Počas testovania hlavný agent identifikoval dve chyby vo vlastnom meracom systéme.

Obe chyby boli následne opravené.

Táto fáza ukázala význam end-to-end testovania. Samotná funkčnosť jednotlivých komponentov totiž nezaručuje správne fungovanie celého používateľského procesu.

### Fáza 8 – Overenie finančných informácií

Po dokončení ETF rešerše nasledovala kontrola vybraných kľúčových údajov oproti pôvodným dokumentom.

Medzi overované zdroje patrili:

- Fact sheet ETF VOO.
- Dokument KID spoločnosti Amundi.
- Cenník Komerční banky.
- Tlačová správa Generálneho finančného riaditeľstva ČR.

Kontrola viedla aj k úprave niektorých formulácií na landing page.

Príkladom bolo pôvodne príliš všeobecné tvrdenie o dostupnosti amerických ETF prostredníctvom brokerov.

Text bol upravený na presnejšiu formuláciu „většina brokerů neprodá“, aby nevyvolával dojem univerzálneho obmedzenia.

Tento prípad dokumentuje dôležitý rozdiel medzi automaticky získanou informáciou a informáciou overenou oproti primárnemu zdroju.

### Fáza 9 – Automatizované overovanie databázy

Pre zadanie A bol vytvorený validačný skript prvej úrovne (L1).

Kontrola zahŕňala:

- Platnosť a dostupnosť URL.
- Overenie údajov prostredníctvom ARES.
- Kontrolu časového okna investičnej aktivity.
- Prítomnosť povinných dátových polí.

Následne bolo spustených päť nezávislých overovacích agentov s modelom Claude Opus 5.5.

Títo agenti pracovali naslepo nad 29 predbežne zaradenými a 12 vyradenými subjektmi.

Princíp slepého overovania mal obmedziť ovplyvnenie výsledku pôvodným rozhodnutím zberového agenta.

### Fáza 10 – Rozhodovanie sporných prípadov

Po nezávislom overovaní nasledovala úroveň L3, v ktorej hlavný agent riešil rozpory medzi jednotlivými závermi.

Medzi konkrétne príklady patrili:

- Nesprávne priradené IČO pri subjekte N1.
- Family office chybne klasifikované ako VC investor.
- Subjekt Koopeo, ktorý bol nesprávne vyradený.

Tieto prípady ukázali, že formálne vyplnený záznam nemusí byť vecne správny.

Osobitná pozornosť sa preto venovala identite subjektov, ich skutočnej investičnej činnosti a správnemu použitiu klasifikačných kritérií.

Následne prebehla náhodná kontrola overovateľa, pri ktorej sa dosiahla zhoda v 7 zo 7 kontrolovaných prípadov.

Vzhľadom na obmedzenú veľkosť vzorky ide o čiastkový kontrolný výsledok, nie o dôkaz bezchybnosti celého procesu.

### Fáza 11 – Vyhodnotenie kvality a dokumentácia

Po dokončení výskumu a overovania vznikli súhrnné dokumenty.

**`VYSLEDKY.md`**

Obsahuje vyhodnotenie presnosti vrátane uvádzaných hodnôt 72 % a 86 % a príslušných intervalov spoľahlivosti.

**`NAKLADY.md`**

Odhad nákladov na rozšírenie databázy na celý svet (≈ 62 tis. €), postavený na číslach z pilotu.

**`PLAN.md`**

Bol doplnený o poznatky a metodické úpravy vyplývajúce z pilotného spracovania.

**`README.md`**

Obsahuje opis projektu, výstupov a identifikovaných chýb pri práci s AI.

### Fáza 12 – Finálna kontrola a publikovanie

Po dokončení lokálneho riešenia používateľ požiadal o kontrolu súladu so zadaním a o následné zverejnenie.

Hlavný agent skontroloval požiadavky a pripravil produkčné nasadenie.

Súčasťou príprav bolo:

- Doplnenie konfigurácie `vercel.json`.
- Príprava ukladania leadov v prostredí Vercel.
- Zverejnenie projektového repozitára na GitHube.
- Nasadenie zadania B na Vercel.

Výsledná landing page je dostupná na adrese:

https://clientelo-uloha.vercel.app/

Tým sa pôvodne lokálny projekt zmenil na verejne dostupné riešenie.

### Fáza 13 – Export a transparentnosť konverzácie

Na záver používateľ požiadal o export pracovnej konverzácie.

Pôvodný export však obsahoval aj súkromný kontext nesúvisiaci s projektom.

Z tohto dôvodu sa rozhodlo nezverejniť kompletný surový export, ale pripraviť štruktúrovaný súhrn relevantných pracovných krokov.

Podrobnejšie informácie zostali dostupné v projektových súboroch, zadaniach agentov a ich výstupoch.

---

## 4. Výsledky projektu

### 4.1 Zadanie A – databáza investorov

| Ukazovateľ | Výsledok |
|---|---:|
| Počet nájdených kandidátov | 60 |
| Predbežne zaradené subjekty | 29 |
| Finálny počet subjektov v databáze | 24 |
| Evidované dôkazy so zdrojom | 234 |
| Zberoví agenti | 4 |
| Nezávislí overovací agenti | 5 |
| Zhoda v náhodnej kontrole | 7/7 |

Z pôvodných 60 kandidátov bolo do finálnej databázy zaradených 24 subjektov.

*Uvedené čísla opisujú prechod kandidátov procesom výberu a overovania. Samy osebe nepredstavujú štatistickú mieru presnosti databázy.*

### 4.2 Zadanie B – landing page

| Ukazovateľ | Výsledok |
|---|---:|
| Spracované americké ETF | 12 |
| Európske alternatívy | UCITS dvojčatá |
| Reklamné kreatívy | 2 |
| Typy meraných udalostí | 22 |
| Interaktívna kalkulačka | Implementovaná |
| Formulár a nadväzujúca anketa | Implementované |
| End-to-end test formulára | Vykonaný |
| Produkčné nasadenie | Vercel |

Súčasťou výsledku nebola iba samotná webová stránka, ale aj podkladové finančné dáta, reklamné materiály, merací systém a report konverzného procesu.

### 4.3 Celkové výsledky

- **12 špecializovaných AI subagentov** použitých počas realizácie.
- **60 kandidátov** v počiatočnom výskume investorov.
- **24 finálnych záznamov** v databáze.
- **234 evidovaných dôkazov** so zdrojmi.
- **12 ETF** spracovaných s európskymi alternatívami.
- **22 typov udalostí** v systéme merania.
- **2 reklamné kreatívy**.
- **15 Git commitov** počas vývoja.

---

## 5. Kontrola kvality a práca s chybami AI

Jedným z najdôležitejších aspektov projektu bolo oddelenie generovania výstupov od ich kontroly.

Počas realizácie sa objavilo niekoľko typov problémov.

### 5.1 Chybná identifikácia subjektov

Pri niektorých investoroch vznikli problémy so správnym priradením identifikačných údajov.

Typickým príkladom bolo priradenie cudzieho IČO.

Tento problém ukazuje, že AI môže nájsť relevantne vyzerajúcu informáciu, ktorá však patrí inému subjektu.

### 5.2 Nesprávna klasifikácia

Ďalšou skupinou chýb bolo nesprávne zaradenie subjektov do investičných kategórií.

Napríklad family office bolo klasifikované ako VC investor, hoci také zaradenie nezodpovedalo stanoveným pravidlám.

### 5.3 Nesprávne vyradenie

Overovací proces identifikoval aj opačný problém, keď bol relevantný subjekt chybne vyradený.

Príkladom bol Koopeo.

### 5.4 Príliš kategorické formulácie

Pri práci s finančnými informáciami sa ukázalo riziko príliš širokých tvrdení.

Oprava textu o dostupnosti amerických ETF je konkrétnym príkladom spresnenia formulácie na základe overenia zdrojov.

### 5.5 Chyby implementácie

Počas testovania webovej aplikácie boli identifikované dve chyby merania, ktoré vznikli pri implementácii.

Ich odhalenie pri testovaní celého formulárového procesu potvrdzuje význam praktického overovania, nie iba kontroly zdrojového kódu.

**Zásadný poznatok:** Výstupy AI treba chápať ako pracovné výsledky, ktoré môžu vyžadovať nezávislú validáciu. Ani použitie viacerých agentov samo osebe nezaručuje správnosť, najmä ak pracujú s podobnými zdrojmi alebo používajú obdobné rozhodovacie postupy.

---

## 6. Limity a interpretácia výsledkov

Pri hodnotení projektu je dôležité rozlišovať medzi technickým dokončením úlohy a nezávisle preukázanou kvalitou výsledku.

Pri databáze investorov prebehlo viacúrovňové overovanie, napriek tomu nemožno predpokladať absolútnu správnosť všetkých údajov.

Uvádzané hodnoty presnosti 72 % a 86 % treba interpretovať podľa metodiky opísanej vo `VYSLEDKY.md`, vrátane veľkosti vzorky a intervalov spoľahlivosti.

Pri landing page prebehlo funkčné testovanie, opísaný priebeh však sám osebe nedokladá dlhodobú prevádzkovú stabilitu ani skutočný konverzný výkon.

Podobne nemožno z počtu použitých subagentov alebo commitov priamo odvodzovať kvalitu výsledného riešenia.

Tieto metriky slúžia predovšetkým ako informácia o rozsahu a organizácii realizácie.

---

## 7. Štruktúra dokumentácie

Podrobné informácie o projekte sú rozdelené do niekoľkých súborov a adresárov.

| Súbor / adresár | Obsah |
|---|---|
| `README.md` | Prehľad projektu, použitie a známe chyby |
| `zadanie-a/PLAN.md` | Metodika, dátový model a plán overovania |
| `zadanie-a/VYSLEDKY.md` | Vyhodnotenie kvality a presnosti |
| `zadanie-a/NAKLADY.md` | Odhad nákladov na rozšírenie na celý svet |
| `zadanie-a/ODHAD.md` | Odhad trhu a jeho podklady |
| `zadanie-a/agents/BRIEF-*.md` | Zadania jednotlivých agentov |
| `zadanie-a/data/raw/` | Surové výstupy zberu dát |
| `zadanie-a/verification/` | Výsledky nezávislého overovania |
| `zadanie-b/research/BRIEF-etf.md` | Zadanie ETF výskumu |
| `zadanie-b/research/` | Výskumné podklady a výstupy |

Táto štruktúra umožňuje oddeliť súhrnný opis projektu od podrobných technických a výskumných podkladov.

---

## 8. Poznámka k transparentnosti a ochrane súkromia

Tento dokument je redakčne upraveným súhrnom pracovnej konverzácie s Claude Code.

Nejde o doslovný prepis všetkých správ ani o kompletný export internej session.

Úplný export nebol zverejnený, pretože obsahoval súkromné informácie a kontext, ktoré nesúviseli s riešením projektu.

Na účely technickej kontroly a posúdenia práce s AI sú relevantné pracovné podklady, zadania subagentov, výsledky overovania a projektová dokumentácia.

Dokument zachytáva postup realizácie podľa dostupného súhrnu konverzácie k 29. 10. 2026.
