import { OrNullable } from "../types/or-nullable.type";
import { is } from "./is.helper";

export const orFail = <T>(fn: () => T) => <U>(take: OrNullable<U>): U => {
  if (is.null(take)) throw fn();
  if (is.undefined(take)) throw fn();
  return take;
}