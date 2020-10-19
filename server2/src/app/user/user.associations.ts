import { Association } from "sequelize";
import { UserModel, UserPasswordModel, RoleModel, UserRoleModel } from "../../circle";
import { K2K } from "../../common/types/k2k.type";

export interface UserAssociations {
  [index: string]: Association;
  password: Association<UserModel, UserPasswordModel>;
  roles: Association<UserModel, RoleModel>;
  userRoles: Association<UserModel, UserRoleModel>;
};

export const UserAssociation: K2K<UserAssociations> = {
  password: 'password',
  roles: 'roles',
  userRoles: 'userRoles',
}