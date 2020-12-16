import httpErrors from 'http-errors';

export class NotFoundException extends httpErrors.NotFound {
  constructor(
    msg: string | undefined
  ) {
    super(msg);
  }
}