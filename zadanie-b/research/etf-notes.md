# ETF research notes (retrieved 2026-10-29)

Companion to `etf-data.json`. Everything below was gathered on 2026-10-29 from public sources only.

## 1. How the numbers were obtained

- **Vanguard (VOO, VTI, VT, VEU, VYM):** investor.vanguard.com is JavaScript-only (empty to the fetch tool). Vanguard fact-sheet PDFs (`workplace.vanguard.com/iippdf/pdfs/FS<id>R.pdf`, revision 09/2026, data as of 2026-09-30) were fetchable. I converted the PDFs with pdftotext myself and read the figures from the text, not from the fetch tool's summary. IDs: VOO 968, VTI 970, VT 3141, VEU 991, VYM 923.
- **iShares (IVV, AGG):** product page and fact sheets fetchable. AGG fact sheet is as of 2026-09-30. The IVV fact sheet at the iShares URL is still the **2026-06-30** edition, so IVV returns are dated differently from the rest. The product page gave AUM (as of 2026-10-28), TER, exchange, 12m trailing yield (1.10% as of 2026-09-30) but its performance table was cut off in the fetch.
- **SSGA (SPY, SPYM, GLD):** product pages and fact-sheet PDFs fetchable (fact sheets as of 2026-09-30).
- **KraneShares (KWEB):** product page fetchable (net assets 2026-10-28; returns 2026-09-30).
- **Schwab (SCHD):** every schwabassetmanagement.com URL returned 403. Used Schwab's brokerage research page (schwab.wallst.com, returns as of 2026-09-30), AAII (10y), a search-engine excerpt of the Schwab page (AUM, TER, NYSE Arca) and stockanalysis.com. **Medium confidence.**
- **ARK (ARKK):** ark-funds.com returned 403. Dropped anyway (see section 3).
- **Dividend yield:** one uniform trailing-12-month yield from stockanalysis.com (prices of 2026-10-28) for comparability. Issuer yields (SEC, 12m, distribution yield) use different definitions and are kept as `dividend_yield_issuer` where I found them.
- **UCITS twins:** justETF profile pages (fetched), one per ISIN.
- **PDF parsing caveat:** layout text from some PDFs is jumbled (VT, VEU fact sheets) or stored rotated/reversed (GLD bar chart). I decoded them by column position (pdfplumber) and cross-checked NAV, market and index rows. VT, VEU and GLD returns deserve a quick visual check against the PDFs before publishing.

## 2. Important: the fetch tool's summaries can be wrong

The fetch tool summarises pages with a small model. It mislabelled SPY returns on the SSGA web page (said 1y 22.73 / 5y 15.18 / 10y 10.82). The fact-sheet PDF shows 22.73 is the **3-year** figure; real values are 1y 15.60 / 5y 13.65 / 10y 15.18 (NAV, 2026-09-30). Hence I used raw PDF text wherever possible. Values that only passed through the fetch summary: IVV AUM/yield (iShares page), SPY/SPYM/GLD AUM and exchange (SSGA pages), KWEB (KraneShares page), SCHD returns (Schwab wallst page), all justETF fields, stockanalysis fields.

## 3. Exchange check (NYSE / NYSE Arca required)

| Ticker | Result | Source |
|---|---|---|
| VOO, VTI, VT, VEU, VYM | NYSE Arca | Vanguard fact sheets 2026-09-30 |
| IVV, AGG | NYSE Arca | iShares fact sheets/product page |
| SPY, SPYM, GLD | NYSE Arca | SSGA pages (Listing information 2026-10-29) and fact sheets |
| SCHD | NYSE Arca | stockanalysis + search excerpt of Schwab (no first-party fetch) |
| KWEB | "NYSE" on KraneShares page, "NYSE Arca" on stockanalysis | both NYSE group; wording differs |
| **VXUS** | **Nasdaq - dropped** (VEU used instead) | stockanalysis |
| **BND** | **Nasdaq - dropped** (AGG used instead) | stockanalysis |
| **ARKK** | **Cboe BZX - dropped** | stockanalysis shows BATS; search excerpt says ARK moved primary listing from NYSE Arca to Cboe BZX effective 2025-03-31 (ARK's own document not read) |

Replacement for ARKK: KWEB (0.69% TER, thematic, NYSE group). Other NYSE Arca candidates seen on stockanalysis but not used: TAN (Invesco Solar, 0.70%; Invesco site unreadable, would have needed secondary returns), BITO (ProShares Bitcoin ETF, 0.95%, ProShares page readable, exchange not stated on issuer page, odd yield). KWEB is passive, not active - if the page copy says "active", use BITO or change wording.

## 4. Name, ticker and fee changes (the "2025 trap")

- **SPLG -> SPYM:** name and ticker changed effective **2025-10-31**; fund is now "State Street SPDR Portfolio S&P 500 ETF", ticker SPYM, TER 0.02% unchanged, same index. Evidence: SSGA page and fact sheet now say SPYM; stockanalysis.com's /etf/splg/ URL now serves the SPYM page; search excerpts of an SSGA AP notice and a MIAX alert give the date. The SSGA notice PDF URL returned 404. Also, SSGA renamed SPY itself to "State Street SPDR S&P 500 ETF Trust".
- **VTI renamed:** now "Vanguard Morningstar Total Stock Market ETF" (effective 2026-07-29 per secondary source), benchmark changed from CRSP US Total Market to Morningstar US Total Market Index. Ticker and TER unchanged. The current Vanguard fact sheet itself shows the new name/benchmark. Do not call it "Vanguard Total Stock Market ETF / CRSP" on the page.
- **Vanguard fee cut:** Vanguard cut fees on 168 share classes effective 2025-02-01 (search-engine excerpt of Vanguard's corporate page; the page itself could not be read). Current TERs used: VOO 0.03, VTI 0.03, VT 0.06, VEU 0.04, VYM 0.04. Old values were **not verified**: mymoneyblog.com says VEU "lowered to 0.04%"; a search excerpt of an older Vanguard fact sheet (as of 2025-06-30) showed VYM at 0.06%, which suggests the VYM cut may have come in a later round than February 2025. A later Vanguard round (84 share classes, 53 funds) is mentioned in 401kspecialistmag via search excerpt.
- **SPY TER** is 0.0945% (SSGA), commonly rounded to 0.09%.
- **UCITS TERs also moved:** VWCE (IE00BK5BQT80) is 0.14% on justETF (older sources say 0.19%); Xtrackers MSCI USA 1C shows 0.03% on justETF (I remember it higher; double-check); new Vanguard ex-US UCITS (IE0009A5ADV9) launched 2026-08-18 at 0.12% with only EUR 157 m.

## 5. Where sources disagree

| Item | Values | Handling |
|---|---|---|
| VOO AUM | $1.032T (Vanguard, 2026-09-30, ETF class) vs $1.06T (stockanalysis, ~2026-10-28) | issuer value used, dated |
| IVV AUM | $888.95B (iShares, 2026-10-28) vs $879.89B (stockanalysis, undated) | issuer value |
| AGG AUM | $135.65B (iShares fact sheet, 2026-09-30) vs $139.34B (stockanalysis, undated) | issuer value |
| 1-year returns | issuer figures end 2026-09-30; stockanalysis "1y total return" ends ~2026-10-28. Examples: VOO 15.70 vs 13.98; SCHD 23.36 vs 33.92 (and 34.5 on wisesheets, undated); GLD 8.74 vs 1.77; KWEB -38.19 vs -41.01; AGG -1.87 vs -1.38 | issuer quarter-end values used. SCHD and GLD gaps are large and not explained - one month of market moves plus base effects is plausible but unverified. Do not mix the two sets. |
| GLD 1y NAV vs market | 8.74 vs 7.14 on SSGA fact sheet | reported as is; likely timing of the market-value mid-price; check chart visually |
| SCHD 10y | Schwab page shows none; AAII 12.4% (NAV, 2026-09-30) | AAII value used, rounded to 1 decimal |
| SCHD TER/AUM | Schwab (search excerpt) 0.060%, ~$118.5B as of 2026-10-27; stockanalysis 0.06%, $118.95B | consistent |
| SPYM 10y | includes pre-2020 history when the fund tracked other indexes (inception 2005) | flagged in source_note |
| VTI inception/identity | still shown as "Vanguard Total Stock Market ETF/CRSP" on some sites (roic.ai, etc.) | outdated |
| KWEB yield | stockanalysis 9.12% ($2.10 annual dividend) vs KraneShares page shows no yield (annual distribution) | low confidence, consider n/a |
| BITO yield (not used) | stockanalysis 22.7% vs ProShares 12-month yield 28.64% / SEC 0.68% | not used |

## 6. UCITS twins - quality of the match

- **Exact index twin:** VOO -> VUAA (acc, 0.07), IVV -> SXR8/CSPX (acc, 0.07), SPY -> SPY5 (dist, 0.03), SPYM -> SPYL (acc, 0.03), VEU -> Vanguard FTSE All-World ex-US UCITS (acc, 0.12, new and small), AGG -> IUAA (acc, 0.25, not on Xetra per justETF), KWEB -> KraneShares UCITS (acc, 0.75, dearer than US fund).
- **Near twin:** VT -> VWCE (acc, 0.14), FTSE All-World vs FTSE Global All Cap (no small caps).
- **Approximate only:** VYM -> VHYD (global high dividend, dist, 0.29); SCHD -> SPYD (S&P High Yield Dividend Aristocrats, dist, 0.35). Different indexes.
- **No twin:** VTI (no total-US-market UCITS found; the SPDR Russell 3000 UCITS is liquidated per justETF). Closest: Xtrackers MSCI USA 1C (large/mid only). The S&P 500 UCITS ETFs are the practical substitute.
- **GLD:** only an ETC exists (iShares Physical Gold ETC, 0.12%), not a UCITS ETF.
- Only IE00B5BMR087, IE00B6YX5C33, IE00BFMXXD54, IE000XZSV718, IE0009A5ADV9, IE00BK5BQT80, IE00BJ0KDR00, IE00B8GKDB10, IE00B6YX5D40, IE00BYXYYM63, IE00B4ND3602, IE00BFXR7892 were fetched on justETF. justETF fund sizes were returned without clear as-of dates, so no UCITS AUM is in the JSON except notes. The first attempt with ISIN IE000ZYRH0Q7 (my guess) returned an empty justETF screener - that ISIN was wrong and is not used.

## 6b. "Can a Czech buy them?" - how solid is the PRIIPs claim

- The mechanism (no KID -> brokers block retail purchases of US-listed ETFs; hold/sell still allowed) is stated first-party by **DEGIRO** (UK helpdesk: "U.S. products are particularly impacted"), **LYNX** ("Retail clients cannot purchase ETFs from countries where the issuer does not publish a KID..."), **TradeZero Europe**, and a **Saxo** partner update. **Interactive Brokers** says the same but the page was 403, so wording is from a search excerpt. **Trading 212**: only a community-forum reply (searched summary said staff, the post I fetched was a normal user) - no help-centre text found. **XTB**: no first-party statement found; only the Finhacker blog (2020, updated 2022). Fio and Patria: see below.
- **Not universal for Czech residents.** Fio banka is reported to allow US ETFs on an execution-only basis, relying on a permissive CNB stance (via Finhacker quoting Fio's site; Fio's own ETF page does not mention it). The CNB Q&A (RS2018-12) says a firm that only executes client orders and gives no advice or active offering is generally not the "seller" who must deliver a KID, but it does not mention US funds. Patria: unclear. So the safe landing-page wording is "most mainstream brokers available to Czech retail clients (DEGIRO, LYNX, Trading 212, IBKR, Saxo-based) block purchases", not "Czechs cannot buy".
- No ESMA/ESA primary text or EUR-Lex text was successfully read (EUR-Lex fetch returned empty; EP page returned empty). Article references (Art. 5, Art. 13 of Regulation 1286/2014) are therefore not quoted.

## 7. Czech bank funds

- **Done with KID:** Amundi Funds Global Equity A CZK Hgd (KB distribution): KID dated 2026-08-19; ongoing admin/management cost 1.93% p.a., transaction costs 0.54% p.a., max entry cost 4.50%; KB charges 3.00% purchase markup (price list valid from 2026-08-03). Active fund, ESG article 8, benchmark MSCI World. 
- **Partial:** Česká spořitelna. Price list effective 2026-10-23: Erste group equity funds 3.00% entry, third-party equity funds 4.00%. Sporotrend (CEE equity) info sheet dated 2025-08-29: entry max 3.00%, mgmt fee 2.00% p.a.; **no KID ongoing-charges figure obtained** (secondary TER 2.27% undated). The Erste AM PDF I found is not the KID.
- **Not obtained:** ČSOB. The Patria "ČSOB parametry fondů" PDF (valid from 2026-06-15) has a broken font encoding and could not be decoded; csobam.cz pages returned no fund details; search excerpts only gave an undated aggregator TER (2.22%) for "ČSOB Akciový". Nothing from ČSOB is in the JSON.
- ČS price list also shows a 0.35% charge for buying securities on US exchanges (ETFs included in "same prices"), but says nothing about whether US ETFs are actually buyable.

## 8. Czech tax - corrections to the brief

- 3-year time test: confirmed (ARROWS; finance.cz). GFŘ guideline D-59 (search excerpt only) agrees.
- CZK 100,000 value test: **still valid in 2026** (GFŘ press release 2026-01-05). It is measured on proceeds, not profit (ARROWS). Per GFŘ guideline (search excerpt) it is an alternative to the time test, not an add-on.
- **40 million CZK cap: the brief's "od 2025?" needs correcting.** The cap applied for 2025 only and is **abolished for securities from 2026-01-01** (Act 360/2025 Sb.; MF press release 2025-09-10; GFŘ 2026-01-05; dauc.cz 2025-12-11). It remains only for crypto-assets. Several 2025 articles (finance.cz 2025-04-11) still describe the cap as current - outdated.
- Paragraph letters of Income Tax Act sections (w, x, u, q, v) differ between sources; not cited.
- Reporting duty for exempt income above CZK 5 million (GFŘ, search excerpt) not included.
- ETF-specific: Acc vs Dist and domicile; source is a law-firm article only.

## 9. US tax

- 15% treaty dividend rate for Czech residents: IRS Tax Treaty Table 1 (document revision May 2023, but the Czech row is long-standing). Footnote w: the 15% rate applies to RIC dividends (this covers US ETFs) - good for the page claim "15% with W-8BEN". Statutory default 30% and W-8BEN procedure: IRS pages (updated 2026-07-23 and 2026-10-02).
- US estate tax for non-resident aliens: **USD 60,000** filing threshold for US-situated assets (IRS pages updated 2026-06-28), not inflation-indexed. The IRS page does not itself say US-listed ETF shares are US-situs; that is general practitioner knowledge, not sourced here. Irish UCITS ETFs not being US-situs is also not sourced here.
- IRS list of estate and gift tax treaties (updated 2026-09-08) does not include the Czech Republic - so no treaty relief from the USD 60,000 threshold.
- Not covered: US-situs rules for specific ETFs, Czech tax treatment of foreign withholding credit, withholding inside UCITS funds.

## 10. DIP

- MF ČR page (2024-01-31): DIP available from 2024-01-01; deduction up to CZK 48,000 per year shared across all state-supported pension products and long-term-care insurance; employer exemption up to CZK 50,000; 10 years and age 60 conditions, otherwise repay benefit (up to 10 years back).
- GFŘ "Daňové novinky pro rok 2026" does not mention DIP; I did not find or read the law text, so changes in 2025-2026 (if any) are unverified.

## 11. Gaps / not confident

1. IVV returns are as of 2026-06-30, others 2026-09-30.
2. SCHD: no first-party Schwab data; AUM/TER via excerpt; 10y from AAII (rounded).
3. GLD returns decoded from rotated chart text; 1y NAV vs market gap unexplained.
4. VT and VEU returns: jumbled table layout, mapped by pattern.
5. KWEB: exchange wording ("NYSE" vs "NYSE Arca"), dividend yield low confidence.
6. KB/Amundi fund assumed identical to KID share class (A CZK Hgd).
7. No ČSOB fund data; no current ČS KID.
8. No primary EU/ESMA text on PRIIPs; IBKR/Trading 212/XTB statements weak; Fio/Patria position only via blog.
9. Previous (pre-Feb-2025) Vanguard TERs not verified from Vanguard documents.
10. WebSearch budget ran out before final cross-checks (KWEB sub-venue, further ČSOB/ČS KID searches).
11. `fx` left null as instructed.
