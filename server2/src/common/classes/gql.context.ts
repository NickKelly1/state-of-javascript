import url from 'url';
import qs from 'qs';
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
import {
  ApiQuery,
  ApiSorts,
  ApiConditionAnd,
  ApiConditionAttributes,
  ApiConditionOr,
  ApiConditionValue,
  ApiConditional,
  ApiDir,
  ApiFilter,
  ApiFilterAttributes,
  ApiFilterOperators,
  ApiFilterOperatorsTypes,
  ApiFilterRange,
  ApiOp,
  ApiSort,
  _and,
  _attr,
  _or,
  _val,
} from '../schemas/api.query.types';
import { IParsedQuery, transformApiQuery } from '../schemas/api.query.transformer';
import { logger } from '../logger/logger';
import { pretty, prettyQ } from '../helpers/pretty.helper';
import { QueryRunner } from '../../app/db/query-runner';
import { InternalServerException } from '../exceptions/types/internal-server.exception';
import { InternalServerExceptionLang } from '../i18n/packs/internal-server-exception.lang';
import { Transaction } from 'sequelize';
import { Loader } from './loader';
import { UserId } from '../../app/user/user.id.type';
import { userInfo } from 'os';
import { ist } from '../helpers/ist.helper';

export class GqlContext implements IRequestContext {
  public readonly execution: ExecutionContext;
  protected readonly _req: Request;
  protected readonly _res: Response;
  protected _runner?: QueryRunner;

  get req(): Request { return this._req; }
  get res(): Response { return this._res; }
  get services(): IServices { return this._req.__locals__.services; }
  get auth(): RequestAuth { return this._req.__locals__.auth; }

  assertAuthentication(): UserId {
    const user_id = this.auth.user_id;
    if (ist.nullable(user_id)) {
      throw this.except(UnauthenticatedException());
    }
    return user_id;
  }

  // get transaction(): Transaction {
  //   const { transaction } = this.runner;
  //   return transaction;
  // }

  // get runner(): QueryRunner {
  //   if (!this._runner) {
  //     throw this.except(InternalServerException({
  //       message: this.lang(InternalServerExceptionLang.RunnerNotInitialised),
  //     }));
  //   }
  //   return this._runner;
  // }

  static create(arg: {
    req: Request;
    res: Response;
  }): GqlContext {
    const { req, res } = arg;
    let ctx = req?.__locals__?.gqlCtx;
    if (!ctx) {
      const execution = new ExecutionContext({});
      ctx = new GqlContext({ execution, req, res });
      execution.setGql(ctx);
      if (!req.__locals__) {
        req.__locals__ = ({} as Request['__locals__']);
      }
      req.__locals__.gqlCtx = ctx;
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
    const { execution, req, res, } = arg;
    this.execution = execution;
    this._req = req;
    this._res = res;
  }

  protected _loader?: Loader;
  public get loader(): Loader {
    if (this._loader) return this._loader;
    this._loader = new Loader({ ctx: this, });
    return this._loader;
  }

  authorize(can: boolean): void | never {
    if (!can) throw this.except(ForbiddenException());
  }

  except(throwable: IThrowable): Exception {
    const exception = throwable(this);
    exception.shiftStack(2);
    return exception;
  }

  lang(switcher: Record<ALanguage, OrUndefined<string>>): string {
    const languages = this._req.acceptsLanguages();
    return langMatch(languages, switcher);
  }

  info(): IJson {
    const url = this._req.url;
    const ip = this._req.ip;
    return {
      url,
      ip,
      user_id: this.auth.user_id ?? null,
    };
  }

  validate<T>(validator: Joi.ObjectSchema<T>, obj: unknown): T {
    const { _req: req } = this;
    const { body } = req;
    const validation = validate(validator, obj);
    if (isLeft(validation)) {
      throw this.except(BadRequestException({
        error: this.lang(ExceptionLang.BadRequest),
        data: validation.left,
      }));
    }
    return validation.right;
  }



  // prep(arg: { runner: QueryRunner }) {
  //   const { runner } = arg;
  //   if (this._runner) {
  //     throw this.except(InternalServerException({
  //       message: this.lang(InternalServerExceptionLang.RunnerAlreadyInitialised),
  //     }));
  //   }
  //   this._runner = runner;
  //   return;
  // }
}
