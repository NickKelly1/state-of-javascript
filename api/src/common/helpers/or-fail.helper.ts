import { OrNullable } from "../types/or-nullable.type";
import { ist } from "./ist.helper";

export const orFail = <T>(fn: () => T) => <U>(take: OrNullable<U>): U => {
  if (ist.null(take)) throw fn();
  if (ist.undefined(take)) throw fn();
  return take;
}