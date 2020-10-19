import { Response } from "express";

export interface IResponder {
  respond(res: Response): void;
}