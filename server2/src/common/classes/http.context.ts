import { ParamsDictionary, Query, } from 'express-serve-static-core';
import { Request, Response } from 'express';
import { ExecutionContext } from './execution-context';
import { ALanguage, Language } from '../i18n/consts/language.enum';
import { OrUndefined } from '../types/or-undefined.type';
import { IThrowable, IRequestContext } from '../interfaces/request-context.interface';
import { langMatch } from '../i18n/lange-match';
import { Exception } from '../exceptions/exception';
import { RequestAuth } from './request-auth';
import { UnauthenticatedException } from '../exceptions/types/unauthenticated.exception';
import { ForbiddenException } from '../exceptions/types/forbidden.exception';


export class HttpContext implements IRequestContext {
  public readonly execution: ExecutionContext;
  public readonly req: Request;
  public readonly res: Response;

  get auth(): RequestAuth {
    return this.req.__locals__.auth;
  }

  static create(arg: {
    req: Request;
    res: Response;
  }): HttpContext {
    const { req, res } = arg;
    let http = res.locals?.context;
    if (!http) {
      const execution = new ExecutionContext({});
      http = new HttpContext({ execution, req, res });
      execution.setHttp(http);
      res.locals.context = http;
    }
    return http;
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
    return exception;
  }

  lang(switcher: Record<ALanguage, OrUndefined<string>>): string {
    const languages = this.req.acceptsLanguages();
    return langMatch(languages, switcher);
  }
}
