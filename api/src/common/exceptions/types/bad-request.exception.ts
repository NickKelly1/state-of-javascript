import { IExceptionArg } from '../interfaces/exception-arg.interface';
import { Exception } from '../exception';
import { ExceptionLang } from '../../i18n/packs/exception.lang';
import { IThrowable } from '../../interfaces/request-context.interface';
import { HttpCode } from '../../constants/http-code.const';

export const BadRequestException = (arg?: Partial<IExceptionArg>): IThrowable => (ctx) => {
  return new Exception({
    code: HttpCode.BAD_REQUEST,
    name: 'BadRequestException',
    ctx,
    ...arg,
    error: arg?.error ?? ctx.lang(ExceptionLang.BadRequest),
    message: arg?.message ?? arg?.error ?? ctx.lang(ExceptionLang.BadRequest),
  });
}
