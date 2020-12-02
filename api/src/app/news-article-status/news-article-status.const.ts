
export const NewsArticleStatus = {
  Draft: 10,
  Rejected: 20,
  Submitted: 30,
  Approved: 40,
  Unpublished: 50,
  Published: 60,
} as const;
export type NewsArticleStatus = typeof NewsArticleStatus;
export type ANewsArticleStatus = NewsArticleStatus[keyof NewsArticleStatus];