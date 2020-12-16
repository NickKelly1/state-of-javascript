import httpErrors from 'http-errors';

export class ForbiddenException extends httpErrors.Forbidden {
  constructor(
    msg: string | undefined,
  ) {
    super(msg);
  }
}