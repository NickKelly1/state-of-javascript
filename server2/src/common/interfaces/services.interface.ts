import { Sequelize } from "sequelize";
import { JwtService } from "../../app/auth/jwt.service";
import { DbService } from "../../app/db/db.service";
import { HashService } from "../../app/hash/hash.service";
import { PermissionPolicy } from "../../app/permission/permission.policy";
import { PermissionService } from "../../app/permission/permission.service";
import { RolePermissionPolicy } from "../../app/role-permission/role-permission.policy";
import { RolePermissionService } from "../../app/role-permission/role-permission.service";
import { RoleService } from "../../app/role/role.service";
import { RolePolicy } from "../../app/role/user.policy";
import { UserPasswordService } from "../../app/user-password/user-password.service";
import { UserRolePolicy } from "../../app/user-role/user-role.policy";
import { UserRoleService } from "../../app/user-role/user-role.service";
import { UserPolicy } from "../../app/user/user.policy";
import { UserService } from "../../app/user/user.service";
import { EnvService } from "../environment/env";

export interface IServices {
  userService: () => UserService;
  userPolicy: () => UserPolicy;

  roleService: () => RoleService;
  rolePolicy: () => RolePolicy;

  permissionService: () => PermissionService;
  permissionPolicy: () => PermissionPolicy;

  userRoleService: () => UserRoleService;
  userRolePolicy: () => UserRolePolicy;

  rolePermissionService: () => RolePermissionService;
  rolePermissionPolicy: () => RolePermissionPolicy;

  userPasswordService: () => UserPasswordService,
  hash: () => HashService;
  env: () => EnvService;
  dbService: () => DbService;
  jwtService: () => JwtService;
}