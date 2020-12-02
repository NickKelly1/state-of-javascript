import { IExceptionArg } from '../interfaces/exception-arg.interface';
import { Exception } from '../exception';
import { ExceptionLang } from '../../i18n/packs/exception.lang';
import { IThrowable } from '../../interfaces/request-context.interface';
import { HttpCode } from '../../constants/http-code.const';


export const LoginExpiredException = (arg?: Partial<IExceptionArg>): IThrowable => (ctx) => {
  return new Exception({
    code: HttpCode.LOGIN_EXPIRED,
    name: 'LoginExpiredException',
    ctx,
    ...arg,
    error: arg?.error ?? ctx.lang(ExceptionLang.LoginExpired),
    message: arg?.message ?? arg?.error ?? ctx.lang(ExceptionLang.LoginExpired),
  });
}
