import { Association } from "sequelize";
import { UserRoleModel, UserModel } from "../../circle";
import { K2K } from "../../common/types/k2k.type";
import { RoleModel } from "../role/role.model";

export interface UserRoleAssociations {
  [index: string]: Association;
  user: Association<UserRoleModel, UserModel>;
  role: Association<UserRoleModel, RoleModel>;
};

export const UserRoleAssociation: K2K<UserRoleAssociations> = {
  user: 'user',
  role: 'role',
}