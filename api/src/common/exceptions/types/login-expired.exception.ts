import httpErrors from 'http-errors';
import { HttpCode } from '../../constants/http-code.const';

export class LoginExpiredException extends httpErrors.HttpError {
  status = HttpCode.UNAUTHORIZED;
  statusCode = HttpCode.UNAUTHORIZED;

  constructor(
    msg: string
  ) {
    super(msg);
  }
}