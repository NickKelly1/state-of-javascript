/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLError, FormattedExecutionResult, graphql, GraphQLFormattedError } from "graphql";
import { ist } from "../helpers/ist.helper";
import { isu } from "../helpers/isu.helper";
import { OrUndefined } from "../types/or-undefined.type";
import { ApiException } from "./api.exception";

// function normaliseGraphQLApiException(caught: any) {
//   try {
//     const errors = (caught.response.errors as GraphQLError[]);
//     const error = errors[0];
//     if (error.extensions?.exception) {
//       return ApiException({
//         code: error.extensions.exception.code,
//         name: error.extensions.exception.name,
//         message: error.extensions.exception.message,
//         stack: error.extensions.exception.stack,
//         trace: error.extensions.exception.trace,
//         data: error.extensions.exception.data,
//       });
//     }
//     return ApiException({
//       code: -1,
//       name: error.name,
//       message: error.message,
//       stack: error.stack,
//     });
//   } catch (error2) {
//     return ApiException({ code: -1, });
//   }
// }

// export const normaliseGqlApiException = normaliseGraphQLApiException;


const _pipe = {
  // 1
  _1_catchToExecutionResult(some: unknown): undefined | FormattedExecutionResult {
    if (ist.keyof(some, 'response')) {
      return (some as any).response;
    }
    return undefined;
  },

  // 2
  _2_executionResultToGraphQLError(exec: FormattedExecutionResult | unknown): undefined | GraphQLError {
    if (ist.keyof(exec, 'errors') && ist.arr((exec as any).errors)) {
      return (exec as any).errors?.[0];
    }
    return undefined;
  },

  // 3
  _3_graphQLErrorToExtensionException(error: GraphQLError | unknown): unknown {
    if (ist.keyof(error, 'extensions') && ist.keyof((error as any).extensions, 'exception')) {
      return (error as any).extensions.exception;
    }
    return undefined;
  },

  // 4
  _4_anyToApiException(unk: unknown): ApiException {
    return ApiException({
      code: (ist.keyof(unk, 'code') && ist.num((unk as any).code)) ? (unk as any).code : undefined,
      name: (ist.keyof(unk, 'name') && ist.str((unk as any).name)) ? (unk as any).name : undefined,
      message: (ist.keyof(unk, 'message') && ist.str((unk as any).message)) ? (unk as any).message : undefined,
      stack: (ist.keyof(unk, 'stack') && ist.str((unk as any).stack)) ? (unk as any).stack : undefined,
      trace: (ist.keyof(unk, 'trace') && ist.arrOf(ist.str)((unk as any).trace)) ? (unk as any).trace : undefined,
      data: (ist.keyof(unk, 'data') && isu.apiExceptionData((unk as any).data)) ? (unk as any).data : undefined,
    });
  },
};


export function normaliseApiException(unk: unknown): ApiException {
  if (isu.apiPartialExceptionShape(unk)) return ApiException(unk);
  const _1 = _pipe._1_catchToExecutionResult(unk);
  const _2 = _pipe._2_executionResultToGraphQLError(_1 ?? unk);
  const _3 = _pipe._3_graphQLErrorToExtensionException(_2 ?? unk);
  const _4 = _pipe._4_anyToApiException(_3 ?? unk);
  return _4;
}


export function rethrow(fn: (...unk: unknown[]) => unknown) {
  return function (...args: unknown[]): never {
    throw fn(...args);
  }
}
