export const CacheKeys = {
  stockAnalysis: "stock-analysis",
  stockAnalysisBySymbol(symbol: string) {
    return `${this.stockAnalysis}:${symbol}`;
  },
  stockAnalysisByQuery(symbol: string, queryString: string) {
    return `${this.stockAnalysisBySymbol(symbol)}:${queryString || "default"}`;
  }
};
