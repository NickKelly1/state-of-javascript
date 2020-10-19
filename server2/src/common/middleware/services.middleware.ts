import { Handler, NextFunction, Request, Response } from "express"
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
import { HttpContext } from "../classes/http.context";
import { RequestAuth } from "../classes/request-auth";
import { EnvService } from "../environment/env";
import { handler } from "../helpers/handler.helper";
import { lazy } from "../helpers/lazy";
import { logger } from "../logger/logger";

export const servicesMw = (arg: { env: EnvService, sequelize: Sequelize }) => handler((req: Request, res: Response, next: NextFunction) => {
  // initialise req locals
  const auth = new RequestAuth();
  const ctx = HttpContext.ensure({ req, res });
  req.__locals__ = {
    auth,
    httpCtx: ctx,
    services: {
      userService: lazy(() => new UserService(ctx)),
      userPolicy: lazy(() => new UserPolicy(ctx)),

      roleService: lazy(() => new RoleService(ctx)),
      rolePolicy: lazy(() => new RolePolicy(ctx)),

      permissionService: lazy(() => new PermissionService(ctx)),
      permissionPolicy: lazy(() => new PermissionPolicy(ctx)),

      userRoleService: lazy(() => new UserRoleService(ctx)),
      userRolePolicy: lazy(() => new UserRolePolicy(ctx)),

      rolePermissionService: lazy(() => new RolePermissionService(ctx)),
      rolePermissionPolicy: lazy(() => new RolePermissionPolicy(ctx)),


      env: lazy(() => arg.env),
      hash: lazy(() => new HashService(ctx)),
      userPasswordService: lazy(() => new UserPasswordService(ctx)),
      dbService: lazy(() => new DbService(ctx, arg.sequelize)),
      jwtService: lazy(() => new JwtService(ctx)),
    }
  };
  next();
});