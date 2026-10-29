# Odhad: koľko investorov sa dá získať z verejných zdrojov a s akou spoľahlivosťou

Všetky vstupné čísla, ich URL a dátumy sú v [agents/scale-sources.md](agents/scale-sources.md)
(zber: agent podľa [BRIEF-0](agents/BRIEF-0-scale.md); kľúčové čísla som ručne
porovnal so zdrojmi — NVCA Yearbook 2026, SEC IA statistics 2025, Invest Europe 2026, Deloitte 2024, EBAN 2025).

## Ako čítať tabuľku

- **Existuje** = koľko subjektov daného typu podľa najlepších verejných zdrojov je.
- **Identifikovateľné** = koľko z nich vieme z verejných zdrojov nájsť **a doložiť
  datovanou investíciou** (t. j. prejdú pravidlami z [PLAN.md](PLAN.md)). Toto číslo
  je vždy menšie — investor, ktorý nezanecháva verejnú stopu, do DB nevstúpi.
- **Spoľahlivosť** = očakávaná presnosť zaradenia (je to naozaj aktívny investor
  správneho typu) a úplnosť polí ticket / kapitál.

## Odhad podľa typu

| Typ | Existuje (zdroj) | Identifikovateľné z verejných zdrojov | Presnosť zaradenia | Ticket verejne | Kapitál verejne |
|---|---|---|---|---|---|
| **VC + CVC** | USA: 2 984 firiem (NVCA 2026), 4 172 aktívnych US VC investorov; SEC ADV: 3 273 poradcov s VC fondom. Európa: 253 VC firiem uzavrelo fond len v 2025 (Invest Europe). Čína: ~11 600 PE+VC správcov (AMAC). Preqin: 21 254 „aktívnych“ VC firiem globálne (široká definícia) | **10 000 – 15 000** | 95 %+ | ~50 % | ~65 % |
| **Private equity** | SEC ADV: 4 603 poradcov s PE fondom; Preqin: 31 653 aktívnych PE firiem (vrátane realít/infra a malých); Európa: 4 600+ PE+VC firiem v databáze Invest Europe | **8 000 – 12 000** | 95 %+ | ~40 % | ~75 % |
| **Family office** | 8 030 single FO (Deloitte 2024); multi-FO bez spoľahlivého čísla; PwC eviduje 20 000+ „deal-active“ FO (neoverené) | **2 000 – 4 000** | 85 – 90 % | < 20 % | ~30 % |
| **Angel investori** | USA ~445 000 aktívnych (UNH CVR, prieskum, neoverené); Európa ~47 600 viditeľných v sieťach (EBAN) | **20 000 – 40 000** | 85 – 90 % | ~20 % | ~0 % (nezverejňujú) |
| **Veľkí súkromní investori** | 3 428 miliardárov (Forbes 2026); 0,56 – 0,71 mil. UHNWI ≥ 30 mil. USD (Altrata / Knight Frank) | **2 000 – 5 000** (s doloženou priamou investíciou ≥ 1 mil. EUR) | 85 % | ~10 % | ~60 % (odhad majetku z rebríčkov, nie investičný kapitál) |
| **Spolu** | | **≈ 40 000 – 75 000**, z toho jadro VC + PE **≈ 18 000 – 27 000** | | | |

## Z čoho odhad vychádza

1. **VC: 10–15 tis.** NVCA/PitchBook ukazuje 6 292 VC investorov (s CVC), ktorí v roku 2025
   investovali do amerických firiem, z toho 4 172 so sídlom v USA. USA tvoria podľa
   objemu zhruba polovicu svetového VC, podľa počtu firiem menej (Európa a Ázia
   majú viac malých fondov). Preto: US ~4 tis. + Európa ~3–4 tis. + Ázia (bez AMAC
   Číny, kde väčšina správcov nie je VC) ~2–4 tis. + zvyšok sveta ~1–2 tis.
   Horná hranica je Preqin (21 tis. „active firm coverage“), ktorý počíta aj veľmi
   malé a polospiace subjekty — tie by naše pravidlo aktivity (24 mesiacov) vyradilo.
2. **PE: 8–12 tis.** SEC ADV dáva 4 603 poradcov s PE fondom (registrovaní v USA,
   vrátane zahraničných). Európa a Ázia pridajú porovnateľný počet; Preqin 31,6 tis.
   je horná hranica so širokou definíciou. PE transakcie sú verejnejšie (oznámenia
   akvizícií, antimonopolné úrady), preto je podiel identifikovateľných vysoký.
3. **Family office: 2–4 tis.** Z 8 030 single FO investuje priamo do firiem asi
   polovica a verejnú stopu (oznámené kolo, tlačová správa) zanecháva zhruba
   polovica z nich. FO sú zámerne diskrétne — preto nižšia presnosť aj úplnosť.
4. **Angels: 20–40 tis.** Z ~0,5 mil. aktívnych angels vo svete je verejne
   menovaných v ≥ 2 kolách len malá časť (OpenVC má 16,7 tis. profilov, angel siete
   v USA a Európe ~15 tis. + ~48 tis. členov). Pri fyzických osobách navyše
   obmedzuje rozsah GDPR (len profesijné, nimi zverejnené údaje).
5. **Veľkí súkromní investori: 2–5 tis.** Väčšina miliardárov investuje cez FO
   alebo holding; ako samostatný záznam má zmysel len ten, kto má doloženú priamu
   investíciu. Prekrytie s FO riešime deduplikáciou (jeden záznam na rodinu).

## Spoľahlivosť — čo si z pilotu prenášame

Pilot na českých VC ([VYSLEDKY.md](VYSLEDKY.md)) dáva reálne čísla pre typ VC:
presnosť zaradenia, presnosť polí a úplnosť tiketu / kapitálu. Odhady pre ostatné
typy sú odvodené z toho, ako verejne daný typ komunikuje — **sú to predpoklady,
ktoré treba overiť ďalším pilotom** (napr. 30 family offices v DACH).

Najväčšie riziká pre spoľahlivosť:
- **Self-reported čísla** (veľkosť fondu, ticket) — marketingové a často zastarané.
- **„Kapitál“ angela a FO** sa verejne takmer nedá zistiť; pole bude `not_public`.
- **Zastaranie**: počet VC firiem v USA prvýkrát medziročne klesol (NVCA:
  3 152 → 2 984, čisto −5 %); hrubý odchod je vyšší, pretože časť úbytku nahrádzajú
  nové fondy — môj odhad 10–15 % ročne (neoverené, preto ho pilot meria cez
  pravidlo X8). Bez obnovy každých 6 mesiacov klesá presnosť zaradenia o
  niekoľko percentných bodov ročne.
