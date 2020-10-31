import { Request, Response } from "express";
import { isLeft } from "fp-ts/lib/Either";
import { ExtractJwt } from "passport-jwt";
import { ist } from "../../common/helpers/ist.helper";
import { prettyQ } from "../../common/helpers/pretty.helper";
import { IRequestContext } from "../../common/interfaces/request-context.interface";
import { logger } from "../../common/logger/logger";
import { OrNull } from "../../common/types/or-null.type";
import { PermissionId } from "../permission/permission-id.type";
import { UserModel } from "../user/user.model";
import { IAuthorisationRo } from "./gql/authorisation.gql";
import { IAccessToken } from "./token/access.token.gql";

export class AuthSerivce {
  constructor(
    protected readonly ctx: IRequestContext
  ) {
    //
  }

  getAccessToken(arg: { req: Request, }): OrNull<IAccessToken> {
    const { req } = arg;
    // try header
    let token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    // try cookie
    if (ist.nullable(token)) { token = req.cookies.access_token ?? null; }

    // no token...
    if (ist.nullable(token)) return null;

    const mbAccess = this.ctx.services.jwtService.decodeAccessToken({ token });

    if (isLeft(mbAccess)) {
      // failed to validate token
      // throw mbAccess.left;
      // don't throw - let route handler throw if required...
      logger.warn(`Failed to validate access token: "${token}: ${prettyQ(mbAccess.left.toJsonDev())}"`);
      return null;
    }

    const access = mbAccess.right;

    if (this.ctx.services.jwtService.isExpired(access)) {
      logger.warn(`Expired access_token for user "${access.user_id}"`);
      // throw ctx.except(LoginExpiredException());
      // don't throw - let route handler throw if required...
      return null;
    }

    return mbAccess.right;
  }

  unauthenticate(arg: { res: Response }): void {
    const { res } = arg;
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }

  authenticate(arg: {
    res: Response,
    user: UserModel;
    permissions: PermissionId[];
  }): IAuthorisationRo {
    const { res, user, permissions } = arg;
    const access = this.ctx.services.jwtService.createAccessToken({ partial: {
      permissions: permissions,
      user_id: user.id,
    }});
    const refresh = this.ctx.services.jwtService.createRefreshToken({ partial: { user_id: user.id } });
    const access_token = this.ctx.services.jwtService.signAccessToken({ access });
    const refresh_token = this.ctx.services.jwtService.signRefreshToken({ refresh });

    res.cookie(
      'access_token',
      access_token,
      {
        sameSite: false,
        domain: this.ctx.services.universal.env.HOST,
        secure: this.ctx.services.universal.env.is_prod(),
        path: '/',
        httpOnly: true,
        // expires: new Date(Date.now() + this.ctx.services.universal.env.ACCESS_TOKEN_EXPIRES_IN_MS),
        maxAge: this.ctx.services.universal.env.ACCESS_TOKEN_EXPIRES_IN_MS,
      },
    );


    // scoped refresh to user
    res.cookie(
      'refresh_token',
      refresh_token,
      {
        // only send the refresh_token on the refresh route...
        // this means we can't use gql for the refresh route
        // by only using this route, we reduce the risk of
        // csrf attack
        sameSite: false,
        domain: this.ctx.services.universal.env.HOST,
        secure: this.ctx.services.universal.env.is_prod(),
        path: '/v1/auth/refresh',
        httpOnly: true,
        // expires: new Date(Date.now() + this.ctx.services.universal.env.REFRESH_TOKEN_EXPIRES_IN_MS),
        maxAge: this.ctx.services.universal.env.REFRESH_TOKEN_EXPIRES_IN_MS,
      },
    );

    const obj: IAuthorisationRo = {
      access_token,
      refresh_token,
      access_token_object: access,
      refresh_token_object: refresh,
      user: {
        name: user.name,
      },
    };

    return obj;
  }
}