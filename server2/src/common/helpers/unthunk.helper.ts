import { Thunk } from "graphql";
import { ist } from "./ist.helper";

export function unthunk<T>(thunk: Thunk<T>): T{
  if (ist.fn(thunk)) return thunk();
  return thunk;
}