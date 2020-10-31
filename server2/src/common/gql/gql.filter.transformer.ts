import { Op, Rangable, WhereAttributeHash, WhereOperators, WhereOptions } from "sequelize";
import { ist } from "../helpers/ist.helper";
import { OrUndefined } from "../types/or-undefined.type";
import { IGqlFilterField, IGqlFilterGroup, IGqlFilterRange } from "./gql.filter.types";

export function transformGqlRange(range: IGqlFilterRange): Rangable {
  return [range.from, range.to] as Rangable;
}

function transformFilterAttributes(record: Record<string, IGqlFilterField>): OrUndefined<WhereOptions> {
  const wheres: [string, WhereOptions][] = Object
    .entries(record)
    .map(([field, config]): OrUndefined<[string, WhereOptions]> => {
      const operations: WhereAttributeHash[] = [];
      if (ist.notNullable(config.eq)) operations.push({ [Op.eq]: config.eq });
      if (ist.notNullable(config.neq)) operations.push({ [Op.ne]: config.neq });
      if (ist.notNullable(config.null)) {
        if (config.null) { operations.push({ [Op.eq]: null }); }
        else { operations.push({ [Op.not]: { [Op.is]: null } }); }
      }
      if (ist.notNullable(config.gt)) operations.push({ [Op.gt]: config.gt });
      if (ist.notNullable(config.gte)) operations.push({ [Op.gte]: config.gte });
      if (ist.notNullable(config.lt)) operations.push({ [Op.lt]: config.lt });
      if (ist.notNullable(config.lte)) operations.push({ [Op.lte]: config.lte });
      if (ist.notNullable(config.nbetween)) operations.push({ [Op.notBetween]: transformGqlRange(config.nbetween) });
      if (ist.notNullable(config.between)) operations.push({ [Op.between]: transformGqlRange(config.between) });
      if (ist.notNullable(config.in)) operations.push({ [Op.in]: config.in });
      if (ist.notNullable(config.nin)) operations.push({ [Op.notIn]: config.nin });
      if (ist.notNullable(config.ilike)) operations.push({ [Op.iLike]: config.ilike });
      if (ist.notNullable(config.nilike)) operations.push({ [Op.notILike]: config.nilike });
      if (ist.notNullable(config.like)) operations.push({ [Op.like]: config.like });
      if (ist.notNullable(config.nlike)) operations.push({ [Op.notLike]: config.nlike });
      if (ist.notNullable(config.overlap)) operations.push({ [Op.overlap]: transformGqlRange(config.overlap) });
      if (ist.notNullable(config.substring)) operations.push({ [Op.substring]: config.substring });
      if (ist.notNullable(config.iregexp)) operations.push({ [Op.iRegexp]: config.iregexp });
      if (ist.notNullable(config.niregexp)) operations.push({ [Op.notIRegexp]: config.niregexp });
      if (ist.notNullable(config.regexp)) operations.push({ [Op.regexp]: config.regexp });
      if (ist.notNullable(config.nregexp)) operations.push({ [Op.notRegexp]: config.nregexp });
      if (ist.notNullable(config.strict_left)) operations.push({ [Op.strictLeft]: transformGqlRange(config.strict_left) });
      if (ist.notNullable(config.strict_right)) operations.push({ [Op.strictRight]: transformGqlRange(config.strict_right) });
      if (!operations.length) return undefined;
      if (operations.length === 1) return [field, operations[0]];
      return [field, { [Op.and]: operations }];
    })
    .filter(ist.notNullable);
  if (!wheres.length) return undefined;
  return Object.fromEntries(wheres);
}

function transformFilterGroup(group: IGqlFilterGroup): OrUndefined<WhereOptions> {
  const wheres: OrUndefined<WhereOptions>[] = [];
  if (group.and) { wheres.push(transformFilterGroups(group.and)) }
  if (group.or) { wheres.push(transformFilterGroups(group.or)) }
  if (group.attr) { wheres.push(transformFilterAttributes(group.attr)) }
  const defs = wheres.filter(ist.notNullable);
  if (defs.length === 0) return undefined;
  if (defs.length === 1) return defs[0];
  return { [Op.and]: defs };
}

function transformFilterGroups(groups: IGqlFilterGroup[]): OrUndefined<WhereOptions> {
  if (groups.length === 0) return undefined;
  if (groups.length === 1) { return transformFilterGroup(groups[0]); }
  const defs = groups.map(transformFilterGroup).filter(ist.notNullable);
  if (defs.length === 0) return undefined;
  if (defs.length === 1) return defs[0];
  return { [Op.and]: defs };
}

export const transformGqlFilter = transformFilterGroups;
