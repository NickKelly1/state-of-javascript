import { ApplicationRequestHandler } from 'express-serve-static-core';
import { Express, IRouterHandler, IRouterMatcher, request } from 'express';
import { IMwFn, mw } from '../helpers/mw.helper';

export class ExpressContext {
  public readonly root: Express;

  constructor(
    arg: {
      readonly root: Express,
    }
  ) {
    const { root } = arg;
    this.root = root;
  }

  mw(fn: IMwFn): this {
    mw(fn);
    this.root.use(mw(fn));
    return this;
  }

  // proxy express use
  use: ApplicationRequestHandler<ExpressContext> = (...args: any[]): this => {
    this.root.use(...args);
    return this;
  }
}
