import { Handler } from "express";
import { isLeft } from "fp-ts/lib/Either";
import { ExtractJwt } from "passport-jwt";
import { LoginExpiredException } from "../exceptions/types/login-expired.exception";
import { ist } from "../helpers/is.helper";
import { mw } from "../helpers/mw.helper";
import { prettyQ } from "../helpers/pretty.helper";
import { logger } from "../logger/logger";

// if access token is given, verify it
export const passportMw = (): Handler => mw((ctx, next) => {
  const { req } = ctx;
  const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

  console.log('--');
  console.log('--');
  console.log('--');
  console.log('--');
  console.log('--');
  console.log('--');
  console.log(token);

  if (ist.nullable(token)) {
    // no token...
    return void next();
  }

  const mbAccess = ctx.services.jwtService().decodeAccessToken({ token });

  if (isLeft(mbAccess)) {
    // failed to validate token
    // throw mbAccess.left;
    // don't throw - let route handler throw if required...
    logger.warn(`Failed to validate access token: "${token}: ${prettyQ(mbAccess.left.toJsonDev())}"`);
    return void next();
  }

  const access = mbAccess.right;

  if (ctx.services.jwtService().isExpired(access)) {
    // throw ctx.except(LoginExpiredException());
    // don't throw - let route handler throw if required...
    return void next();
  }

  // use the valid access token
  ctx.auth.addAccess({ access });

  next();
})