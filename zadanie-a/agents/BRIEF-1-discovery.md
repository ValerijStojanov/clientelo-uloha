# Brief 1 — vyhľadanie kandidátov (discovery)

Agent: Claude Sonnet (subagent), iba web search + web fetch, žiadne platené databázy.

## Úloha
Zostav čo najúplnejší zoznam subjektov, ktoré by niekto mohol označiť za
„VC fond z Českej republiky“. Neposudzuj, či sú to skutoční investori — to je
úloha ďalšej fázy. Naopak: chceme, aby v zozname boli aj hraničné prípady
(PE fondy, akcelerátory, investičné skupiny, CVC, crowdfundingové platformy,
poradcovia, verejné inštitúcie), aby sme vedeli otestovať pravidlá vyradenia.

## Zdroje (použi aspoň 4 rôzne typy)
1. Členovia asociácie CVCA (cvca.cz) a Invest Europe.
2. Register ČNB (JERRS) — správcovia investičných fondov / správcovia s povolením
   ako „správce do limitu“ / EuVECA.
3. Portfólio EIF / Národní rozvojový fond / programy financované z EU, kde sú
   menované české VC fondy.
4. Médiá a rebríčky: CzechCrunch, Forbes CZ, Hospodářské noviny, E15,
   Dealroom (verejné stránky), Crunchbase (verejné stránky), Wikipedia.
5. Zoznamy investorov od startupových komunít (StartupJobs, CzechInvest, CzechStartups).

## Výstup
Súbor `zadanie-a/data/raw/candidates.json` — pole objektov:
```json
{"name": "...", "website": "https://...", "found_in": [{"url": "https://...", "source_type": "association|regulator|eif_or_public|media|database|community", "retrieved": "2026-10-29"}], "note": "max 1 veta, čo o subjekte zdroj hovorí"}
```
- Cieľ: 40–60 kandidátov. Duplicity zlúč (jeden záznam na správcovskú firmu,
  nie na jednotlivé fondy).
- `found_in` uveď všetky zdroje, v ktorých si subjekt našiel (počet výskytov
  použijeme ako signál).
- Nič si nevymýšľaj. Ak nemáš URL, kde sa subjekt spomína, do zoznamu ho nedávaj.
- Na konci vráť krátke zhrnutie: koľko kandidátov, z ktorých zdrojov, ktoré
  zdroje nefungovali (paywall, blokovanie, zastarané).
