export const CacheKeys = {
  symbolCatalog: "symbol-catalog",
  stockAnalysis: "stock-analysis",
  stockSignalCards: "stock-signal-cards",
  backtestReport: "backtest-report",
  symbolCatalogByQuery(queryString: string) {
    return `${this.symbolCatalog}:${queryString || "default"}`;
  },
  stockAnalysisBySymbol(symbol: string) {
    return `${this.stockAnalysis}:${symbol}`;
  },
  stockAnalysisByQuery(symbol: string, queryString: string) {
    return `${this.stockAnalysisBySymbol(symbol)}:${queryString || "default"}`;
  },
  backtestReportByQuery(queryString: string) {
    return `${this.backtestReport}:${queryString || "default"}`;
  }
};
