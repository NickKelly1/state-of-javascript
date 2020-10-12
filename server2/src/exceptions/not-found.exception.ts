import HttpCodes from 'http-status-codes';
import HttpErrors from 'http-errors';
import { IException } from "../interfaces/exception.interface";
import { BaseException } from './base.exception';
import { IHttpExceptionable } from '../classes/http.context';
import { ExecutionContext } from '../classes/execution-context';
import { Lang } from '../langs/lang';
import { Language } from '../langs/consts/language.enum';

export interface INotFoundExceptionArg {
  name?: string;
}

export class NotFoundException extends BaseException {
  public readonly code: number;
  public readonly error: string;
  public readonly message: string;

  static http(arg?: INotFoundExceptionArg): IHttpExceptionable {
    return (ctx) => new NotFoundException(ctx.execution, arg);
  }

  constructor(
    readonly execution: ExecutionContext,
    readonly arg?: INotFoundExceptionArg,
  ) {
    super();
    const name = arg?.name;

    let match = execution.match({
      http: (http) => ({
        error: Lang.Exception.NotFound({})({ languages: http.req.acceptsLanguages() }),
        message: Lang.Exception.NotFound({ name })({ languages: http.req.acceptsLanguages() }),
      }),
    });

    if (!match) {
      match = {
        error: Lang.Exception.NotFound({})({ languages: [Language.En] }),
        message: Lang.Exception.NotFound({ name })({ languages: [Language.En] }),
      };
    };

    const { error, message } = match;
    this.error = error;
    this.message = message;
    this.code = HttpCodes.NOT_FOUND;
  }
}
