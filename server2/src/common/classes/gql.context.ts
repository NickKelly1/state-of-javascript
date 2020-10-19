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

export class GqlContext implements IRequestContext {
  public readonly execution: ExecutionContext;
  protected readonly req: Request;
  protected readonly res: Response;
  protected _runner?: QueryRunner;

  get services(): IServices {
    return this.req.__locals__.services;
  }

  get auth(): RequestAuth {
    return this.req.__locals__.auth;
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
    this.req = req;
    this.res = res;
  }

  authorize(can: boolean): void | never {
    if (!can) throw this.except(ForbiddenException());
  }

  except(throwable: IThrowable): Exception {
    const exception = throwable(this);
    exception.shiftStack(3);
    return exception;
  }

  lang(switcher: Record<ALanguage, OrUndefined<string>>): string {
    const languages = this.req.acceptsLanguages();
    return langMatch(languages, switcher);
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
