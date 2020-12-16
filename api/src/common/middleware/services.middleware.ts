import { Handler, NextFunction, Request, Response } from "express"
import { Sequelize } from "sequelize";
import { HttpContext } from "../context/http.context";
import { RequestAuth } from "../classes/request-auth";
import { EnvService } from "../environment/env";
import { handler } from "../helpers/handler.helper";
import { RequestSerivceContainer } from "../containers/request.service.container";
import { IUniversalServices } from "../interfaces/universal.services.interface";
import { toId } from "../helpers/to-id.helper";
import { c_shadow_id, h_shadow_id } from "../constants/shad.const";

export const servicesMw = (arg: {
  universal: IUniversalServices,
}): Handler => handler(async (req: Request, res: Response, next: NextFunction) => {
  const { universal } = arg;
  // initialise req locals
  const ctx = HttpContext.ensure({ req, res });
  const services = new RequestSerivceContainer(ctx, universal);
  const systemPermissions = await universal.systemPermissions.getPermissions();
  const auth = new RequestAuth(
    systemPermissions.pub.map(toId),
    undefined,
    // TODO: hash shad_id so it can't be spoofed so easy...
    req.header(h_shadow_id) ?? req.cookies[c_shadow_id] ?? null,
  );
  req.__locals__ = { auth, httpCtx: ctx, services, };
  next();
});
