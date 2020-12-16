import { FormattedExecutionResult, GraphQLError, isListType } from "graphql";
import { IApiExceptionData } from "../backend-api/types/api.exception-data.interface";
import { IPartialApiException } from "../backend-api/types/api.exception.interface";
import { ist } from "./ist.helper";

export const isu = {
  // FormattedExecutionResult
  apiFormattedExecutionResult: (unk: unknown): unk is FormattedExecutionResult => {
    if (!ist.obj(unk)) return false;
    if (!ist.oneOf<undefined | null | unknown[]>([ist.null, ist.arr])(unk.errors)) return false;
    if (!ist.oneOf([ist.nullable, ist.obj])(unk.data)) return false;
    if (!ist.oneOf([ist.nullable, ist.obj])(unk.extensions)) return false;
    return true;
  },

  apiPartialExceptionShape: (unk: unknown): unk is IPartialApiException => {
    if (!ist.obj(unk)) return false;
    if (!ist.num(unk.code)) return false;
    if (!ist.oneOf([ist.undefined, ist.str])(unk.name)) return false;
    if (!ist.oneOf([ist.undefined, ist.str])(unk.message)) return false;
    if (!ist.oneOf([ist.undefined, isu.apiExceptionData])(unk.data)) return false;
    if (!ist.oneOf([ist.undefined, ist.arrOf(ist.str)])(unk.trace)) return false;
    if (!ist.oneOf([ist.undefined, ist.str])(unk.stack)) return false;
    return true;
  },

  apiExceptionData: (unk: unknown): unk is IApiExceptionData => {
    if (!ist.obj(unk)) return false;
    return Object.values(unk).every(ist.arrOf(ist.str));
  },

  hasExtensionException: (unk: unknown): unk is { extensions: { exception: unknown } } => {
    return (
      ist.obj(unk)
      && ist.notNullable((unk as GraphQLError).extensions)
      && ist.notNullable((unk as GraphQLError).extensions?.exception)
    );
  }
}