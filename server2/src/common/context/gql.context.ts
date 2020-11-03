import { Request, Response } from 'express';
import { ALanguage } from '../i18n/consts/language.enum';
import { OrUndefined } from '../types/or-undefined.type';
import { IRequestContext } from '../interfaces/request-context.interface';
import { langMatch } from '../i18n/helpers/lange-match.helper';
import { IRequestServices } from '../interfaces/request.services.interface';
import { IJson } from '../interfaces/json.interface';
import {
  _and,
  _attr,
  _or,
  _val,
} from '../schemas/api.query.types';
import { QueryRunner } from '../../app/db/query-runner';
import { BaseContext } from './base.context';
import { ExecutionContext } from '../classes/execution.context';
import { RequestAuth } from '../classes/request-auth';

export class GqlContext extends BaseContext implements IRequestContext {
  public readonly execution: ExecutionContext;
  protected readonly _req: Request;
  protected readonly _res: Response;
  protected _runner?: QueryRunner;

  get req(): Request { return this._req; }
  get res(): Response { return this._res; }
  get services(): IRequestServices { return this._req.__locals__.services; }
  get auth(): RequestAuth { return this._req.__locals__.auth; }

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
    super();
    const { execution, req, res, } = arg;
    this.execution = execution;
    this._req = req;
    this._res = res;
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
}
