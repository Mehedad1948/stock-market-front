export const CacheKeys = {
  stockAnalysis: "stock-analysis",
  stockSignalCards: "stock-signal-cards",
  backtestReport: "backtest-report",
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
