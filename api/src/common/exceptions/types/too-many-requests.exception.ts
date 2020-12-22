import httpErrors from 'http-errors';

export class TooManyRequestsException extends httpErrors.TooManyRequests {
  constructor(
    msg?: string,
  ) {
    super(msg);
  }
}