import { Request, Response } from 'express';
import { IException } from '../interfaces/exception.interface';
import { ExecutionContext } from './execution-context';
import * as overrides from '../custom';


export class HttpContext {
  public readonly execution: ExecutionContext;
  public readonly req: Request;
  public readonly res: Response;

  static bindHttp(arg: { req: Request, res: Response }): HttpContext {
    const { req, res } = arg;
    if (!req.context) {
      const execution = new ExecutionContext({});
      const http = new HttpContext({ execution, req, res });
      execution.setHttp(http);
      req.context = http;
    }
    return req.context;
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

  throw(exception: IHttpExceptionable): never {
    throw exception(this);
  }
}

export interface IHttpExceptionable {
  (ctx: HttpContext): IException;
}