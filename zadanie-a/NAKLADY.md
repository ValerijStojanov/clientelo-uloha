# Odhad nákladov na rozšírenie na celý svet

Cenník Claude API k 29. 10. 2026 ([platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing)):

| Model | Vstup | Vstup z cache | Výstup |
|---|---|---|---|
| Claude Sonnet 5.5 (zber) | 2 $ / 1M tokenov | 0,10 $ | 10 $ |
| Claude Opus 5.5 (overovanie) | 4 $ | 0,20 $ | 20 $ |
| Web search | 10 $ / 1 000 vyhľadávaní | | |
| Web fetch | bez príplatku (len tokeny) | | |

## 1. Koľko práce

| Veličina | Hodnota | Z čoho |
|---|---|---|
| Identifikovateľní investori | 40 – 75 tis. (stred **55 tis.**) | [ODHAD.md](ODHAD.md) |
| Kandidátov na spracovanie | ≈ 2,5 × viac = **~140 tis.** | pilot: 60 kandidátov → 24 vo finálnej DB |
| Volania nástrojov na kandidáta | ~8 (2–3 vyhľadávania, 5–6 stránok) | pilot: 465 volaní / 60 kandidátov = 7,8 |
| Volania nástrojov na overenie | ~8 | pilot: 306 volaní / 41 overení (29 zaradených + 12 vyradených) = 7,5 |
| Podiel záznamov s nezhodou L0 vs. L2 | **31 %** | pilot: 9 z 29 (typ, sídlo, aktivita) |

## 2. Náklady na jeden záznam (predpoklady)

Agent pri každom kroku znova číta svoj kontext; s prompt cachingom platí plnú
cenu len za nové tokeny. Predpoklad na kandidáta: **150 tis. vstupných tokenov
(80 % z cache) + 8 tis. výstupných**; na overenie jedného zaradeného záznamu
**200 tis. vstupných (80 % z cache) + 10 tis. výstupných**.

| Krok | Model | Výpočet | Na záznam |
|---|---|---|---|
| Zber + pravidlá (na kandidáta) | Sonnet 5.5 | 30k × 2 $ + 120k × 0,10 $ + 8k × 10 $ (/1M) + 3 vyhľ. × 0,01 $ | **≈ 0,18 $** |
| Nezávislé overenie L2 (na zaradený) | Opus 5.5 | 40k × 4 $ + 160k × 0,20 $ + 10k × 20 $ (/1M) + 2 vyhľ. | **≈ 0,41 $** |
| Rozhodnutie nezhôd (agent) | Opus 5.5 | ako L2, len pri nezhodách | ≈ 0,41 $ |
| Ručná kontrola L3 | človek | ~6 min × 25 €/h | **≈ 2,50 €** |
| Obnova aktivity (každých 6 mes.) | Sonnet 5.5 | len „nová investícia od dátumu X?“ | ≈ 0,05 $ |

## 3. Celkom (stredný scenár: 55 tis. investorov, 140 tis. kandidátov)

| Položka | Množstvo | Náklad |
|---|---|---|
| Zber a zaradenie | 140 000 kandidátov × 0,18 $ | **≈ 25 200 $** |
| Overenie L2 | 55 000 × 0,41 $ | **≈ 22 600 $** |
| Rozhodnutie nezhôd agentom | 31 % × 55 000 × 0,41 $ | **≈ 7 000 $** |
| Ručná kontrola L3 | 3 % náhodná vzorka (1 650) + 20 % nezhôd, ktoré agent nevyrieši (3 410) = 5 060 × 2,50 € | **≈ 12 700 €** |
| Vývoj pipeline (orchestrácia, deduplikácia, registre, UI na kontrolu) | 1 vývojár × 6–8 týždňov | interné |
| **Jednorazovo spolu (bez vývoja)** | | **≈ 54 800 $ + 12 700 € ≈ 62 000 €** |
| Obnova | 55 000 × 0,05 $ × 2 / rok | **≈ 5 500 $ / rok** |

Rozpätie: pesimistický scenár (75 tis. investorov, 2× viac tokenov na záznam)
≈ 2,5 × stredného; optimistický (40 tis., Batch API so zľavou 50 % tam, kde nevadí
oneskorenie) ≈ 0,5 ×.

### Ako sedí predpoklad tokenov s pilotom

Claude Code hlási pre 4 zberových agentov spolu ~1,0 mil. tokenov, t. j. ~17 tis.
na kandidáta. Toto číslo zjavne nezahŕňa opakované čítanie kontextu pri každom
kroku (inak by pri ~8 krokoch vychádzalo vyššie), takže môj predpoklad 158 tis.
tokenov na kandidáta je **konzervatívny horný odhad**. Skutočnú cenu treba
zmerať na API (usage na úrovni requestu) pri prvých 1 000 kandidátoch.
Čas: zberový agent spracuje 15 kandidátov za 14–22 minút, pri paralelizácii
(50 agentov) je 140 tis. kandidátov ≈ 3–4 dni behu.

## 4. Kde sa dá ušetriť a kde nie

- **Batch API (−50 %)** pre zber a obnovu — nevadí, že výsledok príde do 24 h.
- **Registre namiesto webu** všade, kde existujú (SEC Form ADV/D, ESMA, Companies
  House, ARES): lacnejšie, presnejšie a dajú sa sťahovať hromadne bez LLM.
- **Overovanie nešetriť.** Pilot ukázal (pozri [VYSLEDKY.md](VYSLEDKY.md)), že
  zberový agent sa mýli práve v číslach (veľkosť fondu, ticket) a v odkazoch na
  zdroj — teda v tom, kvôli čomu klient databázu kupuje.
- **Ručná kontrola je najdrahšia položka na záznam**, preto ju smerujeme len na
  náhodnú vzorku (meranie presnosti) a na nezhody, ktoré agent nevyrieši.
