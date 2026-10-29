// PLACEHOLDER — dočasné hodnoty len na test rozloženia, prepíše tools/build-data.mjs
window.ETF_DATA = {
  asOf: "30. 9. 2026",
  calc: { returnPct: 7, bank: { ter: 2.0, entry: 3 }, etf: { ter: 0.03, label: "SPYL" } },
  etfs: [
    { ticker: "VOO", name: "Vanguard S&P 500 ETF", issuer: "Vanguard", exchange: "NYSE Arca", ter: 0.03, aum: 7e11, divYield: 1.2, ret10: 13.1, ret5: 15.0, retAsOf: "30. 9. 2026", source: "https://investor.vanguard.com", twin: { ticker: "SPYL", isin: "IE000XZSV718", name: "SPDR S&P 500 UCITS ETF (Acc)", ter: 0.03, exchange: "Xetra" } },
    { ticker: "IVV", name: "iShares Core S&P 500 ETF", issuer: "iShares", exchange: "NYSE Arca", ter: 0.03, aum: 6e11, divYield: 1.2, ret10: 13.0, retAsOf: "30. 9. 2026", source: "https://ishares.com", twin: { ticker: "CSPX", isin: "IE00B5BMR087", name: "iShares Core S&P 500 UCITS ETF", ter: 0.07, exchange: "LSE" } },
    { ticker: "SPY", name: "SPDR S&P 500 ETF Trust", issuer: "SSGA", exchange: "NYSE Arca", ter: 0.0945, aum: 6e11, ret10: 12.9, retAsOf: "30. 9. 2026", source: "https://ssga.com", twin: null },
    { ticker: "VTI", name: "Vanguard Total Stock Market ETF", issuer: "Vanguard", exchange: "NYSE Arca", ter: 0.03, aum: 5e11, ret10: 12.5, retAsOf: "30. 9. 2026", source: "https://investor.vanguard.com", twin: null },
    { ticker: "SCHD", name: "Schwab US Dividend Equity ETF", issuer: "Schwab", exchange: "NYSE Arca", ter: 0.06, aum: 7e10, ret10: 11, retAsOf: "30. 9. 2026", source: "https://schwab.com", twin: null },
    { ticker: "ARKK", name: "ARK Innovation ETF", issuer: "ARK", exchange: "NYSE Arca", ter: 0.75, aum: 6e9, ret10: 9, retAsOf: "30. 9. 2026", source: "https://ark-funds.com", twin: null }
  ],
  sources: [{ label: "Test", url: "https://example.com", date: "29. 10. 2026" }]
};
