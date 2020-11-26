import { Association } from "sequelize";
import { UserModel, UserPasswordModel } from "../../circle";
import { K2K } from "../../common/types/k2k.type";
import { PermissionModel } from "../permission/permission.model";
import { RoleModel } from "../role/role.model";
import { PermissionCategoryModel } from "./permission-category.model";

export interface PermissionCategoryAssociations {
  [index: string]: Association;
  permissions: Association<PermissionCategoryModel, PermissionModel>;
};

export const PermissionCategoryAssociation: K2K<PermissionCategoryAssociations> = {
  permissions: 'permissions',
}