import HttpErrors from 'http-errors';
import { IExceptionArg } from '../interfaces/exception-arg.interface';
import { Exception, IExceptionCtorArg } from '../exception';
import { ExceptionLang } from '../../i18n/packs/exception.lang';
import { IThrowable } from '../../interfaces/request-context.interface';
import { HttpCode } from '../../constants/http-code.const';
import { OrNullable } from '../../types/or-nullable.type';
import { ist } from '../../helpers/ist.helper';

export const NotFoundException = (arg?: Partial<IExceptionArg>): IThrowable => (ctx) => {
  return new Exception({
    code: HttpCode.NOT_FOUND,
    name: 'NotFoundException',
    ctx,
    ...arg,
    error: arg?.error ?? ctx.lang(ExceptionLang.NotFound),
    message: arg?.message ?? arg?.error ?? ctx.lang(ExceptionLang.NotFound),
  });
}

