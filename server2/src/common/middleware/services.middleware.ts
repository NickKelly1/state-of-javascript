import { Handler, NextFunction, Request, Response } from "express"
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
import { HttpContext } from "../classes/http.context";
import { RequestAuth } from "../classes/request-auth";
import { EnvService } from "../environment/env";
import { handler } from "../helpers/handler.helper";
import { lazy } from "../helpers/lazy";
import { logger } from "../logger/logger";
import { NewsArticleService } from "../../app/news-article/news-article.service";
import { NewsArticleRepository } from "../../app/news-article/news-article.repository";
import { NewsArticlePolicy } from "../../app/news-article/news-article.policy";
import { AuthSerivce } from "../../app/auth/auth.service";

export const servicesMw = (arg: { env: EnvService, sequelize: Sequelize }) => handler((req: Request, res: Response, next: NextFunction) => {
  // initialise req locals
  const auth = new RequestAuth();
  const ctx = HttpContext.ensure({ req, res });
  req.__locals__ = {
    auth,
    httpCtx: ctx,
    services: {
      userService: lazy(() => new UserService(ctx)),
      userRepository: lazy(() => new UserRepository(ctx)),
      userPolicy: lazy(() => new UserPolicy(ctx)),

      roleService: lazy(() => new RoleService(ctx)),
      roleRepository: lazy(() => new RoleRepository(ctx)),
      rolePolicy: lazy(() => new RolePolicy(ctx)),

      permissionService: lazy(() => new PermissionService(ctx)),
      permissionRepository: lazy(() => new PermissionRepository(ctx)),
      permissionPolicy: lazy(() => new PermissionPolicy(ctx)),

      userRoleService: lazy(() => new UserRoleService(ctx)),
      userRoleRepository: lazy(() => new UserRoleRepository(ctx)),
      userRolePolicy: lazy(() => new UserRolePolicy(ctx)),

      rolePermissionService: lazy(() => new RolePermissionService(ctx)),
      rolePermissionRepository: lazy(() => new RolePermissionRepository(ctx)),
      rolePermissionPolicy: lazy(() => new RolePermissionPolicy(ctx)),

      newsArticleService: lazy(() => new NewsArticleService(ctx)),
      newsArticleRepository: lazy(() => new NewsArticleRepository(ctx)),
      newsArticlePolicy: lazy(() => new NewsArticlePolicy(ctx)),

      userPasswordService: lazy(() => new UserPasswordService(ctx)),
      userPasswordRepository: lazy(() => new UserPasswordRepository(ctx)),

      env: lazy(() => arg.env),
      hash: lazy(() => new HashService(ctx)),
      dbService: lazy(() => new DbService(ctx, arg.sequelize)),
      jwtService: lazy(() => new JwtService(ctx)),
      authService: lazy(() => new AuthSerivce(ctx)),
    }
  };
  next();
});