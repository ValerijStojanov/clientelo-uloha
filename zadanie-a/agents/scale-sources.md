# Brief 0 - investor universe size: public numbers with sources

Researched 2026-10-29. Only public sources. Every row has URL, publisher, date.

Verification tags in the "what exactly it measures" column:
- [P] = I opened the primary document/page and read the number there
- [S] = secondary source (press, law firm, third-party site) that I opened
- [Q] = number seen only in a search-result excerpt, page itself not opened or blocked (403/cert error) - treat as unconfirmed
- Nothing in this file is computed by me unless marked "[derived]". (No derived numbers were used.)

"Firms" = management companies / GPs / advisers (the legal entity that raises and manages funds).
"Funds" = vehicles (LP structures, SPVs, funds-of-one). One firm runs many funds - never add or compare the two columns.

---

## 1. VC - US (NVCA / PitchBook)

| category | number | what exactly it measures | source URL | publisher | date |
|---|---|---|---|---|---|
| VC FIRMS, US | **2,984** | [P] US-based VC firms "in existence" = firms that raised a fund in the last 8 vintage years (rolling). First-ever year-on-year decline | https://nvca.org/wp-content/uploads/2026/04/NVCA-2026-Yearbook-4.9.26.pdf (p.11, p.65 table) | NVCA, data by PitchBook | Yearbook Apr 2026; data as of 12/31/2025 |
| VC FIRMS, US (prior year, same series) | 3,152 (table) vs 3,054 (narrative) | [P] same definition, 2024 value; the Yearbook itself prints both numbers (see notes) | same PDF | NVCA / PitchBook | Apr 2026 |
| VC FIRMS, US (older edition) | 3,111 | [P] same definition, 2024 value as printed one year earlier | https://nvca.org/wp-content/uploads/2025/03/2025-NVCA-Yearbook.pdf | NVCA / PitchBook | Yearbook Mar 2025 |
| VC FIRMS, US, cumulative | 4,727 | [P] "Total cumulative firms" ever counted in the PitchBook dataset since inception (includes defunct/inactive) | NVCA 2026 Yearbook PDF (Fund and Firm Analysis table, p.11) | NVCA / PitchBook | as of 12/31/2025 |
| VC FUNDS, US | **8,929** | [P] US-based closed VC funds that closed in last 8 vintage years ("funds in existence") | NVCA 2026 Yearbook PDF (p.65) | NVCA / PitchBook | as of 6/30/2025 and 12/31/2025 |
| VC FUNDS, US, cumulative | 15,707 | [P] total cumulative US VC funds ever in dataset | NVCA 2026 Yearbook PDF (p.11) | NVCA / PitchBook | as of 12/31/2025 |
| VC FUNDS, US, 2025 fundraising | 585 funds raised $67.0B; 101 first-time funds | [P] funds that held a close in 2025 (not firms). First-time fund count is stated as "lowest since 2007" in the Yearbook and "lowest since 2011" in the press release | https://nvca.org/press_releases/nvca-releases-2026-yearbook-charts-a-venture-industry-in-transition/ | NVCA | 13 Apr 2026 |
| ACTIVE INVESTORS (mixed: firms + CVC + others), global, investing in US companies | 13,634 (2025); 25,969 (2021 peak) | [P] investors HQ'd anywhere that made 1+ VC-type investment in US companies in the year. Includes non-VC investors (angels groups, corporates, PE, etc.) | NVCA 2026 Yearbook PDF (p.13 table "Number of Active Investors") | NVCA / PitchBook | as of 12/31/2025 |
| ACTIVE VC INVESTORS, global, investing in US companies | **6,292** (2025); 8,489 (2021) | [P] VC + corporate VC + non-profit VC investors, HQ anywhere, 1+ VC investment in US companies in the year | same table | NVCA / PitchBook | as of 12/31/2025 |
| ACTIVE VC INVESTORS, US-HQ | **4,172** (2025); 5,166 (2021) | [P] same, US-headquartered only | same table | NVCA / PitchBook | as of 12/31/2025 |
| ACTIVE FIRST-ROUND VC INVESTORS, global | 2,608 (VC type, 2025) / 4,610 (all types) | [P] investors writing initial checks | same table | NVCA / PitchBook | as of 12/31/2025 |

## 2. VC and PE - Europe (Invest Europe, ESMA, UK)

| category | number | what exactly it measures | source URL | publisher | date |
|---|---|---|---|---|---|
| PE+VC FIRMS, Europe (database) | **4,600+** | [P] "Firms" in the European Data Cooperative (EDC) dataset (PE+VC+growth+buyout). Slide is not labelled active vs historical; it sits next to 13,600+ funds, 110,700+ portfolio cos, 435,000+ transactions (likely all-time totals) | https://www.investeurope.eu/media/2icnrmzc/20260507-invest-europe-activity-data-report-2025.pdf (p.5) | Invest Europe | 7 May 2026 |
| PE+VC FUNDS, Europe (database) | **13,600+** (10,200 shown separately, label unclear) | [P] funds in the EDC dataset | same PDF p.5 | Invest Europe | 7 May 2026 |
| PE+VC FIRMS, Europe, contributing data | 1,140+ | [P] fund managers who contributed to the 2025 data collection; covers 92% of EUR 1,247bn capital under management in Europe (end-2024) | same PDF p.5 | Invest Europe | 7 May 2026 |
| PE+VC FIRMS, Europe (earlier statement) | ">1,750" | [S] "data collected from more than 1,750 private equity and venture capital firms in Europe" (2024 report) | https://www.seca.ch/en/knowledge-library/newsletters/2025/seca-enewsletter-no-550/private-equity-int-news/investing-in-europe-private-equity-activity-2024/ | SECA (Swiss PE assoc.) quoting Invest Europe | 8 Jun 2025 |
| FIRMS that raised funds in 2025, Europe, all PE (incl. VC) | **538 firms / 820 funds** | [P] managers who closed a fund in 2025. Sub-split: VC 316 funds / 253 firms; Growth 190 / 104; Buyout 229 / 163 | Invest Europe PDF above, fundraising section (p.~15) | Invest Europe | 7 May 2026 |
| AIFM entities in ESMA register | 3,790 | [Q-API] record count of entity type "aif" (AIFM) in ESMA's central register backend (`esma_registers_upreg`, parent records, query run 2026-10-29). NOT filtered by status (active vs withdrawn) and not confirmed through the official UI. Upper bound for "AIFMs ever notified to ESMA", not a clean "active" number | https://registers.esma.europa.eu/publication/searchRegister?core=esma_registers_upreg | ESMA | queried 2026-10-29 |
| EuVECA manager entities in ESMA register | 489 | [Q-API] record count of entity type "evc" in same register, same caveats (status unfiltered). A third-party aggregator shows 643 EuVECA *funds* (undated): https://www.citiumtech.com/resources/euveca-register | ESMA (aggregator: Citium Tech) | queried 2026-10-29 |
| UK FCA AIFM count | NOT OBTAINED | FCA publishes lists only via FOI annexes (e.g. FOI11683 Annex A, categories full-scope/small authorised as of 1 Oct 2024) and the Register of small registered AIFMs; counts not readable from the pages I could open. https://www.fca.org.uk/freedom-information/information-fca-aifmd-october-2024 | FCA | Oct 2024 |

## 3. Hard counts from public US registers (SEC)

| category | number | what exactly it measures | source URL | publisher | date |
|---|---|---|---|---|---|
| ADVISERS, all (RIA + ERA) | **22,932** (16,413 RIAs + 6,519 ERAs) | [P] SEC-registered investment advisers + SEC exempt reporting advisers filing Form ADV Part 1A. Not all are investors (most RIAs are wealth managers) | https://www.sec.gov/files/investment/im-investment-adviser-statistics-2025.pdf (Table 1.1) | SEC Division of Investment Management, Analytics Office | period ending Dec 2025 (data through 20 Jul 2026) |
| EXEMPT REPORTING ADVISERS (ERAs) | **6,519** | [P] total ERAs; of which 2,271 tick the venture capital fund adviser exemption and 4,684 the private fund adviser (<$150M) exemption (rows not mutually exclusive; 100 more "no longer smaller PF adviser") | same PDF, Table 1.1 | SEC | Dec 2025 |
| VC ADVISERS reporting VC funds on ADV | **3,273** (ERAs 2,786 + RIAs 487) | [P] advisers (RIA or ERA) that report at least one private fund of type "venture capital fund" on Form ADV Schedule D. Self-labelled by the adviser, includes foreign-based and part-time/SPV managers | same PDF, Tables 5.3, 5.6, 5.9 | SEC | Dec 2025 |
| PE ADVISERS reporting PE funds on ADV | **4,603** (ERAs 2,068) | [P] same logic, fund type "private equity fund" | same PDF, Table 5.3 / 5.9 | SEC | Dec 2025 |
| VC FUNDS reported on ADV | **46,027** (of which advised by ERAs 41,382) | [P] distinct private funds typed "venture capital fund" on Form ADV (de-duplicated across advisers). Includes SPVs / single-asset vehicles. Compare NVCA 8,929 | same PDF, Tables 5.2 / 5.8 | SEC | Dec 2025 |
| VC FUNDS reported on ADV (older) | at least 36,819 (25,822 "qualifying VC funds") | [P] SEC economic analysis in final rule on qualifying VC fund threshold | https://www.sec.gov/files/rules/final/2024/ic-35305.pdf | SEC | Aug 2024 (data as of Jun 2024) |
| PE FUNDS reported on ADV | 39,500 | [P] same, "private equity fund" | same IA stats PDF Table 5.2 | SEC | Dec 2025 |
| VC FUNDS on Form PF (large RIAs only) | 3,616 funds; 340 advisers | [P] only SEC-registered advisers with >= $150M private-fund AUM file Form PF; ERAs and small RIAs excluded | https://www.sec.gov/files/investment/private-funds-statistics-2025-q3.pdf (Tables 1.1, 1.3) | SEC | Q3 2025 (data through 13 Mar 2026) |
| ALL PRIVATE FUNDS on Form PF | 58,891 funds | [S] headline figure on SEC page | https://www.sec.gov/data-research/statistics-data-visualizations/private-fund-statistics | SEC | Q4 2025; page updated 19 Aug 2026 |
| FORM D, new offerings 2025 | **34,553** initial Form D filings; **17,593** by pooled investment funds | [P] offerings (not issuers, not firms) under Reg D; one fund can file several times; includes all fund types, not only VC | https://www.sec.gov/data-research/statistics-data-visualizations/regulation-d-offerings | SEC | calendar year 2025 (page "last updated" shown as 22 Sep 2026) |

## 4. Asia

| category | number | what exactly it measures | source URL | publisher | date |
|---|---|---|---|---|---|
| PE+VC FIRMS, China (AMAC-registered) | **11,567** | [S] number of PE and VC fund managers in China at end Nov 2025, down 516 vs end-2024. The article does not name AMAC explicitly; underlying register is the AMAC private fund manager registry | https://guantao.com/en/page4967 | Guantao law firm (Chambers Investment Funds 2026 chapter) | 26 Feb 2026 (data end Nov 2025) |
| ALL PRIVATE FUND MANAGERS, China | 19,756 | [Q] AMAC statistic as of Jun 2025, all private fund managers (securities, PE/VC, other) - only seen in a Chambers comparison excerpt; the Chambers page is now dead | https://practiceguides.chambers.com/practice-guides/comparison/1019/17339/27235-27238-27249-27261 | Chambers (citing AMAC) | Jun 2025 data |
| VC FIRMS, India | "95+" | [Q] early/growth-stage VC firms HQ'd in India, list by a Substack; weak source | https://insidevc.substack.com/p/indias-vc-ecosystem-95-active-vc | Inside/VC (Substack) | Jul 2025 |
| Rest of Asia (Japan, Korea, SG, HK, SEA) | NOT OBTAINED | no public register/count found in the sources I could open | - | - | - |

## 5. Family offices

| category | number | what exactly it measures | source URL | publisher | date |
|---|---|---|---|---|---|
| SINGLE family offices, world | **8,030** (6,130 in 2019) | [P] Deloitte estimate of SFOs worldwide. Regional split: North America 3,180; Asia Pacific 2,290; Europe 2,020; Middle East 290; South America 190; Africa 60. Survey base: 354 SFOs, Sep-Dec 2023. Press release credits WealthX for projection | https://www.deloitte.com/content/dam/assets-shared/docs/services/deloitte-private/2024/2024-defining-the-family-office-landscape-executive-report.pdf ; press release https://www.deloitte.com/global/en/about/press-room/global-edition-explores-the-rapid-expansion-family-offices-and-ffers-vision-of-the-future-landscape | Deloitte Private | 4 Sep 2024 |
| SINGLE family offices, projection | 9,030 (2025); **10,720** (2030) | [P] same report - forecast, not a count | same | Deloitte | 4 Sep 2024 |
| SINGLE family offices, Campden | ~7,300 | [S] Campden Wealth estimate of SFOs worldwide (up 38% from 2017), AUM $5.9tn. Old; confirms Deloitte order of magnitude | https://irei.com/news/global-family-office-market-grows-manage-5-9t/ | IREI quoting Campden Wealth | 19 Jul 2019 |
| FAMILY OFFICES (all types, deal-active), world | "more than 20,000" | [Q] size of PwC's own database of family offices (built from Family Capital, PitchBook, S&P Capital IQ, Mergermarket, etc.). A database, not a census; includes multi- and hybrid structures. PwC pages returned 403 to me | https://www.pwc.com/gx/en/services/family-business/family-office/family-office-deals-study.html (PDF: https://www.pwc.com/gx/en/services/family-business/assets/global-family-office-deals-study-2025.pdf) | PwC | 2025 edition (data Jul 2015 - Jun 2025) |
| MULTI-family offices | NOT OBTAINED | no primary count found; only unsourced market-report claims (~3,500) which I did not accept | - | - | - |
| UBS family office survey | 317 | [S] sample size of UBS clients surveyed, NOT a population count. Do not cite as "number of family offices" | https://www.ubs.com/global/en/media/display-page-ndp/en-20250521-global-family-office-report-2025.html | UBS | 21 May 2025 |

## 6. Angel investors

| category | number | what exactly it measures | source URL | publisher | date |
|---|---|---|---|---|---|
| ANGEL INVESTORS (individuals), US | **445,535** (2024); 422,350 (2023) | [Q] "active investors" = individuals who made at least one angel investment in the year (CVR survey-based estimate, not a registry). $17.9bn invested, 55,346 ventures funded. Direct fetch of UNH PDF failed (certificate error); numbers quoted via search excerpt of the PDF and matched by a third-party aggregator | https://paulcollege.unh.edu/sites/default/files/media/2025-12/FY%202024%20Analysis%20Report%20Final.pdf ; cross-check https://axis-intelligence.com/angel-investing-statistics/ | Center for Venture Research, UNH (J. Sohl) | citation line "December 2024"; file posted under /2025-12/ |
| ANGELS (individuals), Europe, in networks | **~47,600** (text also says 47,610) | [P] estimated active business angels who are part of a network/association, 39 countries; EBAN stresses this is the *visible* market only (earlier editions multiplied visible market by 10x for the total; dropped in 2024 edition) | https://www.eban.org/wp-content/uploads/2025/12/Stats-Compendium-2024.pdf (p.5 and p.14) | EBAN | PDF created 28 Oct 2025; news listing 29 Oct 2025 (covers 2024 activity) |
| ANGEL NETWORKS (groups), Europe | **359** (same document also says 339 functioning on p.14) | [P] business angel networks/federations mapped by EBAN, 37-39 countries | same PDF (p.7 vs p.14) | EBAN | Oct 2025 |
| ANGEL volume, Europe | EUR 1,220m; 4,582 rounds | [P] visible market, 2024 | same PDF | EBAN | Oct 2025 |
| ANGEL GROUPS, North America | ~200 groups, 15,000+ member angels | [S] ACA's own website: "200 angel groups, marketplace platforms and family offices", "15,000+ member angel investors". Undated page; ACA 2024 Angel Funders Report used data from "more than 60" groups (not a total) | https://angelcapitalassociation.org/about/ ; https://angelcapitalassociation.org/blog/the-angel-capital-association-releases-2024-angel-funders-report/ | Angel Capital Association | undated page; AFR blog 5 Dec 2024 |

## 7. Large private investors (UHNWI, billionaires)

| category | number | what exactly it measures | source URL | publisher | date |
|---|---|---|---|---|---|
| UHNWI (>= $30m net worth), world | **556,850** (2025) | [S] Altrata World Ultra Wealth Report 2026 as reported by press: +14.4% in 2025; combined net worth $63.8tn; 746,570 forecast for 2030 | https://www.thestandard.com.hk/finance/article/335504/Global-ultra-wealthy-population-hits-all-time-high-of-556850-in-2025 ; https://www.wealthprofessional.ca/news/industry-news/global-ultra-wealthy-population-hit-record-high-in-2025-with-further-gains-ahead/392811 | Altrata (via The Standard HK, Wealth Professional) | 24 Jun 2026 |
| UHNWI (>= $30m), world, previous edition | 510,810 | [Q] Altrata WUWR 2025, end Jun 2025 (seen in search excerpt only) | https://www.nonprofitpro.com/article/report-ultra-wealthy-population-accounts-for-combined-net-worth-twice-the-size-of-the-us-economy/ (search hit; not opened) | Altrata | 2025 |
| UHNWI (> $30m), world | **713,626** (2026); 551,435 (2021) | [P] Knight Frank Wealth Sizing Model results. Regional share: N. America 37%, APAC ~31%, Europe ~25% | https://www.knightfrank.com/research/article/2026/4/wealth-sizing-model-2026-results | Knight Frank | 23 Apr 2026 |
| BILLIONAIRES, world | **3,428** | [S] Forbes 40th annual World's Billionaires list: combined $20.1tn; US 989. Prices as of 1 Mar 2026 (per secondary). Forbes page itself returned 403/429; City AM reproduces the release | https://www.cityam.com/forbes-40th-annual-worlds-billionaires-list/ (also https://www.businesswire.com/news/home/20260310629058/en) | Forbes via City AM / Business Wire | 10 Mar 2026 |
| BILLIONAIRES, world | 4,020 | [S] Hurun Global Rich List 2026 (record; 578 additions; wealth as of 15 Jan 2026 per excerpts) | https://storyboard18.com/brand-makers/hurun-global-rich-list-2026-elon-musk-leads-india-ranks-third-with-308-billionaires-92876.html | Hurun Research Institute via Storyboard18 | Mar 2026 (article 22 Mar 2026) |
| BILLIONAIRES, world | 2,919 ("nearly 3,000" in UBS release) | [S] UBS Billionaire Ambitions Report 2025: +8.8% from 2,682; $15.8tn; 287 new entrants (196 self-made) | https://www.ubs.com/global/en/media/display-page-ndp/en-20251204-billionaire-ambitions-report-2025.html ; precise figure https://www.bluewin.ch/en/news/287-new-billionaires-never-before-have-there-been-so-many-2995133.html | UBS (via bluewin.ch) | 4 Dec 2025 |

## 8. Size of investor databases (vendors' own public claims)

Vendors define "investor" differently (firms, funds, people, angels, strategics). These are marketing claims, not independent counts.

| category | number | what exactly it measures | source URL | publisher | date |
|---|---|---|---|---|---|
| PitchBook - investors | **570,000** investors; 56,000 LPs; 147,000 funds | [S] coverage stated in press release (copy on silicon.co.uk; Business Wire original returned 403) | https://www.silicon.co.uk/press-release/pitchbook-strengthens-leadership-in-global-capital-market-data-coverage | PitchBook (Morningstar) | 8 May 2025 |
| PitchBook - investors (later) | 597k investors; 154k funds; 8.5m private companies | [S] description of PitchBook dataset in Anthropic's integration tutorial (not PitchBook itself) | https://academy.claude.com/tutorials/using-pitchbook-for-investment-research | Anthropic | undated (page footer 2026) |
| PitchBook - by type | 481,000+ investors; 47,000+ VC investors; 25,000+ PE investors; 101,000+ angel/incubator; 293,000+ strategic acquirers; (PE database page: 33,793 PE investors) | [Q] seen only in search excerpts of PitchBook's own pages (pitchbook.com blocked: 403). Use order of magnitude only | https://pitchbook.com/private-equity-database ; https://get.pitchbook.com/investor/data-inquiry | PitchBook | undated |
| Preqin - Venture Capital | **21,254 active firms**; 28,266 funds; 8,374 investors (LPs) | [P] "active firm coverage" etc. on Preqin's VC data page | https://preqin.com/data/venture-capital | Preqin (BlackRock) | undated (footer (c) 2026; retrieved 2026-10-29) |
| Preqin - Private Equity | **31,653 active firms**; 68,822 funds; 16,638 investors | [P] same page type | https://preqin.com/data/private-equity | Preqin | undated (footer 2026) |
| Preqin - all asset classes | 67,000+ fund managers, 160+ countries; investor coverage +11% in 2025 | [P] "The Best of Preqin: 2025" | https://www.preqin.com/c/the-best-of-preqin-2025 | Preqin | 2025 review (undated page) |
| Preqin - older/other pages | "20,000+ investors", "48,000 firms", "135,000+ funds" (one page); "37,000+ investors, 67,000+ fund managers, 235,000+ funds" (another page) | [P]/[Q] the two Preqin pages disagree with each other | https://www.preqin.com/data/our-data | Preqin | undated |
| Dealroom | **225K investors mapped**; 3.2M+ companies | [S] relayed by competitor review; Dealroom's own pages (150K+, 190k, 120k+ at different dates) blocked or 404 | https://angelspartners.com/reviews/dealroom/ | Angels Partners quoting Dealroom | "as of Oct 2026" |
| OpenVC | **16,696 investors** across 6,000+ firms/angel networks/family offices | [S] OpenVC "live counter" relayed by competitor; OpenVC's own page headline "16,000+" (page blocked: 403). Free database; skews US/Europe | https://angelspartners.com/reviews/openvc/ ; https://openvc.app/investor-database | OpenVC (via Angels Partners) | "as of Oct 2026" |
| Crunchbase | NOT OBTAINED | no official investor count; only "millions of companies", "80M+ users". Hub pages count segments (e.g. 3,534 in "Venture Capital Companies" hub, from search excerpt) | https://about.crunchbase.com/ | Crunchbase | retrieved 2026-10-29 |

---

## Notes - where sources disagree

1. **US VC "firm" count depends on definition by an order of magnitude.**
   - NVCA/PitchBook: 2,984 firms (raised a fund in last 8 years, US-based) and 4,172 active US-HQ VC investors (made 1+ US deal in 2025).
   - SEC ADV: 3,273 advisers reporting a VC fund (US-registered or exempt, any location of the funds).
   - NVCA cumulative: 4,727 firms ever in the data.
   - Same universe, ~3,000-4,700 depending on the question. Treat "US VC firms" as roughly 3,000-4,000, not 10,000+.
2. **NVCA contradicts itself across editions.** The 2024 firm count is printed as 3,111 (2025 Yearbook), 3,152 (2026 Yearbook table) and 3,054 (2026 Yearbook narrative). PitchBook restates history every year. The 2026 narrative says first-time funds are "lowest since 2007", the NVCA press release says "lowest since 2011". Treat counts as +/- 5%.
3. **Funds vs firms: 8,929 (NVCA funds) vs 46,027 (SEC ADV VC funds).** SEC number counts every vehicle that an adviser self-labels "venture capital fund" on Schedule D (SPVs, single-deal vehicles, foreign feeders). Do not use fund counts as a proxy for firm counts.
4. **Europe: 538 vs 1,140+ vs 1,750+ vs 4,600+ "firms".** 538 = firms that closed a fund in 2025; 1,140+ = managers who contributed data in 2025; >1,750 = earlier coverage statement; 4,600+ = EDC database total (probably incl. inactive/historical, label unclear). Invest Europe does not say how many PE/VC firms exist in Europe.
5. **Family offices: 7,300 (Campden 2019) vs 8,030 (Deloitte 2024) vs 20,000+ (PwC database 2025).** Deloitte and Campden count single-family offices only and are consistent with each other; PwC's is a transaction-database size that includes multi-family/hybrid structures and entities that have done at least one deal. No credible primary count of multi-family offices found.
6. **UHNWI: 556,850 (Altrata, 2025) vs 713,626 (Knight Frank, 2026) at the same $30m threshold.** 28% gap; the pages I read do not reconcile methodology (Knight Frank uses a wealth-sizing model with a 2026 projection; Altrata counts identified wealth at end-2025 / mid-year). Use a range 0.55-0.7 million.
7. **Billionaires: 2,919 (UBS, Dec 2025) vs 3,428 (Forbes, Mar 2026) vs 4,020 (Hurun, Mar 2026).** Different valuation dates (Jan vs Mar 2026 vs earlier), different treatment of family fortunes and Chinese holdings. Forbes is the conventional citation; Hurun is the upper bound.
8. **Angels: 445,535 (US, CVR) vs ~47,600 (Europe, EBAN).** Not comparable. CVR is a survey-based extrapolation of all individuals who invested at least once; EBAN counts only angels visible through networks/associations and explicitly says the real population is larger (older editions multiplied by 10x). US angel *groups*: ~200 (ACA site); Europe: 359 networks (339 in another paragraph of the same EBAN document).
9. **Vendor database sizes are not comparable.** PitchBook 570k-597k "investors" and Dealroom 225K "investors" include angels, strategics, corporates and individual people; Preqin's 21,254 VC firms / 31,653 PE firms are "active firm coverage" (firms may be in both lists); OpenVC 16,696 are investor *profiles* (people) at 6,000+ firms. Preqin's own pages give two different totals.

## Notes - which numbers are most reliable

Most reliable (primary doc read, clear definition, dated):
- SEC Form ADV statistics (Dec 2025): 6,519 ERAs; 3,273 advisers with VC funds; 4,603 with PE funds; 22,932 advisers total. This is the only public hard register with a VC/PE flag, but flags are self-reported and include foreign and small vehicles.
- NVCA 2026 Yearbook: 2,984 US VC firms, 8,929 funds, 4,172 active US-HQ VC investors, 6,292 active VC investors investing in the US.
- Invest Europe 2025 activity report: 538 firms / 820 funds raised in 2025; 253 VC firms / 316 VC funds.
- Deloitte 2024: 8,030 SFOs (survey-based estimate, regional split given).
- EBAN 2024 compendium: 47,600 visible angels, 359 networks (visible market only).
- Preqin VC/PE coverage pages (21,254 / 31,653 active firms): good order of magnitude for "firms identifiable in a commercial database", undated.
- SEC Reg D 2025: 34,553 filings, 17,593 by pooled funds (filings, not entities).

Usable with care (secondary or definitional issues):
- Altrata 556,850 / Knight Frank 713,626 UHNWI; Forbes 3,428 billionaires.
- Guantao/Chambers: 11,567 China PE/VC managers (register not named in the article).
- PitchBook 570,000 investors (vendor press release).

Unconfirmed (do not quote without re-checking): UNH 445,535 angels (PDF could not be opened, only excerpt + aggregator); PwC "20,000+" family offices (page blocked); ESMA register counts 3,790 AIFM / 489 EuVECA (taken from the register's backend, status not filtered, further probing was blocked by the permission system, so I stopped); PitchBook by-type counts; Dealroom/OpenVC counts (relayed by a competitor); Altrata 510,810 (previous edition); India "95+" VC firms; AMAC 19,756.

## Gaps (not found in public sources I could open)
- UK FCA count of AIFMs / EuVECA/RVECA managers (only FOI annex lists, not readable).
- ESMA AIFM/EuVECA counts filtered to active status.
- Any VC/PE firm count for Japan, Korea, Singapore, HK, SEA, Middle East, LatAm.
- Official Crunchbase investor count.
- Multi-family office count.
- Any non-SEC, non-vendor count of US PE firms (SEC gives 4,603 advisers reporting PE funds; Invest Europe gives only EDC totals).
- Independent verification of Deloitte's methodology (WealthX modelling) - the executive summary gives results, not the model.
