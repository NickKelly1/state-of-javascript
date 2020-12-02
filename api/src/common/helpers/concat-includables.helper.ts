import { Includeable, Op, WhereOptions } from "sequelize";
import { OrNullable } from "../types/or-nullable.type";
import { OrUndefined } from "../types/or-undefined.type";
import { ist } from "./ist.helper";

/**
 * Join together many optional sequelize "includes" statements
 *
 * @param includables
 */
export function concatIncludables(includables: OrNullable<OrNullable<Includeable | OrNullable<Includeable>[]>[]>): OrUndefined<Includeable | Includeable[]> {
  const all = includables
    ?.flatMap(includables1 => Array.isArray(includables1) ? includables1 : [includables1])
    .filter(ist.defined)
  
  if (ist.nullable(all)) return undefined;
  if (all.length === 0) return undefined;
  if (all.length === 1) return all[0];
  return all;
}