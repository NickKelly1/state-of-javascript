export const Permission = {
  ShowUser: 100,
  CreateUser: 110,
  UpdateUser: 120,
  DeleteUser: 130,

  ShowRole: 200,
  CreateRole: 210,
  UpdateRole: 220,
  DeleteRole: 230,

  ShowPermission: 300,

  ShowUserRole: 400,
  CreateUserRole: 410,
  UpdateUserRole: 420,
  DeleteUserRole: 430,

  ShowRolePermission: 500,
  CreateRolePermission: 510,
  UpdateRolePermission: 520,
  DeleteRolePermission: 530,

} as const;
export type Permission = typeof Permission;
export type APermission = Permission[keyof Permission];


export const PublicPermissions = [
  Permission.ShowUser,
  Permission.CreateUser,
  Permission.UpdateUser,
  Permission.DeleteUser,

  Permission.ShowRole,
  Permission.CreateRole,
  Permission.UpdateRole,
  Permission.DeleteRole,

  Permission.ShowPermission,

  Permission.ShowUserRole,
  Permission.CreateUserRole,
  Permission.UpdateUserRole,
  Permission.DeleteUserRole,

  Permission.ShowRolePermission,
  Permission.CreateRolePermission,
  Permission.UpdateRolePermission,
  Permission.DeleteRolePermission,
];