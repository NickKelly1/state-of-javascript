import { Request, Response, NextFunction, IRouterHandler, } from 'express';
import { Query, ParamsDictionary } from 'express-serve-static-core';

export interface IMiddleware {
  (req: Request, res: Response, next: NextFunction): any;
};
