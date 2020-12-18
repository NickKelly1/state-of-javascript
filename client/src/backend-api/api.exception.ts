import { IApiException, IPartialApiException } from "./types/api.exception.interface";

// must be serializable
export type ApiException = IApiException;
export function ApiException(_orig: IPartialApiException): ApiException {
  const _trace = _orig.trace ?? _orig.stack?.split('\n') ?? undefined;
  return {
    ..._orig,
    code: _orig.code ?? -1,
    name: _orig.name ?? 'unknown error',
    message: _orig.message ?? 'unknown error',
    trace: ((_trace?.length || 0) > 1)  ? _trace : undefined,
  }
}
