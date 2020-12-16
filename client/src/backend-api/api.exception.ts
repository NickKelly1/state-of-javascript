import { IApiException, IPartialApiException } from "./types/api.exception.interface";

// must be serializable
export type ApiException = IApiException;
export function ApiException(_orig: IPartialApiException): ApiException {
  return {
    ..._orig,
    name: _orig.name ?? 'unknown error',
    message: _orig.message ?? 'unknown error',
    trace: _orig.trace ?? _orig.stack?.split('\n') ?? undefined,
  }
}
