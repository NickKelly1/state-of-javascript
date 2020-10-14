import { IRequestContext } from "../../common/interfaces/request-context.interface";
import jsonwebtoken from 'jsonwebtoken';
import { AccessTokenDto, IAccessTokenDto, IPreAccessTokenDto } from "./dtos/access-token.dto";
import { IPreRefreshTokenDto, IRefreshTokenDto, RefreshTokenDto } from "./dtos/refresh-token.dto";
import { Either, left, right } from "fp-ts/lib/Either";
import { Exception } from "../../common/exceptions/exception";
import { validate } from "../../common/helpers/validate.helper";
import { isLeft } from "fp-ts/lib/Either";
import { BadRequestException } from "../../common/exceptions/types/bad-request.exception";
import { ExceptionLang } from "../../common/i18n/packs/exception.lang";

export class JwtService {
  constructor(
    protected readonly ctx: IRequestContext,
  ) {
    //
  }

  protected expiresInSeconds(hasExp: { exp: number }): number {
    const { exp } = hasExp;
    return Math.round(exp - (Date.now() / 1000));
  }

  isExpired(hasExp: { exp: number }): boolean {
    const { exp } = hasExp;
    return this.expiresInSeconds({ exp }) >= 0;
  }

  decodeAccessToken(arg: { token: string }): Either<Exception, IAccessTokenDto> {
    const { token } = arg;

    // decode
    const obj = jsonwebtoken.decode(token);
    if (!obj) {
      return left(this.ctx.except(BadRequestException({
        message: this.ctx.lang(ExceptionLang.InvalidAccessToken),
      })))
    }

    // validate
    const validation = validate(AccessTokenDto, token);
    if (isLeft(validation)) {
      return left(this.ctx.except(BadRequestException({
        message: this.ctx.lang(ExceptionLang.InvalidAccessToken),
        data: validation.left,
      })));
    }

    return validation;
  }

  decodeRefreshToken(arg: { token: string }): Either<Exception, IRefreshTokenDto> {
    const { token } = arg;

    // decode
    const obj = jsonwebtoken.decode(token);
    if (!obj) {
      return left(this.ctx.except(BadRequestException({
        message: this.ctx.lang(ExceptionLang.InvalidAccessToken),
      })))
    }

    // validate
    const validation = validate(RefreshTokenDto, token);
    if (isLeft(validation)) {
      return left(this.ctx.except(BadRequestException({
        message: this.ctx.lang(ExceptionLang.InvalidAccessToken),
        data: validation.left,
      })));
    }

    return validation;
  }

  createAccessToken(arg: { partial: IPreAccessTokenDto }): IAccessTokenDto {
    const { partial } = arg;
    const now = Date.now()
    const exp = now + this.ctx.services.env().ACCESS_TOKEN_EXPIRES_IN_MS;
    const iat = now;
    const full: IAccessTokenDto = {
      exp,
      iat,
      permissions: partial.permissions,
      user_id: partial.user_id
    }
    return full;
  }

  createRefreshToken(arg: { partial: IPreRefreshTokenDto }): IRefreshTokenDto {
    const { partial } = arg;
    const now = Date.now()
    const exp = now + this.ctx.services.env().REFRESH_TOKEN_EXPIRES_IN_MS;
    const iat = now;
    const full: IRefreshTokenDto = {
      exp,
      iat,
      user_id: partial.user_id
    }
    return full;
  }

  signAccessToken(arg: { access: IAccessTokenDto }): string {
    const { access } = arg;
    const signed = jsonwebtoken.sign(access, this.ctx.services.env().JWT_SECRET);
    return signed;
  }

  signRefreshToken(arg: { refresh: IRefreshTokenDto }): string {
    const { refresh } = arg;
    const signed = jsonwebtoken.sign(refresh, this.ctx.services.env().JWT_SECRET);
    return signed;
  }
}