import { GraphQLEnumType, GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { OrNullable } from "../types/or-nullable.type";

export enum GqlDirEnum {
  Asc = 'ASC',
  Desc = 'DESC',
};

export const GqlDirEnumType = new GraphQLEnumType({
  name: 'SortDirection',
  values: {
    Asc: { value: GqlDirEnum.Asc, },
    Desc: { value: GqlDirEnum.Desc, },
  },
});

export interface IGqlSortInput {
  field: string;
  dir: GqlDirEnum;
}

export const GqlSortInput = new GraphQLInputObjectType({
  name: 'QuerySort',
  fields: () => ({
    field: { type: GraphQLNonNull(GraphQLString) },
    dir: { type: GraphQLNonNull(GqlDirEnumType) },
  }),
});
