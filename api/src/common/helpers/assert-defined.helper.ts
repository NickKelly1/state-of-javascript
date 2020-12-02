import { OrNullable } from "../types/or-nullable.type";
import { ist } from "./ist.helper";

export function assertDefined<T>(arg: OrNullable<T>): T {
  if (ist.nullable(arg)) throw new Error('Failed asserting argument is defined');
  return arg;
}