import { GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull } from "graphql";
import { OrNullable } from "../types/or-nullable.type";
import { GqlFilterFieldType, GqlFilterInputFactory, IGqlFilterGroup } from "./gql.filter.types";
import { IGqlSortInput, GqlSortInput } from "./gql.sort";

export interface IGqlCollectionOptions {
  offset?: OrNullable<number>;
  limit?: OrNullable<number>;
  sorts?: OrNullable<IGqlSortInput[]>;
  filter?: OrNullable<IGqlFilterGroup[]>;
}

export const GqlCollectionOptionsInputFactory = (arg: {
  name: string,
  filters: Record<string, GqlFilterFieldType>,
}): GraphQLInputObjectType => {
  const Obj: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: `${arg.name}Query`,
    fields: () => ({
      offset: { type: GraphQLInt },
      limit: { type: GraphQLInt },
      sorts: { type: GraphQLList(GraphQLNonNull(GqlSortInput)) },
      filter: { type: GraphQLList(GraphQLNonNull(GqlFilterInputFactory({
        name: `${arg.name}QueryFilter`,
        fields: arg.filters,
      }))) },
    }),
  });
  return Obj;
}
