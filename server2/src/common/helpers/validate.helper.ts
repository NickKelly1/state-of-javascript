import { left, right, Left, Right, Either } from 'fp-ts/lib/Either';
import Joi from 'joi';
import { IExceptionData } from '../interfaces/exception-data.interface';
import { $TS_DANGER } from '../types/$ts-danger.type';
import { exceptionData } from './exception-data.helper';


export function validate<T>(validator: Joi.ObjectSchema<T>, body: unknown): Either<IExceptionData, T> {
  const result = validator.validate(body);
  if (result.error) { return left<IExceptionData, T>(exceptionData(result.error)) }
  return right(result.value as $TS_DANGER<unknown> as T);
}