import { ExecutionContext } from './common/classes/execution-context';
import { HttpContext } from './common/classes/http.context';
import { RequestAuth } from './common/classes/request-auth';
import { IRequestContext } from './common/interfaces/request-context.interface';
import { AHttpCode } from './common/constants/http-code.const';
import { NextFunction, Request } from 'express';
import { IServices } from './common/interfaces/services.interface';

export interface IReqLocals {
  ctx: HttpContext;
  auth: RequestAuth;
  services: IServices;
}

// declare module 'express-serve-static-core' {
declare module 'express' {
  export interface Request {
    __locals__: IReqLocals;
  }
}