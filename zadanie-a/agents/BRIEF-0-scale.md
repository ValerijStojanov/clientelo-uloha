# Brief 0 — odhad veľkosti trhu investorov (globálne)

Agent: Claude Sonnet (subagent), web search + web fetch.

Nájdi verejne dostupné čísla (s URL, vydavateľom a dátumom), z ktorých sa dá
odhadnúť, koľko investorov každého typu existuje a koľko je ich identifikovateľných
z verejných zdrojov:

1. VC firmy / VC fondy — globálne, USA (NVCA Yearbook), Európa (Invest Europe),
   prípadne Ázia. Počet firiem vs. počet fondov — rozlíš.
2. Private equity firmy — globálne / USA / Európa.
3. Family offices — single + multi (Deloitte, UBS, Campden).
4. Angel investori — USA (UNH Center for Venture Research), Európa (EBAN),
   počet angel sietí.
5. Veľkí súkromní investori — počet UHNWI (Knight Frank / Altrata), počet miliardárov (Forbes).
6. Verejné registre, ktoré dávajú „tvrdé“ počty: SEC Form ADV (počet
   registrovaných / exempt reporting advisers označených ako VC), SEC Form D,
   ESMA register EuVECA/AIFM, UK FCA.
7. Veľkosť databáz: koľko investorov eviduje Crunchbase, PitchBook, Dealroom,
   Preqin, OpenVC (podľa ich vlastných verejných tvrdení).

Výstup: `zadanie-a/agents/scale-sources.md` — tabuľka
`kategória | číslo | čo presne číslo meria | zdroj (URL) | vydavateľ | dátum`
+ krátke poznámky, kde sa zdroje rozchádzajú. Nič nedopočítavaj bez označenia.
