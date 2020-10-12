import HttpCodes from 'http-status-codes';
import { IException } from "../interfaces/exception.interface";
import { Lang } from '../langs/lang';
import { ExecutionContext } from '../classes/execution-context';
import { Language } from '../langs/consts/language.enum';
import { BaseException } from './base.exception';
import { IHttpExceptionable } from '../classes/http.context';

export interface IInternalServerExceptionArg {
  //
}

export class InternalServerException extends BaseException {
  public readonly code: number;
  public readonly error: string;
  public readonly message: string;

  static http(): IHttpExceptionable {
    return (ctx) => new InternalServerException(ctx.execution, {});
  }

  constructor(
    readonly execution: ExecutionContext,
    readonly arg?: IInternalServerExceptionArg,
  ) {
    super();
    let match = execution.match({
      http: (http) => ({
        error: Lang.Exception.InternalException()({ languages: http.req.acceptsLanguages() }),
        message: Lang.Exception.InternalException()({ languages: http.req.acceptsLanguages() }),
      }),
    });

    if (!match) {
      match = {
        error: Lang.Exception.InternalException()({ languages: [Language.En] }),
        message: Lang.Exception.InternalException()({ languages: [Language.En] }),
      };
    };

    const { error, message } = match;

    this.error = error;
    this.message = message;
    this.code = HttpCodes.NOT_FOUND;
  }
}
