import { Handler } from "express";
import { isLeft } from "fp-ts/lib/Either";
import { ExtractJwt } from "passport-jwt";
import { LoginExpiredException } from "../exceptions/types/login-expired.exception";
import { ist } from "../helpers/is.helper";
import { mw } from "../helpers/mw.helper";

// if access token is given, verify it
export const passportMw = (): Handler => mw((ctx, next) => {
  const { req } = ctx;
  const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

  if (ist.nullable(token)) {
    // no token...
    return void next();
  }

  const mbAccess = ctx.services.jwtService().decodeAccessToken({ token });

  if (isLeft(mbAccess)) {
    // failed to validatea token
    throw mbAccess.left;
  }

  const access = mbAccess.right;

  if (ctx.services.jwtService().isExpired(access)) {
    throw ctx.except(LoginExpiredException());
  }

  // use the valid access token
  ctx.auth.addAccess({ access });

  next();
})