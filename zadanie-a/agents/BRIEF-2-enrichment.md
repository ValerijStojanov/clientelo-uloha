# Brief 2 — zber údajov a zaradenie (enrichment + rules)

Agent: Claude Sonnet (subagent), web search + web fetch + ARES API.
Pravidlá zaradenia/vyradenia: `zadanie-a/PLAN.md`, sekcie 1–3. Prečítaj ich celé.

## Vstup
Zoznam kandidátov (meno + web) — dostaneš ho v zadaní.

## Čo urobiť pre každého kandidáta
1. Zisti, čo subjekt naozaj robí (web, médiá). Rozhodni `include` / `exclude`
   podľa PLAN.md. Pri `exclude` uveď kódy X1–X11 a jednu vetu prečo.
2. Pri `include` (a aj pri `exclude`, ak je to VC mimo ČR alebo neaktívne VC)
   vyplň polia nižšie. **Každá hodnota musí mať aspoň jeden zdroj.**
3. Nájdi **najnovšiu investíciu** (firma, dátum, kolo) a **aspoň jeden
   nezávislý dôkaz** investície — zdroj, ktorý NIE JE web investora
   (médiá, tlačová správa portfóliovej firmy, register).
4. IČO a právny názov over v ARES:
   `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/vyhledat`
   (POST JSON `{"obchodniJmeno": "...", "pocet": 5}`) alebo
   `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/{ico}`.

## Zakázané
- Doplniť hodnotu z pamäti bez URL. Ak hodnotu nenájdeš → `null` a
  `"basis": "not_public"`.
- Použiť Crunchbase/Dealroom/Wikipedia ako **jediný** zdroj hodnoty.
- Prepočítavať meny — uveď pôvodnú sumu a menu, prepočet robí skript.
- Citát dlhší ako 25 slov.

## Formát výstupu (JSON pole, jeden objekt na kandidáta)
```json
{
  "name": "Example Ventures",
  "decision": "include",
  "exclusion_codes": [],
  "decision_reason": "Nezávislý VC fond, 3 investície v 2025–2026.",
  "type": "VC", "subtype": "independent_vc", "type_secondary": null,
  "confidence": "high",
  "fields": {
    "legal_name":   {"value": "Example Ventures SICAV a.s.", "basis": "registry", "src": [S]},
    "registry_id":  {"value": "12345678", "basis": "registry", "src": [S]},
    "hq_city":      {"value": "Praha", "basis": "registry", "src": [S]},
    "website":      {"value": "https://example.vc", "basis": "stated", "src": [S]},
    "sectors":      {"value": ["software", "fintech"], "raw": "B2B SaaS, fintech", "basis": "stated", "src": [S]},
    "stages":       {"value": ["seed", "A"], "basis": "stated", "src": [S]},
    "ticket":       {"value": {"min": 500000, "max": 3000000, "currency": "EUR"}, "basis": "stated|derived|not_public", "derivation": "ak derived: z čoho", "src": [S]},
    "capital":      {"value": {"amount": 60000000, "currency": "EUR"}, "measure": "veľkosť fondu II / AUM / súčet fondov", "as_of": "2025-03", "basis": "stated|registry|media|not_public", "src": [S]},
    "last_investment": {"value": {"company": "...", "date": "2026-09-15", "round": "seed"}, "basis": "media", "src": [S]},
    "independent_deal_evidence": {"value": {"company": "...", "date": "..."}, "basis": "media|portfolio_pr|registry", "src": [S]}
  },
  "open_questions": "čo sa nepodarilo overiť"
}
```
kde `S` = `{"url": "...", "publisher": "...", "published": "YYYY-MM-DD alebo null", "retrieved": "2026-10-29", "quote": "doslovný úryvok ≤ 25 slov, ktorý hodnotu dokladá"}`.

Sektory normalizuj do: software, fintech, health, energy_climate, deeptech, ai,
consumer, mobility, proptech, edtech, security, agri_food, industry,
media_gaming, generalist. Pôvodné znenie daj do `raw`.
