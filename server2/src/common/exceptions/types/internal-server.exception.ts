import { IExceptionArg } from '../interfaces/exception-arg.interface';
import { Exception } from '../exception';
import { ExceptionLang } from '../../i18n/packs/exception.lang';
import { IThrowable } from '../../interfaces/request-context.interface';
import { HttpCode } from '../../constants/http-code.const';

export const InternalServerException = (arg?: Partial<IExceptionArg>): IThrowable => (ctx) => {
  return new Exception({
    code: HttpCode.INTERNAL_SERVER_ERROR,
    name: 'InternalServerException',
    ctx,
    ...arg,
    error: arg?.error ?? ctx.lang(ExceptionLang.InternalException),
    message: arg?.message ?? arg?.error ?? ctx.lang(ExceptionLang.InternalException),
  });
}
