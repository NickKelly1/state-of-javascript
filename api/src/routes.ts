import { Router, Express } from 'express';

export function Routes(arg: { app: Express }): Router {
  const { app } = arg;
  const router = Router();
  return router;
}
