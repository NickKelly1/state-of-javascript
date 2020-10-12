import { Router } from 'express';
import { ExpressContext } from 'src/classes/express-context';
import { AuthRoutes } from './app/auth/auth.routes';
import { UserRoutes } from './app/user/user.routes';

export function Routes(arg: { app: ExpressContext }): Router {
  const { app } = arg;

  const router = Router();

  router.use('/users', UserRoutes({ app }))
  router.use('/auth', AuthRoutes({ app }));

  return router;
}