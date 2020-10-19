import { IJson } from "../interfaces/json.interface";
import { $TS_DANGER } from "../types/$ts-danger.type";
import { $TS_FIX_ME } from "../types/$ts-fix-me.type";
import { Primitive } from "../types/primitive.type";
import { Printable } from "../types/printable.type";

export function ugly(json: Printable | $TS_FIX_ME<any>): string {
  return JSON.stringify(json);
}