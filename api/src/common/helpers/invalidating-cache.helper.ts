import { logger } from "../logger/logger";
import { OrUndefined } from "../types/or-undefined.type";
import { ist } from "./ist.helper";
import { prettyQ } from "./pretty.helper";

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
  get last(): OrUndefined<number> { return this._last; }

  protected _durationMs: number;
  get durationMs(): number { return this._durationMs; }

  protected _value: OrUndefined<T>;

  constructor(
    durationMs: number,
  ) {
    this._durationMs = durationMs;
  }

  isValid(): boolean {
    if (ist.nullable(this._last)) return false;
    const now = Date.now();
    const expiredBy = now - (this._last + this._durationMs);
    const isValid = expiredBy < 0;
    return isValid;
  }

  /**
   * Get the caches value
   */
  get(): ICacheResult<T> {
    let result: ICacheResult<T>;
    if (ist.nullable(this._last)) { result = { state: CacheState.Uninitialised, value: undefined }; }
    else if (!this.isValid()) { result = { state: CacheState.Invalidated, value: undefined }; }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    else { result = { state: CacheState.Valid, value: this._value! }; }
    logger.debug(`[${this.constructor.name}::get] Retrieved: ${CacheState[result.state]}......`)
    return result;
  }

  /**
   * Set the caches value
   */
  set(value: T): void {
    logger.debug(`[${this.constructor.name}::set] Setting...`);
    const now = Date.now();
    this._last = now;
    this._value = value;
  }

  /**
   * Invalidate the cache
   * (make it think it's never been fetched...)
   */
  invalidate(): void {
    logger.debug(`[${this.constructor.name}::invalidate] Force invalidating...`)
    this._last = undefined;
  }
}
