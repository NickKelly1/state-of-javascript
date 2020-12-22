import { HttpContext } from './common/context/http.context';
import { RequestAuth } from './common/classes/request-auth';
import { IRequestServices } from './common/interfaces/request.services.interface';
import { GqlContext } from './common/context/gql.context';

export interface IReqLocals {
  httpCtx?: HttpContext;
  gqlCtx?: GqlContext;
  auth: RequestAuth;
  services: IRequestServices;
}

// declare module 'express-serve-static-core' {
declare module 'express' {
  export interface Request {
    __locals__: IReqLocals;
  }
}