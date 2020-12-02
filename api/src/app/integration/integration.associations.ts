import { Association } from "sequelize";
import { PermissionModel, UserModel, UserPasswordModel } from "../../circle";
import { K2K } from "../../common/types/k2k.type";
import { RolePermissionModel } from "../role-permission/role-permission.model";
import { RoleModel } from "../role/role.model";

export interface IntegrationAssociations {
  [index: string]: Association;
  //
};

export const IntegrationAssociation: K2K<IntegrationAssociations> = {
  //
}