import { Association } from "sequelize";
import { RolePermissionModel, UserModel } from "../../circle";
import { K2K } from "../../common/types/k2k.type";
import { PermissionModel } from "../permission/permission.model";
import { RoleModel } from "../role/role.model";

export interface RolePermissionAssociations {
  [index: string]: Association;
  role: Association<RolePermissionModel, RoleModel>;
  permission: Association<RolePermissionModel, PermissionModel>;
};

export const RolePermissionAssociation: K2K<RolePermissionAssociations> = {
  role: 'role',
  permission: 'permission',
}