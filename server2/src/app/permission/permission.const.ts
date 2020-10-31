export const Permission = {
  SuperAdmin: 10,

  ShowUser: 100,
  CreateUser: 110,
  UpdateUser: 120,
  DeleteUser: 130,
  ManageUser: 140,

  ShowRole: 200,
  CreateRole: 210,
  UpdateRole: 220,
  DeleteRole: 230,
  ManageRole: 240,

  ShowPermission: 300,

  ShowUserRole: 400,
  CreateUserRole: 410,
  UpdateUserRole: 420,
  DeleteUserRole: 430,
  ManageUserRole: 440,

  ShowRolePermission: 500,
  CreateRolePermission: 510,
  UpdateRolePermission: 520,
  DeleteRolePermission: 530,
  ManageRolePermission: 540,

  ShowNewsArticle: 600,
  CreateNewsArticle: 610,
  UpdateNewsArticle: 620,
  DeleteNewsArticle: 630,
  ManageNewsArticle: 640,

  ShowNewsArticleStatus: 700,

  ShowNpmsRecord: 800,
  CreateNpmsRecord: 810,
  UpdateNpmsRecord: 820,
  DeleteNpmsRecord: 830,
  ManageNpmsRecords: 840,

  ShowNpmsDashboard: 900,
  CreateNpmsDashboard: 910,
  UpdateNpmsDashboard: 920,
  DeleteNpmsDashboard: 930,
  ManageNpmsDashboard: 940,

  ShowNpmsDashboardItem: 1000,
  CreateNpmsDashboardItem: 1010,
  UpdateNpmsDashboardItem: 1020,
  DeleteNpmsDashboardItem: 1030,
  ManageNpmsDashboardItem: 1040,
} as const;
export type Permission = typeof Permission;
export type APermission = Permission[keyof Permission];

