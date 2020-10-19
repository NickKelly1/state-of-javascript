import { GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull } from "graphql";
import { FindAndCountOptions, OrderItem } from "sequelize/types";
import { IPaginateInput } from "../interfaces/pageinate-input.interface";
import { OrNullable } from "../types/or-nullable.type";
import { OrUndefined } from "../types/or-undefined.type";
import { IGqlConnectionArgOptions } from "./gql.connection.input";
import { ISortGqlInput, SortGqlInput } from "./gql.sort";

export function transformGqlCollectionInput(arg: { [_q: string]: any }): { page: IPaginateInput; options: FindAndCountOptions } {
  const options = (arg as IGqlConnectionArgOptions)?.options ?? {};
  let order: OrUndefined<OrderItem[]>;
  if (options.sorts) {
    order = options.sorts.map((sort): OrderItem => ({ col: sort.field, val: sort.dir }));
  }
  const limit = options.limit ?? 15;
  const offset = options.offset ?? 0;
  const page: IPaginateInput=  { limit, offset };
  return {
    options: {
      order,
      limit,
      offset,
    },
    page,
  };
}
