import httpErrors from 'http-errors';

export class InternalServerException extends httpErrors.InternalServerError {
  constructor(
    msg: string,
  ) {
    super(msg);
  }
}