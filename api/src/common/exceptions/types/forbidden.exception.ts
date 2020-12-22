import httpErrors from 'http-errors';
import { Str } from '../../helpers/str.helper';

export class ForbiddenException extends httpErrors.Forbidden {
  constructor(
    msg: string | undefined,
  ) {
    super(msg ? Str.startWith({ needle: 'Forbidden: ', haystack: msg, }) : undefined);
  }
}