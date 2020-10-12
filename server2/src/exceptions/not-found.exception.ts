import HttpCodes from 'http-status-codes';
import HttpErrors from 'http-errors';
import { IException } from "../interfaces/exception.interface";
import { Lang } from '@src/langs/lang';
import { ExecutionContext } from '@src/classes/execution-context';
import { Language } from '@src/langs/consts/language.enum';
import { IHttpExceptionable } from '@src/classes/http.context';
import { BaseException } from './base.exception';

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
