import { Association, Model, Sequelize } from 'sequelize';
import { PermissionAssociation } from './app/permission/permission.associations';
import { PermissionField } from './app/permission/permission.attributes';
import { RolePermissionAssociation } from './app/role-permission/role-permission.associations';
import { RolePermissionField } from './app/role-permission/role-permission.attributes';
import { RoleAssociation } from './app/role/role.associations';
import { RoleField } from './app/role/role.attributes';
import { UserPasswordAssociation } from './app/user-password/user-password.associations';
import { UserPasswordField } from './app/user-password/user-password.attributes';
import { UserRoleAssociation } from './app/user-role/user-role.associations';
import { UserRoleField } from './app/user-role/user-role.attributes';
import { UserAssociation } from './app/user/user.associations';
import { UserField } from './app/user/user.attributes';
import {
  PermissionModel,
  RoleModel,
  UserModel,
  UserPasswordModel,
  RolePermissionModel,
  UserRoleModel,
  initPermissionModel,
  initRoleModel,
  initRolePermissionModel,
  initUserModel,
  initUserPasswordModel,
  initUserRoleModel,
} from './circle';

export function modelsInit(arg: { sequelize: Sequelize }) {
  const { sequelize } = arg;

  // boot models
  initUserPasswordModel({ sequelize });
  initUserModel({ sequelize });
  initRoleModel({ sequelize });
  initPermissionModel({ sequelize });
  initUserRoleModel({ sequelize });
  initRolePermissionModel({ sequelize });


  // // user
  UserModel.hasOne(UserPasswordModel, { as: UserAssociation.password, sourceKey: UserField.id, foreignKey: UserPasswordField.user_id, })
  UserModel.hasMany(UserRoleModel, { as: UserAssociation.userRoles, sourceKey: UserField.id, foreignKey: UserRoleField.user_id, })
  UserModel.belongsToMany(RoleModel, { as: UserAssociation.roles, through: UserRoleModel as typeof Model, sourceKey: UserField.id, targetKey: RoleField.id, foreignKey: UserRoleField.user_id, otherKey: UserRoleField.role_id });

  // // user password
  UserPasswordModel.belongsTo(UserModel, { as: UserPasswordAssociation.user, foreignKey: UserPasswordField.user_id, targetKey: UserField.id, });

  // // role
  RoleModel.hasMany(UserRoleModel, { as: RoleAssociation.userRoles, sourceKey: RoleField.id, foreignKey: UserRoleField.role_id, })
  RoleModel.hasMany(RolePermissionModel, { as: RoleAssociation.rolePermissions, sourceKey: RoleField.id, foreignKey: RolePermissionField.role_id, })
  RoleModel.belongsToMany(UserModel, { as: RoleAssociation.users, through: UserRoleModel as typeof Model, sourceKey: RoleField.id, targetKey: UserField.id, foreignKey: UserRoleField.role_id, otherKey: UserRoleField.user_id });
  RoleModel.belongsToMany(PermissionModel, { as : RoleAssociation.permissions, through: RolePermissionModel as typeof Model, sourceKey: RoleField.id, targetKey: PermissionField.id, foreignKey: RolePermissionField.role_id, otherKey: RolePermissionField.permission_id });

  // // permission
  PermissionModel.hasMany(RolePermissionModel, { as: PermissionAssociation.rolePermissions, sourceKey: PermissionField.id, foreignKey: RolePermissionField.permission_id, })
  PermissionModel.belongsToMany(RoleModel, { as: PermissionAssociation.roles, through: RolePermissionModel as typeof Model, sourceKey: PermissionField.id, targetKey: RoleField.id, foreignKey: RolePermissionField.permission_id, otherKey: RolePermissionField.role_id });

  // // role permission
  RolePermissionModel.belongsTo(RoleModel, { as: RolePermissionAssociation.role, targetKey: RoleField.id, foreignKey: RolePermissionField.role_id, })
  RolePermissionModel.belongsTo(PermissionModel, { as: RolePermissionAssociation.permission, targetKey: PermissionField.id, foreignKey: RolePermissionField.role_id, })

  // // user role
  UserRoleModel.belongsTo(UserModel, { as: UserRoleAssociation.user, targetKey: UserField.id, foreignKey: UserRoleField.user_id, });
  UserRoleModel.belongsTo(RoleModel, { as: UserRoleAssociation.role, targetKey: RoleField.id, foreignKey: UserRoleField.role_id, })
}