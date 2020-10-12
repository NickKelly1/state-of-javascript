import { ExpressContext } from "@src/classes/express-context";
import { Router } from "express";


export function AuthRoutes(arg: { app: ExpressContext }): Router {
  const { app } = arg;
  const router = Router();
  return router;
}