import httpErrors from 'http-errors';

export class InitialisationException extends httpErrors.InternalServerError {
  constructor(
    msg?: string | undefined,
  ) {
    super(msg ?? 'Failed to initialise correctly');
  }
}