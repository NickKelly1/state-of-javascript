import { OrUndefined } from "../types/or-undefined.type";
import { ist } from "./ist.helper";

export enum CacheState {
  Uninitialised,
  Invalidated,
  Valid,
}
export interface ICacheResultUninitialised { state: CacheState.Uninitialised; value: undefined; }
export interface ICacheResultInvalided { state: CacheState.Invalidated; value: undefined; }
export interface ICacheResultValid<T> { state: CacheState.Valid; value: T; }
export type ICacheResult<T>  = ICacheResultValid<T> | ICacheResultInvalided | ICacheResultUninitialised;

export const isCacheResult = {
  valid: <T>(unk: ICacheResult<T>): unk is ICacheResultValid<T> => (unk.state === CacheState.Valid),
  invalidated: <T>(unk: ICacheResult<T>): unk is ICacheResultInvalided => (unk.state === CacheState.Invalidated),
  uninitialised: <T>(unk: ICacheResult<T>): unk is ICacheResultUninitialised => (unk.state === CacheState.Uninitialised),
};

export class InvalidatingCache<T> {
  protected _last: OrUndefined<number>;
  get last() { return this._last; }

  protected _durationMs: number;
  get durationMs() { return this._durationMs; }

  protected _value: OrUndefined<T>;

  constructor(
    durationMs: number,
  ) {
    this._durationMs = durationMs;
  }

  isValid(): boolean {
    if (ist.nullable(this._last)) return false;
    const now = Date.now();
    return this._last < (now + this._durationMs);
  }

  get(): ICacheResult<T> {
    if (ist.nullable(this._last)) return { state: CacheState.Uninitialised, value: undefined };
    if (!this.isValid()) return { state: CacheState.Invalidated, value: undefined };
    return { state: CacheState.Valid, value: this._value! };
  }

  set(value: T) {
    const now = Date.now();
    this._last = now;
    this._value = value;
  }
}
