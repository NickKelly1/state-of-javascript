import { is } from "date-fns/locale";
import { GraphQLError } from "graphql";
import { ist } from "../helpers/ist.helper";
import { isu } from "../helpers/isu.helper";
import { IApiException } from "./types/api.exception.interface";

export function normaliseApiException(exp: unknown): IApiException {
  // is already api exception?
  if (isu.apiException(exp)) return exp;

  // has an exception object on it?
  if (
    ist.obj(exp)
    && ist.notNullable((exp as GraphQLError).extensions)
    && ist.notNullable((exp as GraphQLError).extensions?.exception)
  ) {
    return normaliseApiException(exp.exception.exception);
  }

  // neither - fake it
  return {
    name: 'unknown error',
    error: 'unknown error',
    message: 'unknown error',
    code: -1,
  };
}


export function rethrow(fn: (...unk: unknown[]) => unknown) {
  return function (...args: unknown[]): never {
    throw fn(...args);
  }
}