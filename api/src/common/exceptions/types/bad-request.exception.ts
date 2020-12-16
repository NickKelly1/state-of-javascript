import httpErrors from 'http-errors';
import { IExceptionData } from '../../interfaces/exception-data.interface';

export class BadRequestException extends httpErrors.BadRequest {
  constructor(
    msg: string,
    public readonly data?: IExceptionData
  ) {
    super(msg)
  }
}