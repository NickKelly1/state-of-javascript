import { Op, Order, WhereAttributeHash, WhereOptions, WhereValue } from "sequelize";
import { BadRequestException } from "../exceptions/types/bad-request.exception";
import { ist } from "../helpers/ist.helper";
import { pretty } from "../helpers/pretty.helper";
import { QueryLang } from "../i18n/packs/query.lang";
import { IPaginateInput } from "../interfaces/pageinate-input.interface";
import { IRequestContext } from "../interfaces/request-context.interface";
import { logger } from "../logger/logger";
import { OrUndefined } from "../types/or-undefined.type";
import {
  ApiConditionAnd,
  ApiConditionAttributes,
  ApiConditionOr,
  ApiConditionValue,
  ApiConditional,
  ApiFilter,
  ApiFilterAttributes,
  ApiFilterOperators,
  ApiFilterOperatorsTypes,
  _and,
  _attr,
  _or,
  _val,
  ApiSorts,
  ApiDir,
  ApiQuery,
} from './api.query.types';


const isq = {
  and<T>(arg: unknown | ApiConditionAnd<T>): arg is ApiConditionAnd<T> { return (ist.keyof(arg, _and)); },
  or<T>(arg: unknown | ApiConditionOr<T>): arg is ApiConditionOr<T> { return (ist.keyof(arg, _or)); },
  val<T>(arg: unknown | ApiConditionValue<T>): arg is ApiConditionValue<T> { return (ist.keyof(arg, _val)); },
  attr(arg: unknown | ApiConditionAttributes): arg is ApiConditionAttributes { return (ist.keyof(arg, _attr)); },
}

interface ConditionMatcher<A, R> {
  _and: (arg: ApiConditional<A>[]) => R,
  _or: (arg: ApiConditional<A>[]) => R,
  _val: (arg: A) => R,
}
function matchCondition<A, R>(matcher: ConditionMatcher<A, R>) {
  return function doMatch(cond: ApiConditional<A>): R {
    if (isq.and(cond)) {
      // short circuit if only 1 and...
      if (cond._and.length === 1) return doMatch(cond._and[0]);
      return matcher._and(cond._and);
    }
    else if (isq.or(cond)) {
      // short circuit if only 1 or...
      if (cond._or.length === 1) return doMatch(cond._or[0]);
      return matcher._or(cond._or);
    }
    else if (isq.val(cond)) {
      return matcher._val(cond._val);
    }
    else {
      throw new Error(`match condition error:${pretty(cond)}`);
    }
  }
}

interface FilterMatcher<R> {
  _and: (arg: ApiFilter[]) => R,
  _or: (arg: ApiFilter[]) => R,
  _attr: (arg: ApiFilterAttributes) => R,
}
function matchFilter<R>(matcher: FilterMatcher<R>) {
  return function doMatch(filter: ApiFilter): R {
    if (isq.and(filter)) {
      // short circuit if only 1 and...
      if (filter._and.length === 1) return doMatch(filter._and[0]);
      return matcher._and(filter._and);
    }
    else if (isq.or(filter)) {
      // short circuit if only 1 or...
      if (filter._or.length === 1) return doMatch(filter._or[0]);
      return matcher._or(filter._or);
    }
    else if (isq.attr(filter)) {
      return matcher._attr(filter._attr);
    }
    else { throw new Error(`match filter error:${pretty(filter)}`); }
  }
}

export const transformApiFilter = matchFilter<WhereOptions>({
  [_and]: (ands): WhereOptions => { return { [Op.and]: ands.map(transformApiFilter) } },
  [_or]: (ors): WhereOptions => { return { [Op.or]: ors.map(transformApiFilter) } },
  [_attr]: (attr): WhereAttributeHash => {
    const andAttributesWheres: [string, WhereValue][] = Object
      .keys(attr)
      .map((field): OrUndefined<[string, WhereValue]> => {
        const maybeAttributes: OrUndefined<ApiConditional<ApiFilterOperators>> = attr[field];
        if (ist.nullable(maybeAttributes)) return;
        const handleAttributes = matchCondition<ApiFilterOperators, WhereValue>({
          [_and]: (ands): WhereValue => { return { [Op.and]: ands.map(handleAttributes) } },
          [_or]: (ors): WhereValue => { return { [Op.or]: ors.map(handleAttributes) } },
          [_val]: (fieldAttributes): WhereValue => {
            const fieldWheres: WhereValue[] = [];

            // between
            if (ist.notNullable(fieldAttributes._between)) {
              const opMatch = matchCondition<ApiFilterOperatorsTypes['_between'], WhereValue>({
                [_and]: (ands): WhereValue => { return { [Op.and]: ands.map(opMatch) } },
                [_or]: (ors): WhereValue => { return { [Op.or]: ors.map(opMatch) } },
                [_val]: (operatorValue): WhereAttributeHash => { return { [Op.between]: operatorValue }; },
              });
              fieldWheres.push(opMatch(fieldAttributes._between));
            }

            // eq
            if (ist.notNullable(fieldAttributes._eq)) {
              const opMatch = matchCondition<ApiFilterOperatorsTypes['_eq'], WhereValue>({
                [_and]: (ands): WhereValue => { return { [Op.and]: ands.map(opMatch) } },
                [_or]: (ors): WhereValue => { return { [Op.or]: ors.map(opMatch) } },
                [_val]: (operatorValue): WhereAttributeHash => { return { [Op.eq]: operatorValue }; },
              });
              fieldWheres.push(opMatch(fieldAttributes._eq));
            }

            // gt
            if (ist.notNullable(fieldAttributes._gt)) {
              const opMatch = matchCondition<ApiFilterOperatorsTypes['_gt'], WhereValue>({
                [_and]: (ands): WhereValue => { return { [Op.and]: ands.map(opMatch) } },
                [_or]: (ors): WhereValue => { return { [Op.or]: ors.map(opMatch) } },
                [_val]: (operatorValue): WhereAttributeHash => { return { [Op.gt]: operatorValue }; },
              });
              fieldWheres.push(opMatch(fieldAttributes._gt));
            }

            // gte
            if (ist.notNullable(fieldAttributes._gte)) {
              const opMatch = matchCondition<ApiFilterOperatorsTypes['_gte'], WhereValue>({
                [_and]: (ands): WhereValue => { return { [Op.and]: ands.map(opMatch) } },
                [_or]: (ors): WhereValue => { return { [Op.or]: ors.map(opMatch) } },
                [_val]: (operatorValue): WhereAttributeHash => { return { [Op.gte]: operatorValue }; },
              });
              fieldWheres.push(opMatch(fieldAttributes._gte));
            }

            // ilike
            if (ist.notNullable(fieldAttributes._ilike)) {
              const opMatch = matchCondition<ApiFilterOperatorsTypes['_ilike'], WhereValue>({
                [_and]: (ands): WhereValue => { return { [Op.and]: ands.map(opMatch) } },
                [_or]: (ors): WhereValue => { return { [Op.or]: ors.map(opMatch) } },
                [_val]: (operatorValue): WhereAttributeHash => { return { [Op.iLike]: operatorValue }; },
              });
              fieldWheres.push(opMatch(fieldAttributes._ilike));
            }

            // in
            if (ist.notNullable(fieldAttributes._in)) {
              const opMatch = matchCondition<ApiFilterOperatorsTypes['_in'], WhereValue>({
                [_and]: (ands): WhereValue => { return { [Op.and]: ands.map(opMatch) } },
                [_or]: (ors): WhereValue => { return { [Op.or]: ors.map(opMatch) } },
                [_val]: (operatorValue): WhereAttributeHash => { return { [Op.in]: operatorValue }; },
              });
              fieldWheres.push(opMatch(fieldAttributes._in));
            }

            // iregexp
            if (ist.notNullable(fieldAttributes._iregexp)) {
              const opMatch = matchCondition<ApiFilterOperatorsTypes['_iregexp'], WhereValue>({
                [_and]: (ands): WhereValue => { return { [Op.and]: ands.map(opMatch) } },
                [_or]: (ors): WhereValue => { return { [Op.or]: ors.map(opMatch) } },
                [_val]: (operatorValue): WhereAttributeHash => { return { [Op.iRegexp]: operatorValue }; },
              });
              fieldWheres.push(opMatch(fieldAttributes._iregexp));
            }

            // like
            if (ist.notNullable(fieldAttributes._like)) {
              const opMatch = matchCondition<ApiFilterOperatorsTypes['_like'], WhereValue>({
                [_and]: (ands): WhereValue => { return { [Op.and]: ands.map(opMatch) } },
                [_or]: (ors): WhereValue => { return { [Op.or]: ors.map(opMatch) } },
                [_val]: (operatorValue): WhereAttributeHash => { return { [Op.like]: operatorValue }; },
              });
              fieldWheres.push(opMatch(fieldAttributes._like));
            }

            // lt
            if (ist.notNullable(fieldAttributes._lt)) {
              const opMatch = matchCondition<ApiFilterOperatorsTypes['_lt'], WhereValue>({
                [_and]: (ands): WhereValue => { return { [Op.and]: ands.map(opMatch) } },
                [_or]: (ors): WhereValue => { return { [Op.or]: ors.map(opMatch) } },
                [_val]: (operatorValue): WhereAttributeHash => { return { [Op.lt]: operatorValue }; },
              });
              fieldWheres.push(opMatch(fieldAttributes._lt));
            }

            // iregexp
            if (ist.notNullable(fieldAttributes._lte)) {
              const opMatch = matchCondition<ApiFilterOperatorsTypes['_lte'], WhereValue>({
                [_and]: (ands): WhereValue => { return { [Op.and]: ands.map(opMatch) } },
                [_or]: (ors): WhereValue => { return { [Op.or]: ors.map(opMatch) } },
                [_val]: (operatorValue): WhereAttributeHash => { return { [Op.lte]: operatorValue }; },
              });
              fieldWheres.push(opMatch(fieldAttributes._lte));
            }

            // nbetween
            if (ist.notNullable(fieldAttributes._nbetween)) {
              const opMatch = matchCondition<ApiFilterOperatorsTypes['_nbetween'], WhereValue>({
                [_and]: (ands): WhereValue => { return { [Op.and]: ands.map(opMatch) } },
                [_or]: (ors): WhereValue => { return { [Op.or]: ors.map(opMatch) } },
                [_val]: (operatorValue): WhereAttributeHash => { return { [Op.notBetween]: operatorValue }; },
              });
              fieldWheres.push(opMatch(fieldAttributes._nbetween));
            }

            // nilike
            if (ist.notNullable(fieldAttributes._nilike)) {
              const opMatch = matchCondition<ApiFilterOperatorsTypes['_nilike'], WhereValue>({
                [_and]: (ands): WhereValue => { return { [Op.and]: ands.map(opMatch) } },
                [_or]: (ors): WhereValue => { return { [Op.or]: ors.map(opMatch) } },
                [_val]: (operatorValue): WhereAttributeHash => { return { [Op.notILike]: operatorValue }; },
              });
              fieldWheres.push(opMatch(fieldAttributes._nilike));
            }

            // nin
            if (ist.notNullable(fieldAttributes._nin)) {
              const opMatch = matchCondition<ApiFilterOperatorsTypes['_nin'], WhereValue>({
                [_and]: (ands): WhereValue => { return { [Op.and]: ands.map(opMatch) } },
                [_or]: (ors): WhereValue => { return { [Op.or]: ors.map(opMatch) } },
                [_val]: (operatorValue): WhereAttributeHash => { return { [Op.notIn]: operatorValue }; },
              });
              fieldWheres.push(opMatch(fieldAttributes._nin));
            }

            // niregexp
            if (ist.notNullable(fieldAttributes._niregexp)) {
              const opMatch = matchCondition<ApiFilterOperatorsTypes['_niregexp'], WhereValue>({
                [_and]: (ands): WhereValue => { return { [Op.and]: ands.map(opMatch) } },
                [_or]: (ors): WhereValue => { return { [Op.or]: ors.map(opMatch) } },
                [_val]: (operatorValue): WhereAttributeHash => { return { [Op.notIRegexp]: operatorValue }; },
              });
              fieldWheres.push(opMatch(fieldAttributes._niregexp));
            }

            // nlike
            if (ist.notNullable(fieldAttributes._nlike)) {
              const opMatch = matchCondition<ApiFilterOperatorsTypes['_nlike'], WhereValue>({
                [_and]: (ands): WhereValue => { return { [Op.and]: ands.map(opMatch) } },
                [_or]: (ors): WhereValue => { return { [Op.or]: ors.map(opMatch) } },
                [_val]: (operatorValue): WhereAttributeHash => { return { [Op.notLike]: operatorValue }; },
              });
              fieldWheres.push(opMatch(fieldAttributes._nlike));
            }

            // nregexp
            if (ist.notNullable(fieldAttributes._nregexp)) {
              const opMatch = matchCondition<ApiFilterOperatorsTypes['_nregexp'], WhereValue>({
                [_and]: (ands): WhereValue => { return { [Op.and]: ands.map(opMatch) } },
                [_or]: (ors): WhereValue => { return { [Op.or]: ors.map(opMatch) } },
                [_val]: (operatorValue): WhereAttributeHash => { return { [Op.notRegexp]: operatorValue }; },
              });
              fieldWheres.push(opMatch(fieldAttributes._nregexp));
            }

            // neq
            if (ist.notNullable(fieldAttributes._neq)) {
              const opMatch = matchCondition<ApiFilterOperatorsTypes['_neq'], WhereValue>({
                [_and]: (ands): WhereValue => { return { [Op.and]: ands.map(opMatch) } },
                [_or]: (ors): WhereValue => { return { [Op.or]: ors.map(opMatch) } },
                [_val]: (operatorValue): WhereAttributeHash => { return { [Op.ne]: operatorValue }; },
              });
              fieldWheres.push(opMatch(fieldAttributes._neq));
            }

            // null
            if (ist.notNullable(fieldAttributes._null)) {
              const opMatch = matchCondition<ApiFilterOperatorsTypes['_null'], WhereValue>({
                [_and]: (ands): WhereValue => { return { [Op.and]: ands.map(opMatch) } },
                [_or]: (ors): WhereValue => { return { [Op.or]: ors.map(opMatch) } },
                [_val]: (operatorValue): WhereAttributeHash => {
                  if (operatorValue) return { [Op.is]: null };
                  return { [Op.not]: { [Op.is]: null } };
                },
              });
              fieldWheres.push(opMatch(fieldAttributes._null));
            }

            // overlap
            if (ist.notNullable(fieldAttributes._overlap)) {
              const opMatch = matchCondition<ApiFilterOperatorsTypes['_overlap'], WhereValue>({
                [_and]: (ands): WhereValue => { return { [Op.and]: ands.map(opMatch) } },
                [_or]: (ors): WhereValue => { return { [Op.or]: ors.map(opMatch) } },
                [_val]: (operatorValue): WhereAttributeHash => { return { [Op.overlap]: operatorValue }; },
              });
              fieldWheres.push(opMatch(fieldAttributes._overlap));
            }

            // regexp
            if (ist.notNullable(fieldAttributes._regexp)) {
              const opMatch = matchCondition<ApiFilterOperatorsTypes['_regexp'], WhereValue>({
                [_and]: (ands): WhereValue => { return { [Op.and]: ands.map(opMatch) } },
                [_or]: (ors): WhereValue => { return { [Op.or]: ors.map(opMatch) } },
                [_val]: (operatorValue): WhereAttributeHash => { return { [Op.regexp]: operatorValue }; },
              });
              fieldWheres.push(opMatch(fieldAttributes._regexp));
            }

            // overlap
            if (ist.notNullable(fieldAttributes._strict_left)) {
              const opMatch = matchCondition<ApiFilterOperatorsTypes['_strict_left'], WhereValue>({
                [_and]: (ands): WhereValue => { return { [Op.and]: ands.map(opMatch) } },
                [_or]: (ors): WhereValue => { return { [Op.or]: ors.map(opMatch) } },
                [_val]: (operatorValue): WhereAttributeHash => { return { [Op.strictLeft]: operatorValue }; },
              });
              fieldWheres.push(opMatch(fieldAttributes._strict_left));
            }

            // overlap
            if (ist.notNullable(fieldAttributes._strict_right)) {
              const opMatch = matchCondition<ApiFilterOperatorsTypes['_strict_right'], WhereValue>({
                [_and]: (ands): WhereValue => { return { [Op.and]: ands.map(opMatch) } },
                [_or]: (ors): WhereValue => { return { [Op.or]: ors.map(opMatch) } },
                [_val]: (operatorValue): WhereAttributeHash => { return { [Op.strictRight]: operatorValue }; },
              });
              fieldWheres.push(opMatch(fieldAttributes._strict_right));
            }

            // overlap
            if (ist.notNullable(fieldAttributes._substring)) {
              const opMatch = matchCondition<ApiFilterOperatorsTypes['_substring'], WhereValue>({
                [_and]: (ands): WhereValue => { return { [Op.and]: ands.map(opMatch) } },
                [_or]: (ors): WhereValue => { return { [Op.or]: ors.map(opMatch) } },
                [_val]: (operatorValue): WhereAttributeHash => { return { [Op.substring]: operatorValue }; },
              });
              fieldWheres.push(opMatch(fieldAttributes._substring));
            }

            if (fieldWheres.length === 0) {
              throw new Error(`todo no operators matched ${Object.keys(fieldAttributes)}`);
            }

            if (fieldWheres.length === 1) {
              // short ecircuit if only 1 field filter...
              return fieldWheres[0];
            }

            // handle operator...
            return { [Op.and]: fieldWheres };
          },
        });
        const innerWhere = handleAttributes(maybeAttributes);
        return [field, innerWhere];
      })
      .filter(ist.notNullable);
    const attributesWheres: WhereAttributeHash = Object.fromEntries(andAttributesWheres);
    return attributesWheres;
  },
})

const transformApiSorts = (ctx: IRequestContext) => (fromQs: ApiSorts): Order => {
  const order: Order = [];
  fromQs.forEach(({ field, dir }) => {
    const numDir = Number(dir);
    if (numDir === ApiDir.Asc) return order.push([field, 'ASC']);
    if (numDir === ApiDir.Desc) return order.push([field, 'DESC']);
    const message = ctx.lang(QueryLang.InvalidSortDirection({ dir: String(numDir) }))
    throw new BadRequestException(message);
  });
  return order;
}

export interface IParsedQuery {
  page: IPaginateInput;
  options: {
    offset: number;
    limit: number;
    where?: WhereOptions;
    order?: Order;
  }
}

export function transformApiQuery(ctx: IRequestContext, qsVal: ApiQuery): IParsedQuery {
  let where: OrUndefined<WhereOptions>;
  if (qsVal.filter) {
    try {
      where = transformApiFilter(qsVal.filter);
      // stop sequelize throwing error when where is empty
      // if (!Object.keys(where).length && !Object.getOwnPropertySymbols(where).length) where = undefined;
    } catch (error) {
      logger.warn(`failed transforming api filter:${pretty(qsVal.filter)}`);
      throw error;
    }
  }

  let order: OrUndefined<Order>;
  if (qsVal.sorts) {
    order = transformApiSorts(ctx)(qsVal.sorts);
  }

  const limit = qsVal.limit ?? 15;
  const offset = qsVal.offset ?? 0;

  const page: IPaginateInput = { limit, offset };
  return { page, options: { offset, limit, where, order } };
}
