import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { IGqlNever } from "../../../common/gql/gql.ever";

export type IBlogPostCollectionGqlActionSource = IGqlNever;
export const BlogPostCollectionGqlActions = new GraphQLObjectType<IBlogPostCollectionGqlActionSource, GqlContext>({
  name: 'BlogPostCollectionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.blogPostPolicy.canFindMany();
      },
    },
    create: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async (parent, args, ctx): Promise<boolean> => {
        return ctx.services.blogPostPolicy.canCreate();
      },
    },
  },
});
