import { IApiExceptionData } from "./types/api.exception-data.interface";
import { IApiException, IPartialApiException } from "./types/api.exception.interface";

export type ApiException = IApiException;
export function ApiException(_orig: IPartialApiException): ApiException {
  return {
    ..._orig,
    name: _orig.name ?? 'UnknownException',
    message: _orig.message ?? 'unknown message',
    error: _orig.error ?? 'unknown error',
  }
}
// can't pass class to client.... class not serializable
// export class extends Error implements IApiException {
//   public readonly name: string;
//   public readonly code: number;
//   public readonly error: string;
//   public readonly data?: IApiExceptionData;
//   public readonly trace?: string[];

//   constructor(_orig: IApiException) {
//     super(_orig.message);
//     this.name = _orig.name;
//     this.code = _orig.code;
//     this.error = _orig.error;
//     this.message = _orig.message;
//     this.data = _orig.data;
//     this.trace = _orig.trace;
//     this.stack = _orig.stack;
//   }
// }