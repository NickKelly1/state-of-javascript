import { IExceptionArg } from '../interfaces/exception-arg.interface';
import { Exception } from '../exception';
import { ExceptionLang } from '../../i18n/packs/exception.lang';
import { IThrowable } from '../../interfaces/request-context.interface';
import { HttpCode } from '../../constants/http-code.const';


export const UnauthenticatedException = (arg?: Partial<IExceptionArg>): IThrowable => (ctx) => {
  const error = arg?.error ?? ctx.lang(ExceptionLang.Unauthenticated);
  const message = arg?.message ?? arg?.error ?? ctx.lang(ExceptionLang.Unauthenticated);

  return new Exception({
    code: HttpCode.UNAUTHENTICATED,
    name: 'UnauthenticatedException',
    error,
    message,
    data: arg?.data,
    debug: arg?.debug,
  });
}
