import { Handler, Request } from "express";
import * as E from 'fp-ts/Either';
import { UnauthenticatedException } from "../exceptions/types/unauthenticated.exception";
import { ist } from "../helpers/ist.helper";
import { mw } from "../helpers/mw.helper";
import { toId } from "../helpers/to-id.helper";
import { OrNull } from "../types/or-null.type";
import { OrNullable } from "../types/or-nullable.type";

function authTokenCookieExtractor(req: Request): OrNull<string> {
  // req.signedCookies.access_token
  const access_token: OrNullable<string> = req.cookies.access_token;
  return access_token ?? null;
}

// if access token is given, verify it
export const passportMw = (): Handler => mw(async (ctx, next) => {
  const { req } = ctx;

  // if a refresh_token header was given but the value is empty string, just remove the header altogether...
  // need this hack for client that can't remove headers...

  const eAccess = ctx.services.authService.getAccessToken({ req });

  // token provided but is expired or badly formatted
  if (E.isLeft(eAccess)) {
    // unset the access token so they don't get stuck trying to log-out if they're sending it on log-out route...
    ctx.services.authService.unsetAccess({ res: ctx.res, });
    throw new UnauthenticatedException(eAccess.left);
  }

  // token is valid or doesn't exist
  const access = eAccess.right;

  // token doesn't exist - pass through without auth
  if (ist.nullable(access)) {
    return void next();
  }

  // use the valid access token
  ctx.auth.addAccess({ access });

  // add the "authenticated" permissions to the request
  const systemPermissions = await ctx.services.universal.systemPermissions.getPermissions();
  ctx.auth.addPermissions({ permissions: systemPermissions.authenticated.map(toId) });

  next();
})