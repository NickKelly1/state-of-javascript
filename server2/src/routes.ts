import { Router } from 'express';
import { AuthRoutes } from './app/auth/auth.routes';
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


  router.use('/auth', AuthRoutes({ app }));

  router.use('/users', UserRoutes({ app }))
  router.use('/roles', RoleRoutes({ app }));
  router.use('/permissions', PermissionRoutes({ app }));
  router.use('/user-roles', UserRoleRoutes({ app }));
  router.use('/role-permissions', RolePermissionRoutes({ app }));

  return router;
}