import { Sequelize } from "sequelize";
import { JwtService } from "../../app/auth/jwt.service";
import { DbService } from "../../app/db/db.service";
import { HashService } from "../../app/hash/hash.service";
import { PermissionPolicy } from "../../app/permission/permission.policy";
import { PermissionRepository } from "../../app/permission/permission.repository";
import { PermissionService } from "../../app/permission/permission.service";
import { RolePermissionPolicy } from "../../app/role-permission/role-permission.policy";
import { RolePermissionRepository } from "../../app/role-permission/role-permission.repository";
import { RolePermissionService } from "../../app/role-permission/role-permission.service";
import { RoleRepository } from "../../app/role/role.repository";
import { RoleService } from "../../app/role/role.service";
import { RolePolicy } from "../../app/role/role.policy";
import { UserPasswordRepository } from "../../app/user-password/user-password.repository";
import { UserPasswordService } from "../../app/user-password/user-password.service";
import { UserRolePolicy } from "../../app/user-role/user-role.policy";
import { UserRoleRepository } from "../../app/user-role/user-role.repository";
import { UserRoleService } from "../../app/user-role/user-role.service";
import { UserPolicy } from "../../app/user/user.policy";
import { UserRepository } from "../../app/user/user.repository";
import { UserService } from "../../app/user/user.service";
import { EnvService } from "../environment/env";
import { NewsArticleService } from "../../app/news-article/news-article.service";
import { NewsArticleRepository } from "../../app/news-article/news-article.repository";
import { NewsArticlePolicy } from "../../app/news-article/news-article.policy";

export interface IServices {
  userService: () => UserService;
  userRepository: () => UserRepository;
  userPolicy: () => UserPolicy;

  roleService: () => RoleService;
  roleRepository: () => RoleRepository;
  rolePolicy: () => RolePolicy;

  permissionService: () => PermissionService;
  permissionRepository: () => PermissionRepository;
  permissionPolicy: () => PermissionPolicy;

  userRoleService: () => UserRoleService;
  userRoleRepository: () => UserRoleRepository;
  userRolePolicy: () => UserRolePolicy;

  rolePermissionService: () => RolePermissionService;
  rolePermissionRepository: () => RolePermissionRepository;
  rolePermissionPolicy: () => RolePermissionPolicy;

  newsArticleService: () => NewsArticleService;
  newsArticleRepository: () => NewsArticleRepository;
  newsArticlePolicy: () => NewsArticlePolicy;

  userPasswordService: () => UserPasswordService,
  userPasswordRepository: () => UserPasswordRepository;

  hash: () => HashService;
  env: () => EnvService;
  dbService: () => DbService;
  jwtService: () => JwtService;
}