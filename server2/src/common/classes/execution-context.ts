import { Request, Response } from 'express';
import { OrUndefined } from '../types/or-undefined.type';
import { GqlContext } from './gql.context';
import { HttpContext } from './http.context';
import { WsCtx } from './ws.context';


interface IExecutionContextMatchFnArg<T> {
  http?: (ctx: HttpContext) => T;
  ws?: (ctx: WsCtx) => T;
}

export class ExecutionContext {
  protected _http?: HttpContext;
  protected _gql?: GqlContext;
  protected _ws?: WsCtx;

  constructor(readonly arg: {
    http?: HttpContext;
    ws?: WsCtx;
  }) {
    const { http, ws } = arg;
    this._http = http;
    this._ws = ws;
  }

  setHttp(http: HttpContext): this {
    this._http = http;
    return this;
  }

  setGql(gql: GqlContext): this {
    this._gql = gql;
    return this;
  }

  setWs(ws: WsCtx): this {
    this._ws = ws;
    return this;
  }

  http(): OrUndefined<HttpContext> {
    return undefined!;
  }

  ws(): OrUndefined<HttpContext> {
    return undefined!;
  }

  match<T>(arg: IExecutionContextMatchFnArg<T>): OrUndefined<T> {
    if (this._http && arg.http) return arg.http(this._http);
    if (this._ws && arg.ws) return arg.ws(this._ws);
    return undefined;
  }
}
