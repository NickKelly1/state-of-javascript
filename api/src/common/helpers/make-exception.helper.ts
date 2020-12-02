import { Exception } from '../exceptions/exception';
import { InternalServerException } from '../exceptions/types/internal-server.exception';
import { ist } from './ist.helper';
import { IRequestContext } from '../interfaces/request-context.interface';
import { isu } from './isu.helper';

export function makeException(ctx: IRequestContext, err: any): Exception {
  const exception = isu.exception(err)
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