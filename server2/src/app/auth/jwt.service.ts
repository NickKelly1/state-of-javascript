import { IRequestContext } from "../../common/interfaces/request-context.interface";
import jsonwebtoken from 'jsonwebtoken';
import { IRefreshTokenData, IRefreshToken, RefreshTokenValidator } from "./token/refresh.token.gql";
import { Either, left, right } from "fp-ts/lib/Either";
import { Exception } from "../../common/exceptions/exception";
import { validate } from "../../common/helpers/validate.helper";
import { isLeft } from "fp-ts/lib/Either";
import { BadRequestException } from "../../common/exceptions/types/bad-request.exception";
import { ExceptionLang } from "../../common/i18n/packs/exception.lang";
import { AccessTokenValidator, IAccessToken, IAccessTokenData } from "./token/access.token.gql";
import { logger } from "../../common/logger/logger";
import { prettyQ } from "../../common/helpers/pretty.helper";

export class JwtService {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }


  /**
   * In how many seconds does the thing expire?
   *
   * @param hasExp
   */
  protected expiresInSeconds(hasExp: { exp: number }): number {
    const { exp } = hasExp;
    return Math.round(exp - Date.now());
  }


  /**
   * Is the thing expired?
   *
   * @param hasExp
   */
  isExpired(hasExp: { exp: number }): boolean {
    const { exp } = hasExp;
    return this.expiresInSeconds({ exp }) <= 0;
  }


  /**
   * Decode the access token
   *
   * @param arg
   */
  decodeAccessToken(arg: { token: string }): Either<Exception, IAccessToken> {
    const { token } = arg;

    // decode
    const obj = jsonwebtoken.decode(token);
    if (!obj) {
      return left(this.ctx.except(BadRequestException({
        message: this.ctx.lang(ExceptionLang.InvalidAccessToken),
      })))
    }

    // validate
    const validation = validate(AccessTokenValidator, obj);
    if (isLeft(validation)) {
      return left(this.ctx.except(BadRequestException({
        message: this.ctx.lang(ExceptionLang.InvalidAccessToken),
        data: validation.left,
      })));
    }

    return validation;
  }


  /**
   * Decode the refresh token
   *
   * @param arg
   */
  decodeRefreshToken(arg: { token: string }): Either<Exception, IRefreshToken> {
    const { token } = arg;

    // decode
    const obj = jsonwebtoken.decode(token);
    if (!obj) {
      return left(this.ctx.except(BadRequestException({
        message: this.ctx.lang(ExceptionLang.InvalidRefreshToken),
      })))
    }

    // validate
    const validation = validate(RefreshTokenValidator, obj);
    if (isLeft(validation)) {
      return left(this.ctx.except(BadRequestException({
        message: this.ctx.lang(ExceptionLang.InvalidRefreshToken),
        data: validation.left,
      })));
    }

    return validation;
  }


  /**
   * Create a access token
   *
   * @param arg
   */
  createAccessToken(arg: { partial: IAccessTokenData }): IAccessToken {
    const { partial } = arg;
    const now = Date.now()
    const exp = now + this.ctx.services.universal.env.ACCESS_TOKEN_EXPIRES_IN_MS;
    const iat = now;
    const full: IAccessToken = {
      exp,
      iat,
      permissions: partial.permissions,
      user_id: partial.user_id
    }
    return full;
  }


  /**
   * Create a refresh token
   *
   * @param arg
   */
  createRefreshToken(arg: { partial: IRefreshTokenData }): IRefreshToken {
    const { partial } = arg;
    const now = Date.now()
    const exp = now + this.ctx.services.universal.env.REFRESH_TOKEN_EXPIRES_IN_MS;
    const iat = now;
    const full: IRefreshToken = {
      exp,
      iat,
      user_id: partial.user_id
    }
    return full;
  }


  /**
   * Sign the access token
   *
   * @param arg
   */
  signAccessToken(arg: { access: IAccessToken }): string {
    const { access } = arg;
    const signed = jsonwebtoken.sign(access, this.ctx.services.universal.env.JWT_SECRET);
    return signed;
  }


  /**
   * Sign the refresh token
   *
   * @param arg
   */
  signRefreshToken(arg: { refresh: IRefreshToken }): string {
    const { refresh } = arg;
    const signed = jsonwebtoken.sign(refresh, this.ctx.services.universal.env.JWT_SECRET);
    return signed;
  }
}