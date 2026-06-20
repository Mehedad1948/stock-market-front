export const portfolioKeys = {
  all: ["portfolio"] as const,
  summary: (accountScope: string) => [...portfolioKeys.all, "summary", accountScope] as const
};
