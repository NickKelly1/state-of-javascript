import { GraphQLEnumType, GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { OrNullable } from "../types/or-nullable.type";

export enum DirGqlEnum {
  Asc = 'ASC',
  Desc = 'DESC',
};

export const DirGqlEnumType = new GraphQLEnumType({
  name: 'Dir',
  values: {
    Asc: { value: DirGqlEnum.Asc, },
    Desc: { value: DirGqlEnum.Desc, },
  },
});

export interface ISortGqlInput {
  field: string;
  dir: DirGqlEnum;
}

export const SortGqlInput = new GraphQLInputObjectType({
  name: 'Sort',
  fields: () => ({
    field: { type: GraphQLNonNull(GraphQLString) },
    dir: { type: GraphQLNonNull(DirGqlEnumType) },
  }),
});
