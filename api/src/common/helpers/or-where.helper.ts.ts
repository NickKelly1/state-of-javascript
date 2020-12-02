import { Op, WhereOptions } from "sequelize";
import { OrNullable } from "../types/or-nullable.type";
import { OrUndefined } from "../types/or-undefined.type";
import { ist } from "./ist.helper";

export function orWhere(wheres: OrNullable<WhereOptions>[]): OrUndefined<WhereOptions> {
  const defs = wheres.filter(ist.notNullable);
  if (defs.length === 0) return undefined;
  if (defs.length === 1) return defs[0];
  return { [Op.or]: defs };
}