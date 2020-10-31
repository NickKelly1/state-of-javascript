import { Handler, Request } from "express";
import { isLeft } from "fp-ts/lib/Either";
import { ExtractJwt } from "passport-jwt";
import { LoginExpiredException } from "../exceptions/types/login-expired.exception";
import { ist } from "../helpers/ist.helper";
import { mw } from "../helpers/mw.helper";
import { prettyQ } from "../helpers/pretty.helper";
import { logger } from "../logger/logger";
import { OrNull } from "../types/or-null.type";
import { OrNullable } from "../types/or-nullable.type";
import { OrUndefined } from "../types/or-undefined.type";

function authTokenCookieExtractor(req: Request): OrNull<string> {
  // req.signedCookies.access_token
  const access_token: OrNullable<string> = req.cookies.access_token;
  return access_token ?? null;
}

// if access token is given, verify it
export const passportMw = (): Handler => mw((ctx, next) => {
  const { req } = ctx;

  const access = ctx.services.authService.getAccessToken({ req });

  if (ist.nullable(access)) {
    return void next();
  }

  // use the valid access token
  ctx.auth.addAccess({ access });

  next();
})