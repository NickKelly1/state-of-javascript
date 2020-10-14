import { ParamsDictionary, Query, } from 'express-serve-static-core';
import { Request, Response } from 'express';
import { ExecutionContext } from './execution-context';
import { ALanguage, Language } from '../i18n/consts/language.enum';
import { OrUndefined } from '../types/or-undefined.type';
import { IThrowable, IRequestContext } from '../interfaces/request-context.interface';
import { langMatch } from '../i18n/helpers/lange-match.helper';
import { Exception } from '../exceptions/exception';
import { RequestAuth } from './request-auth';
import { UnauthenticatedException } from '../exceptions/types/unauthenticated.exception';
import { ForbiddenException } from '../exceptions/types/forbidden.exception';
import { IServices } from '../interfaces/services.interface';
import Joi from 'joi';
import { validate } from '../helpers/validate.helper';
import { isLeft } from 'fp-ts/lib/Either';
import { BadRequestException } from '../exceptions/types/bad-request.exception';
import { ExceptionLang } from '../i18n/packs/exception.lang';
import { IJson } from '../interfaces/json.interface';


export class HttpContext implements IRequestContext {
  public readonly execution: ExecutionContext;
  public readonly req: Request;
  public readonly res: Response;

  get services(): IServices {
    return this.req.__locals__.services;
  }

  get auth(): RequestAuth {
    return this.req.__locals__.auth;
  }

  static ensure(arg: {
    req: Request;
    res: Response;
  }): HttpContext {
    const { req, res } = arg;
    let ctx = req?.__locals__?.ctx;
    if (!ctx) {
      const execution = new ExecutionContext({});
      ctx = new HttpContext({ execution, req, res });
      execution.setHttp(ctx);
      req.__locals__ = { ...req.__locals__, ctx };
    }
    return ctx;
  }

  constructor(
    arg: {
      readonly execution: ExecutionContext,
      readonly req: Request,
      readonly res: Response,
    }
  ) {
    const { execution, req, res } = arg;
    this.execution = execution;
    this.req = req;
    this.res = res;
  }

  authorize(can: boolean): void | never {
    if (!can) throw this.except(ForbiddenException());
  }

  except(throwable: IThrowable): Exception {
    const exception = throwable(this);
    // Error.captureStackTrace()
    exception.shiftStack(3);
    return exception;
  }

  lang(switcher: Record<ALanguage, OrUndefined<string>>): string {
    const languages = this.req.acceptsLanguages();
    return langMatch(languages, switcher);
  }

  body<T>(validator: Joi.ObjectSchema<T>): T {
    const { req } = this;
    const { body } = req;
    const validation = validate(validator, body);
    if (isLeft(validation)) {
      throw this.except(BadRequestException({
        error: this.lang(ExceptionLang.BadRequest),
        data: validation.left,
      }));
    }
    return body;
  }

  info(): IJson {
    const url = this.req.url;
    const ip = this.req.ip;
    return {
      url,
      ip,
      user_id: this.auth.user_id ?? null,
    };
  }
}
