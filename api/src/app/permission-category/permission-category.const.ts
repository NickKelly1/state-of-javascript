export const PermissionCategory = {
  SuperAdmin: 100,
  Jobs: 200,
  Logs: 300,
  PermissionsCategories: 400,
  Permissions: 500,
  Roles: 600,
  Users: 800,
  UserTokenTypes: 1000,
  UserTokens: 1100,
  NewsArticleStatuses: 1200,
  NewsArticles: 1300,
  NpmsPackages: 1400,
  NpmsDashboardStatuses: 1500,
  NpmsDashboards: 1600,
  Integrations: 1700,
  // BlogCategories: 1900,
  // BlogPosts: 2000,
  // BlogPostImages: 2100,
  // BlogPostComments: 2200,
  // BlogPostVotes: 2300,
  // BlogPostCommentVotes: 2400,
  // BlogPostTags: 2500,
} as const;
export type PermissionCategory = typeof PermissionCategory;

// validate no conflicts on file compile...
(() => {
  const catSet: Set<number> = new Set();
  Object.values(PermissionCategory).forEach(category => {
    if (catSet.has(category)) throw new Error(`Compilation Integrity Error: category ${category} already exists`);
  });
})();