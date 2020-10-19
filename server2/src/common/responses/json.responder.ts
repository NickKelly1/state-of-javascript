import { Response } from "express";
import { pretty } from "../helpers/pretty.helper";
import { IJson } from "../interfaces/json.interface";
import { IResponder } from "../interfaces/responder.interface";


export class JsonResponder<T = any> implements IResponder {
  constructor(
    public readonly status: number,
    public readonly json: T,
  ) {
    //
  }

  respond(res: Response) {
    if (res.req?.query.pretty) {
      res.status(this.status).contentType('json').send(pretty(this.json));
    } else {
      res.status(this.status).json(this.json);
    }
  }
}
