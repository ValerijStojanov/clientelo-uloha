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
| Kandidátov na spracovanie | ≈ 2,2 × viac = **~120 tis.** | pilot: 60 kandidátov → {{PILOT_INCLUDED}} zaradených |
| Volania nástrojov na kandidáta | ~8 (2–3 vyhľadávania, 5–6 stránok) | pilot: 110–122 volaní na 15 kandidátov |

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

## 3. Celkom (stredný scenár: 55 tis. investorov, 120 tis. kandidátov)

| Položka | Množstvo | Náklad |
|---|---|---|
| Zber a zaradenie | 120 000 kandidátov × 0,18 $ | **≈ 21 600 $** |
| Overenie L2 | 55 000 × 0,41 $ | **≈ 22 600 $** |
| Rozhodnutie nezhôd agentom | {{DISAGREE_PCT}} × 55 000 × 0,41 $ | **≈ {{DISAGREE_COST}} $** |
| Ručná kontrola L3 | 3 % náhodná vzorka (1 650) + 20 % nezhôd, ktoré agent nevyrieši | **≈ {{HUMAN_COST}} €** |
| Vývoj pipeline (orchestrácia, deduplikácia, registre, UI na kontrolu) | 1 vývojár × 6–8 týždňov | interné |
| **Jednorazovo spolu (bez vývoja)** | | **≈ {{TOTAL_ONEOFF}}** |
| Obnova | 55 000 × 0,05 $ × 2 / rok | **≈ 5 500 $ / rok** |

Rozpätie: pesimistický scenár (75 tis. investorov, 2× viac tokenov na záznam)
≈ 2,5 × stredného; optimistický (40 tis., Batch API so zľavou 50 % tam, kde nevadí
oneskorenie) ≈ 0,5 ×.

## 4. Kde sa dá ušetriť a kde nie

- **Batch API (−50 %)** pre zber a obnovu — nevadí, že výsledok príde do 24 h.
- **Registre namiesto webu** všade, kde existujú (SEC Form ADV/D, ESMA, Companies
  House, ARES): lacnejšie, presnejšie a dajú sa sťahovať hromadne bez LLM.
- **Overovanie nešetriť.** Pilot ukázal (pozri [VYSLEDKY.md](VYSLEDKY.md)), že
  zberový agent sa mýli práve v číslach (veľkosť fondu, ticket) a v odkazoch na
  zdroj — teda v tom, kvôli čomu klient databázu kupuje.
- **Ručná kontrola je najdrahšia položka na záznam**, preto ju smerujeme len na
  náhodnú vzorku (meranie presnosti) a na nezhody, ktoré agent nevyrieši.
