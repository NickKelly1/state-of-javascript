import { ist } from "../helpers/ist.helper";
import { isu } from "../helpers/isu.helper";
import { OrUndefined } from "../types/or-undefined.type";
import { ApiException } from "./api.exception";

export function normaliseApiException(exp: unknown): ApiException {
  // is already api exception?
  if (isu.apiPartialExceptionShape(exp)) return ApiException(exp);

  // has an extension.exception object on it?
  if (isu.hasExtensionException(exp)) {
    return normaliseApiException(exp.extensions.exception);
  }

  // has an "errors" array object on it?
  if (ist.obj(exp) && ist.arr(exp.errors)) {
    const exceptions = exp
      .errors
      .filter(isu.apiPartialExceptionShape)
      .concat(...exp
        .errors
        .filter(err => !isu.apiPartialExceptionShape(err))
        .filter(isu.hasExtensionException)
        .map(err => err.extensions.exception)
        .map(normaliseApiException));

    if (exceptions.length) {
      const name = Array.from(new Set(exceptions.map(exp => exp.name))).join(', ');
      const code = new Set(exceptions.map(exp => exp.code).filter(ist.notNullable)).size === 1 ? exceptions[0].code : -1;
      const error = Array.from(new Set(exceptions.map(exp => exp.error).filter(ist.notNullable))).join('\n');
      const message = Array.from(new Set(exceptions.map(exp => exp.message).filter(ist.notNullable))).join('\n');
      const trace = exceptions.map(exp => exp.trace?.concat('__end__')).filter(ist.notNullable).flat();
      const stack = Array.from(new Set(exceptions.map(exp => exp.stack).filter(ist.notNullable))).join('\n__end__\n')
      // flatten data
      const data: Record<string, string[]> = {};
      exceptions.forEach(exception => { if (ist.obj(exception.data)) {
        Object.entries(exception.data).forEach(([key, values]) => {
          const prev: OrUndefined<string[]> = data[key];
          if (prev) { data[key] = [...prev, ...values]; }
          else { data[key] =  values; }
        });
      }});

      return ApiException({
        code,
        name,
        error,
        message,
        data,
        trace,
        stack,
      });
    }
  }

  // comes from GraphQL object?
  if (ist.obj(exp) && ist.obj(exp.response)) {
    return normaliseApiException(exp.response);
  }

  // neither - fake it
  return ApiException({ code: -1, });
}


export function rethrow(fn: (...unk: unknown[]) => unknown) {
  return function (...args: unknown[]): never {
    throw fn(...args);
  }
}