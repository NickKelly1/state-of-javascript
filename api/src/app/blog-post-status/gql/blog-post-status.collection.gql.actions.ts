import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { GqlContext } from "../../../common/context/gql.context";
import { IGqlNever } from "../../../common/gql/gql.ever";

export type IBlogPostStatusCollectionGqlActionSource = IGqlNever;
export const BlogPostStatusCollectionGqlActions = new GraphQLObjectType<IBlogPostStatusCollectionGqlActionSource, GqlContext>({
  name: 'BlogPostStatusCollectionActions',
  fields: {
    show: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: (parent, args, ctx): boolean => {
        return ctx.services.blogPostStatusPolicy.canFindMany();
      },
    },
  },
});
