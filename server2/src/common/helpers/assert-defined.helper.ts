import { OrNullable } from "../types/or-nullable.type";
import { ist } from "./is.helper";

export function assertDefined<T>(arg: OrNullable<T>): T {
  if (ist.nullable(arg)) throw new Error('Failed asserting argument is defined');
  return arg;
}