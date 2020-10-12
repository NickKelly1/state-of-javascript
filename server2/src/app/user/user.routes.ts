import { Router } from 'express';
import { ExpressContext } from '../../classes/express-context';
import { HttpCode } from '../../constants/http-code.const';
import { mw } from '../../helpers/mw.helper';

export function UserRoutes(arg: { app: ExpressContext }): Router {
  const { app } = arg;
  const router = Router();

  router.use('/', mw(async (ctx, next) => {
    const { req, res } = ctx;
    res.status(HttpCode.OK).json({ users: ':)' });
  }));

  return router;
}