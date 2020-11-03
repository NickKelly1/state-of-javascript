import { is } from "date-fns/locale";
import { GraphQLError } from "graphql";
import { ist } from "../helpers/ist.helper";
import { isu } from "../helpers/isu.helper";
import { OrUndefined } from "../types/or-undefined.type";
import { IApiException } from "./types/api.exception.interface";

export function normaliseApiException(exp: unknown): IApiException {
  // is already api exception?
  if (isu.apiException(exp)) return exp;

  // has an extension.exception object on it?
  if (isu.hasExtensionException(exp)) {
    return normaliseApiException(exp.extensions.exception);
  }

  // has an "errors" array object on it?
  if (ist.obj(exp) && ist.arr(exp.errors)) {
    const exceptions = exp
      .errors
      .filter(isu.apiException)
      .concat(...exp
        .errors
        .filter(err => !isu.apiException(err))
        .filter(isu.hasExtensionException)
        .map(err => err.extensions.exception)
        .map(normaliseApiException));

    if (exceptions.length) {
      const name = Array.from(new Set(exceptions.map(exp => exp.name))).join(', ');
      const code = new Set(exceptions.map(exp => exp.code)).size === 1 ? exceptions[0].code : -1;
      const error = Array.from(new Set(exceptions.map(exp => exp.error))).join('\n');
      const message = Array.from(new Set(exceptions.map(exp => exp.message))).join('\n');
      // flatten data
      const data: Record<string, string[]> = {};
      exceptions.forEach(exception => { if (ist.obj(exception.data)) {
        Object.entries(exception.data).forEach(([key, values]) => {
          const prev: OrUndefined<string[]> = data[key];
          if (prev) { data[key] = [...prev, ...values]; }
          else { data[key] =  values; }
        });
      }});

      return {
        code,
        name,
        error,
        message,
        data,
      };
    }
  }

  if (ist.obj(exp) && ist.obj(exp.response)) {
    return normaliseApiException(exp.response);
  }

  // neither - fake it
  return {
    name: 'unknown error',
    code: -1,
    error: 'unknown error',
    message: 'unknown error',
  };
}


export function rethrow(fn: (...unk: unknown[]) => unknown) {
  return function (...args: unknown[]): never {
    throw fn(...args);
  }
}