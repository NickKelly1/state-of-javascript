import { Association } from "sequelize";
import { PermissionModel, UserModel, UserPasswordModel } from "../../circle";
import { K2K } from "../../common/types/k2k.type";
import { PermissionCategoryModel } from "../permission-category/permission-category.model";
import { RolePermissionModel } from "../role-permission/role-permission.model";
import { RoleModel } from "../role/role.model";

export interface PermissionAssociations {
  [index: string]: Association;
  roles: Association<PermissionModel, RoleModel>;
  rolePermissions: Association<PermissionModel, RolePermissionModel>;
  category: Association<PermissionModel, PermissionCategoryModel>;
};

export const PermissionAssociation: K2K<PermissionAssociations> = {
  roles: 'roles',
  rolePermissions: 'rolePermissions',
  category: 'category',
}