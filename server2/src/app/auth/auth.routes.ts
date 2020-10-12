import { Router } from 'express';
import { ExpressContext } from '../../classes/express-context';


export function AuthRoutes(arg: { app: ExpressContext }): Router {
  const { app } = arg;
  const router = Router();
  return router;
}