export const Permission = {
  ShowUser: 100,
  CreateUser: 110,
  UpdateUser: 120,
  DeleteUser: 130,
} as const;
export type Permission = typeof Permission;
export type APermission = Permission[keyof Permission];


export const PublicPermissions = [
  Permission.ShowUser,
  Permission.CreateUser,
  Permission.UpdateUser,
  Permission.DeleteUser,
];