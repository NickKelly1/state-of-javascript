import { Router } from 'express';
import { PermissionRoutes } from './app/permission/permission.routes';
import { RolePermissionRoutes } from './app/role-permission/role-permission.routes';
import { RoleRoutes } from './app/role/role.routes';
import { UserRoleRoutes } from './app/user-role/user-role.routes';
import { UserRoutes } from './app/user/user.routes';
import { ExpressContext } from './common/classes/express-context';
import { mw } from './common/helpers/mw.helper';

export function Routes(arg: { app: ExpressContext }): Router {
  const { app } = arg;

  const router = Router();

  // router.use('/v1/auth', AuthRoutes({ app }));
  // router.use('/v1/users', UserRoutes({ app }))
  // router.use('/v1/roles', RoleRoutes({ app }));
  // router.use('/v1/permissions', PermissionRoutes({ app }));
  // router.use('/v1/user-roles', UserRoleRoutes({ app }));
  // router.use('/v1/role-permissions', RolePermissionRoutes({ app }));

  return router;
}