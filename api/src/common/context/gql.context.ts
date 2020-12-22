import { Request, Response } from 'express';
import { ALanguage, Language } from '../i18n/consts/language.enum';
import { OrUndefined } from '../types/or-undefined.type';
import { langMatch } from '../i18n/helpers/lange-match.helper';
import { IRequestServices } from '../interfaces/request.services.interface';
import { IJson } from '../interfaces/json.interface';
import { QueryRunner } from '../../app/db/query-runner';
import { BaseContext } from './base.context';
import { ExecutionContext } from '../classes/execution.context';
import { RequestAuth } from '../classes/request-auth';

export class GqlContext extends BaseContext {
  public readonly execution: ExecutionContext;
  protected readonly _http?: { req: Request; res: Response };
  protected readonly _auth: RequestAuth;
  protected readonly _services: IRequestServices;
  protected _runner?: QueryRunner;


  get http(): OrUndefined<{ req: Request; res: Response }> { return this._http; }
  get auth(): RequestAuth { return this._auth; }
  get services(): IRequestServices { return this._services; }


  /**
   * Create a GqlRequestContext from Http req & res
   *
   * @param arg
   */
  static createFromHttp(arg: {
    req: Request;
    res: Response;
  }): GqlContext {
    const { req, res } = arg;
    let ctx = req?.__locals__?.gqlCtx;
    if (!ctx) {
      const execution = new ExecutionContext({});
      ctx = new GqlContext({
        execution,
        http: {
          req,
          res,
        },
        auth: req.__locals__.auth,
        services: req.__locals__.services,
      });
      execution.setGql(ctx);
      if (!req.__locals__) {
        req.__locals__ = ({} as Request['__locals__']);
      }
      req.__locals__.gqlCtx = ctx;
    }
    return ctx;
  }


  /**
   * Constructor
   *
   * @param arg
   */
  constructor(
    arg: {
      readonly execution: ExecutionContext,
      readonly auth: RequestAuth;
      readonly services: IRequestServices;
      readonly http: OrUndefined<{ req: Request, res: Response }>;
    }
  ) {
    super();
    const { execution, http, auth, services } = arg;
    this.execution = execution;
    this._auth = auth;
    this._services = services;
    this._http = http;
  }


  /**
   * Lang
   *
   * @param switcher
   */
  lang(switcher: Record<ALanguage, OrUndefined<string>>): string {
    const languages = this.http?.req.acceptsLanguages() ?? [Language.En];
    const match = langMatch(languages, switcher);
    return match;
  }


  /**
   * Info
   */
  info(): IJson {
    const url = this.http?.req.url;
    const ip = this.http?.req.ip;
    return {
      url,
      ip,
      user_id: this.auth.user_id ?? null,
    };
  }
}
