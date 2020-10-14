import { OrNullable } from "../types/or-nullable.type";
import { is } from "./is.helper";

export function assertDefined<T>(arg: OrNullable<T>): T {
  if (is.nullable(arg)) throw new Error('Failed asserting argument is defined');
  return arg;
}