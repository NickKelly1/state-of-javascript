import { Association } from "sequelize/types";
import { RoleModel, UserModel, PermissionModel, UserRoleModel, RolePermissionModel } from "../../circle";
import { K2K } from "../../common/types/k2k.type";

export interface RoleAssociations {
  [index: string]: Association;
  users: Association<RoleModel, UserModel>;
  permissions: Association<RoleModel, PermissionModel>;
  userRoles: Association<UserModel, UserRoleModel>;
  rolePermissions: Association<UserModel, RolePermissionModel>;
};

export const RoleAssociation: K2K<RoleAssociations> = {
  users: 'users',
  permissions: 'permissions',
  userRoles: 'userRoles',
  rolePermissions: 'rolePermissions',
}