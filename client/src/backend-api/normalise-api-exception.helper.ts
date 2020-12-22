/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLError, FormattedExecutionResult, } from "graphql";
import { ist } from "../helpers/ist.helper";
import { isu } from "../helpers/isu.helper";
import { ApiException } from "./api.exception";

// const _pipe = {
//   // 1
//   _1_catchToExecutionResult(some: unknown): undefined | FormattedExecutionResult {
//     if (ist.keyof(some, 'response')) {
//       return (some as any).response;
//     }
//     return undefined;
//   },

//   // 2
//   _2_executionResultToGraphQLError(exec: FormattedExecutionResult | unknown): undefined | GraphQLError {
//     if (ist.keyof(exec, 'errors') && ist.arr((exec as any).errors)) {
//       return (exec as any).errors?.[0];
//     }
//     return undefined;
//   },

//   // 3
//   _3_graphQLErrorToExtensionException(error: GraphQLError | unknown): unknown {
//     if (ist.keyof(error, 'extensions') && ist.keyof((error as any).extensions, 'exception')) {
//       return (error as any).extensions.exception;
//     }
//     return undefined;
//   },

//   // 4
//   _4_anyToApiException(unk: unknown): ApiException {
//     return ApiException({
//       code: (ist.keyof(unk, 'code') && ist.num((unk as any).code)) ? (unk as any).code : undefined,
//       name: (ist.keyof(unk, 'name') && ist.str((unk as any).name)) ? (unk as any).name : undefined,
//       message: (ist.keyof(unk, 'message') && ist.str((unk as any).message)) ? (unk as any).message : undefined,
//       stack: (ist.keyof(unk, 'stack') && ist.str((unk as any).stack)) ? (unk as any).stack : undefined,
//       trace: (ist.keyof(unk, 'trace') && ist.arrOf(ist.str)((unk as any).trace)) ? (unk as any).trace : undefined,
//       data: (ist.keyof(unk, 'data') && isu.apiExceptionData((unk as any).data)) ? (unk as any).data : undefined,
//     });
//   },
// };


/**
 * Catch errors from the API
 *
 * Typically from the graphql endpoint/s
 */
export function normaliseApiException(error: unknown): ApiException {
  //  - if the error originated within the GraphQL executor, then
  //    the response will be a well-formed GraphQL error
  //  - if the error came before the GraphQL executor, such as
  //    401 or 440, then expect .response to be a json object representing
  //    an error

  // already is api exception
  if (isu.apiPartialExceptionShape(error)) return ApiException(error);

  // unknown api exception
  if (!ist.obj(error)) return ApiException({ code: -1 });

  // use either .response the plain object
  let response = error.response;
  if (!response) response = error;

  // response is api exception
  if (isu.apiPartialExceptionShape(response)) return ApiException(response);

  // try a "raw" error
  // if the endpoint simply returns a string error, the GraphQL client will
  // turn it into status (number) & error (string)
  const rawError = response;
  if (ist.obj(rawError) && ist.str(rawError.error) && ist.num(rawError.status)) {
    const code = rawError.status as unknown as number;
    const message = rawError.error as unknown as string;
    return ApiException({ code, message, });
  }

  // check the graphql server-formatted error
  const formattedError = response.errors?.[0];
  
  // check for an extension.exception
  const extendedError = formattedError?.extensions?.exception ?? formattedError;
  if (isu.apiPartialExceptionShape(extendedError)) return ApiException(extendedError);

  // some kind of other error?
  if (error instanceof Error){ 
    let code = Number((error as any).code);
    if (!Number.isFinite(code)) code = -1;
    return ApiException({
      code,
      message: error.message,
      stack: error.stack,
    });
  }

  // totally unknown...
  return ApiException({ code: -1 });
}


export function rethrow(fn: (...unk: unknown[]) => unknown) {
  return function (...args: unknown[]): never {
    throw fn(...args);
  }
}
