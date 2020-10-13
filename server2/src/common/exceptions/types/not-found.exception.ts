import HttpErrors from 'http-errors';
import { IExceptionArg } from '../interfaces/exception-arg.interface';
import { Exception, IExceptionCtorArg } from '../exception';
import { ExceptionLang } from '../../i18n/packs/exception.lang';
import { IThrowable } from '../../interfaces/request-context.interface';
import { HttpCode } from '../../constants/http-code.const';

export const NotFoundException = (arg?: Partial<IExceptionArg>): IThrowable => (ctx) => {
  const error = arg?.error ?? ctx.lang(ExceptionLang.NotFound);
  const message = arg?.message ?? arg?.error ?? ctx.lang(ExceptionLang.NotFound);

  return new Exception({
    code: HttpCode.NOT_FOUND,
    name: 'NotFoundException',
    error,
    message,
    data: arg?.data,
    debug: arg?.debug,
  });
}
