import { OrNull } from "../types/or-null.type";
import { ist } from "./ist.helper";

export class Debounce {
  protected _timeout: OrNull<ReturnType<typeof setTimeout>> = null;

  constructor(protected ms: number, fn?: (() => any)) {
    if (ist.notNullable(fn)) { this._timeout = setTimeout(fn, ms); }
  }

  set(fn: () => any, ms?: number) {
    if (ist.notNullable(this._timeout)) { clearTimeout(this._timeout); }
    this._timeout = setTimeout(fn, ms ?? this.ms);
  }

  setMs(ms: number) { this.ms = ms; }

  abort() {
    if (ist.notNullable(this._timeout)) {
      clearTimeout(this._timeout);
    }
  }
}