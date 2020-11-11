import { GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull } from "graphql";
import { FindAndCountOptions, OrderItem, WhereOperators, WhereOptions } from "sequelize";
import { IPaginateInput } from "../interfaces/pageinate-input.interface";
import { OrNullable } from "../types/or-nullable.type";
import { OrUndefined } from "../types/or-undefined.type";
import { transformGqlFilter } from "./gql.filter.transformer";
import { IGqlCollectionOptions } from "./gql.collection.options";
import { IGqlQueryArg } from "./gql.query.arg";
import { IGqlSortInput, GqlSortInput, GqlDirEnum } from "./gql.sort";

export function transformGqlQuery(arg: { [_q: string]: any }): {
  page: IPaginateInput;
  options: FindAndCountOptions,
} {
  const options: Partial<IGqlCollectionOptions> = ((arg ?? {}) as Partial<IGqlQueryArg>)?.query ?? {};

  const limit = options.limit ?? 15;
  const offset = options.offset ?? 0;
  let order: OrUndefined<OrderItem[]>;
  let where: OrUndefined<WhereOptions>;

  // transform filter

  // transform sorts
  if (options.sorts) {
    order = options.sorts.map((sort): OrderItem => [
      sort.field,
      sort.dir === GqlDirEnum.Asc ? 'ASC' : 'DESC',
    ]);
  }

  if (options.filter) {
    where = transformGqlFilter(options.filter);
  }

  const page: IPaginateInput=  { limit, offset };
  return {
    options: {
      where,
      order,
      limit,
      offset,
    },
    page,
  };
}
