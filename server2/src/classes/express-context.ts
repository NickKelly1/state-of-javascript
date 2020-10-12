import { IMwFn, mw } from '@src/helpers/mw.helper';
import { Express, IRouterHandler, IRouterMatcher } from 'express';

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
}
