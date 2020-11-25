import { Router } from 'express';
import { AuthRoutes } from './app/auth/auth.routes';
import { UserTokenRoutes } from './app/user-token/user-token.routes';
import { ExpressContext } from './common/classes/express-context';
import { mw } from './common/helpers/mw.helper';

export function Routes(arg: { app: ExpressContext }): Router {
  const { app } = arg;

  const router = Router();

  router.use('/v1/auth', AuthRoutes({ app }));
  router.use('/v1/user-links', UserTokenRoutes({ app }));
  // router.use('/v1/users', UserRoutes({ app }))
  // router.use('/v1/roles', RoleRoutes({ app }));
  // router.use('/v1/permissions', PermissionRoutes({ app }));
  // router.use('/v1/user-roles', UserRoleRoutes({ app }));
  // router.use('/v1/role-permissions', RolePermissionRoutes({ app }));

  return router;
}