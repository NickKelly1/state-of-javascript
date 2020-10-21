import { Exception } from '../exceptions/exception';
import { InternalServerException } from '../exceptions/types/internal-server.exception';
import { ist } from '../helpers/is.helper';
import { IRequestContext } from '../interfaces/request-context.interface';

export function makeException(ctx: IRequestContext, err: any): Exception {
  const exception = ist.exception(err)
    ? err
    : ctx.except(InternalServerException({
      debug: ist.obj(err)
        ? err instanceof Error
          ? { name: err.name, message: err.message, stack: err.stack?.split('\n') }
          : { ...err }
        : err
      }));
  return exception;
}