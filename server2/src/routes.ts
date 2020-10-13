import { Router } from 'express';
import { AuthRoutes } from './app/auth/auth.routes';
import { UserRoutes } from './app/user/user.routes';
import { ExpressContext } from './common/classes/express-context';
import { mw } from './common/helpers/mw.helper';

export function Routes(arg: { app: ExpressContext }): Router {
  const { app } = arg;

  const router = Router();


  router.use('/users', UserRoutes({ app }))
  router.use('/auth', AuthRoutes({ app }));

  // router.use('/', mw(async ({ http, next }) => {
  //   //
  // }));

  return router;
}