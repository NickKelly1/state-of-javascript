export const Permission = {
  SuperAdmin: 10,

  ShowUsers: 100,
  ShowUserIdentities: 101,
  CreateUsers: 110,
  RegisterUsers: 111,
  UpdateUsers: 120,
  UpdateUserSelf: 121,
  UpdateUserPasswords: 122,
  SoftDeleteUsers: 130,
  SoftDeleteUserSelf: 131,
  HardDeleteUsers: 132,
  RestoreUsers: 133,

  ManageUsers: 140,
  DeactivateUsers: 141,

  ShowRoles: 200,
  CreateRoles: 210,
  UpdateRoles: 220,
  SoftDeleteRoles: 230,
  HardDeleteRoles: 231,
  RestoreRoles: 232,
  ManageRoles: 240,

  ShowPermissions: 300,

  ShowUserRoles: 400,
  CreateUserRoles: 410,
  UpdateUserRoles: 420,
  HardDeleteUserRoles: 430,
  ManageUserRoles: 440,

  ShowRolePermissions: 500,
  CreateRolePermissions: 510,
  UpdateRolePermissions: 520,
  HardDeleteRolePermissions: 530,
  ManageRolePermissions: 540,

  ShowNewsArticles: 600,
  CreateNewsArticles: 610,
  UpdateNewsArticles: 620,
  UpdateOwnNewsArticles: 621,
  SoftDeleteDeleteNewsArticles: 630,
  HardDeleteDeleteNewsArticles: 631,
  RestoreNewsArticles: 632,
  ManageNewsArticles: 640,

  ShowNewsArticleStatus: 700,

  ShowNpmsPackages: 800,
  CreateNpmsPackages: 810,
  UpdateNpmsPackages: 820,
  SoftDeleteNpmsPackages: 830,
  HardDeleteNpmsPackages: 831,
  RestoreNpmsPackages: 832,
  ManageNpmsPackages: 840,

  ShowNpmsDashboards: 900,
  CreateNpmsDashboards: 910,
  UpdateNpmsDashboards: 920,
  UpdateOwnNpmsDashboards: 921,
  SoftDeleteNpmsDashboards: 930,
  HardDeleteNpmsDashboards: 931,
  RestoreNpmsDashboards: 932,
  ManageNpmsDashboards: 940,

  ShowNpmsDashboardItem: 1000,
  CreateNpmsDashboardItem: 1010,
  UpdateNpmsDashboardItem: 1020,
  UpdateOwnNpmsDashboardItem: 1021,
  HardDeleteNpmsDashboardItem: 1030,
  HardDeleteOwnNpmsDashboardItem: 1031,
  ManageNpmsDashboardItem: 1040,

  ShowNpmsDashboardStatus: 1100,

  ShowIntegrations: 1200,
  ShowIntegrationSecrets: 1201,
  ManageIntegrations: 1220,
} as const;
export type Permission = typeof Permission;
export type APermission = Permission[keyof Permission];

