import { left, right, Either } from 'fp-ts/lib/Either';
import Joi from 'joi';
import { IExceptionData } from '../interfaces/exception-data.interface';
import { logger } from '../logger/logger';
import { $TS_DANGER } from '../types/$ts-danger.type';
import { exceptionData } from './exception-data.helper';
import { prettyQ } from './pretty.helper';


export function validate<T>(validator: Joi.ObjectSchema<T>, body: unknown): Either<IExceptionData, T> {
  const result = validator.validate(body, { abortEarly: false });
  if (result.error) {
    logger.warn(`validation error: "${prettyQ(result.error)}"`);
    return left<IExceptionData, T>(exceptionData(result.error))
  }
  return right(result.value as $TS_DANGER<unknown> as T);
}