# Brief 3 — nezávislé overenie (L2)

Agent: Claude Opus (iný model ako zberový agent → menej korelovaných chýb).
Overovateľ **nevidí** zdôvodnenie zberového agenta, jeho `confidence` ani
`decision_reason`. Dostane iba tvrdenia a URL.

## Pre každý záznam
1. **Pole po poli:** otvor uvedený zdroj (WebFetch) a označ tvrdenie:
   - `supported` — zdroj hodnotu doslovne alebo jednoznačne uvádza,
   - `partial` — zdroj hodnotu uvádza, ale inak (iné číslo, iný rok, širší sektor),
   - `not_supported` — zdroj hodnotu neuvádza alebo ju vyvracia,
   - `unavailable` — stránka neodpovedá / paywall / 404.
   Pri `partial` a `not_supported` napíš, čo zdroj skutočne hovorí.
2. **Zaradenie nezávisle:** bez ohľadu na dodané tvrdenia sám nájdi (WebSearch)
   aspoň jednu investíciu subjektu za posledných 24 mesiacov z nezávislého
   zdroja. Potom rozhodni:
   - `is_active_investor`: true / false / unclear,
   - `type_correct`: je to VC (vrátane CVC / akcelerátora s equity)? true / false / unclear,
   - `hq_in_cz`: true / false / unclear.
3. Nič nedomýšľaj. Ak niečo nevieš overiť, napíš `unclear` a prečo.

## Výstup
JSON pole objektov:
```json
{"name": "...", "fields": {"legal_name": {"verdict": "supported", "note": ""}, "...": {}},
 "own_deal_found": {"company": "...", "date": "...", "url": "..."},
 "is_active_investor": true, "type_correct": true, "hq_in_cz": true,
 "comment": "max 2 vety"}
```
