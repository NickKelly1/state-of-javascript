import jsonwebtoken from 'jsonwebtoken';
import { IRefreshTokenData, IRefreshToken, RefreshTokenValidator } from "./token/refresh.token.gql";
import { Either, left } from "fp-ts/lib/Either";
import { validate } from "../../common/helpers/validate.helper";
import { isLeft } from "fp-ts/lib/Either";
import { BadRequestException } from "../../common/exceptions/types/bad-request.exception";
import { ExceptionLang } from "../../common/i18n/packs/exception.lang";
import { AccessTokenValidator, IAccessToken, IAccessTokenData } from "./token/access.token.gql";
import httpErrors from 'http-errors';
import { BaseContext } from '../../common/context/base.context';

export class JwtService {
  constructor(
    protected readonly ctx: BaseContext,
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
  decodeAccessToken(arg: { token: string }): Either<httpErrors.HttpError, IAccessToken> {
    const { token } = arg;

    // decode
    const obj = jsonwebtoken.decode(token);
    if (!obj) {
      const message = this.ctx.lang(ExceptionLang.InvalidAccessToken);
      return left(new BadRequestException(message));
    }

    // validate
    const validation = validate(AccessTokenValidator, obj);
    if (isLeft(validation)) {
      const message = this.ctx.lang(ExceptionLang.InvalidAccessToken);
      return left(new BadRequestException(message, validation.left));
    }

    return validation;
  }


  /**
   * Decode the refresh token
   *
   * @param arg
   */
  decodeRefreshToken(arg: { token: string }): Either<httpErrors.HttpError, IRefreshToken> {
    const { token } = arg;

    // decode
    const obj = jsonwebtoken.decode(token);
    if (!obj) {
      const message = this.ctx.lang(ExceptionLang.InvalidRefreshToken);
      return left(new BadRequestException(message));
    }

    // validate
    const validation = validate(RefreshTokenValidator, obj);
    if (isLeft(validation)) {
      const message = this.ctx.lang(ExceptionLang.InvalidRefreshToken);
      return left(new BadRequestException(message, validation.left));
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
      // ensure unique permissions...
      permissions: Array.from(new Set(partial.permissions).values()),
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