export const Permission = {
  SuperAdmin: {
    SuperAdmin: 100,
  },
  Jobs: {
    Viewer: 200,
  },
  Logs: {
    Viewer: 300,
  },
  PermissionsCategories: {
    Viewer: 400,
  },
  Permissions: {
    Viewer: 500,
  },
  Roles: {
    Viewer: 600,
    Manager: 610,
    Admin: 620,
  },
  Users: {
    Viewer: 800,
    ViewIdentities: 805,
    Manager: 810,
    Register: 820,
    UpdateSelf: 830,
    UpdatePasswords: 840,
    Deactivate: 850,
    ForceUpdateEmails: 860,
    ForceVerify: 870,
    Admin: 880,
  },
  UserTokenTypes: {
    Viewer: 1000,
  },
  UserTokens: {
    Viewer: 1100,
  },
  NewsArticleStatuses: {
    Viewer: 1200,
  },
  NewsArticles: {
    Viewer: 1300,
    Writer: 1310,
    Manager: 1320,
    Admin: 1330,
  },
  NpmsPackages: {
    Viewer: 1400,
    Creator: 1410,
    Admin: 1420,
  },
  NpmsDashboardStatuses: {
    Viewer: 1500,
  },
  NpmsDashboards: {
    Viewer: 1600,
    Creator: 1610,
    Manager: 1630,
    Admin: 1640,
  },
  Integrations: {
    Viewer: 1800,
    ViewSecrets: 1801,
    Manage: 1820,
  },
  // BlogCategories: {
  //   Show: 1900,
  //   Update: 1920,
  //   SoftDelete: 1930,
  //   HardDelete: 1931,
  //   Restore: 1932,
  //   Manage: 1940,
  // },
  // BlogPosts: {
  //   Show: 2000,
  //   ShowAllVoteCount: 2001,
  //   ShowOwnVoteCount: 2002,
  //   Create: 2010,
  //   Update: 2020,
  //   UpdateOwn: 2021,
  //   AttachTags: 2022,
  //   SoftDelete: 2030,
  //   SoftDeleteOwn: 2031,
  //   HardDelete: 2032,
  //   HardDeleteOwn: 2033,
  //   Restore: 2034,
  //   Manage: 2040,
  // },
  // BlogPostImages: {
  //   ShowOwn: 2100,
  //   ShowAll: 2101,
  //   Create: 2110,
  //   UpdateAll: 2120,
  //   UpdateOwn: 2121,
  //   SoftDeleteAll: 2130,
  //   SoftDeleteOwn: 2131,
  //   HardDeleteAll: 2132,
  //   HardDeleteOwn: 2133,
  //   RestoreAll: 2134,
  //   RestoreOwn: 2135,
  //   Manage: 2140,
  // },
  // BlogPostComments: {
  //   ShowOwn: 2200,
  //   ShowAll: 2201,
  //   ShowAllOnOwnPosts: 2202,
  //   Create: 2210,
  //   UpdateAll: 2220,
  //   UpdateOwn: 2221,
  //   SoftDeleteAll: 2230,
  //   SoftDeleteOwn: 2231,
  //   HardDeleteAll: 2232,
  //   HardDeleteOwn: 2233,
  //   RestoreAll: 2234,
  //   RestoreOwn: 2235,
  //   Manage: 2240,
  // },
  // BlogPostVotes: {
  //   ShowOnAllBlogPosts: 2300,
  //   ShowOnOwnBlogPosts: 2301,
  //   ShowOwnOnAllBlogPosts: 2302,
  //   CreateAndUpdateOwn: 2310,
  //   UpdateAll: 2311,
  //   HardDeleteAll: 2331,
  //   HardDeleteOwn: 2332,
  //   Manage: 2340,
  // },
  // BlogPostCommentVotes: {
  //   ShowOnAllBlogPosts: 2400,
  //   ShowOnOwnBlogPosts: 2401,
  //   ShowOwnOnAllBlogPosts: 2402,
  //   CreateAndUpdateOwn: 2410,
  //   UpdateAll: 2411,
  //   HardDeleteAll: 2431,
  //   HardDeleteOwn: 2432,
  //   Manage: 2440,
  // },
  // BlogPostTags: {
  //   Show: 2500,
  //   Create: 2510,
  //   Update: 2520,
  //   SoftDelete: 2530,
  //   HardDelete: 2535,
  //   Restore: 2531,
  //   Manage: 2540,
  // },
} as const;
// export type Permission = typeof Permission;
// export type APermission = Permission[keyof Permission];

// validate no conflicts on file compile...
(() => {
  const permSet: Set<number> = new Set();
  Object.values(Permission).forEach(category => {
    Object.values(category).forEach((permission) => {
      if (permSet.has(permission)) throw new Error(`Compilation Integrity Error: permission ${permission} already exists`);
    });
  });
})();