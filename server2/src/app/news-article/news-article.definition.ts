export const NewsArticleDefinition = {
  title: {
    min: 0,
    // 20 words max
    max: 50,
  },
  teaser: {
    min: 0,
    // 500 words max
    max: 500,
  },
  body: {
    min: 0,
    // 10_000 words max
    max: 10_000,
  },
};