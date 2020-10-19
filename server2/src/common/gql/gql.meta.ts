import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { ICollectionMeta } from "../interfaces/collection-meta.interface";

export const GqlMeta = new GraphQLObjectType<ICollectionMeta>({
  name: 'meta',
  fields: {
    limit: { type: new GraphQLNonNull(GraphQLInt), },
    offset: { type: new GraphQLNonNull(GraphQLInt), },
    total: { type: new GraphQLNonNull(GraphQLInt), },
    page_number: { type: new GraphQLNonNull(GraphQLInt), },
    pages: { type: new GraphQLNonNull(GraphQLInt), },
    more: { type: new GraphQLNonNull(GraphQLBoolean), },
  },
});
