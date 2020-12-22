import { Request, Response } from "express";
import * as E from 'fp-ts/Either';
import { isLeft } from "fp-ts/lib/Either";
import { ExtractJwt } from "passport-jwt";
import { BaseContext } from "../../common/context/base.context";
import { ist } from "../../common/helpers/ist.helper";
import { prettyQ } from "../../common/helpers/pretty.helper";
import { AuthLang } from "../../common/i18n/packs/auth.lang";
import { logger } from "../../common/logger/logger";
import { OrNull } from "../../common/types/or-null.type";
import { PermissionId } from "../permission/permission-id.type";
import { UserModel } from "../user/user.model";
import { IAuthenticationGqlNodeSource, IAuthorisationRo } from "./gql-input/authorisation.gql";
import { IAccessToken } from "./token/access.token.gql";

export class AuthSerivce {
  constructor(
    protected readonly ctx: BaseContext,
  ) {
    //
  }


  /**
   * Get an access token
   *
   * @param arg
   */
  getAccessToken(arg: { req: Request, }): E.Either<string, OrNull<IAccessToken>> {
    const { req } = arg;
    // try header
    let token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    // try cookie
    if (!token) { token = req.cookies.access_token ?? null; }

    // no token...
    if (!token) return E.right(null);

    const mbAccess = this.ctx.services.jwtService.decodeAccessToken({ token });

    if (isLeft(mbAccess)) {
      // failed to validate token
      // throw mbAccess.left;
      // don't throw - let route handler throw if required...
      logger.warn(`Failed to validate access token: "${token}: ${prettyQ(mbAccess.left.toJsonDev())}"`);
      return E.left(mbAccess.left.message);
    }

    const access = mbAccess.right;

    if (this.ctx.services.jwtService.isExpired(access)) {
      logger.warn(`Expired access_token for user "${access.user_id}"`);
      // don't throw - let route handler throw if required...
      return E.left(this.ctx.lang(AuthLang.AccessExpired({ key: 'access_token' })));
    }

    return mbAccess;
  }


  /**
   * Unauthenticate accses_token (remove from cookies...)
   *
   * @param arg
   */
  unsetAccess(arg: {
    res?: Response;
  }): void {
    const { res } = arg;
    if (ist.defined(res)) {
      res.cookie(
        'access_token',
        '',
        {
          sameSite: false,
          domain: this.ctx.services.universal.env.HOST,
          secure: this.ctx.services.universal.env.is_prod(),
          path: '/',
          httpOnly: true,
          expires: new Date(0), // @ the beginning of UTC time... 1970
        },
      );
    }
    //
  }


  /**
   * Unauthenticate refresh_token (remove from cookies...)
   *
   * @param arg
   */
  unsetRefresh(arg: {
    res?: Response;
  }): void {
    const { res } = arg;
    if (ist.defined(res)) {
      res.cookie(
        'refresh_token',
        '',
        {
          // only send the refresh_token on the refresh route...
          // this means we can't use gql for the refresh route
          // by only using this route, we reduce the risk of
          // csrf attack
          sameSite: false,
          domain: this.ctx.services.universal.env.HOST,
          secure: this.ctx.services.universal.env.is_prod(),
          path: '/refresh/',
          httpOnly: true,
          expires: new Date(0), // @ the beginning of UTC time... 1970
        },
      );
    }
  }


  /**
   * Unauthenticate the requester
   *
   * @param arg
   */
  unauthenticate(arg: {
    res?: Response;
  }): void {
    const { res } = arg;
    // unset the access_token
    if (ist.notNullable(res)) {
      // @note: path must be the same as was set, otherwise won't be cleared...
      this.unsetAccess({ res });
      this.unsetRefresh({ res });
    }
  }


  /**
   * Authenticate the requester
   *
   * @param arg
   */
  authenticate(arg: {
    res?: Response,
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
    // add permissions to the current session...
    // this is helpful in GraphQL where response can use the new authentication
    this.ctx.auth.addPermissions({ permissions: access.permissions });

    if (ist.notNullable(res)) {
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
          // 1 year... make the token stick past jwt expiry
          // that way jwt will throw 401 instead of being silently revoked...
          // maxAge: 1_000 * 60 * 60 * 24 * 356, // this.ctx.services.universal.env.ACCESS_TOKEN_EXPIRES_IN_MS,
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
          path: '/refresh/',
          httpOnly: true,
          // expires: new Date(Date.now() + this.ctx.services.universal.env.REFRESH_TOKEN_EXPIRES_IN_MS),
          // 1 year... make the token stick past jwt expiry
          // that way jwt will throw 401 instead of being silently revoked...
          maxAge: this.ctx.services.universal.env.REFRESH_TOKEN_EXPIRES_IN_MS,
          // maxAge: 1_000 * 60 * 60 * 24 * 356, // this.ctx.services.universal.env.REFRESH_TOKEN_EXPIRES_IN_MS,
        },
      );
    }

    const obj: IAuthorisationRo = {
      access_token,
      refresh_token,
      access_token_object: access,
      refresh_token_object: refresh,
      user_name: user.name,
    };

    return obj;
  }



  /**
   * todo: docs
   *
   * @param arg
   */
  toAuthenticationGqlNodeSource(arg: { auth: IAuthorisationRo, user: UserModel }): IAuthenticationGqlNodeSource {
    const { auth, user, } = arg;
    const result: IAuthenticationGqlNodeSource = {
      access_token: auth.access_token,
      access_token_object: auth.access_token_object,
      refresh_token: auth.refresh_token,
      refresh_token_object: auth.refresh_token_object,
      user_id: user.id,
      user_name: user.name,
    };
    return result;
  }
}