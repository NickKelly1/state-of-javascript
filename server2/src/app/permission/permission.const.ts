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
} as const;
export type Permission = typeof Permission;
export type APermission = Permission[keyof Permission];


export const PublicPermissions = [
  Permission.SuperAdmin,

  Permission.ShowUser,
  Permission.CreateUser,
  Permission.UpdateUser,
  Permission.DeleteUser,
  Permission.ManageUser,

  Permission.ShowRole,
  Permission.CreateRole,
  Permission.UpdateRole,
  Permission.DeleteRole,
  Permission.ManageRole,

  Permission.ShowPermission,

  Permission.ShowUserRole,
  Permission.CreateUserRole,
  Permission.UpdateUserRole,
  Permission.DeleteUserRole,
  Permission.ManageUserRole,

  Permission.ShowRolePermission,
  Permission.CreateRolePermission,
  Permission.UpdateRolePermission,
  Permission.DeleteRolePermission,
  Permission.ManageRolePermission,

  Permission.ShowNewsArticle,
  Permission.CreateNewsArticle,
  Permission.UpdateNewsArticle,
  Permission.DeleteNewsArticle,
  Permission.ManageNewsArticle,

  Permission.ShowNewsArticleStatus,
];