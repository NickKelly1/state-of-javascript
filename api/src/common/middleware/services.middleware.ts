import { Handler, NextFunction, Request, Response } from "express"
import { HttpContext } from "../context/http.context";
import { RequestAuth } from "../classes/request-auth";
import { handler } from "../helpers/handler.helper";
import { RequestSerivceContainer } from "../containers/request.service.container";
import { IUniversalServices } from "../interfaces/universal.services.interface";
import { toId } from "../helpers/to-id.helper";
import { c_aid, h_aid } from "../constants/shad.const";

export const servicesMw = (arg: {
  universal: IUniversalServices,
}): Handler => handler(async (req: Request, res: Response, next: NextFunction) => {
  const { universal } = arg;
  // initialise req locals
  const ctx = HttpContext.ensure({ req, res });
  const services = new RequestSerivceContainer(ctx, universal);
  const systemPermissions = await universal.systemPermissionsService.getPermissions();
  let aid = req.header(h_aid) ?? req.cookies[c_aid] ?? null;
  // hash aid so it can't be spoofed (easily)
  // database writes will be with this writes aid
  if (aid) aid = universal.encryptionService.md5Hash({ value: aid });
  const auth = new RequestAuth(systemPermissions.pub.map(toId), undefined, aid);
  req.__locals__ = { auth, httpCtx: ctx, services, };
  next();
});
