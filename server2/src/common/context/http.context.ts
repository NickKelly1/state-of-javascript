import url from 'url';
import qs from 'qs';
import { Request, Response } from 'express';
import { ALanguage } from '../i18n/consts/language.enum';
import { OrUndefined } from '../types/or-undefined.type';
import { IRequestContext } from '../interfaces/request-context.interface';
import { langMatch } from '../i18n/helpers/lange-match.helper';
import { IRequestServices } from '../interfaces/request.services.interface';
import Joi from 'joi';
import { IJson } from '../interfaces/json.interface';
import {
  ApiQuery,
  _and,
  _attr,
  _or,
  _val,
} from '../schemas/api.query.types';
import { IParsedQuery, transformApiQuery } from '../schemas/api.query.transformer';
import { logger } from '../logger/logger';
import { prettyQ } from '../helpers/pretty.helper';
import { BaseContext } from './base.context';
import { ExecutionContext } from '../classes/execution.context';
import { RequestAuth } from '../classes/request-auth';

export class HttpContext extends BaseContext implements IRequestContext {
  public readonly execution: ExecutionContext;
  public readonly req: Request;
  public readonly res: Response;

  get services(): IRequestServices {
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
    let ctx = req?.__locals__?.httpCtx;
    if (!ctx) {
      const execution = new ExecutionContext({});
      ctx = new HttpContext({ execution, req, res });
      execution.setHttp(ctx);
      if (!req.__locals__) {
        req.__locals__ = ({} as Request['__locals__']);
      }
      req.__locals__ = { ...req.__locals__, httpCtx: ctx };
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
    super();
    const { execution, req, res } = arg;
    this.execution = execution;
    this.req = req;
    this.res = res;
  }

  lang(switcher: Record<ALanguage, OrUndefined<string>>): string {
    const languages = this.req.acceptsLanguages();
    return langMatch(languages, switcher);
  }

  body<T>(validator?: Joi.ObjectSchema<T>): T {
    const { req } = this;
    const { body } = req;
    if (!validator) return body as T;
    return this.validate(validator, body);
  }

  findQuery(): IParsedQuery {
    const { req } = this;
    const { query } = req;
    const parsed = qs.parse(url.parse(req.url).query ?? '', { depth: 30 });
    const transformed = transformApiQuery(this, (parsed._q ?? {}) as ApiQuery);
    logger.info(`query\n${req.url}\n-----------\n${prettyQ(parsed)}\n+++++++++++\n${prettyQ(transformed)}`)
    return transformed;
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
