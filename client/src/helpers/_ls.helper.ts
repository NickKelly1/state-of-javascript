import { OrUndefined } from "../types/or-undefined.type";
import { ist } from "./ist.helper";

/**
 * Wraps local storage
 */
export type _ls = OrUndefined<Storage>;
export const _ls: _ls =
  typeof window !== 'undefined'
    ? (ist.obj(window) && ist.obj(window.localStorage))
      ? window.localStorage
      : undefined
    : undefined