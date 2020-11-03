import { pipe } from "./compose.helper";
import { later } from "./later.helper";
import { NormalisedError, normaliseError } from "./normalise-error.helper";

export enum AttemptType { Success, Fail, }

export type Success<T> = { _t: AttemptType.Success, value: T }
export type Fail<E> = { _t: AttemptType.Fail, value: E }
export type Attempt<T, E> = Success<T> | Fail<E>;

export const isSuccess = <T, E>(attempt: Attempt<T, E>): attempt is Success<T> => attempt._t === AttemptType.Success;
export const success = <T>(value: T): Success<T> => ({ _t: AttemptType.Success, value });

export const isFail = <T, E>(attempt: Attempt<T, E>): attempt is Fail<E> => attempt._t === AttemptType.Fail;
export const fail = <E>(value: E): Fail<E> => ({ _t: AttemptType.Fail, value });

export const unwrapAttempt = <T>(attempt: Attempt<T, any>): T => {
  if (isSuccess(attempt)) return attempt.value;
  throw new TypeError('Failed asserting that attempt was successful');
}

export async function attemptAsync<T, U>(
  promise: Promise<T>,
  normalise: ((unk: unknown) => U),
): Promise<Attempt<T, U>> {
  const result = promise.then(success).catch(pipe(normalise, fail));
  return result;
}

