import { IExceptionArg } from '../interfaces/exception-arg.interface';
import { Exception } from '../exception';
import { ExceptionLang } from '../../i18n/packs/exception.lang';
import { IThrowable } from '../../interfaces/request-context.interface';
import { HttpCode } from '../../constants/http-code.const';


export const ForbiddenException = (arg?: Partial<IExceptionArg>): IThrowable => (ctx) => {
  const error = arg?.error ?? ctx.lang(ExceptionLang.Forbidden);
  const message = arg?.message ?? arg?.error ?? ctx.lang(ExceptionLang.Forbidden);

  return new Exception({
    code: HttpCode.UNAUTHENTICATED,
    name: 'ForbiddenException',
    error,
    message,
    data: arg?.data,
    debug: arg?.debug,
  });
}
