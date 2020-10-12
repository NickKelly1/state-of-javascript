import { ExpressContext } from "@src/classes/express-context";
import { HttpCode } from "@src/constants/http-code.const";
import { mw } from "@src/helpers/mw.helper";
import { Router } from "express";

export function UserRoutes(arg: { app: ExpressContext }): Router {
  const { app } = arg;
  const router = Router();

  router.use('/', mw(async (ctx, next) => {
    const { req, res } = ctx;
    res.status(HttpCode.OK).json({ users: ':)' });
  }));

  return router;
}