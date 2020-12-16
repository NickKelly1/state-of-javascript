import httpErrors from "http-errors";

export class UnauthenticatedException extends httpErrors.Unauthorized {
  constructor(msg: string | undefined) {
    super(msg);
  }
}