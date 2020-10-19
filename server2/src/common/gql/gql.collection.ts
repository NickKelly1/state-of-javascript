import { GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull } from "graphql";
import { OrNullable } from "../types/or-nullable.type";
import { ISortGqlInput, SortGqlInput } from "./gql.sort";

export interface ICollectionGqlInput {
  offset?: OrNullable<number>;
  limit?: OrNullable<number>;
  sorts?: OrNullable<ISortGqlInput[]>;
}

export const CollectionGqlInput = new GraphQLInputObjectType({
  name: 'Collection',
  fields: () => ({
    offset: { type: GraphQLInt },
    limit: { type: GraphQLInt },
    sorts: { type: GraphQLList(GraphQLNonNull(SortGqlInput)) },
  }),
});
