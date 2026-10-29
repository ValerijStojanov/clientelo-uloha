# Dokumentace průběhu spolupráce s Claude Code

**Projekt:** Zpracování zadání A – databáze investorů a zadání B – investiční landing page  
**Datum realizace:** 29. 10. 2026  
**Hlavní nástroj:** Claude Code (desktop)  
**Hlavní model:** Claude Opus 5.5  
**Subagenti:** Claude Sonnet 5.5 a Claude Opus 5.5  
**Výsledné prostředí:** GitHub, Vercel, lokální vývojové prostředí

> Strukturovaný souhrn pracovní konverzace, nikoliv doslovný export (důvod v sekci 8).
> Podrobnosti o práci s AI jsou v hlavním [README.md](../README.md#ako-som-pracoval-s-ai).

---

## 1. Zadání projektu

Projekt se skládal ze dvou hlavních částí, které byly řešeny v rámci jedné pracovní session.

### 1.1 Zadání A – databáze investorů

První část byla zaměřena na identifikaci, klasifikaci a ověřování relevantních investorů podle předem stanovených kritérií.

Požadovaným výsledkem byla strukturovaná databáze subjektů s doložitelnými informacemi a zdroji.

Klíčové činnosti zahrnovaly:

1. Vyhledání potenciálně relevantních investorů.
2. Definování pravidel pro jejich zařazení nebo vyřazení.
3. Získání veřejně dostupných informací.
4. Kontrolu identity a investiční aktivity.
5. Ověření výsledků nezávislými AI agenty.
6. Vyřešení sporných případů.
7. Vyhodnocení přesnosti a kvality získaných dat.

### 1.2 Zadání B – investiční landing page

Druhá část zahrnovala návrh a implementaci webové stránky zaměřené na investiční téma.

Součástí řešení byly:

- Landing page s interaktivní investiční kalkulačkou.
- Porovnání vybraných ETF a jejich evropských UCITS alternativ.
- Formulář pro získávání potenciálních zákazníků.
- Navazující dotazníkový proces.
- Systém měření uživatelských interakcí.
- Dvě reklamní kreativy.
- Testování uživatelského průchodu.
- Příprava produkčního nasazení.

Obě zadání byla nejprve vyvíjena lokálně. Publikace na GitHub a Vercel proběhla až po následném výslovném požadavku uživatele.

---

## 2. Použité AI nástroje a organizace práce

### 2.1 Hlavní AI agent

Hlavním koordinátorem projektu byl Claude Opus 5.5 prostřednictvím aplikace Claude Code.

Jeho úlohou bylo především:

- Analyzovat požadavky zadání.
- Navrhnout plán realizace.
- Rozdělovat práci mezi subagenty.
- Implementovat webovou aplikaci.
- Vyhodnocovat výsledky dílčích úkolů.
- Kontrolovat a opravovat nalezené chyby.
- Připravovat finální dokumentaci.

Hlavní agent fungoval jako centrální koordinační vrstva mezi zadáním, vývojem, výzkumem a ověřováním výsledků.

### 2.2 Specializovaní subagenti

Pro jednotlivé úkoly bylo využito celkem **12 subagentů**.

| Oblast | Počet agentů | Úloha |
|---|---:|---|
| Discovery investorů | 1 | Vyhledání 60 kandidátů |
| Sběr informací | 4 | Zpracování kandidátů podle metodiky |
| Nezávislé ověřování | 5 | Kontrola zařazení a vyřazení |
| ETF research | 1 | Sběr produktových a regulatorních dat |
| Odhad trhu | 1 | Podklady pro odhad velikosti trhu |
| **Celkem** | **12** | |

Pro sběr dat byl použit Claude Sonnet 5.5, zatímco nezávislé ověřování probíhalo pomocí Claude Opus 5.5.

Toto rozdělení umožnilo využít různé modely podle charakteru úkolu. Rutinnější rešeršní činnosti byly odděleny od náročnějšího rozhodování a kontroly.

Důležitým principem bylo, že výsledek jednoho AI agenta nebyl automaticky považován za ověřený.

---

## 3. Průběh realizace

### Fáze 1 – Analýza zadání a plánování

Na začátku uživatel poskytl e-mail obsahující obě zadání a požádal o jejich realizaci.

Claude nejprve identifikoval dvě samostatné pracovní oblasti a vyžádal si upřesnění rozsahu a způsobu publikace.

Uživatel potvrdil, že chce realizovat obě části, avšak zpočátku pouze lokálně.

Následně byl založen projektový repozitář a vytvořen soubor `PLAN.md`.

Plán obsahoval zejména:

- Pracovní definici relevantního investora.
- Kritéria zařazení do databáze.
- Jedenáct kategorií důvodů vyřazení (X1–X11).
- Návrh datového modelu.
- Víceúrovňový systém ověřování (L1–L4).
- Postup řešení nejednoznačných případů.

**Význam této fáze:** Před zahájením samotného sběru dat byla stanovena jednotná metodika. Tím se snížilo riziko, že jednotliví agenti budou stejná kritéria interpretovat rozdílně.

### Fáze 2 – Paralelní výzkum

Po vytvoření plánu byli spuštěni tři výzkumní subagenti.

První agent se zaměřil na vyhledání 60 potenciálních českých VC investorů.

Druhý agent zpracovával informace o ETF, jejich vlastnostech, evropských alternativách a dostupných zdrojích.

Třetí agent vyhledával veřejné údaje o počtech investorů a související informace využitelné pro odhad velikosti trhu.

Výzkumné úkoly probíhaly paralelně, což umožnilo pokračovat ve vývoji webové aplikace bez nutnosti čekat na dokončení všech rešerší.

### Fáze 3 – Implementace landing page

Zatímco subagenti zpracovávali výzkumné úkoly, hlavní agent implementoval zadání B.

Vznikla landing page s několika hlavními funkčními prvky.

**Interaktivní kalkulačka**

Úvodní část stránky obsahovala kalkulačku prezentovanou formou vizuální „účtenky“. Jejím účelem bylo srozumitelně zobrazovat investiční výpočty a umožnit uživateli pracovat s jejich výsledky.

**Porovnání ETF**

Součástí stránky bylo porovnání investičních produktů. Některé informace byly zpřístupňovány prostřednictvím uzamčené části uživatelského rozhraní.

**Lead generation formulář**

Primární formulář obsahoval pouze jedno vstupní pole. Cílem bylo minimalizovat počáteční náročnost interakce a umožnit navázání další komunikace.

**Měření interakcí**

Bylo implementováno first-party měření uživatelských událostí bez využití cookies.

**Backend**

Součástí řešení byl server a API potřebné pro fungování formuláře a navazujících procesů.

### Fáze 4 – Uživatelské testování a optimalizace

Po implementaci byla stránka otevřena a testována v prohlížeči, včetně mobilního zobrazení.

Při kontrole bylo zjištěno, že první obrazovka na mobilních zařízeních obsahuje příliš mnoho vertikálního prostoru.

Hlavní agent proto upravil rozložení úvodní sekce tak, aby bylo hlavní CTA viditelné bez nutnosti scrollování.

Tato úprava byla zaměřena na použitelnost a přístupnost hlavní akce. Její skutečný dopad na konverzní poměr však nebyl v rámci popsaného testování prokázán.

### Fáze 5 – Sběr dat o investorech

Po dokončení počátečního discovery byli spuštěni čtyři samostatní sběroví agenti.

Každý zpracovával přibližně 15 kandidátů podle metodiky definované v `BRIEF-2`.

Agenti vyhledávali informace potřebné pro klasifikaci jednotlivých subjektů a zaznamenávali podklady pro jejich následné ověření.

Výsledkem sběrové fáze bylo 29 předběžně zařazených kandidátů.

Zároveň byly na základě dostupných tržních informací připraveny podklady pro dokument `ODHAD.md`.

### Fáze 6 – Reklamní kreativy

V rámci zadání B vznikly dvě reklamní kreativy.

Jejich příprava probíhala prostřednictvím HTML, ze kterého byly následně vytvořeny PNG soubory.

Důležitým rozhodnutím bylo využití stejných datových podkladů jako v investiční kalkulačce.

Tím byla podpořena numerická konzistence mezi reklamní komunikací a samotnou landing page.

### Fáze 7 – Testování konverzního procesu

Následně byl otestován kompletní uživatelský průchod formulářem.

Test zahrnoval následující scénář:

1. Zadání e-mailové adresy s překlepem.
2. Opravu vstupu.
3. Odeslání formuláře.
4. Přechod do navazující ankety.
5. Zadání telefonního čísla.
6. Kontrolu zaznamenaných událostí.

Během testování hlavní agent identifikoval dvě chyby ve vlastním měřicím systému.

Obě chyby byly následně opraveny.

Tato fáze ukázala význam end-to-end testování. Samotná funkčnost jednotlivých komponent totiž nezaručuje správné fungování celého uživatelského procesu.

### Fáze 8 – Ověření finančních informací

Po dokončení ETF rešerše následovala kontrola vybraných klíčových údajů proti původním dokumentům.

Mezi ověřované zdroje patřily:

- Fact sheet ETF VOO.
- Dokument KID společnosti Amundi.
- Ceník Komerční banky.
- Tisková zpráva Generálního finančního ředitelství.

Kontrola vedla také k úpravě některých formulací na landing page.

Příkladem bylo původně příliš obecné tvrzení o dostupnosti amerických ETF prostřednictvím brokerů.

Text byl upraven na přesnější formulaci „většina brokerů neprodá“, aby nevyvolával dojem univerzálního omezení.

Tento případ dokumentuje důležitý rozdíl mezi automaticky získanou informací a informací ověřenou proti primárnímu zdroji.

### Fáze 9 – Automatizované ověřování databáze

Pro zadání A byl vytvořen validační skript první úrovně (L1).

Kontrola zahrnovala:

- Platnost a dostupnost URL.
- Ověření údajů prostřednictvím ARES.
- Kontrolu časového okna investiční aktivity.
- Přítomnost povinných datových polí.

Následně bylo spuštěno pět nezávislých ověřovacích agentů používajících Claude Opus 5.5.

Tito agenti pracovali naslepo nad 29 předběžně zařazenými a 12 vyřazenými subjekty.

Princip slepého ověřování měl omezit ovlivnění výsledku původním rozhodnutím sběrového agenta.

### Fáze 10 – Rozhodování sporných případů

Po nezávislém ověřování následovala úroveň L3, ve které hlavní agent řešil rozpory mezi jednotlivými závěry.

Mezi konkrétní příklady patřily:

- Nesprávně přiřazené IČO u subjektu N1.
- Family office chybně klasifikované jako VC investor.
- Subjekt Koopeo, který byl nesprávně vyřazen.

Tyto případy ukázaly, že formálně vyplněný záznam nemusí být věcně správný.

Zvláštní pozornost byla proto věnována identitě subjektů, jejich skutečné investiční činnosti a správnému použití klasifikačních kritérií.

Následně proběhla namátková kontrola ověřovatele, při které bylo dosaženo shody v 7 ze 7 kontrolovaných případů.

Vzhledem k omezené velikosti vzorku jde o dílčí kontrolní výsledek, nikoliv o důkaz bezchybnosti celého procesu.

### Fáze 11 – Vyhodnocení kvality a dokumentace

Po dokončení výzkumu a ověřování byly vytvořeny souhrnné dokumenty.

**`VYSLEDKY.md`**

Obsahoval vyhodnocení přesnosti, včetně uváděných hodnot 72 % a 86 % a příslušných intervalů spolehlivosti.

**`NAKLADY.md`**

Odhad nákladů na rozšíření databáze na celý svět (≈ 62 tis. €), postavený na číslech z pilotu.

**`PLAN.md`**

Byl doplněn o poznatky a metodické úpravy vyplývající z pilotního zpracování.

**`README.md`**

Obsahoval popis projektu, výstupů a identifikovaných chyb při práci s AI.

### Fáze 12 – Finální kontrola a publikace

Po dokončení lokálního řešení uživatel požádal o kontrolu souladu se zadáním a o následné zveřejnění.

Hlavní agent provedl kontrolu požadavků a připravil produkční nasazení.

Součástí příprav bylo:

- Doplnění konfigurace `vercel.json`.
- Příprava ukládání leadů v prostředí Vercel.
- Zveřejnění projektového repozitáře na GitHubu.
- Nasazení zadání B na Vercel.

Výsledná landing page je dostupná na adrese:

https://clientelo-uloha.vercel.app/

Tím se původně lokální projekt změnil na veřejně dostupné řešení.

### Fáze 13 – Export a transparentnost konverzace

V závěru uživatel požádal o export pracovní konverzace.

Původní export však obsahoval také soukromý kontext nesouvisející s projektem.

Z tohoto důvodu bylo rozhodnuto nezveřejňovat kompletní surový export, ale připravit strukturovaný souhrn relevantních pracovních kroků.

Detailnější informace zůstaly dostupné v projektových souborech, zadáních agentů a jejich výstupech.

---

## 4. Výsledky projektu

### 4.1 Zadání A – databáze investorů

| Ukazatel | Výsledek |
|---|---:|
| Počet nalezených kandidátů | 60 |
| Předběžně zařazené subjekty | 29 |
| Finální počet subjektů v databázi | 24 |
| Evidované důkazy se zdrojem | 234 |
| Sběroví agenti | 4 |
| Nezávislí ověřovací agenti | 5 |
| Shoda v namátkové kontrole | 7/7 |

Z původních 60 kandidátů bylo do finální databáze zařazeno 24 subjektů.

*Uvedená čísla popisují průchod kandidátů procesem výběru a ověřování. Sama o sobě nepředstavují statistickou míru přesnosti databáze.*

### 4.2 Zadání B – landing page

| Ukazatel | Výsledek |
|---|---:|
| Zpracovaná americká ETF | 12 |
| Evropské alternativy | UCITS dvojčata |
| Reklamní kreativy | 2 |
| Typy měřených událostí | 22 |
| Interaktivní kalkulačka | Implementována |
| Formulář a navazující anketa | Implementovány |
| End-to-end test formuláře | Proveden |
| Produkční nasazení | Vercel |

Součástí výsledku byla nejen samotná webová stránka, ale také podkladová finanční data, reklamní materiály, měřicí systém a report konverzního procesu.

### 4.3 Celkové výsledky

- **12 specializovaných AI subagentů** použitých během realizace.
- **60 kandidátů** v počátečním výzkumu investorů.
- **24 finálních záznamů** v databázi.
- **234 evidovaných důkazů** se zdroji.
- **12 ETF** zpracovaných s evropskými alternativami.
- **22 typů událostí** v systému měření.
- **2 reklamní kreativy**.
- **15 Git commitů** během vývoje.

---

## 5. Kontrola kvality a práce s chybami AI

Jedním z nejdůležitějších aspektů projektu bylo oddělení generování výstupů od jejich kontroly.

Během realizace se objevilo několik typů problémů.

### 5.1 Chybná identifikace subjektů

U některých investorů vznikly problémy se správným přiřazením identifikačních údajů.

Typickým příkladem bylo přiřazení cizího IČO.

Tento problém ukazuje, že AI může najít relevantně vypadající informaci, která však patří jinému subjektu.

### 5.2 Nesprávná klasifikace

Další skupinou chyb bylo nesprávné zařazení subjektů do investičních kategorií.

Například family office bylo klasifikováno jako VC investor, přestože takové zařazení neodpovídalo stanoveným pravidlům.

### 5.3 Nesprávné vyřazení

Ověřovací proces identifikoval také opačný problém, kdy byl relevantní subjekt chybně vyřazen.

Příkladem byl Koopeo.

### 5.4 Příliš kategorické formulace

Při práci s finančními informacemi se ukázalo riziko příliš širokých tvrzení.

Oprava textu o dostupnosti amerických ETF představuje konkrétní příklad zpřesnění formulace na základě ověření zdrojů.

### 5.5 Chyby implementace

Během testování webové aplikace byly identifikovány dvě chyby měření, které vznikly při implementaci.

Jejich odhalení při testování celého formulářového procesu potvrzuje význam praktického ověřování, nikoliv pouze kontroly zdrojového kódu.

**Zásadní poznatek:** Výstupy AI je nutné chápat jako pracovní výsledky, které mohou vyžadovat nezávislou validaci. Ani použití více agentů samo o sobě nezaručuje správnost, zejména pokud pracují s podobnými zdroji nebo používají obdobné rozhodovací postupy.

---

## 6. Limity a interpretace výsledků

Při hodnocení projektu je důležité rozlišovat mezi technickým dokončením úkolu a nezávisle prokázanou kvalitou výsledku.

U databáze investorů bylo provedeno víceúrovňové ověřování, přesto nelze předpokládat absolutní správnost všech údajů.

Uváděné hodnoty přesnosti 72 % a 86 % je nutné interpretovat podle metodiky popsané v `VYSLEDKY.md`, včetně velikosti vzorku a intervalů spolehlivosti.

U landing page bylo provedeno funkční testování, ale popsaný průběh sám o sobě nedokládá dlouhodobou provozní stabilitu ani skutečný konverzní výkon.

Podobně nelze z počtu použitých subagentů nebo commitů přímo odvozovat kvalitu výsledného řešení.

Tyto metriky slouží především jako informace o rozsahu a organizaci realizace.

---

## 7. Struktura dokumentace

Podrobné informace o projektu jsou rozděleny do několika souborů a adresářů.

| Soubor / adresář | Obsah |
|---|---|
| `README.md` | Přehled projektu, použití a známé chyby |
| `zadanie-a/PLAN.md` | Metodika, datový model a plán ověřování |
| `zadanie-a/VYSLEDKY.md` | Vyhodnocení kvality a přesnosti |
| `zadanie-a/NAKLADY.md` | Odhad nákladů na rozšíření na celý svět |
| `zadanie-a/ODHAD.md` | Odhad trhu a jeho podklady |
| `zadanie-a/agents/BRIEF-*.md` | Zadání jednotlivých agentů |
| `zadanie-a/data/raw/` | Surové výstupy sběru dat |
| `zadanie-a/verification/` | Výsledky nezávislého ověřování |
| `zadanie-b/research/BRIEF-etf.md` | Zadání ETF výzkumu |
| `zadanie-b/research/` | Výzkumné podklady a výstupy |

Tato struktura umožňuje oddělit souhrnný popis projektu od detailních technických a výzkumných podkladů.

---

## 8. Poznámka k transparentnosti a ochraně soukromí

Tento dokument je redakčně upraveným souhrnem pracovní konverzace s Claude Code.

Nejedná se o doslovný přepis všech zpráv ani o kompletní export interní session.

Úplný export nebyl zveřejněn, protože obsahoval soukromé informace a kontext, které nesouvisely s řešením projektu.

Pro účely technické kontroly a posouzení práce s AI jsou relevantní pracovní podklady, zadání subagentů, výsledky ověřování a projektová dokumentace.

Dokument zachycuje postup realizace podle dostupného souhrnu konverzace k datu 29. 10. 2026.
