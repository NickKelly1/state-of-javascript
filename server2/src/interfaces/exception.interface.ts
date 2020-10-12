import { HttpContext } from "@src/classes/http.context";
import { OrUndefined } from "../types/or-undefined.type";
import { IJson } from "./json.interface";

export interface IException extends Error {
  readonly __is_exception: true;

  code: number;
  error: string;
  message: string;
  data?: OrUndefined<Record<string, OrUndefined<string[]>>>;

  toJson(): IJson;
}
